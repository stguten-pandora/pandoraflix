import tmdb from "../config/tmdb.config.js";
import * as Utils from "../utils/parseProps.utils.js";

async function getMovieMeta(tmdbId) {
    const type = "movie";
    const language = "pt-BR";
    
    const movieMeta = await tmdb.movieInfo({ id: tmdbId, language: language, append_to_response: "videos,credits" });
    const meta = {
      imdb_id: movieMeta.imdb_id,
      cast: Utils.parseCast(movieMeta.credits),
      country: Utils.parseCoutry(movieMeta.production_countries),
      description: movieMeta.overview,
      director: Utils.parseDirector(movieMeta.credits),
      genre: Utils.parseGenres(movieMeta.genres),
      imdbRating: movieMeta.vote_average.toFixed(1),
      name: movieMeta.title,
      released: new Date(movieMeta.release_date),
      slug: Utils.parseSlug(type, movieMeta.title, movieMeta.imdb_id),
      type: type,
      writer: Utils.parseWriter(movieMeta.credits),
      year: movieMeta.release_date ? movieMeta.release_date.substring(0, 4) : "",
      trailers: Utils.parseTrailers(movieMeta.videos),
      background: `https://image.tmdb.org/t/p/original${movieMeta.backdrop_path}`,
      poster: `https://image.tmdb.org/t/p/w500${movieMeta.poster_path}`,
      runtime: Utils.parseRunTime(movieMeta.runtime),
      id: `pd:${movieMeta.imdb_id}`,
      genres: Utils.parseGenres(movieMeta.genres),
      logo: `https://images.metahub.space/logo/medium/${movieMeta.imdb_id}/img`,
      releaseInfo: movieMeta.release_date ? movieMeta.release_date.substring(0, 4) : "",
      trailerStreams: Utils.parseTrailerStream(movieMeta.videos),
      links: new Array(
        Utils.parseImdbLink(movieMeta.vote_average, movieMeta.imdb_id),
        Utils.parseShareLink(movieMeta.title, movieMeta.imdb_id, type),
        ...Utils.parseGenreLink(movieMeta.genres, type, language),
        ...Utils.parseCreditsLink(movieMeta.credits)
      ),
      behaviorHints: {
        defaultVideoId: movieMeta.imdb_id,
        hasScheduledVideos: false
      },
      videos: [
        {
          id: movieMeta.imdb_id ,
          title: "",
          released: movieMeta.release_date
            ? new Date(movieMeta.release_date).toISOString()
            : new Date().toISOString(),
        },
      ],
    };

    return Promise.resolve({meta});
}

export { getMovieMeta };