import manifest from "../../.data/manifest.json" assert { type: "json" };

async function responseControler(res, data) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", "application/json");
    res.send(data);
   /*  res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-control-allow-headers": "*",
        "Content-Type": "application/json"
    });

    res.json(data); */
}

async function getManifest(req, res) {
    responseControler(res, manifest);
};

async function getStream(req, res) {

}

async function getCatalog(req, res) {

}

async function paramDef(req, res, next, val) {
    if (manifest.types.includes(val)) {
        next();
    } else {
        next("Unsupported type " + val);
    }
}

export { getManifest, getCatalog, getStream, paramDef }