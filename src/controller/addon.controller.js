import manifest from "../../.data/manifest.json" assert { type: "json" };
import { movieCatalog, movieStream } from "./filmes.controller.js";

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

async function getStream(req, res) {
    const { type, id } = req.params;

    switch (type) {
        case "movie":
            const streams = await movieStream(type, id);
            responseControler(res, { streams: streams });
            break;
        case "serie":

            break;
        default:
            responseControler(res, { error: "Unsupported type " + type });
            break;
    }
}

async function getCatalog(req, res) {
    const { type } = req.params;
    switch (type) {
        case "movie":
            let metas = await movieCatalog();
            responseControler(res, { metas: metas });
            break;
        case "serie":
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

export { getManifest, getCatalog, getStream, paramDef }