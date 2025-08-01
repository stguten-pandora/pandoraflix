import app from "./src/app.js";
import reloadCatalogCache from "./src/utils/cache.util.js";

reloadCatalogCache("movie");
reloadCatalogCache("series");

app.listen(3000, () => {
    console.log(`Server is running on port ${process.env.APP_PORT || 3000}`);
}); 