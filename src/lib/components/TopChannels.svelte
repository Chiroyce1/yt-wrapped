<script lang="ts">
	import type { TopChannels } from "../types";

	export let topChannels: TopChannels;
	export let n: number;

	$: channelEntries = Object.entries(topChannels).slice(0, n);
	const loadedMore = Object.entries(topChannels).slice(n, 200);
	const pad = (x: number) => (x <= 9 ? `0${x}` : x);
</script>

<div class="top">
	<p class="data">Your top channels were</p>
	{#each channelEntries as [channelName, channelInfo], index (channelName)}
		<div class="channel">
			<div class="left">
				<span class="code">#{pad(index + 1)}</span>
				<a href={channelInfo.channelURL}>{channelName}</a>
			</div>
			<span class="gradient code blue">{channelInfo.videosWatched} videos</span>
		</div>
	{/each}
	<details>
		<summary>21 - 200</summary>
		{#each loadedMore as [channelName, channelInfo], index (channelName)}
			<div class="channel">
				<div class="left">
					<span class="code">#{pad(index + n + 1)}</span>
					<a href={channelInfo.channelURL}>{channelName}</a>
				</div>
				<span class="gradient code blue"
					>{channelInfo.videosWatched} videos</span
				>
			</div>
		{/each}
	</details>
</div>

<style>
	.channel {
		display: flex;
		justify-content: space-between;
	}

	summary {
		margin-top: 1em;
		margin-bottom: 1em;
	}
</style>
