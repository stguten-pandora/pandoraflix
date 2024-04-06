import builder from "./src/config/streamio-addon.config.js";

const dataset = {
    "tt5834426":{type: 'movie'},
    // Some examples of streams we can serve back to Stremio ; see https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/stream.md
    "tt0051744": { name: "House on Haunted Hill", type: "movie", infoHash: "9f86563ce2ed86bbfedd5d3e9f4e55aedd660960" }, // torrent
    "tt1254207": { name: "Pixel Movies 1080p", description: "Big Buck Bunny\n1080p 60fps",  type: "movie", url: "https://pixeldrain.com/api/file/48X9eaG3" }, // HTTP stream
    "tt0031051": { name: "The Arizone Kid", type: "movie", ytId: "m3BKVSpP80s" }, // YouTube stream
    "tt0137523": { name: "Fight Club", type: "movie", externalUrl: "https://www.netflix.com/watch/26004747" }, // redirects to Netflix
    "tt1748166:1:1": { name: "Pioneer One", type: "series", infoHash: "07a9de9750158471c3302e4e95edb1107f980fa6" },
    "tt0412142:1:1":{name:"Pixel Movies 1080p", type:"series", description: "Obrigado por utilizar! :)\nPixel Drain Movies\nContribua: livepix.gg/stguten", url:"https://pixeldrain.com/api/file/gRbQVZgg"} // torrent for season 1, episode 1
};

builder.defineStreamHandler(function(args) {
    console.log(args);
    if (dataset[args.id]) {
        return Promise.resolve({ streams: [dataset[args.id]] });
    } else {
        return Promise.resolve({ streams: [] });
    }
})

const buildin = builder.getInterface();

export default buildin;