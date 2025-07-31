import app from "./config/express.config.js";
import * as addonController from "./controller/addon.controller.js";

//Stremio routes
app.get("/manifest.json", addonController.getManifest);
app.get("/catalog/:type/:id/:extra?.json", addonController.getCatalog);
app.get("/meta/:type/:id.json", addonController.getMeta);
app.get("/stream/:type/:id.json", addonController.getStream);

app.get(/(.*)/, (req, res) => {
    res.status(404).send("Endpoint não encontrado.");
});

app.use((err, _, res, next) => {
    console.error(err);
    res.status(500).send("Erro interno.");
});

export default app;