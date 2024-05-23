import pool from "../config/pg.config.js";

async function getSeries() {
    const result = await pool.query(`SELECT f.id, f.name FROM addon.series f ORDER BY name asc`);
    return result.rows;
}

async function getSeriesEpsStreamById(id) {
    const result = await pool.query(`SELECT "name", jsonb_object_keys(unnest(links)) as qualidade, unnest(links) ->> jsonb_object_keys(unnest(links)) AS link FROM addon.series WHERE ("id" || ':' || season || ':' || episode) = $1`, [id]);
    return result.rows;
}

async function inserirSeries(dados){
    try {
        const result = await pool.query(`INSERT INTO addon.series VALUES ($1, $2, array[$3, $4, $5]::jsonb[], $6, $7)`, dados);
        return result;        
    } catch (error) {
        throw new Error('Falha ao inserir a lista de episódios da série!');
    }
}

async function atualizarLinksSeries(dados){
    const result = await pool.query(`UPDATE addon.series SET links = array[$2, $3, $4]::jsonb[] WHERE id = $1`, dados);
    return result;
}

export { getSeries, getSeriesEpsStreamById, inserirSeries, atualizarLinksSeries };