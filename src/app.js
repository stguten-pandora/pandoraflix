import app from "./config/express.config.js";
import { getCatalog, getManifest, getStream } from "./controller/addon.controller.js";

app.get("/manifest.json", getManifest);

app.get("/catalog/:type/:id.json", getCatalog);

app.get("/stream/:type/:id.json", getStream);

export default app;