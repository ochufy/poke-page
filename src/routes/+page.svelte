<script>
  export let data;
  import { goto } from "$app/navigation";

  $: ({ supabase, session } = data);
  $: if (session) {
    goto("/");
  }
</script>

<div class="hero min-h-screen bg-base-300">
  <div class="hero-content">
    <div class="max-w-md text-center">
      <h1 class="text-white font-bold text-4xl">Welcome to PokePage</h1>
      {#if !session}
        <p class="py-6">
          Create an account to make your own PokePage with your own unique URL!
        </p>
        <a href="/login" class="btn btn-primary">Create An Account</a>
      {/if}
    </div>
  </div>
</div>
