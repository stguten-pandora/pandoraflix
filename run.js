import app from "./src/app.js";
import reloadCatalogCache from "./src/utils/cache.util.js";

await reloadCatalogCache("movie");
await reloadCatalogCache("series");

app.listen(3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
}); 