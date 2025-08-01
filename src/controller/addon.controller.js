import * as tmdbUtil from "../utils/tmdb.util.js";
import * as metaController from "./meta.controller.js";
import * as filmesController from "./filmes.controller.js";
import * as seriesController from "./series.controller.js";
import { responseBuilder } from "../builder/response.builder.js";
import client from "../config/redis.config.js";

async function getManifest(_, res) {
    const genres_movie = await tmdbUtil.getGenreList("movie").then((genres) => genres.map((el) => el.name).sort());
    const genres_series = await tmdbUtil.getGenreList("serie").then((genres) => genres.map((el) => el.name).sort());

    const manifest = {
        id: "br.dev.stguten.pandoraflix",
        version: "2.0.0",
        name: "PandoraFlix",
        description: "Biblioteca Pessoal gerada usando o PandoraFlix.",
        resources: ["catalog", "meta", "stream"],
        types: ["movie", "series"],
        catalogs: [
            {
                id: "pandoraflixmovies",
                type: "movie",
                name: "PandoraFlix Movies",
                pageSize: 25,
                extra: [
                    { name: "genre", options: genres_movie },
                    { name: "skip" },
                    { name: "search" }
                ],
                extraSupported: ["genre", "skip", "search"]
            },
            {
                id: "pandoraflixseries",
                type: "series",
                name: "PandoraFlix Series",
                pageSize: 25,
                extra: [
                    { name: "genre", options: genres_series },
                    { name: "skip" },
                    { name: "search" }
                ],
                extraSupported: ["genre", "skip", "search"]
            }
        ],
        idPrefixes: ["pd", "tt"]
    }
    responseBuilder(res, manifest);
}

async function getCatalog(req, res) {
    const { type } = req.params;
    const { genre, skip, search } = req.params.extra
        ? Object.fromEntries(new URLSearchParams(req.url.split("/").pop().split("?")[0].slice(0, -5)).entries())
        : {};
    const page = Math.ceil(skip ? skip / 25 + 1: undefined) || 1;
    let metas;

    switch (type) {
        case "movie":
            const movieCatalogCache = await client.get("catalogo:filme");
            if (movieCatalogCache) {
                metas = JSON.parse(movieCatalogCache).slice((page - 1) * 25, page * 25);
                break;
            }
            metas = await filmesController.getMovieCatalog(page, search, genre);
            break;
        case "series":
            const seriesCatalogCache = await client.get("catalogo:serie");
            if (seriesCatalogCache) {
                metas = JSON.parse(seriesCatalogCache).slice((page - 1) * 25, page * 25);
                break;
            }
            metas = await seriesController.getSeriesCatalog(page, search, genre);
            break;
        default:
            return responseBuilder(res, { error: "Unsupported type " + type });
    }

    responseBuilder(res, { metas });
}

async function getMeta(req, res) {
    const { type, id } = req.params;
    const tmdbId = id.includes("pd") 
        ? await tmdbUtil.getTmdbId(decodeURIComponent(id).split(":")[1]) 
        : await tmdbUtil.getTmdbId(decodeURIComponent(id));
    switch (type) {
        case "movie":
            const movieMeta = await metaController.getMovieMeta(tmdbId);
            responseBuilder(res, movieMeta);
            break;
        case "series":
            const seriesMeta = await metaController.getSeriesMeta(tmdbId);
            responseBuilder(res, seriesMeta);
            break;
        default:
            responseBuilder(res, { error: "Unsupported type " + type });
            break;
    }
}

async function getStream(req, res) {
    const { type, id } = req.params;
    const movieId = id.includes("pd") ? decodeURIComponent(id).split(":")[1] : decodeURIComponent(id);

    switch (type) {
        case "movie":
            const movieStreams = await filmesController.getMovieStream(movieId);
            responseBuilder(res, { streams: movieStreams });
            break;
        case "series":
            const serieStream = await seriesController.getSerieStream(movieId);
            responseBuilder(res, { streams: serieStream });
            break;
        default:
            responseBuilder(res, { error: "Unsupported type " + type });
            break;
    }
}

async function paramDef(_, __, next, val) {
    if (["movie", "series"].includes(val)) {
        next();
    } else {
        next("Unsupported type " + val);
    }
}

export { getManifest, getCatalog, getStream, getMeta, paramDef }