<script>
    export let data;
    import { Auth } from '@supabase/auth-ui-svelte';
    import { ThemeSupa } from '@supabase/auth-ui-shared';
    import { goto } from '$app/navigation';

    let {supabase, session} = data;
    $: ({supabase, session} = data);
    $: if(session){
        goto("/");
    }
</script>

<div class="hero min-h-screen bg-base-300">
    <div class="hero-content w-[800px]">
        <div class="flex flex-col">
            <p>Create an account or login below!</p>
            <!-- supabase auth ui -->
             <Auth
                supabaseClient={supabase}
                theme="dark"
                appearance={{
                    theme: ThemeSupa,
                    style: {
                        input: "width: 400px;"
                    }
                }}
             />
        </div>
    </div>
</div>