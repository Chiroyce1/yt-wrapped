<script lang="ts">
	import Chart from "./Chart.svelte";
	import { onMount } from "svelte";
	import { st } from "$lib/stats";
	import { analyzeProperty } from "$lib/analyze";
	import type { Stats } from "$lib/utils";
	let props = $props();

	const stats: Stats = props.stats;
	let data: {
		stat: string;
		keys: string[];
		values: number[];
		info: string;
	}[] = $state([]);

	const statList = $state(st);

	function createGraphs() {
		if (!stats) {
			throw new Error("No stats provided");
		}
		statList.forEach(({ stat, func, info }) => {
			let { keys, values } = analyzeProperty(stats.videos, ["time"], func);
			keys = keys.slice(0, 10);
			values = values.slice(0, 10);
			data.push({ stat, keys, values, info });
		});
	}

	onMount(() => {
		createGraphs();
	});
</script>

{#if data}
	<div class="flex flex-col gap-12">
		{#each data as { stat, keys, values, info }, i}
			<p class="text-2xl lg:text-4xl font-semibold text-center my-4">
				{info} <span class="gradient blue">{keys[0]}</span>
			</p>
			<Chart {keys} {stat} {values} />
		{/each}
	</div>
{/if}
