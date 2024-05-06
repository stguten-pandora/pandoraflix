import manifest from "../../.data/manifest.json" assert { type: "json" };
import { getMovieCatalog, getMovieStream } from "./filmes.controller.js";
import { getMovieMeta, getSeriesMeta } from "./meta.controller.js";
import { getSeriesCatalog, getSerieStream } from "./series.controller.js";
import { getTmdbId } from "./tmdb.controller.js";

async function responseControler(res, data) {
    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-control-allow-headers": "*",
        "Content-Type": "application/json"
    });

    res.json(data);
}

async function getManifest(req, res) {
    responseControler(res, manifest);
};

async function getCatalog(req, res) {
    const { type } = req.params;
    switch (type) {
        case "movie":
            const movieMetas = await getMovieCatalog();
            responseControler(res, { metas: movieMetas });
            break;
        case "series":
            const seriesMetas = await getSeriesCatalog();
            responseControler(res, { metas: seriesMetas});
            break;
        default:
            responseControler(res, { error: "Unsupported type " + type });
            break;
    }
}

async function getStream(req, res) {
    const { type, id } = req.params;
    const movieId = (id.includes("pd") ? id.split(":")[1] : id);

    switch (type) {
        case "movie":
            const movieStreams = await getMovieStream(movieId);
            responseControler(res, { streams: movieStreams });
            break;
        case "series":
            const serieStream = await getSerieStream(movieId);
            responseControler(res, { streams: serieStream });
            break;
        default:
            responseControler(res, { error: "Unsupported type " + type });
            break;
    }
}

async function getMeta(req, res){
    const { type, id } = req.params;
    const tmdbId = (id.includes("pd") ? await getTmdbId(id.split(":")[1]) : await getTmdbId(id));

    switch (type) {
        case "movie":
            const movieMeta = await getMovieMeta(tmdbId);
            //console.log(movieMeta);
            responseControler(res, movieMeta);
            break;
        case "series":
            const seriesMeta = await getSeriesMeta(tmdbId);
            responseControler(res, seriesMeta);
            break;
        default:
            responseControler(res, { error: "Unsupported type " + type });
            break;
    }
}

async function paramDef(req, res, next, val) {
    if (manifest.types.includes(val)) {
        next();
    } else {
        next("Unsupported type " + val);
    }
}

export { getManifest, getCatalog, getStream, getMeta, paramDef }