import app from "./config/express.config.js";
import { getCatalog, getManifest, getMeta, getStream } from "./controller/addon.controller.js";

app.get("/manifest.json", getManifest);

app.get("/catalog/:type/:id.json", getCatalog);

app.get("/stream/:type/:id.json", getStream);

app.get("/meta/:type/:id.json", getMeta);

export default app;