import pool from "../config/pg.config.js";

async function getFilmes() {
    const result = await pool.query(`SELECT f.id, f.name FROM addon.filmes f`);
    return result.rows;
}

async function getFilmeStreamById(id) {
    const result = await pool.query(`select "name" , jsonb_object_keys(unnest(links)) as qualidade, unnest(links) ->> jsonb_object_keys(unnest(links)) as link from addon.filmes where "id" = $1`, [id]);
    return result.rows;
}

export { getFilmes, getFilmeStreamById };