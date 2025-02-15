const POKEMON_API = "https://pokeapi.co/api/v2/";

// 1. get pokemon list

export let getPokemonList = async() => {
    const response = await fetch(POKEMON_API + "pokemon?limit=151&offset=0");
    const data = await response.json();
    return data.results;
}

// 2. get data of a pokemon

export let getPokemon = async(name: string) => {
    const response = await fetch(POKEMON_API + "pokemon/" + name);
    const data = await response.json();
    return data;
}