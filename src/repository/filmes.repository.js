import pool from "../config/pg.config.js";

async function getFilmes() {
    const result = await pool.query(`SELECT f.id, f.name FROM addon.filmes f`);
    return result.rows;
}

async function getFilmeById(id) {
    const result = await pool.query(`select f."name" , unnest(f.links) as links from addon.filmes f where f."id" = $1`, [id]);
    return result.rows;
}

export { getFilmes, getFilmeById };