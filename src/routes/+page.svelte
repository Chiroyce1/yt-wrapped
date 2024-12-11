<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import { Label } from "$lib/components/ui/label/index.js";
	import {
		cn,
		type Channel,
		type TopChannels,
		type TopVideos,
	} from "$lib/utils";
	import { parseData, statTopChannels, statTopVideos, year } from "$lib/index";
	import { type Video } from "$lib/utils";
	import ChannelCard from "$lib/components/ChannelCard.svelte";
	import VideoCard from "$lib/components/VideoCard.svelte";

	let topChannels: Channel[] = $state([]);
	let topVideos: { watched: number; video: Video; channel: Channel }[] = $state(
		[]
	);
	let topSongs: { watched: number; video: Video; channel: Channel }[] = $state(
		[]
	);
	let images: { [key: string]: string } = $state({});

	let uniqueChannels = $state(0);
	let uniqueArtists = $state(0);

	const inputClass =
		"border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

	let files: FileList | undefined = $state();
	let history: Video[] = $state([]);
	let music: Video[] = $state([]);

	$effect(() => {
		if (!files) {
			console.warn("No files uploaded");
			return;
		}
		const file = files[0];
		file.text().then((content) => {
			const json = JSON.parse(content);
			history = parseData(json);
			console.info(`Loaded ${history.length} history objects`);
			music = history.filter((video) =>
				video.url?.includes("music.youtube.com")
			);
			console.info(`Loaded ${music.length} songs`);
			history = history.filter(
				(video) => !video.url?.includes("music.youtube.com")
			);
			console.info(`Loaded ${history.length} video`);

			topVideos = statTopVideos(history).slice(0, 5);
			topChannels = statTopChannels(history).slice(0, 5);
			topSongs = statTopVideos(music).slice(0, 5);

			uniqueChannels = new Set(history.map((video) => video.channel.name)).size;
			uniqueArtists = new Set(music.map((video) => video.channel.name)).size;

			// get all unique channel urls from the top channels, top videos' channels and top songs' channels
			let uniqueChannelUrls = [
				...new Set([
					// @ts-ignore
					...Object.entries(topChannels).map(([_, channel]) => channel.url),
					// @ts-ignore
					...Object.entries(topVideos).map(([_, video]) => video.channel.url),
					// @ts-ignore
					...Object.entries(topSongs).map(([_, video]) => video.channel.url),
				]),
			];

			uniqueChannelUrls = uniqueChannelUrls
				.map((url) => url?.split("/").pop())
				.filter((url): url is string => !!url);

			fetch("/api", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ channels: uniqueChannelUrls }),
			})
				.then((res) => res.json())
				.then((data) => {
					images = data;
				});
		});
	});
</script>

<main class="w-full lg:mx-auto my-8 flex items-center flex-col gap-16">
	<h1 class="text-5xl lg:text-7xl text-center gradient red font-extrabold">
		YouTube Wrapped {year}
	</h1>

	{#if !files}
		<div class="mx-auto grid lg:w-1/2 items-center gap-8">
			<Label for="file" class="text-xl"
				>Upload your <code>watch-history.json</code> file</Label
			>
			<div class="flex gap-1">
				<input
					id="file"
					type="file"
					class={cn(inputClass, "cursor-pointer")}
					bind:files
				/>
				<Button>Unwrap it!</Button>
			</div>
			<Button href="/takeout" variant="link">How do I get it?</Button>
		</div>
	{:else}
		{#key images}
			<div class="flex flex-col lg:flex-row gap-8 lg:w-3/4 w-full">
				<div class="text-3xl lg:text-4xl text-center w-1/2">
					Watched <span class="gradient purple font-bold text-5xl"
						>{history.length.toLocaleString()}
					</span>
					videos <br /> from
					<span class="gradient yellow font-bold text-5xl"
						>{uniqueChannels.toLocaleString()}</span
					> unique channels
				</div>

				<div class="text-3xl lg:text-4xl text-center w-1/2">
					Listened to <span class="gradient purple font-bold text-5xl"
						>{music.length.toLocaleString()}
					</span>
					songs <br /> from
					<span class="gradient yellow font-bold text-5xl"
						>{uniqueArtists.toLocaleString()}</span
					> unique artists
				</div>
			</div>
			<div
				class="flex flex-col lg:flex-row w-full justify-center py-12 px-4 lg:px-8"
			>
				<div
					class="w-full lg:w-1/3 h-auto py-4 px-4 lg:px-8 rounded-lg space-y-4"
				>
					<h1 class="text-3xl font-extrabold text-center">Top Channels</h1>
					{#each topChannels as channel}
						<ChannelCard
							{channel}
							thumbnail={images[channel.url.split("/").pop() || ""]}
						/>
					{/each}
				</div>
				<div
					class="w-full lg:w-1/3 h-auto py-4 px-4 lg:px-8 rounded-lg space-y-4"
				>
					<h1 class="text-3xl font-extrabold text-center">Top Videos</h1>
					{#each topVideos as video}
						<VideoCard
							{video}
							thumbnail={images[video.channel.url.split("/").pop() || ""]}
						/>
					{/each}
				</div>
				<div
					class="w-full lg:w-1/3 h-auto py-4 px-4 lg:px-8 rounded-lg space-y-4"
				>
					<h1 class="text-3xl font-extrabold text-center">Top Songs</h1>
					{#each topSongs as video}
						<VideoCard
							{video}
							thumbnail={images[video.channel.url.split("/").pop() || ""]}
						/>
					{/each}
				</div>
			</div>
		{/key}
	{/if}
</main>
