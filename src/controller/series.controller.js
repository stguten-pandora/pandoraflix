import tmdb from "../config/tmdb.config.js";
import { getSeries, getSeriesEpsStreamById } from "../repository/series.repository.js";
import { getGenreList } from "./tmdb.controller.js";

async function getSeriesCatalog() {
    const catalog = new Array();
    const series = await getSeries();

    for (const serie of series) {
        const result = await tmdb.find({ id: serie.id, external_source: 'imdb_id', language: 'pt-BR'});
        const genreList = await getGenreList("movie");
        const movie = result.tv_results[0];
        catalog.push({
            id: `pd:${serie.id}`,
            name: movie.title,
            genre: movie.genre_ids.map(genre => genreList.find((x) => x.id === genre).name),
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            background: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
            logo: `https://images.metahub.space/logo/medium/${serie.id}/img`,
            posterShape: "regular",
            imdbRating: movie.vote_average.toFixed(1),
            year: movie.first_air_date ? movie.first_air_date.substring(0,4) : "",
            type: "series",
            description: movie.overview,
        }); 
    }
    return catalog || [];
}

async function getSerieStream(id) {
    const resposta = await getSeriesEpsStreamById(id);
    const stream = resposta.map((item) => {
        return {
            name: `Pixel Séries - ${item.qualidade}`,
            description: `${item.name.replace(",", "")} - ${item.qualidade}, Obrigado por utilizar o Pixel Séries!, Contribua em livepix.gg/stguten`,
            url: item.link
        }
    });
    return stream || []; 
}

export { getSeriesCatalog , getSerieStream};
