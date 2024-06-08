import tmdb from "../config/tmdb.config.js";
import { getFilmeStreamById, getFilmes, inserirFilmes } from "../repository/filmes.repository.js";
import { getGenreList, getLogos } from "./tmdb.controller.js";
import * as Utils from "../utils/parseProps.utils.js";
import reloadCatalogCache from "../utils/cache.util.js";

async function getMovieCatalog() {
    const catalog = new Array();
    const filmes = await getFilmes();
    const type = "movie";
    const language = "pt-BR";
    
    for (const filme of filmes) {
        const result = await tmdb.find({ id: filme.id, external_source: 'imdb_id', language: "pt-BR" });
        const genreList = await getGenreList("movie");
        const movie = result.movie_results[0];
        const movieMetaInfo = await tmdb.movieInfo({ id: movie.id, language: "pt-BR", append_to_response: 'videos,credits' });
        
        catalog.push({
            id: `pd:${filme.id}`,
            name: movie.title,
            genre: movie.genre_ids.map(genre => genreList.find((x) => x.id === genre).name),
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            background: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
            logo: await getLogos(movie.id, "movie") || `https://images.metahub.space/logo/medium/${filme.id}/img`,
            posterShape: "regular",
            imdbRating: movie.vote_average.toFixed(1),
            year: movieMetaInfo.release_date ? movieMetaInfo.release_date.substring(0, 4) : "",
            released: new Date(movieMetaInfo.release_date).toISOString(),
            type: "movie",
            runtime: Utils.parseRunTime(movieMetaInfo.runtime),
            description: movie.overview,
            cast: Utils.parseCast(movieMetaInfo.credits),
            director: Utils.parseDirector(movieMetaInfo.credits),
            writer: Utils.parseWriter(movieMetaInfo.credits),
            releaseInfo: Utils.parseReleaseInfo(movieMetaInfo),
            links: new Array(
                Utils.parseImdbLink(movieMetaInfo.vote_average, movieMetaInfo.imdb_id),
                Utils.parseShareLink(movieMetaInfo.title, movieMetaInfo.imdb_id, type),
                ...Utils.parseGenreLink(movieMetaInfo.genres, type, language),
                ...Utils.parseCreditsLink(movieMetaInfo.credits)
              ),
        });
    }
    return catalog || [];
}

async function getMovieStream(id) {
    const resposta = await getFilmeStreamById(id);
    const stream = resposta.map((item) => {
        return {
            name: `Pixel Movies - ${item.qualidade}`,
            description: `${item.name.replace(",", "")} - ${item.qualidade}\nObrigado por utilizar o Pixel Movies!\nContribua em livepix.gg/stguten`,
            url: item.link,
            behaviorHints: {
                bingeGroup: `pixelmovies|${item.qualidade}`
            }
        }
    });
    return stream || [];
}

async function adicionarFilme(req, res, next) {
    if (req.params.tipo === 'serie') { 
        next();
        return;
    };
    const { codigo, nome, qualidade1080, qualidade720, qualidade480 } = req.body;
    const obj1080 = { "1080p": qualidade1080 };
    const obj720 = { "720p": qualidade720 };
    const obj480 = { "480p": qualidade480 };

    const response = await inserirFilmes([codigo, nome, obj1080, obj720, obj480]);
    if(response) reloadCatalogCache("movie");

    res.status(200).send(response ? { status: true } : { status: false });
}

export { getMovieCatalog, getMovieStream, adicionarFilme };
