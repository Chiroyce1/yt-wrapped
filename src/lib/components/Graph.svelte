<script lang="ts">
	import type { Days, Stats } from "../types";
	import Chart from 'chart.js/auto';
	import { onMount } from "svelte";
	import { year } from "../data";
	export let stats: Stats;

	function createCharts() {
		// @ts-ignore
		const ctxLine = document.getElementById("lineChart").getContext("2d");

		const graphData = {
			line: {
				x: stats.dates,
				y: stats.videosOverYear
			},
			bar: {
				x: stats.dates,
				y: stats.videosPerDay
			}
		}

		let lineChart = new Chart(ctxLine, {
			type: "line",
			data: {
				labels: graphData.line.x,
				datasets: [
					{
						label: "Videos watched throughout the year",
						data: graphData.line.y,
						borderColor: "rgba(75, 192, 192, 1)",
						borderWidth: 2,
						fill: true,
					},
				],
			}
		});

		// @ts-ignore
		const ctxBar = document.getElementById("barChart").getContext("2d");
		let barChart = new Chart(ctxBar, {
			type: "bar",
			data: {
				labels: graphData.bar.x,
				datasets: [
					{
						label: "Videos Per Day",
						data: graphData.bar.y,
						backgroundColor: "rgba(75, 192, 192, 0.2)",
						borderColor: "rgba(75, 192, 192, 1)",
						borderWidth: 1,
					},
				],
			}
		});
	};
	
	onMount(createCharts);
</script>

<h2 class="gradient">Videos watched throughout {year}</h2>
<canvas id="lineChart" width="500" height="300"></canvas>
<h2 class="gradient">Videos watched every day in {year}</h2>
<canvas id="barChart" width="500" height="300"></canvas>

<style>
	canvas {
		width: 100%;
	}
</style>