<script>

    import { socket } from '$lib/socket'
    import { page } from '$app/stores'
    import { goto } from '$app/navigation'
    import { onMount } from 'svelte'
    import { flip } from 'svelte/animate'
    import { crossfade } from 'svelte/transition'
    import { quintOut } from 'svelte/easing'

    onMount(async() => {
        if (!$page.data.user) goto('/register')
        console.log($page.data.user)
    })

    const [send, receive] = crossfade({
		duration: d => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

    let messages = []

    let msg
    async function sendMessage() {
        if (!msg || msg == '') return
        socket.emit('message', { 
            body: this.message.value, 
            sender: $page.data.user.name, 
            color: $page.data.user.color,
            timestamp: Date.now()
        })
        msg = ''
    }

    socket.on('message', (msg) => {
        messages = [msg, ...messages]
    })

</script>

<div id="chat">
    <ul class="messages">
        {#each messages as message (message.timestamp)}
            <li in:receive={{ key: message.timestamp }} out:send={{ key: message.timestamp }} animate:flip={{ duration: 300 }} data-initials={message.sender.slice(0, 1)} class="message" style="--color: {message.color}">
                <div class="body">
                    <span class="sender">{message.sender}</span>
                    {message.body}
                </div>
            </li>
        {/each}
    </ul>

    <form on:submit|preventDefault={sendMessage}>
        <input autocomplete=off bind:value={msg} name="message" type="text" placeholder="Skriv en besked til alle deltagere">
        <button>
            <svg width="28px" height="28px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M22 12L3 20l3.563-8L3 4l19 8zM6.5 12H22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </button>
    </form>
</div>

<style lang="scss">

    #chat {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        padding: 20px;
    }

    .messages {
        flex-grow: 1;
        margin: 0 0 20px 0;
        padding: 0px;
        list-style: none;
        display: flex;
        gap: 20px;
        overflow-y: scroll;
        overflow-x: hidden;
        flex-direction: column-reverse;

        .message {
            display: flex;
            flex-direction: row;
            align-items: center;
            background-color: $grey;
            color: $white;
            border-radius: 10px;

            .body {
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding: 20px 20px 20px 0;

                .sender {
                    font-weight: bold;
                    text-transform: uppercase;
                    font-style: italic;
                }
            }

            &::before {
                content: attr(data-initials);
                margin: 20px;
                padding: 20px;
                background-color: var(--color);
                display: block;
                border-radius: 50px;
                width: 20px;
                height: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                text-transform: uppercase;
                box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
                font-size: 1.5rem;
            }
        }
    }

    form {
        display: flex;
        flex-direction: row;
        position: relative;
        align-items: center;

        input {
            flex-grow: 1;
            padding: 20px;
            border-radius: 10px;
            background-color: $grey;
            color: $white;
            border: none;
        }

        button {
            width: 100px;
            margin: 0 0 0 20px;
            background-color: transparent;
            border: none;
            position: absolute;
            right: 0px;
            cursor: pointer;
            color: $white;
        }
    }

</style>