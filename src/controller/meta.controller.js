import tmdb from "../config/tmdb.config.js";
import getEpisodes from "../utils/getEpisodes.utils.js";
import * as Utils from "../utils/parseProps.utils.js";

async function getMovieMeta(tmdbId) {
  try {
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
        defaultVideoId: movieMeta.imdb_id ? movieMeta.imdb_id : `pd:${movieMeta.imdb_id}`,
        hasScheduledVideos: false
      }
    };

    return Promise.resolve({ meta });
  } catch (error) {
    return Promise.resolve({meta : {} });
  }
}

async function getSeriesMeta(tmdbId) {
  try {
    const type = "series";
    const language = "pt-BR";

    const serieMeta = await tmdb.tvInfo({ id: tmdbId, language: language, append_to_response: "videos,credits,external_ids" });
    const meta = {
      cast: Utils.parseCast(serieMeta.credits),
      country: Utils.parseCoutry(serieMeta.production_countries),
      description: serieMeta.overview,
      genre: Utils.parseGenres(serieMeta.genres),
      imdbRating: serieMeta.vote_average.toFixed(1),
      imdb_id: serieMeta.external_ids.imdb_id,
      name: serieMeta.name,
      poster: `https://image.tmdb.org/t/p/w500${serieMeta.poster_path}`,
      released: new Date(serieMeta.release_date),
      runtime: Utils.parseRunTime(serieMeta.runtime),
      stats: serieMeta.status,
      type: type,
      writer: Utils.parseWriter(serieMeta.credits),
      year: Utils.parseYear(serieMeta.status, serieMeta.first_air_date, serieMeta.last_air_date),
      background: `https://image.tmdb.org/t/p/original${serieMeta.backdrop_path}`,
      slug: Utils.parseSlug(type, serieMeta.name, serieMeta.external_ids.imdb_id),
      id: `pd:${serieMeta.external_ids.imdb_id}`,
      genres: Utils.parseGenres(serieMeta.genres),
      releaseInfo: serieMeta.release_date ? serieMeta.release_date.substring(0, 4) : "",
      logo: `https://images.metahub.space/logo/medium/${serieMeta.external_ids.imdb_id}/img`,
      trailers: Utils.parseTrailers(serieMeta.videos),
      trailerStreams: Utils.parseTrailerStream(serieMeta.videos),
      links: new Array(
        Utils.parseImdbLink(serieMeta.vote_average, serieMeta.external_ids.imdb_id),
        Utils.parseShareLink(serieMeta.name, serieMeta.external_ids.imdb_id, type),
        ...Utils.parseGenreLink(serieMeta.genres, type, language),
        ...Utils.parseCreditsLink(serieMeta.credits)
      ),
      behaviorHints: {
        defaultVideoId: null,
        hasScheduledVideos: true
      },
      videos: await getEpisodes(language, tmdbId, serieMeta.external_ids.imdb_id, serieMeta.seasons)
    };

    return Promise.resolve({ meta });

  } catch (error) {
    return Promise.resolve({meta : {} });
  }
}

export { getMovieMeta, getSeriesMeta };