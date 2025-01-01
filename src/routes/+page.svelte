<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import { cn } from "$lib/utils";
	import { parseData, defaultYear, defaultTop, getStats } from "$lib/index";
	import type { Days, Stats } from "$lib/utils";
	import ChannelCard from "$lib/components/ChannelCard.svelte";
	import VideoCard from "$lib/components/VideoCard.svelte";
	import Charts from "$lib/components/Charts.svelte";
	import { onMount } from "svelte";
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { goto } from "$app/navigation";

	// ================================================================ //
	// ALL STATE VARIABLES
	let year: number = $state(defaultYear);
	let musicChecked: boolean = $state(false);
	let top: number = $state(defaultTop);
	let topSongs: number = $state(defaultTop);
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
	let files: FileList | undefined = $state();

	// ================================================================ //

	onMount(() => {
		// RUN WHEN DOM LOADS
		// set year to non-default if specified in query params
		const searchParams = new URLSearchParams(location.search);
		const yearParam = searchParams.get("year");
		if (yearParam) year = parseInt(yearParam);
		document.title = `YouTube Wrapped ${year}`;
	});

	function dummy(n: any) {
		return n;
	}

	const inputClass =
		"border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

	function loadImages() {
		if (!stats) return;
		let uniqueChannelUrls = [
			...new Set([
				...Object.entries(stats.topChannels.slice(0, top)).map(
					([_, channel]) => channel.url
				),
				...Object.entries(stats.topVideos.slice(0, top)).map(
					([_, video]) => video.channel.url
				),
				...Object.entries(stats.topSongs.slice(0, topSongs)).map(
					([_, video]) => video.channel.url
				),
				...Object.entries(stats.topArtists.slice(0, topSongs)).map(
					([_, channel]) => channel.url
				),
			]),
		];

		uniqueChannelUrls = uniqueChannelUrls
			.map((url) => url?.split("/").pop())
			.filter((url): url is string => !!url);

		// filter channelURLs that are already in `images`
		uniqueChannelUrls = uniqueChannelUrls.filter(
			(url) => !Object.keys(images).includes(url)
		);

		console.info(`Fetching ${uniqueChannelUrls.length} images...`);

		fetch("/api", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ channels: uniqueChannelUrls }),
		})
			.then((res) => res.json())
			.then((data) => {
				images = { ...images, ...data };
				setInterval(() => (images["a"] = Math.random().toString()), 1000);
			});
	}

	function load() {
		if (!files) {
			console.warn("No files uploaded");
			return;
		}
		const file = files[0];
		file.text().then((content) => {
			const json = JSON.parse(content);
			stats = parseData(json, year);
			if (!stats) throw new Error("Invalid data");

			console.info(`Loaded ${stats.videos.length} videos`);
			console.info(`Loaded ${stats.songs.length} songs`);
			console.info(
				`${stats.uniqueArtists.length} unique artists and ${stats.uniqueChannels.length} unique channels`
			);

			avg = getStats(stats.videos);

			console.info(avg);
			console.info(stats);

			loadImages();
		});
	}

	$effect(() => {
		console.info(`Files:`, files);
		if (files) load();
	});
</script>

<main class="w-full lg:mx-auto my-8 flex items-center flex-col gap-16">
	<h1 class="text-5xl lg:text-7xl text-center gradient red font-extrabold">
		YouTube Wrapped {year}
	</h1>

	{#if !stats}
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
						>{stats.uniqueSongs.length.toLocaleString()}
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

			{#key top}
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
				<Button
					class="text-center w-full lg:w-1/2"
					onclick={() => {
						top = top + 5;
						loadImages();
					}}
					variant="secondary">Load more videos and channels</Button
				>
				<div class="flex items-center gap-2">
					<Checkbox
						id="terms"
						bind:checked={musicChecked}
						aria-labelledby="terms-label"
					/>
					<Label
						id="terms-label"
						for="terms"
						class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						Show music stats
					</Label>
				</div>
				{#if musicChecked}
					<div
						class="BOTTOMBAR w-full lg:w-4/5 flex flex-col lg:flex-row justify-center px-4"
					>
						<div
							class="w-full lg:w-1/2 h-auto py-4 px-4 lg:px-8 rounded-lg space-y-4"
						>
							<h1 class="text-4xl font-extrabold text-center">Top Songs</h1>
							{#each stats.topSongs.slice(0, topSongs) as video}
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
							{#each stats.topArtists.slice(0, topSongs) as channel}
								<ChannelCard
									{channel}
									thumbnail={images[channel.url.split("/").pop() || ""]}
								/>
							{/each}
						</div>
					</div>
					<Button
						class="text-center w-full lg:w-1/2"
						onclick={() => {
							topSongs = topSongs + 5;
							loadImages();
						}}
						variant="secondary">Load more songs and artists</Button
					>
				{/if}
			{/key}
		{/key}
		<div class="charts">
			{#key year}
				<Charts {stats} />
			{/key}
		</div>
		<div class="flex gap-2">
			<Button
				onclick={() => {
					year = year - 1;
					goto(`/?year=${year}`);
					load();
					window.scrollTo({ top: 0, behavior: "smooth" });
				}}
				class="text-sky-500 text-xl"
				variant="secondary">{year - 1} stats</Button
			>
			<Button class="text-green-500 text-xl" variant="secondary"
				>{year} stats</Button
			>
			<Button
				disabled={year + 1 > new Date().getFullYear()}
				onclick={() => {
					year = year + 1;
					goto(`/?year=${year}`);
					load();
					window.scrollTo({ top: 0, behavior: "smooth" });
				}}
				class="text-sky-500 text-xl"
				variant="secondary">{year + 1} stats</Button
			>
		</div>
	{/if}
</main>
