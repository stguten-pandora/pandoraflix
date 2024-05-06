import tmdb from "../config/tmdb.config.js";

async function getGenreList(type) {
    try {
        switch (type) {
            case "movie":
                const genreMovie = await tmdb.genreMovieList({ language: 'pt-BR' });
                return genreMovie.genres || [];
            case "serie":
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
    for (const key in result) {
        if(result[key].length !== 0){
            return result[key][0].id;
        }
    }    
}

async function getLogos(tmdbId, type){
    switch (type) {
        case "movie":
            const imagemFilme = await tmdb.movieImages({ id: tmdbId, language: 'pt'});
            return imagemFilme.logos.length > 0 ? `https://image.tmdb.org/t/p/original${imagemFilme.logos[0].file_path}` : null;
        case "serie":
            const imagemSerie = await tmdb.tvImages({ id: tmdbId, language: 'pt'});
            return imagemSerie.logos.length > 0 ? `https://image.tmdb.org/t/p/original${imagemSerie.logos[0].file_path}` : null;  
        default:
            break;
    }
}

export { getGenreList, getTmdbId, getLogos};