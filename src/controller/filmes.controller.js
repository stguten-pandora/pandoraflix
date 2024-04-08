import { getFilmeById, getFilmes } from "../repository/filmes.repository.js";

async function movieCatalog() {
    const filmes = await getFilmes();
    return filmes || [];
}

async function movieStream(type, id) {
    const resposta = await getFilmeById(id);
    const stream = resposta.map((item) => {
        return {
            name: `Pixel Movies - ${Object.keys(item.links)}`,
            description: `${item.name} - ${Object.keys(item.links)}, Obrigado por utilizar o Pixel Movies!, Contribua em livepix.gg/stguten`,
            url: item.links[Object.keys(item.links)]
        }
    });
    return stream || [];
}

export { movieCatalog, movieStream };
