import app from "./src/app.js";
import reloadCatalogCache from "./src/utils/cache.util.js";

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

reloadCatalogCache("movie");
reloadCatalogCache("series");