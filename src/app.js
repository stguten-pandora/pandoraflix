import app from "./config/express.config.js";
import { getCatalog, getManifest, getMeta, getStream } from "./controller/addon.controller.js";

//Stremio routes
app.get("/manifest.json", getManifest);
app.get("/catalog/:type/:id/:extra?.json", getCatalog);
app.get("/meta/:type/:id.json", getMeta);
app.get("/stream/:type/:id.json", getStream);

app.get(/(.*)/, (req, res) => {
    res.status(404).send("Endpoint não encontrado.");
});

app.use((err, _, res, next) => {
    console.error(err);
    res.status(500).send("Erro interno.");
});

export default app;