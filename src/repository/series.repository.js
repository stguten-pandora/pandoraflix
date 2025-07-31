import pool from "../config/pg.config.js";

async function getSeries(page, search, genre) {
    const result = await pool.query(`SELECT id, title from pandoraflix.series
        WHERE 1 = 1 
        ${(search ? `AND title ILIKE '%${search}%' ` : '')} 
        ${(genre ? `AND genre @> Array['${genre}'] ` : '')} 
        ORDER BY title 
        LIMIT 25 OFFSET ${page} * 25`
    );
    return result.rows;
}

async function getSeriesEpsStreamById(id) {
    console.log(id);

    try {
        const result = await pool.query(`
            SELECT series.episode_title as title, 
                series.temporada,
                series.episodio,
                jsonb_object_keys(unnest(series.links)) as qualidade, 
                unnest(series.links) ->> jsonb_object_keys(unnest(series.links)) AS link 
            FROM pandoraflix.series series WHERE (series.id || ':' || series.temporada || ':' || series.episodio) = $1`, [id]
        );
        return result.rows;
    } catch (error) {
        throw new Error('Falha ao buscar a lista de episódios da série!');
    }
}

export {
    getSeries,
    getSeriesEpsStreamById
};