import client from "../config/redis.config.js";
import { getMovieCatalog } from "../controller/filmes.controller.js";
import { getSeriesCatalog } from "../controller/series.controller.js";

async function reloadCatalogCache(catalogType) {
    switch (catalogType) {
        case "movie":
            const movieCatalog = await getMovieCatalog(0);
            await client.set("catalogo:filme", JSON.stringify(movieCatalog));
            console.log("Catalogo de filmes atualizado.");
            break;
        case "series":
            const seriesCatalog = await getSeriesCatalog(0);
            await client.set("catalogo:serie", JSON.stringify(seriesCatalog));
            console.log("Catalogo de séries atualizado.");
            break;
        default:
            console.log("Como chegamos aqui?");
            break;
    }
}

export default reloadCatalogCache;