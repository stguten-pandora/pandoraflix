//TO DO: Implementar a lógica para retornar a lista de séries
async function seriesCatalog() {
    /* const filmes = await getFilmes();
    return filmes || []; */
    return [];
}

//TO DO: Implementar a lógica para retornar o stream de séries
async function seriesStream(id) {
    /* const resposta = await getFilmeById(id);
    const stream = resposta.map((item) => {
        return {
            name: `Pixel Movies - ${Object.keys(item.links)}`,
            description: `${item.name} - ${Object.keys(item.links)}, Obrigado por utilizar o Pixel Movies!, Contribua em livepix.gg/stguten`,
            url: item.links[Object.keys(item.links)]
        }
    });
    return stream || []; */
    return [];
}

export { seriesCatalog, seriesStream };
