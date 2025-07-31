import pool from "../config/pg.config.js";

async function getFilmes(page, search, genre) {
    const result = await pool.query(`SELECT id, title from pandoraflix.filmes
        WHERE 1 = 1 
        ${(search ? `AND title ILIKE '%${search}%' ` : '')} 
        ${(genre ? `AND genre @> Array['${genre}'] ` : '')} 
        ORDER BY title 
        LIMIT 25 OFFSET ${page} * 25`
    );
    return result.rows;
}

async function getFilmeStreamById(id) {
    const result = await pool.query(`
        SELECT filmes.title, 
            jsonb_object_keys(unnest(links)) as qualidade, 
            unnest(links) ->> jsonb_object_keys(unnest(links)) AS link 
        FROM pandoraflix.filmes filmes WHERE "id" = $1`, [id]
    );
    return result.rows;
}

export {
    getFilmes,
    getFilmeStreamById
};