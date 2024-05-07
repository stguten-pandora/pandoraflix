import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { paramDef } from "../controller/addon.controller.js";

const app = express();

app.param("type", paramDef);

app.use(helmet(
    { contentSecurityPolicy: false }
));
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;