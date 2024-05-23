import express from 'express';
import path from "path";

import app from "./config/express.config.js";
import { getCatalog, getManifest, getMeta, getStream } from "./controller/addon.controller.js";
import { adicionarFilme } from './controller/filmes.controller.js';
import { adicionarSerie } from './controller/series.controller.js';
import { getBasicInfo } from './controller/tmdb.controller.js';

const publicDir = path.join(process.cwd(), "public");

app.use("/", express.static(publicDir));

//Stremio routes
app.get("/manifest.json", getManifest);
app.get("/catalog/:type/:id.json", getCatalog);
app.get("/meta/:type/:id.json", getMeta);
app.get("/stream/:type/:id.json", getStream);

//Rotas de adição ou remoção de catalogo
app.post("/adicionar/:tipo", adicionarFilme, adicionarSerie);
app.put("/modificar/:tipo");
app.delete("/remover/:tipo");

app.get("/imdb-info", getBasicInfo)


app.get("*", (req, res) => {
    res.status(404).send("Endpoint não encontrado.");
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Erro interno.");
});

export default app;