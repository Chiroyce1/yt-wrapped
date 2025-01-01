<script lang="ts">
	import * as Avatar from "$lib/components/ui/avatar/index";
	import type { Video } from "$lib/utils";
	import { ExternalLink } from "lucide-svelte";
	let props = $props();

	function formatNumber(n: number) {
		if (n < 1000) {
			return n;
		} else if (n < 1_000_000) {
			return (n / 1000).toFixed(1) + "K";
		} else {
			return (n / 1_000_000).toFixed(1) + "M";
		}
	}

	let date = $state(false);
	// svelte-ignore non_reactive_update
	let video = props.video;
	if (video.video) {
		video = video.video;
	}

	if (props.date) {
		date = true;
	}

	const imgUrl = props.thumbnail;
</script>

<div class="flex items-center shadow-md rounded-md p-4 bg-secondary">
	<Avatar.Root class="h-16 w-16 shadow-lg">
		<Avatar.Image src={imgUrl} alt={video.title} />
		<Avatar.Fallback>{video.channel.name}</Avatar.Fallback>
	</Avatar.Root>
	<div class="ml-4 space-y-1">
		<p class="text-xl font-medium leading-none">
			<a href={video.url} target="_blank"
				><span class="flex items-center gap-2"
					>{video.title}<ExternalLink size={14} /></span
				></a
			>
		</p>
		<p class="text-muted-foreground text-sm">
			<!-- if video object in video -->
			{video.channel.name} ·
			{#if date}
				{new Date(video.time).toLocaleTimeString()}
			{:else}
				· {formatNumber(video.watched || 1)} times
			{/if}
		</p>
	</div>
</div>
