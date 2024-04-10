import pool from "../config/pg.config.js";

async function getFilmes() {
    const result = await pool.query(`SELECT 
    f.id, f.type, f.name, f.poster, f."posterShape", array_agg(g.name) as genres, f."imdbRating" , f."releaseInfo", f.description, f.trailers 
   FROM 
       addon.filmes f
       left join addon.genres g on g.id = any(f.genres)
   group by 
       f.id, f.type, f.name, f.poster, f."posterShape" , f."imdbRating" , f."releaseInfo" , f.links , f.description , f.trailers `);
    return result.rows;
}

async function getFilmeById(id) {
    const result = await pool.query(`select f."name" , unnest(f.links) as links
    from addon.filmes f 
    where f."id" = $1`, [id]);
    return result.rows;
}

export { getFilmes, getFilmeById };