import { addonBuilder } from "stremio-addon-sdk";

const manifest = {
    "id": "br.dev.stguten.pixeldrainmovies",
    "version": "1.0.0",

    "name": "Pixel Drain Movies",
    "description": "Your movies from Pixel Drain!",

    //"icon": "URL to 256x256 monochrome png icon", 
    //"background": "URL to 1024x786 png/jpg background",

    // set what type of resources we will return
    "resources": ["stream"],

    "types": ["movie", "series"], // your add-on will be preferred for these content types

    // set catalogs, we'll have 2 catalogs in this case, 1 for movies and 1 for series
    "catalogs": [],

    // prefix of item IDs (ie: "tt0032138")
    "idPrefixes": [ "tt" ]
};

const builder = new addonBuilder(manifest);

export default builder;