import app from "./src/app.js";

app.listen(3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

/* import { getFilme } from "./src/repository/filmes.repository.js";
const resposta = await getFilme('tt5834426');


console.log(stream); */