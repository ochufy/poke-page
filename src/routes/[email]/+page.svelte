<script lang="ts">
  import { page } from "$app/stores";
  import { getPokemon, getPokemonList } from "$lib/pokemonAPI";
  import { onMount } from "svelte";
  export let data;

  let { supabase, session } = data;
  $: ({ supabase, session } = data);
  $: email = $page.params.email;

  let pokemonList: any = [];
  let pokemonData: any = [];

  let profile = {
    description: "this is a default description...change it as you wish!",
    pokemon_ids: [1, 2, 3],
  };

  let isModalOpen = false;
  let searchInput = "";

  let refreshPokemonData = async () => {
    pokemonData = [];
    profile.pokemon_ids.map(async (id: number) => {
      const data = await getPokemon(id.toString());

      if (pokemonData === undefined) {
        pokemonData = [data];
      } else {
        pokemonData = [...pokemonData, data];
      }
    });
  };

  let saveProfile = async () => {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email);

    // if no profile, create new (record in table)
    if (profileData?.length === 0) {
      await supabase.from("profiles").insert({
        ...profile,
        user_id: session?.user?.id,
        email: session?.user?.email,
      });
    }
    // if profile exists, update it
    else {
      await supabase
        .from("profiles")
        .update(profile)
        .eq("user_id", session?.user?.id);
    }
  };

  onMount(async () => {
    pokemonList = await getPokemonList();

    // fetch current profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("description, pokemon_ids")
      .eq("email", email);
    console.log(profile);

    // if logged in user doesn't have a profile yet, make a new profile
    if (profileData?.length === 0 && email == session?.user?.email) {
      // save profile
      await saveProfile();
    } else if (profileData != null && profileData.length > 0) {
      profile = profileData[0];
    } else {
      profile = {
        description: "This user doesn't have a profile yet!",
        pokemon_ids: [],
      };
    }

    await refreshPokemonData();
  });

  let savePageEdits = async () => {
    await saveProfile();
    await refreshPokemonData();
    isModalOpen = false;
  };

  let togglePokemon = async (id: number) => {
    let pokemonIDs = profile.pokemon_ids;

    if (pokemonIDs.length >= 3 && !pokemonIDs.includes(id)) {
      alert("You can only have max. 3 pokemon!");
      return;
    }
    if (pokemonIDs.includes(id)) {
      let index = pokemonIDs.indexOf(id);
      pokemonIDs.splice(index, 1);
    } else {
      pokemonIDs.push(id);
    }

    profile.pokemon_ids = [...pokemonIDs];
  };
</script>

<div class="hero min-h-screen bg-base-300">
  <div class="hero-content">
    <div class="max-w-2xl text-center">
      <h1 class="text-white font-bold text-4xl">{email}'s Page</h1>
      <p class="py-3 max-w-md mx-auto">{profile.description}</p>
      <div class="grid grid-cols-3">
        {#if pokemonData === undefined}
          <p>Loading...</p>
        {:else}
          {#each pokemonData as pokemon}
            <div class="card bg-slate-700 m-4 shadow-lg shadow-blue-900">
              <div class="card-body">
                <div class="text-center">
                  <img
                    src={pokemon.sprites.front_default}
                    alt="Pokemon Card"
                    class="w-32 h-32 mx-auto"
                  />
                  <h2 class="text-white text-2xl font-bold">{pokemon.name}</h2>
                  <p class="text-info">{pokemon.types[0].type.name}</p>
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>
      {#if email == session?.user?.email}
        <button class="btn btn-info" onclick={() => (isModalOpen = true)}
          >Edit Page</button
        >
        <dialog class="modal min-w-lg" class:modal-open={isModalOpen}>
          <div class="modal-box">
            <h3 class="text-white">Edit Your PokePage</h3>
            <p class="italic">
              Here you can make edits to your page, such as description or
              pokemon selected.
            </p>
            <p class="text-white p-2">Edit your description</p>
            <textarea
              bind:value={profile.description}
              class="textarea textarea-bordered textarea-lg w-full max-w-md h-[150px]"
            ></textarea>
            <p class="text-white p-2">Select your pokemon</p>
            <div class="grid grid-cols-3 overflow-y-scroll max-h-[500px] m-3">
              <div class="col-span-3">
                <input
                  type="text"
                  class="input input-bordered w-full"
                  placeholder="Search for a pokemon"
                  bind:value={searchInput}
                />
              </div>
              {#each pokemonList as pokemon, index}
                {#if pokemon.name.includes(searchInput)}
                  <button
                    class={"card bg-slate-700 h-12 p-1 m-1 justify-center items-center " +
                      (profile.pokemon_ids.includes(index + 1)
                        ? "border border-blue-600"
                        : "")}
                    onclick={() => togglePokemon(index + 1)}
                  >
                    <div class="text-center">
                      <h2 class="text-white text-xl">{pokemon.name}</h2>
                    </div>
                  </button>
                {/if}
              {/each}
            </div>
            <button class="btn btn-success" onclick={() => savePageEdits()}
              >Save Edits</button
            >
          </div>
        </dialog>
      {/if}
    </div>
  </div>
</div>
