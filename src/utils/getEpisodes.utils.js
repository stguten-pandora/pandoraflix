import tmdb from "../config/tmdb.config.js";

function genSeasonsString(seasons) {
    if (seasons.length <= 20) {
        return [
            seasons.map((season) => `season/${season.season_number}`).join(","),
        ];
    } else {
        const result = new Array(Math.ceil(seasons.length / 20))
            .fill()
            .map((_) => seasons.splice(0, 20));
        return result.map((arr) => {
            return arr.map((season) => `season/${season.season_number}`).join(",");
        });
    }
}

async function getEpisodes(language, tmdbId, imdb_id, seasons) {
    const seasonString = genSeasonsString(seasons);
    const episodes = [];    
    await Promise.all(
        seasonString.map(async (el) => {
            await tmdb.tvInfo({ id: tmdbId, language, append_to_response: el })
                .then((res) => {
                    const splitSeasons = el.split(",");
                    splitSeasons.map((season) => {
                        if (res[season]) {
                            res[season].episodes.map((episode, index) => {
                                episodes.push({
                                    id: imdb_id
                                        ? `${imdb_id}:${episode.season_number}:${index + 1}`
                                        : `pd:${tmdbId}:${episode.season_number}:${index + 1}`,
                                    name: episode.name,
                                    season: episode.season_number,
                                    number: index + 1,
                                    episode: index + 1,
                                    thumbnail: `https://image.tmdb.org/t/p/w500${episode.still_path}`,
                                    overview: episode.overview,
                                    description: episode.overview,
                                    rating: episode.vote_average.toString(),
                                    firstAired: new Date(
                                        Date.parse(episode.air_date) + episode.season_number
                                    ),
                                    released: new Date(
                                        Date.parse(episode.air_date) + episode.season_number
                                    ),
                                });
                            });
                        }
                    });
                })
                .catch(console.error);
        })
    );
    return episodes;
}

export default getEpisodes;