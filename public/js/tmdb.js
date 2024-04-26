const books = document.querySelector('#codigoImdb');
const nome = document.querySelector('#nomeSerie');
const sinopse = document.querySelector('#sinopse');
const type = document.querySelector('#typeSerie');
const notaImdb = document.querySelector('#imdbNote');
const releaseInfo = document.querySelector('#releaseInfo');
const poster = document.querySelector('#poster');

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
                resultadoFinal = data[key];
            }
        }
        console.log(resultadoFinal[0]);
        nome.value = resultadoFinal[0].title || resultadoFinal[0].name;
        sinopse.innerHTML = resultadoFinal[0].overview;
        type.value = resultadoFinal[0].media_type.charAt(0).toUpperCase() + resultadoFinal[0].media_type.slice(1);   
        notaImdb.value = resultadoFinal[0].vote_average;   
        releaseInfo.value = resultadoFinal[0].release_date ? resultadoFinal[0].release_date.split('-')[0] : resultadoFinal[0].first_air_date.split('-')[0];    
        poster.src = `https://image.tmdb.org/t/p/w500${resultadoFinal[0].poster_path}`; 
    }
});