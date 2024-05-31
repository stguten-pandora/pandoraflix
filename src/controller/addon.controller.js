import * as fs from "node:fs";
import path from "node:path";

import { getMovieCatalog, getMovieStream } from "./filmes.controller.js";
import { getMovieMeta, getSeriesMeta } from "./meta.controller.js";
import { getSeriesCatalog, getSerieStream } from "./series.controller.js";
import { getTmdbId } from "./tmdb.controller.js";
import client from "../config/redis.config.js";

const manifestPath = path.join(process.cwd(), ".data", "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

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
            const catalogoFilmeCache = await client.get("catalogo:filme");
            if (catalogoFilmeCache) {
                responseControler(res, { metas: JSON.parse(catalogoFilmeCache) });
                break;
            }
            const movieMetas = await getMovieCatalog();
            await client.set("catalogo:filme", JSON.stringify(movieMetas));
            responseControler(res, { metas: movieMetas });
            break;
        case "series":
            const catalogoSerieCache = await client.get("catalogo:serie");
            if (catalogoSerieCache) {
                responseControler(res, { metas: JSON.parse(catalogoSerieCache) });
                break;
            }
            const seriesMetas = await getSeriesCatalog();
            await client.set("catalogo:serie", JSON.stringify(seriesMetas));
            responseControler(res, { metas: seriesMetas });
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

async function getMeta(req, res) {
    const { type, id } = req.params;
    const tmdbId = (id.includes("pd") ? await getTmdbId(id.split(":")[1]) : await getTmdbId(id));

    switch (type) {
        case "movie":
            const metaFilmeCache = await client.get(`meta:filme:${tmdbId}`);
            if (metaFilmeCache) {
                responseControler(res, JSON.parse(metaFilmeCache));
                break;
            }
            const movieMeta = await getMovieMeta(tmdbId);
            await client.set(`meta:filme:${tmdbId}`, JSON.stringify(movieMeta));
            responseControler(res, movieMeta);
            break;
        case "series":
            const metaSerieCache = await client.get(`meta:serie:${tmdbId}`);
            if (metaSerieCache) {
                responseControler(res, JSON.parse(metaSerieCache));
                break;
            }
            const seriesMeta = await getSeriesMeta(tmdbId);
            await client.set(`meta:serie:${tmdbId}`, JSON.stringify(seriesMeta));
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