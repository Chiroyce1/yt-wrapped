<script lang="ts">
	import * as Table from "$lib/components/ui/table";
	import Button from "$lib/components/ui/button/button.svelte";
	import { cn, type Stats } from "$lib/utils";
	import { parseData, defaultYear } from "$lib/index";
	import * as Avatar from "$lib/components/ui/avatar/index";

	let year: number = $state(defaultYear);
	let stats: Stats = $state();
	let images: Record<string, string> = $state({});
	let count = $state(50);

	const inputClass =
		"border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

	let files: FileList | undefined = $state();

	function loadImages() {
		if (!stats) return;
		const channelUrls = stats.videos
			.slice(0, count)
			.map((video) => video.channel.url);
		let uniqueChannelUrls = [...new Set(channelUrls)];

		uniqueChannelUrls = uniqueChannelUrls
			.map((url) => url?.split("/").pop())
			.filter((url): url is string => !!url);

		// filter channelURLs that are already in `images`
		uniqueChannelUrls = uniqueChannelUrls.filter(
			(url) => !Object.keys(images).includes(url)
		);

		if (uniqueChannelUrls.length === 0) return;
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
				setTimeout(() => {
					images = { ...images, a: Math.random().toString() };
				}, 1000);
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
			stats = parseData(json, new Date().getFullYear());
			if (!stats) throw new Error("Invalid data");

			console.info(`Loaded ${stats.videos.length} videos`);
			console.info(`Loaded ${stats.songs.length} songs`);
			console.info(
				`${stats.uniqueArtists.length} unique artists and ${stats.uniqueChannels.length} unique channels`
			);

			loadImages();
		});
	}

	$effect(() => {
		console.info(`Files:`, files);
		if (files) load();
	});
</script>

<div class="mx-auto grid lg:w-1/2 items-center gap-8 my-12">
	<p class="text-4xl lg:text-5xl text-center gradient red font-extrabold">
		YouTube Watch History
	</p>
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

<div class="w-full lg:w-4/5 mx-auto flex flex-col items-center">
	{#if !stats}
		<p class="text-xl text-center font-bold">0 videos</p>
	{:else}
		<p class="text-xl text-center font-bold">
			{stats.videos.length.toLocaleString()} total videos
		</p>
		<Table.Root>
			<Table.Header>
				<!-- 
				export type Video = {
					title: string;
					url: string;
					time: string;
					channel: Channel;
				};
 				-->
				<Table.Row>
					<Table.Head class="w-1/4">Channel</Table.Head>
					<Table.Head class="w-1/2">Video</Table.Head>
					<Table.Head class="text-right w-1/4">Time</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each stats.videos.slice(0, count) as video}
					<Table.Row>
						<Table.Cell>
							<a href={video.channel.url} class="" target="_blank">
								<div
									class="flex flex-col lg:flex-row items-center gap-2 lg:gap-4"
								>
									<Avatar.Root class="h-16 w-16 shadow-lg">
										<Avatar.Image
											src={images[video.channel.url.split("/").pop() || ""]}
										/>
										<Avatar.Fallback>
											<span class="font-medium lg:text-xl"
												>{video.channel.name}</span
											></Avatar.Fallback
										>
									</Avatar.Root> <br />
									<span class="text-sm"
										>{video.channel.name} ({stats.videos.filter(
											(v) => v.channel.url === video.channel.url
										).length} videos)</span
									>
								</div></a
							>
						</Table.Cell>
						<Table.Cell>
							<a href={video.url} class="lg:text-xl" target="_blank"
								>{video.title}</a
							>
						</Table.Cell>
						<Table.Cell class="font-medium text-sm lg:text-md"
							>{new Date(video.time).toLocaleString()}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
	{#if stats}
		{#if count < stats.videos.length}
			<Button
				class="mx-auto w-3/4 lg:w-1/2 my-4"
				onclick={() => {
					count += 50;
					loadImages();
				}}>Load more</Button
			>
		{/if}
	{/if}
</div>
