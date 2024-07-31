const URL = "https://pokeapi.co/api/v2/pokemon/";
const cardsContainer = document.querySelector(".cards-container")
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("pokemonModal");
const modalDetails = document.getElementById("modalDetails");
const typeFilter = document.querySelector("#typeFilter");

const itemsPerPage = 50;
let currentPage = 1;

const fetchAllPokemon = () => {
    const promises = [];
    for (let i = 1; i <= 386; i++) {
        const url = `${URL}${i}`;
        promises.push(
            fetch(url)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json();
                })
                .catch(error => {
                    console.error(`Error fetching Pokémon ${i}:`, error);
                    return null; // Retornamos null en caso de error para que Promise.all continúe
                })
        );
    }
    return Promise.all(promises)
    }

const loadImage = (url) => {
    return new Promise((resolve,reject) => {
        const img = new Image()
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = reject;
    })
}

const preloadImages = (imageUrls) => {
    const result = imageUrls.map(url => loadImage(url));
    return Promise.all(result);
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

    const cardPokemon = document.querySelectorAll(".card-pokemon")
    displayCardPokemon(cardPokemon)

    displayPagination(pokemonList);
    window.scrollTo(0, 0);
}

const displayCardPokemon = (cardPokemon) =>{
    cardPokemon.forEach(card => {
        card.addEventListener("click", async (e) => {
            const id = e.currentTarget.children[0].textContent.slice(1)
            const pokemon = await fetchPokemonById(id);
            openModal(pokemon);
        });
    });
}

const fetchPokemonById = async (id) => {
    const url = `${URL}${id}`;
    try{
        const res = await fetch(url);
        return res.json();
    }
    catch{
        console.error("Error")
    }

}

const openModal = (pokemon) => {
    if (!pokemon) return;
    modalDetails.innerHTML = `
        <h2>${pokemon.name.toUpperCase()}</h2>
        <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
        <p><strong>ID:</strong> #${pokemon.id}</p>
        <p><strong>Height:</strong> ${pokemon.height}M</p>
        <p><strong>Weight:</strong> ${pokemon.weight}KG</p>
        <p><strong>Abilities:</strong> ${pokemon.abilities.map(ability => ability.ability.name.toUpperCase()).join(', ')}</p>
    `;
    modal.style.display = "block";
}

const closeModal = () => {
    modal.style.display = "none";
}

document.querySelector(".close").addEventListener("click", closeModal);

window.addEventListener("click", (event) => {
    const modal = document.getElementById("pokemonModal");
    if (event.target === modal) {
        closeModal();
    }
});

const displayPagination = (pokemonList) => {
    const totalPages = Math.ceil(pokemonList.length / itemsPerPage);
    const paginationContainer = document.querySelector("#pagination");

    paginationContainer.innerHTML = "";

    if(totalPages == 1) paginationContainer.style.backgroundColor = "transparent";

    if(totalPages > 1){
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.classList.add("button")
            button.textContent = i;
            button.addEventListener("click", () => {
                currentPage = i;
                displayPokemon(pokemonList, currentPage);
            });
            paginationContainer.appendChild(button);
        }
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


const selectQueryType = () => {
    const query = searchInput.value.trim();
    const type = typeFilter.value;
    filterPokemon(query, type);
}

searchInput.addEventListener("input", selectQueryType)

typeFilter.addEventListener("change", selectQueryType)

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