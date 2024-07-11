const URL = "https://pokeapi.co/api/v2/pokemon/";
const cardsContainer = document.querySelector(".cards-container")
const searchInput = document.getElementById("searchInput");
let allPokemon = [];


const fetchAllPokemon = () => {
    const promises = [];
    for (let i = 1; i <= 386; i++) {
        const url = `${URL}${i}`;
        promises.push(fetch(url).then(res => res.json()));
    }
    return Promise.all(promises);
}

const displayPokemon = (data) => {
    cardsContainer.innerHTML = "";
    data.forEach(res => {
        const element = `<article class="card-pokemon">
            <p class="card-background">#${res.id}</p>
            <section class="card-img">
                <img src="${res.sprites.other["official-artwork"].front_default}" alt="${res.name.toUpperCase()}">
            </section>

            <section class="card-dni">
                <p class="id">#${res.id}</p>
                <h3 class="name">${res.name}</h3>
            </section>

            <section class="card-types">
                ${res.types.map(type => `<p class="types ${type.type.name}">${type.type.name}</p>`)}
            </section>

            <section class="card-info">
                <p class="heigth">${res.height}M</p>
                <p class="weigth">${res.weight}KG</p>
            </section>
        </article>`;
        cardsContainer.insertAdjacentHTML("beforeend", element);
    });
}


const filterPokemon = (query) => {
    query = query.toLowerCase();
    const filtered = allPokemon.filter(pokemon =>
        pokemon.name.toLowerCase().includes(query) || pokemon.id.toString() === query
    );
    displayPokemon(filtered);
}

searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    filterPokemon(query);
});

const inicialAllPokemon = async () => {
    try {
        const pokemonList = await fetchAllPokemon();
        allPokemon = pokemonList;
        displayPokemon(allPokemon);
    } catch (error) {
        console.error(error);
    }
}

inicialAllPokemon();