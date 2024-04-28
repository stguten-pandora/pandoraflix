import manifest from "../../.data/manifest.json" assert { type: "json" };
import { movieCatalog, movieStream } from "./filmes.controller.js";
import { getMovieMeta } from "./meta.controller.js";
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
            let metas = await movieCatalog();
            responseControler(res, { metas: metas });
            break;
        case "series":
            responseControler(res, { metas: []});
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
            const movieStreams = await movieStream(movieId);
            responseControler(res, { streams: movieStreams });
            break;
        case "series":
            //const serieStreams = await serieStream(type, id);
            //responseControler(res, { streams: serieStreams });
            break;
        default:
            responseControler(res, { error: "Unsupported type " + type });
            break;
    }
}

async function getMeta(req, res){
    const { type, id } = req.params;
    const tmdbId = (id.includes("pd") ? id.split(":")[1] : await getTmdbId(id));

    switch (type) {
        case "movie":
            const movieMeta = await getMovieMeta(tmdbId);
            responseControler(res, movieMeta);
            break;
        case "series":
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