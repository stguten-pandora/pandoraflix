import tmdb from "../config/tmdb.config.js";
import * as Utils from "../utils/parseProps.utils.js";
import { getSeries, getSeriesEpsStreamById, inserirSeries } from "../repository/series.repository.js";
import { getGenreList, getLogos } from "./tmdb.controller.js";
import reloadCatalogCache from "../utils/cache.util.js";

async function getSeriesCatalog() {
    const catalog = new Array();
    const series = await getSeries();
    const type = "series";
    const language = "pt-BR";

    for (const serie of series) {
        const result = await tmdb.find({ id: serie.id, external_source: 'imdb_id', language: language });
        const genreList = await getGenreList("serie");
        const serieInfo = result.tv_results[0];        
        const serieMetaInfo = await tmdb.tvInfo({ id: serieInfo.id, language: language, append_to_response: 'videos,credits,external_ids' });

        catalog.push({
            id: `pd:${serie.id}`,
            name: serieInfo.name,
            genre: serieInfo.genre_ids.map(genre => genreList.find((x) => x.id === genre).name),
            poster: `https://image.tmdb.org/t/p/w500${serieInfo.poster_path}`,
            background: `https://image.tmdb.org/t/p/original${serieInfo.backdrop_path}`,
            logo: await getLogos(serieInfo.id, "serie") || `https://images.metahub.space/logo/medium/${serie.id}/img`,
            posterShape: "regular",
            imdbRating: serieMetaInfo.vote_average.toFixed(1),
            year: Utils.parseYear(serieMetaInfo.status, serieMetaInfo.first_air_date, serieMetaInfo.last_air_date),
            released: new Date(serieInfo.first_air_date).toISOString(),
            type: "series",
            runtime: Utils.parseRunTime(serieMetaInfo.episode_run_time),
            description: serieInfo.overview,
            cast: Utils.parseCast(serieMetaInfo.credits),
            director: Utils.parseDirector(serieMetaInfo.credits),
            writer: Utils.parseWriter(serieMetaInfo.credits),
            releaseInfo: Utils.parseReleaseInfo(serieMetaInfo),
            links: new Array(
                Utils.parseImdbLink(serieMetaInfo.vote_average, serieMetaInfo.external_ids.imdb_id),
                Utils.parseShareLink(serieMetaInfo.name, serieMetaInfo.external_ids.imdb_id, type),
                ...Utils.parseGenreLink(serieMetaInfo.genres, type, language),
                ...Utils.parseCreditsLink(serieMetaInfo.credits)
            ),
        });
    }
    return catalog || [];
}

async function getSerieStream(id) {
    const resposta = await getSeriesEpsStreamById(id);
    const stream = resposta.map((item) => {
        return {
            name: `Pixel Séries - ${item.qualidade}`,
            description: `${item.name.replace(",", "")} - ${item.qualidade}\nObrigado por utilizar o Pixel Séries!\nContribua em livepix.gg/stguten`,
            url: item.link,
            behaviorHints: {
                bingeGroup: `pixelmovies|${item.qualidade}`
            }
        }
    });
    return stream || [];
}

async function adicionarSerie(req, res) {
    const { codigo, nome, temporada, episodio, qualidade1080, qualidade720, qualidade480 } = req.body;
    const lista = qualidade1080 ?? qualidade720 ?? qualidade480 ?? "";
    if (lista.includes("list") && lista !== "") {
        const require = await fetch(lista);
        const response = await require.json();
        let count = 1;
        try {
            for (const item of response.files) {
                await inserirSeries([codigo, nome,
                    { "1080p": qualidade1080 ? `https://pixeldrain.com/api/file/${item.id}` : "" },
                    { "720p": qualidade720 ? `https://pixeldrain.com/api/file/${item.id}` : "" },
                    { "480p": qualidade480 ? `https://pixeldrain.com/api/file/${item.id}` : "" },
                    temporada, count++]);
            }
            reloadCatalogCache("series");
            res.status(200).send({ status: true });
        } catch (e) {
            console.log(e.message);
            res.status(500).send({ status: false });
        }
    } else {
        const response = await inserirSeries([codigo, nome, { "1080p": qualidade1080 ?? "" },
            { "720p": qualidade720 ?? "" }, { "480p": qualidade480 ?? "" }, temporada, episodio]);

        if(response) reloadCatalogCache("series");
        res.status(200).send(response ? { status: true } : { status: false });
    }
}

export { getSeriesCatalog, getSerieStream, adicionarSerie };
