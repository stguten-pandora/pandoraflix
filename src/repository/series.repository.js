import pool from "../config/pg.config.js";

async function getSeries() {
    const result = await pool.query(`SELECT f.id, f.name FROM addon.series f`);
    return result.rows;
}

async function getSeriesEpsStreamById(id) {
    const result = await pool.query(`select "name", jsonb_object_keys(unnest(links)) as qualidade, unnest(links) ->> jsonb_object_keys(unnest(links)) as link from addon.series where ("id" || ':' || season || ':' || episode) = $1`, [id]);
    return result.rows;
}

export { getSeries, getSeriesEpsStreamById };