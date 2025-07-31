import app from "./src/app.js";
import reloadCatalogCache from "./src/utils/cache.util.js";

reloadCatalogCache("movie").then(() => console.log("Cache reloaded!"));
reloadCatalogCache("series").then(() => console.log("Cache reloaded!"));

app.listen(3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
}); 