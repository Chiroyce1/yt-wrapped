<script lang="ts">
	import "../../app.css";
	import TopChannels from "./TopChannels.svelte";
	import type { Stats } from "../types";
	import { getStats, year, totalVideos, average } from "../data";
	import Graph from "./Graph.svelte";
	import App from "../../App.svelte";

	export let data: any | undefined;
	let stats: Stats | undefined;

	function daysPassedThisYear(): number {
		let now = new Date();
		let startOfYear = new Date(now.getFullYear(), 0, 0);
		// @ts-ignore
		let diff = now - startOfYear;
		let oneDay = 1000 * 60 * 60 * 24;
		return Math.floor(diff / oneDay);
	}

	let months = 1;

	$: if (data) {
		months = Math.max(1, Object.keys(data.days).length / 30);
		stats = getStats(data.days);
		console.log(`updating with ${Object.keys(data.days).length} days`);
	}
</script>

{#if data && stats}
	<p class="data title">You watched...</p>
	<p class="data">
		- a total of <span class="gradient blue"
			>{totalVideos(data.days).toLocaleString()}</span
		>
		videos
	</p>
	<p class="data">
		- an average of <span class="gradient yellow"
			>{average(data.days, Object.keys(data.days).length)}</span
		> videos in a day
	</p>
	<p class="data">
		- an average of <span class="gradient purple"
			>{average(data.days, months)}</span
		> videos in a month
	</p>
	<p class="data">
		- a whopping <span class="gradient red">{stats.mostWatchedMonthValue}</span>
		videos in <span class="gradient yellow">{stats.mostWatchedMonth}</span>
	</p>
	<p class="data">
		- a monumental <span class="gradient yellow"
			>{stats.mostWatchedDayValue}</span
		>
		videos on <span class="gradient red">{stats.mostWatchedDay}</span>
	</p>
	<TopChannels topChannels={data.top} n={20} />

	<br />
	<i
		><sub
			>Videos include #shorts but not videos or music played from
			music.youtube.com</sub
		></i
	>
	<br /><br /><br />
	<Graph {stats} />
{/if}

<style>
	p {
		margin: 0;
		font-weight: 300;
	}

	.title {
		margin-top: 1em;
		font-size: 1.8em;
	}

	i {
		color: var(--fg);
	}
</style>
