const URL = "https://pokeapi.co/api/v2/pokemon/";
const cardsContainer = document.querySelector(".cards-container")


const addPokemon = (res) => {

    const element = `<article class="card-pokemon">
                <p class="card-background">#001</p>
                <section class="card-img">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/17.png" alt="PIDGEOTTO">
                </section>

                <section class="card-dni">
                    <p class="id">#001</p>
                    <h3 class="name">PIDGEOTTO</h3>
                </section>

                <section class="card-types">
                    <p class="types normal">Normal</p>
                    <p class="types flying">Flying</p>
                </section>

                <section class="card-info">
                    <p class="heigth">11M</p>
                    <p  class="weigth">300Kg</p>
                </section>
            </article>`

    cardsContainer.insertAdjacentHTML("beforeend", element)
}

for (let i = 1; i <= 151; i++) {
    fetch(URL + i)
        .then((res) => res.json())
        .then(res => addPokemon(res))
}

