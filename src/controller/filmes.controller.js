import tmdb from "../config/tmdb.config.js";
import { getFilmeStreamById, getFilmes, inserirFilmes } from "../repository/filmes.repository.js";
import { getGenreList, getLogos } from "./tmdb.controller.js";

async function getMovieCatalog() {
    const catalog = new Array();
    const filmes = await getFilmes();

    for (const filme of filmes) {        
        const result = await tmdb.find({ id: filme.id, external_source: 'imdb_id', language: "pt-BR" });
        const genreList = await getGenreList("movie");
        const movie = result.movie_results[0];

        catalog.push({
            id: `pd:${filme.id}`,
            name: movie.title,
            genre: movie.genre_ids.map(genre => genreList.find((x) => x.id === genre).name),
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            background: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
            logo: await getLogos(movie.id, "movie") || `https://images.metahub.space/logo/medium/${filme.id}/img`,
            posterShape: "regular",
            imdbRating: movie.vote_average.toFixed(1),
            year: movie.release_date ? movie.release_date.substring(0, 4) : "",
            type: "movie",
            description: movie.overview,
        });
    }
    return catalog || [];
}

async function getMovieStream(id) {
    const resposta = await getFilmeStreamById(id);
    const stream = resposta.map((item) => {
        return {
            name: `Pixel Movies - ${item.qualidade}`,
            description: `${item.name.replace(",", "")} - ${item.qualidade}\n Obrigado por utilizar o Pixel Movies!\n Contribua em livepix.gg/stguten`,
            url: item.link
        }
    });
    return stream || [];
}

async function adicionarFilme(req, res, next) {
    if (req.params.tipo === 'serie') next();
    const { codigo, nome, qualidade1080, qualidade720, qualidade480 } = req.body;
    const obj1080 = { "1080p": qualidade1080 };
    const obj720 = { "720p": qualidade720 };
    const obj480 = { "480p": qualidade480 };

    const response = await inserirFilmes([codigo, nome, obj1080, obj720, obj480]);

    res.status(200).send(response ? { status: true } : { status: false });
}

export { getMovieCatalog, getMovieStream, adicionarFilme };
