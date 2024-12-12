<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import { Label } from "$lib/components/ui/label/index.js";
	import { cn, type Channel } from "$lib/utils";
	import { parseData, year, top, getStats } from "$lib/index";
	import type { Video, Days, Stats } from "$lib/utils";
	import ChannelCard from "$lib/components/ChannelCard.svelte";
	import VideoCard from "$lib/components/VideoCard.svelte";
	import Charts from "$lib/components/Charts.svelte";

	let stats: Stats = $state();

	let avg:
		| {
				avgPerDay: number;
				avgPerMonth: number;
				days: Days;
				max: number;
		  }
		| undefined = $state(undefined);

	let images: Record<string, string> = $state({});

	const inputClass =
		"border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

	let files: FileList | undefined = $state();

	$effect(() => {
		if (!files) {
			console.warn("No files uploaded");
			return;
		}
		const file = files[0];
		file.text().then((content) => {
			const json = JSON.parse(content);
			stats = parseData(json);
			if (!stats) throw new Error("Invalid data");

			console.info(`Loaded ${stats.videos.length} videos`);
			console.info(`Loaded ${stats.songs.length} songs`);
			console.info(
				`${stats.uniqueArtists.length} unique artists and ${stats.uniqueChannels.length} unique channels`
			);

			// get all unique channel urls from the top channels, top videos' channels and top songs' channels
			let uniqueChannelUrls = [
				...new Set([
					...Object.entries(stats.topChannels.slice(0, top)).map(
						([_, channel]) => channel.url
					),
					...Object.entries(stats.topVideos.slice(0, top)).map(
						([_, video]) => video.channel.url
					),
					...Object.entries(stats.topSongs.slice(0, top)).map(
						([_, video]) => video.channel.url
					),
					...Object.entries(stats.topArtists.slice(0, top)).map(
						([_, channel]) => channel.url
					),
				]),
			];

			avg = getStats(stats.videos);

			console.log(avg);
			console.log(stats);

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
					setInterval(() => (images["a"] = Math.random().toString()), 1000);
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
			<Label for="file" class="text-xl text-center"
				>Upload your <code
					class="mx-1 border-2 px-2 py-1 rounded-md border-secondary"
					>watch-history.json</code
				> file</Label
			>
			<div class="flex gap-1 w-full lg:w-2/3 mx-auto">
				<input
					id="file"
					type="file"
					class={cn(inputClass, "cursor-pointer")}
					bind:files
				/>
				<Button>Generate</Button>
			</div>
			<Button href="/takeout" variant="link">How do I get the file?</Button>
		</div>
	{:else if stats && avg}
		{#key images}
			<div class="flex flex-col lg:flex-row gap-8 lg:w-3/4 w-full">
				<div
					class="text-3xl lg:text-4xl text-center w-full lg:w-1/2 items-center"
				>
					Watched <span class="gradient purple font-bold text-5xl"
						>{stats.videos.length.toLocaleString()}
					</span>
					videos <br /> from
					<span class="gradient yellow font-bold text-5xl"
						>{stats.uniqueChannels.length.toLocaleString()}</span
					> unique channels
				</div>

				<div class="text-3xl lg:text-4xl text-center w-full lg:w-1/2">
					Listened to <span class="gradient yellow font-bold text-5xl"
						>{stats.songs.length.toLocaleString()}
					</span>
					songs <br /> from
					<span class="gradient purple font-bold text-5xl"
						>{stats.uniqueArtists.length.toLocaleString()}</span
					> unique artists
				</div>
			</div>
			<div class="flex flex-col lg:flex-row gap-8 lg:w-3/4 w-full">
				<div
					class="text-3xl lg:text-4xl text-center w-full lg:w-1/2 items-center"
				>
					You watched around <span class="gradient blue font-bold text-5xl"
						>{avg.avgPerDay.toFixed().toLocaleString()}
					</span>
					videos every single
					<span class="gradient blue font-bold">day</span>!
				</div>
				<div
					class="text-3xl lg:text-4xl text-center w-full lg:w-1/2 items-center"
				>
					You watched around <span class="gradient font-bold text-5xl"
						>{avg.avgPerMonth.toFixed().toLocaleString()}
					</span>
					videos every <span class="gradient font-bold">month</span>!
				</div>
			</div>
			<div
				class="TOPBAR w-full lg:w-4/5 flex flex-col lg:flex-row justify-center pt-4 px-4"
			>
				<div
					class="w-full lg:w-1/2 h-auto py-4 px-4 lg:px-8 rounded-lg space-y-4"
				>
					<h1 class="text-4xl font-extrabold text-center">Top Channels</h1>
					{#each stats.topChannels.slice(0, top) as channel}
						<ChannelCard
							{channel}
							thumbnail={images[channel.url.split("/").pop() || ""]}
						/>
					{/each}
				</div>
				<div
					class="w-full lg:w-1/2 h-auto py-4 px-4 lg:px-8 rounded-lg space-y-4"
				>
					<h1 class="text-4xl font-extrabold text-center">Top Videos</h1>
					{#each stats.topVideos.slice(0, top) as video}
						<VideoCard
							{video}
							thumbnail={images[video.channel.url.split("/").pop() || ""]}
						/>
					{/each}
				</div>
			</div>
			<div
				class="BOTTOMBAR w-full lg:w-4/5 flex flex-col lg:flex-row justify-center px-4"
			>
				<div
					class="w-full lg:w-1/2 h-auto py-4 px-4 lg:px-8 rounded-lg space-y-4"
				>
					<h1 class="text-4xl font-extrabold text-center">Top Songs</h1>
					{#each stats.topSongs.slice(0, top) as video}
						<VideoCard
							{video}
							thumbnail={images[video.channel.url.split("/").pop() || ""]}
						/>
					{/each}
				</div>
				<div
					class="w-full lg:w-1/2 h-auto py-4 px-4 lg:px-8 rounded-lg space-y-4"
				>
					<h1 class="text-4xl font-extrabold text-center">Top Artists</h1>
					{#each stats.topArtists.slice(0, top) as channel}
						<ChannelCard
							{channel}
							thumbnail={images[channel.url.split("/").pop() || ""]}
						/>
					{/each}
				</div>
			</div>
		{/key}
		<div class="charts">
			<Charts {stats} />
		</div>
		<p class="text-2xl">
			<i>Come back tomorrow to see more stats (under development)...</i>
		</p>
	{/if}
</main>
