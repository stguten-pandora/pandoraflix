import tmdb from "../config/tmdb.config.js";
import * as tmdbUtil from "../utils/tmdb.util.js";
import * as parsePropsUtils from "../utils/parseProps.utils.js";
import * as seriesRepository from "../repository/series.repository.js";

async function getSeriesCatalog(page, search, genre) {
    const series = await seriesRepository.getSeries(page, search, genre);
    const genreList = await tmdbUtil.getGenreList("serie");
    const type = "series";
    const language = "pt-BR";

    const itens = series.map(async (serie) => {
        const result = await tmdb.find({ id: serie.id, external_source: 'imdb_id', language: language });
        const serieInfo = result.tv_results[0];
        const serieMetaInfo = await tmdb.tvInfo({ id: serieInfo.id, language: language, append_to_response: 'videos,credits,external_ids' });

        return {
            id: `pd:${serie.id}`,
            name: serieInfo.name,
            genre: serieInfo.genre_ids.map(genre => genreList.find((x) => x.id === genre).name),
            poster: `https://image.tmdb.org/t/p/w500${serieInfo.poster_path}`,
            background: `https://image.tmdb.org/t/p/original${serieInfo.backdrop_path}`,
            logo: await tmdbUtil.getLogos(serieInfo.id, "serie") || `https://images.metahub.space/logo/medium/${serie.id}/img`,
            posterShape: "regular",
            imdbRating: serieMetaInfo.vote_average.toFixed(1),
            year: parsePropsUtils.parseYear(serieMetaInfo.status, serieMetaInfo.first_air_date, serieMetaInfo.last_air_date),
            released: new Date(serieInfo.first_air_date).toISOString(),
            type,
            runtime: parsePropsUtils.parseRunTime(serieMetaInfo.episode_run_time),
            description: serieInfo.overview,
            cast: parsePropsUtils.parseCast(serieMetaInfo.credits),
            director: parsePropsUtils.parseDirector(serieMetaInfo.credits),
            writer: parsePropsUtils.parseWriter(serieMetaInfo.credits),
            releaseInfo: parsePropsUtils.parseYear(serieMetaInfo.status, serieMetaInfo.first_air_date, serieMetaInfo.last_air_date),
            links: new Array(
                parsePropsUtils.parseImdbLink(serieMetaInfo.vote_average, serieMetaInfo.external_ids.imdb_id),
                parsePropsUtils.parseShareLink(serieMetaInfo.name, serieMetaInfo.external_ids.imdb_id, type),
                ...parsePropsUtils.parseGenreLink(serieMetaInfo.genres, type, language),
                ...parsePropsUtils.parseCreditsLink(serieMetaInfo.credits)
            ),
        }
    });
    const catalog = await Promise.all(itens);
    return catalog;
}

async function getSerieStream(id) {
    const resposta = await seriesRepository.getSeriesEpsStreamById(id);
    const stream = resposta.map((item) => {
        return {
            name: `PandoraFlix Séries - ${item.qualidade}`,
            description: `S${String(item.temporada).padStart(2, "0")}E${String(item.episodio).padStart(2, "0")} - ${item.title.replace(",", " ")}\nObrigado por utilizar o PandoraFlix Séries!\nContribua em livepix.gg/stguten`,
            url: item.link,
            behaviorHints: {
                bingeGroup: `pandoraflixseries|${item.qualidade}`
            }
        }
    });
    return stream;
}

export {
    getSeriesCatalog,
    getSerieStream
};
