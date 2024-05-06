import tmdb from "../config/tmdb.config.js";
import { getSeries, getSeriesEpsStreamById, inserirSeries } from "../repository/series.repository.js";
import { getGenreList, getLogos } from "./tmdb.controller.js";

async function getSeriesCatalog() {
    const catalog = new Array();
    const series = await getSeries();

    for (const serie of series) {
        const result = await tmdb.find({ id: serie.id, external_source: 'imdb_id', language: 'pt-BR'});
        const genreList = await getGenreList("serie");
        const serieInfo = result.tv_results[0];
        
        catalog.push({
            id: `pd:${serie.id}`,
            name: serieInfo.name,
            genre: serieInfo.genre_ids.map(genre => genreList.find((x) => x.id === genre).name),
            poster: `https://image.tmdb.org/t/p/w500${serieInfo.poster_path}`,
            background: `https://image.tmdb.org/t/p/original${serieInfo.backdrop_path}`,
            logo: await getLogos(serieInfo.id, "serie") || `https://images.metahub.space/logo/medium/${serie.id}/img`,
            posterShape: "regular",
            imdbRating: serieInfo.vote_average.toFixed(1),
            year: serieInfo.first_air_date ? serieInfo.first_air_date.substring(0,4) : "",
            type: "series",
            description: serieInfo.overview,
        }); 
    }
    return catalog || [];
}

async function getSerieStream(id) {
    const resposta = await getSeriesEpsStreamById(id);
    const stream = resposta.map((item) => {
        return {
            name: `Pixel Séries - ${item.qualidade}`,
            description: `${item.name.replace(",", "")} - ${item.qualidade}\n Obrigado por utilizar o Pixel Séries!\n Contribua em livepix.gg/stguten`,
            url: item.link
        }
    });
    return stream || []; 
}

async function adicionarSerie(req, res, next){
    const { codigo, nome, temporada, episodio, qualidade1080, qualidade720, qualidade480 } = req.body;
    const obj1080 = { "1080p": qualidade1080 };
    const obj720 = { "720p": qualidade720 };
    const obj480 = { "480p": qualidade480 };

    const response = await inserirSeries([codigo, nome, obj1080, obj720, obj480, temporada, episodio]);

    res.status(200).send(response ? { status: true } : { status: false });
}

export { getSeriesCatalog , getSerieStream, adicionarSerie};
