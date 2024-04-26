import tmdb from "../config/tmdb.config.js";

async function getGenreList(type) {
    try {
        switch (type) {
            case "movie":
                const genreMovie = await tmdb.genreMovieList({ language: 'pt-BR' });
                return genreMovie.genres || [];
            case "series":
                const genreSeries = await tmdb.genreTvList({ language: 'pt-BR' });
                return genreSeries.genres || [];
            default:
                return [];
        }
    } catch (err) {
        console.error(err);
    }
}

async function getTmdbId(imdbId){
    const result = await tmdb.find({ id: imdbId, external_source: 'imdb_id', language: 'pt-BR'});
    return result.movie_results[0].id;
}

export { getGenreList, getTmdbId };