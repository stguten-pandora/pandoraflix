import tmdb from "../config/tmdb.config.js";
import getEpisodes from "../utils/getEpisodes.utils.js";
import * as tmdbUtils from "../utils/tmdb.util.js";
import * as parsePropsUtils from "../utils/parseProps.utils.js";

async function getMovieMeta(tmdbId) {
  try {
    const type = "movie";
    const language = "pt-BR";
    const movieMeta = await tmdb.movieInfo({ id: tmdbId, language: language, append_to_response: "videos,credits" });

    const meta = {
      imdb_id: movieMeta.imdb_id,
      cast: parsePropsUtils.parseCast(movieMeta.credits),
      country: parsePropsUtils.parseCoutry(movieMeta.production_countries),
      description: movieMeta.overview,
      director: parsePropsUtils.parseDirector(movieMeta.credits),
      genre: parsePropsUtils.parseGenres(movieMeta.genres),
      imdbRating: movieMeta.vote_average.toFixed(1),
      name: movieMeta.title,
      released: new Date(movieMeta.release_date),
      slug: parsePropsUtils.parseSlug(type, movieMeta.title, movieMeta.imdb_id),
      type: type,
      writer: parsePropsUtils.parseWriter(movieMeta.credits),
      year: movieMeta.release_date ? movieMeta.release_date.substring(0, 4) : "",
      trailers: parsePropsUtils.parseTrailers(movieMeta.videos),
      background: `https://image.tmdb.org/t/p/original${movieMeta.backdrop_path}`,
      poster: `https://image.tmdb.org/t/p/w500${movieMeta.poster_path}`,
      runtime: parsePropsUtils.parseRunTime(movieMeta.runtime),
      id: `pd:${movieMeta.imdb_id}`,
      genres: parsePropsUtils.parseGenres(movieMeta.genres),
      logo: await tmdbUtils.getLogos(tmdbId, "movie") || `https://images.metahub.space/logo/medium/${movieMeta.imdb_id}/img`,
      releaseInfo: movieMeta.release_date ? movieMeta.release_date.substring(0, 4) : "",
      trailerStreams: parsePropsUtils.parseTrailerStream(movieMeta.videos),
      links: new Array(
        parsePropsUtils.parseImdbLink(movieMeta.vote_average, movieMeta.imdb_id),
        parsePropsUtils.parseShareLink(movieMeta.title, movieMeta.imdb_id, type),
        ...parsePropsUtils.parseGenreLink(movieMeta.genres, type, language),
        ...parsePropsUtils.parseCreditsLink(movieMeta.credits)
      ),
      behaviorHints: {
        defaultVideoId: movieMeta.imdb_id ? movieMeta.imdb_id : `pd:${movieMeta.imdb_id}`,
        hasScheduledVideos: false
      }
    };
    
    return { meta };
  } catch (error) {
    console.log(error);
    return { meta: {} };
  }
}

async function getSeriesMeta(tmdbId) {
  try {
    const type = "series";
    const language = "pt-BR";
    const serieMeta = await tmdb.tvInfo({ id: tmdbId, language: language, append_to_response: "videos,credits,external_ids" });

    const meta = {
      cast: parsePropsUtils.parseCast(serieMeta.credits),
      country: parsePropsUtils.parseCoutry(serieMeta.production_countries),
      description: serieMeta.overview,
      genre: parsePropsUtils.parseGenres(serieMeta.genres),
      imdbRating: serieMeta.vote_average.toFixed(1),
      imdb_id: serieMeta.external_ids.imdb_id,
      name: serieMeta.name,
      poster: `https://image.tmdb.org/t/p/w500${serieMeta.poster_path}`,
      released: new Date(serieMeta.release_date),
      runtime: parsePropsUtils.parseRunTime(serieMeta.episode_run_time),
      stats: serieMeta.status,
      type: type,
      writer: parsePropsUtils.parseWriter(serieMeta.credits),
      year: parsePropsUtils.parseYear(serieMeta.status, serieMeta.first_air_date, serieMeta.last_air_date),
      background: `https://image.tmdb.org/t/p/original${serieMeta.backdrop_path}`,
      slug: parsePropsUtils.parseSlug(type, serieMeta.name, serieMeta.external_ids.imdb_id),
      id: `pd:${serieMeta.external_ids.imdb_id}`,
      genres: parsePropsUtils.parseGenres(serieMeta.genres),
      releaseInfo: parsePropsUtils.parseYear(serieMeta.status, serieMeta.first_air_date, serieMeta.last_air_date),
      logo: await tmdbUtils.getLogos(tmdbId, "serie") || `https://images.metahub.space/logo/medium/${serie.id}/img`,
      trailers: parsePropsUtils.parseTrailers(serieMeta.videos),
      trailerStreams: parsePropsUtils.parseTrailerStream(serieMeta.videos),
      links: new Array(
        parsePropsUtils.parseImdbLink(serieMeta.vote_average, serieMeta.external_ids.imdb_id),
        parsePropsUtils.parseShareLink(serieMeta.name, serieMeta.external_ids.imdb_id, type),
        ...parsePropsUtils.parseGenreLink(serieMeta.genres, type, language),
        ...parsePropsUtils.parseCreditsLink(serieMeta.credits)
      ),
      behaviorHints: {
        defaultVideoId: null,
        hasScheduledVideos: true
      },
      videos: await getEpisodes(language, tmdbId, serieMeta.external_ids.imdb_id, serieMeta.seasons)
    };

    return { meta };

  } catch (error) {
    return { meta: {} };
  }
}

export { getMovieMeta, getSeriesMeta };