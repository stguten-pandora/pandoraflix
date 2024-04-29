const books = document.querySelector('#codigoImdb');
const nome = document.querySelector('#nomeSerie');
const type = document.querySelector('#typeSerie');

document.addEventListener('input', async (event) => {
    event.preventDefault();
    let codigo = event.target.value;
    if(codigo.includes('tt') && codigo.length >= 9){
        const response = await fetch(`https://api.themoviedb.org/3/find/${codigo}?external_source=imdb_id&language=pt-BR`,{
            headers:{
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNGM3OTgxYzE5MjEyMmM0Njg5MWRiMmJiM2I0YTY5MSIsInN1YiI6IjY2MGY0NDY3M2Y4ZWRlMDE3Y2UyYThiMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Z7cX4fHRfxhVmTbVEuXvQwPzQdI8532KZViBLp6OvAw'
            }
        });
        const data = await response.json();
        let resultadoFinal;
        for (const key in data) {
            if(data[key].length !== 0){
                resultadoFinal = data[key].id;
            }
        }
        nome.value = resultadoFinal[0].title || resultadoFinal[0].name;
        type.value = resultadoFinal[0].media_type;
    }
});