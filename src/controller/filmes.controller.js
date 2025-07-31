import tmdb from "../config/tmdb.config.js";
import * as Utils from "../utils/parseProps.utils.js";
import * as tmdbUtil from "../utils/tmdb.util.js";
import * as filmesRepository from "../repository/filmes.repository.js";

const genreList = await tmdbUtil.getGenreList("movie");

async function getMovieCatalog(page, search, genre) {
    const filmes = await filmesRepository.getFilmes(page, search, genre);
    const type = "movie";
    const language = "pt-BR";

    const itens = filmes.map(async (filme) => {
        const result = await tmdb.find({ id: filme.id, external_source: 'imdb_id', language: "pt-BR" });
        const movie = result.movie_results[0];
        const movieMetaInfo = await tmdb.movieInfo({ id: movie.id, language, append_to_response: 'videos,credits' });

        return {
            id: `pd:${filme.id}`,
            name: movie.title,
            genre: movie.genre_ids.map(genre => genreList.find((x) => x.id === genre).name),
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            background: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
            logo: await tmdbUtil.getLogos(movie.id, "movie") || `https://images.metahub.space/logo/medium/${filme.id}/img`,
            posterShape: "regular",
            imdbRating: movie.vote_average.toFixed(1),
            year: movieMetaInfo.release_date ? movieMetaInfo.release_date.substring(0, 4) : "",
            released: new Date(movieMetaInfo.release_date).toISOString(),
            type,
            runtime: Utils.parseRunTime(movieMetaInfo.runtime),
            description: movie.overview,
            cast: Utils.parseCast(movieMetaInfo.credits),
            director: Utils.parseDirector(movieMetaInfo.credits),
            writer: Utils.parseWriter(movieMetaInfo.credits),
            releaseInfo: movieMetaInfo.release_date ? movieMetaInfo.release_date.substring(0, 4) : "",
            links: new Array(
                Utils.parseImdbLink(movieMetaInfo.vote_average, movieMetaInfo.imdb_id),
                Utils.parseShareLink(movieMetaInfo.title, movieMetaInfo.imdb_id, type),
                ...Utils.parseGenreLink(movieMetaInfo.genres, type, language),
                ...Utils.parseCreditsLink(movieMetaInfo.credits)
            ),
        }
    });
    const catalog = await Promise.all(itens);
    return catalog;
}

async function getMovieStream(id) {
    const resposta = await filmesRepository.getFilmeStreamById(id);
    const stream = resposta.map((item) => {
        return {
            name: `Pixel Movies\n${item.qualidade}`,
            description: `${item.title.replace(",", " ")} - ${item.qualidade}\nObrigado por utilizar o Pixel Movies!\nContribua em livepix.gg/stguten`,
            url: item.link,
            behaviorHints: {
                bingeGroup: `pixelmovies|${item.qualidade}`
            }
        }
    });
    return stream || [];
}

export {
    getMovieCatalog,
    getMovieStream
};
