<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
	import "../app.css";
	import Nav from "$lib/components/Nav.svelte";
	let { children } = $props();
</script>

<svelte:head>
	<title>ytwrapped</title>

	<meta name="description" content="ytwrapped" />
	<meta name="keywords" content="yt" />

	<link rel="shortcut icon" href="/favicon.svg" type="image/svg+xml" />
</svelte:head>
<ModeWatcher />

<div class="lg:p-3 p-2">
	<Nav />
	{@render children()}
</div>
