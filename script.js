const URL = "https://pokeapi.co/api/v2/pokemon/";
const cardsContainer = document.querySelector(".cards-container")


const addPokemon = async () => {

    try {
        const resArray = await handlePokemon();
        console.log(resArray)

        resArray.forEach(res => {
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
            console.log(res)
            cardsContainer.insertAdjacentHTML("beforeend", element);
        });
    } catch (error) {
        console.error(error);
    }
}

const handlePokemon = async () => {

    const promises = [];
    for (let i = 1; i <= 3; i++) {
        const url = `${URL}${i}`;
        promises.push(fetch(url).then(res => res.json()));
    }
    return Promise.all(promises);
}

addPokemon();