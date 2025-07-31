import tmdb from "../config/tmdb.config.js";

async function getTmdbId(imdbId) {
    const result = await tmdb.find({ id: imdbId, external_source: 'imdb_id', language: 'pt-BR' });
    for (const key in result) {
        if (result[key].length !== 0) {
            return result[key][0].id;
        }
    }
}

async function getGenreList(type) {
    try {
        const genreList = type === "movie" ? await tmdb.genreMovieList({ language: 'pt-BR' }) : await tmdb.genreTvList({ language: 'pt-BR' });
        return genreList.genres;
    } catch (err) {
        console.error(err);
        return [];
    }
}

async function getLogos(tmdbId, type) {
    try {
        const images = type === "movie" ? await tmdb.movieImages({ id: tmdbId, language: 'pt' }) : await tmdb.tvImages({ id: tmdbId, language: 'pt' });
        return images.logos.length > 0 ? `https://image.tmdb.org/t/p/original${images.logos[0].file_path}` : null;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export { getGenreList, getTmdbId, getLogos };