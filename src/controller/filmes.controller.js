import { getFilmeById, getFilmes } from "../repository/filmes.repository.js";
import tmdb from "../config/tmdb.config.js";
import { getGenreList } from "./tmdb.controller.js";

async function movieCatalog() {
    const catalog = new Array();
    const filmes = await getFilmes();

    for (const filme of filmes) {
        const result = await tmdb.find({ id: filme.id, external_source: 'imdb_id', language: 'pt-BR'});
        const genreList = await getGenreList("movie");
        const movie = result.movie_results[0];
        catalog.push({
            id: `pd:${filme.id}`,
            name: movie.title,
            genre: movie.genre_ids.map(genre => genreList.find((x) => x.id === genre).name),
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            background: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
            logo: `https://images.metahub.space/logo/medium/${filme.id}/img`,
            posterShape: "regular",
            imdbRating: movie.vote_average.toFixed(1),
            year: movie.release_date ? movie.release_date.substring(0,4) : "",
            type: "movie",
            description: movie.overview,
        });
    }
    return catalog || [];
}

async function movieStream(id) {
    const resposta = await getFilmeById(id);
    const stream = resposta.map((item) => {
        return {
            name: `Pixel Movies - ${Object.keys(item.links)}`,
            description: `${item.name.replace(",", "")} - ${Object.keys(item.links)}, Obrigado por utilizar o Pixel Movies!, Contribua em livepix.gg/stguten`,
            url: item.links[Object.keys(item.links)]
        }
    });
    return stream || [];
}

export { movieCatalog, movieStream };
