const URL = "https://pokeapi.co/api/v2/pokemon/";
const cardsContainer = document.querySelector(".cards-container")
const searchInput = document.getElementById("searchInput");

const itemsPerPage = 50;
let currentPage = 1;

const fetchAllPokemon = () => {
    const promises = [];
    for (let i = 1; i <= 386; i++) {
        const url = `${URL}${i}`;
        promises.push(fetch(url).then(res => res.json()));
    }
    return Promise.all(promises);
}

const preloadImages = (imageUrls) => {
    return Promise.all(imageUrls.map(url => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = resolve;
            img.onerror = reject;
        });
    }));
}

const displayPokemon = async (pokemonList, page = 1) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPokemon = pokemonList.slice(startIndex, endIndex);

    // Preload all images
    const imageUrls = paginatedPokemon.map(res => res.sprites.other["official-artwork"].front_default);
    await preloadImages(imageUrls);

    cardsContainer.innerHTML = "";

    paginatedPokemon.forEach(res => {
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
                ${res.types.map(type => `<p class="types ${type.type.name}">${type.type.name}</p>`).join('')}
            </section>

            <section class="card-info">
                <p class="heigth">${res.height}M</p>
                <p class="weigth">${res.weight}KG</p>
            </section>
        </article>`;
        cardsContainer.insertAdjacentHTML("beforeend", element);
    });

    displayPagination(pokemonList);
    window.scrollTo(0, 0); // Scroll to the top of the page
}

const displayPagination = (pokemonList) => {
    const totalPages = Math.ceil(pokemonList.length / itemsPerPage);
    const paginationContainer = document.querySelector("#pagination");

    paginationContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.addEventListener("click", () => {
            currentPage = i;
            displayPokemon(pokemonList, currentPage);
        });
        paginationContainer.appendChild(button);
    }
}

let allPokemon = [];

const filterPokemon = (query, type) => {
    query = query.toLowerCase();
    const filtered = allPokemon.filter(pokemon => {
        const matchesQuery = pokemon.name.toLowerCase().includes(query) || pokemon.id.toString() === query;
        const matchesType = type === "all" || pokemon.types.some(t => t.type.name === type);
        return matchesQuery && matchesType;
    });
    currentPage = 1;
    displayPokemon(filtered, currentPage);
}

searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    const type = document.querySelector("#typeFilter").value;
    filterPokemon(query, type);
});

const typeFilter = document.querySelector("#typeFilter");
typeFilter.addEventListener("change", () => {
    const query = searchInput.value.trim();
    const type = typeFilter.value;
    filterPokemon(query, type);
});

const init = async () => {
    try {
        const pokemonList = await fetchAllPokemon();
        allPokemon = pokemonList;
        displayPokemon(allPokemon, currentPage);
    } catch (error) {
        console.error(error);
    }
}

init();
