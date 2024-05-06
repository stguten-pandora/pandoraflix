import pool from "../config/pg.config.js";

async function getFilmes() {
    const result = await pool.query(`SELECT f.id, f.name FROM addon.filmes f ORDER BY name ASC`);
    return result.rows;
}

async function getFilmeStreamById(id) {
    const result = await pool.query(`SELECT "name" , jsonb_object_keys(unnest(links)) as qualidade, unnest(links) ->> jsonb_object_keys(unnest(links)) AS link FROM addon.filmes WHERE "id" = $1`, [id]);
    return result.rows;
}

async function inserirFilmes(dados){
    try {
        const result = await pool.query(`INSERT INTO addon.filmes VALUES ($1, $2, array[$3, $4, $5]::jsonb[])`, dados);
        return result;        
    } catch (error) {
        console.log(error);
    }
}

async function atualizarLinksFilmes(dados){
    const result = await pool.query(`UPDATE addon.filmes SET links = array['{"1080p": $2, "720p": $3, "480p": $4}']::jsonb[] WHERE id = $1`, dados);
    return result;
}

export { getFilmes, getFilmeStreamById, inserirFilmes, atualizarLinksFilmes };