<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
	import "../app.css";
	import Nav from "$lib/components/Nav.svelte";
	let { children } = $props();
</script>

<svelte:head>
	<title>ytwrapped</title>

	<meta name="description" content="ytwrapped" />
	<link rel="shortcut icon" href="fav.png" type="image/png" />
	<meta
		name="description"
		content="ytwrapped shows you the best of your 2024 YouTube watch history"
	/>
	<meta name="keywords" content="yt, youtube, wrapped, 2024, 2024 wrapped" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://ytwrapped.vercel.app" />
	<meta property="og:title" content="ytwrapped" />
	<meta
		property="og:description"
		content="ytwrapped shows you the best of your 2024 YouTube watch history"
	/>
	<meta property="og:image" content="/og.jpg" />
</svelte:head>
<ModeWatcher />

<div class="lg:p-3 p-2">
	<Nav />
	{@render children()}
</div>
