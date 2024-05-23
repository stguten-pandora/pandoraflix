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

const temporadaChk = document.querySelector('#temporadaChk');
const episodioChk = document.querySelector('#episodioChk');

function qualidadeInputSwitcher(status) {
    if (status === "enable") {
        qualidade1080.removeAttribute('disabled')
        qualidade720.removeAttribute('disabled')
        qualidade480.removeAttribute('disabled')
    } else {
        qualidade1080.setAttribute('disabled', 'disabled')
        qualidade720.setAttribute('disabled', 'disabled')
        qualidade480.setAttribute('disabled', 'disabled')
    }
}

function serieSelectSwitcher(status) {
    if (status === "enable") {
        temporada.removeAttribute('disabled')
        episodio.removeAttribute('disabled')
    } else {
        temporada.setAttribute('disabled', 'disabled')
        episodio.setAttribute('disabled', 'disabled')
    }
}

function checkedChange(elementChk, elementText) {
    const elemento = document.getElementById(elementText);
    if (document.getElementById(elementChk).checked) {
        elemento.removeAttribute('disabled');
    } else {
        elemento.setAttribute('disabled', 'disabled');
    }
}

function resetFormulario() {
    codigo.value = nome.value = type.value = ano.value = '';
    qualidade1080.value = qualidade720.value = qualidade480.value = 'https://pixeldrain.com/api/';
    temporada.value = episodio.value = 1;
    temporadaDiv.style.display = episodioDiv.style.display = 'none';
    qualidadeInputSwitcher("disable");
    document.getElementById("episodioChk").checked = false;
    document.getElementById("temporadaChk").checked = false;
    checkedChange("episodioChk", "episodio");
    checkedChange("temporadaChk", "temporada");
}

document.getElementById('codigoImdb').addEventListener('input', async (event) => {
    event.preventDefault();
    let imdbCode = codigo.value;
    if (imdbCode.includes('tt') && imdbCode.length >= 9) {
        const response = await fetch(`./imdb-info?imdbcode=${imdbCode}`);
        const resultadoFinal = await response.json();

        if (resultadoFinal[0].media_type === "tv"){
            temporadaDiv.style.display = episodioDiv.style.display = 'block';
            temporadaChk.checked = episodioChk.checked = true;
            serieSelectSwitcher("enable");
        }else {
            temporadaDiv.style.display = episodioDiv.style.display = 'none';
            temporadaChk.checked = episodioChk.checked = false;
            serieSelectSwitcher("disable");
        } 

        qualidadeInputSwitcher("enable");

        nome.value = resultadoFinal[0].title || resultadoFinal[0].name;
        type.value = resultadoFinal[0].media_type;
        ano.value = resultadoFinal[0].release_date ? resultadoFinal[0].release_date.substring(0, 4) : resultadoFinal[0].first_air_date.substring(0, 4);
    } else if (imdbCode.length >= 0 && imdbCode.length < 9) {
        temporadaDiv.style.display = episodioDiv.style.display = 'none';
        nome.value = type.value = ano.value = '';
        qualidadeInputSwitcher("disable");
    }
});

document.addEventListener('submit', async (event) => {
    event.preventDefault();
    const dados = {
        codigo: codigo.value,
        nome: nome.value,
        qualidade1080: qualidade1080.value.endsWith('/') ? null : qualidade1080.value,
        qualidade720: qualidade720.value.endsWith('/') ? null : qualidade720.value,
        qualidade480: qualidade480.value.endsWith('/') ? null : qualidade480.value
    };

    if (type.value === "tv") {
        Object.assign(dados, {
            temporada: temporadaChk.checked ? (parseInt(temporada.value) || 0) : 0,
            episodio: episodioChk.checked ? (parseInt(episodio.value) || 0) : 0,
        });
    }
    const response = await fetch(type.value === "movie" ? './adicionar/movie' : './adicionar/serie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(dados)
    });
    const data = await response.json();
    alert(data.status ? 'Adicionado com sucesso!' : 'Erro ao adicionar!');

    resetFormulario();
});

document.getElementById("episodioChk").addEventListener("click", () => { checkedChange("episodioChk", "episodio") });
document.getElementById("temporadaChk").addEventListener("click", () => { checkedChange("temporadaChk", "temporada") });