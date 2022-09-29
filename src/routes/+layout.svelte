<script>

  import "../app.scss";
  import { page } from '$app/stores'
  import EventManager from '$lib/event-manager.svelte'
  import NewFlag from '$lib/new-flag.svelte'
  import FlagNotification from '$lib/flag-notification.svelte'

</script>

<NewFlag />
<FlagNotification />
<EventManager />

<slot />
