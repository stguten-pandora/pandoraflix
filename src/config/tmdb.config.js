import { MovieDb } from 'moviedb-promise';

const tmdb = new MovieDb(process.env.TMDB_KEY);

export default tmdb;