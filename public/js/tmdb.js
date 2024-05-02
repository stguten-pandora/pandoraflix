const codigo = document.querySelector('#codigoImdb');
const nome = document.querySelector('#nomeSerie');
const type = document.querySelector('#typeSerie');
const ano = document.querySelector('#anoSerie');

const qualidade480 = document.querySelector('#qualidade480');
const qualidade720 = document.querySelector('#qualidade720');
const qualidade1080 = document.querySelector('#qualidade1080');

const temporadaDiv = document.querySelector('#temporadaDiv');
const episodioDiv = document.querySelector('#episodioDiv');

const temporada = document.querySelector('#temporada');
const episodio = document.querySelector('#episodio');

document.getElementById('codigoImdb').addEventListener('input', async (event) => {
    event.preventDefault();
    let codigo = event.target.value;
    if (codigo.includes('tt') && codigo.length >= 9) {
        const response = await fetch(`https://api.themoviedb.org/3/find/${codigo}?external_source=imdb_id&language=pt-BR`, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNGM3OTgxYzE5MjEyMmM0Njg5MWRiMmJiM2I0YTY5MSIsInN1YiI6IjY2MGY0NDY3M2Y4ZWRlMDE3Y2UyYThiMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Z7cX4fHRfxhVmTbVEuXvQwPzQdI8532KZViBLp6OvAw'
            }
        });
        const data = await response.json();
        let resultadoFinal;
        for (const key in data) {
            if (data[key].length !== 0) {
                resultadoFinal = data[key];
                if (key == 'tv_results') {
                    temporadaDiv.style.display = 'block';
                    episodioDiv.style.display = 'block';

                    temporada.removeAttribute('disabled');
                    episodio.removeAttribute('disabled');
                } else {
                    temporadaDiv.style.display = 'none';
                    episodioDiv.style.display = 'none';

                    temporada.setAttribute('disabled', 'disabled');
                    episodio.setAttribute('disabled', 'disabled');
                }
                qualidade480.removeAttribute('disabled');
                qualidade720.removeAttribute('disabled');
                qualidade1080.removeAttribute('disabled');
            }
        }
        nome.value = resultadoFinal[0].title || resultadoFinal[0].name;
        type.value = resultadoFinal[0].media_type;
        ano.value = resultadoFinal[0].release_date ? resultadoFinal[0].release_date.substring(0, 4) : resultadoFinal[0].first_air_date.substring(0, 4);
    } else if (codigo.length >= 0 && codigo.length < 9) {
        temporadaDiv.style.display = 'none';
        episodioDiv.style.display = 'none';

        nome.value = '';
        type.value = '';
        ano.value = '';

        qualidade480.setAttribute('disabled', 'disabled');
        qualidade720.setAttribute('disabled', 'disabled');
        qualidade1080.setAttribute('disabled', 'disabled');
    }
});

document.addEventListener('submit', async (event) => {
    event.preventDefault();
    const dados = {};
    switch (type.value) {
        case 'movie':
            Object.assign(dados, {
                codigo: codigo.value,
                nome: nome.value,
                qualidade1080: qualidade1080.value.endsWith('/') ? '' : qualidade1080.value,
                qualidade720: qualidade720.value.endsWith('/') ? '' : qualidade720.value,
                qualidade480: qualidade480.value.endsWith('/') ? '' : qualidade480.value
            });
            break;
        case 'tv':
            Object.assign(dados, {
                codigo: codigo.value,
                temporada: parseInt(temporada.value) || 0,
                episodio: parseInt(episodio.value) || 0,
                nome: nome.value,
                qualidade1080: qualidade1080.value.endsWith('/') ? '' : qualidade1080.value,
                qualidade720: qualidade720.value.endsWith('/') ? '' : qualidade720.value,
                qualidade480: qualidade480.value.endsWith('/') ? '' : qualidade480.value
            });
            break;
    }
    const response = await fetch(type.value === 'movie' ? '/adicionar/movie' : '/adicionar/serie' ,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(dados)
    });
    const data = await response.json();
    alert(data.status ? 'Adicionado com sucesso!' : 'Erro ao adicionar!');
});
