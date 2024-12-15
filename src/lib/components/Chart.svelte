<script lang="ts">
	import Chart from "chart.js/auto";
	let props = $props();

	let { keys, values, stat } = props;

	console.info(
		`${stat} loaded with ${keys.length} keys and ${values.length} values`
	);

	const data = {
		labels: keys, // y-axis labels (keys)
		datasets: [
			{
				label: "Videos Watched",
				data: values, // x-axis values (values)
				backgroundColor: "rgba(54, 162, 235, 0.2)",
				borderColor: "rgba(54, 162, 235, 1)",
				borderWidth: 1,
			},
		],
	};

	function chart(node: HTMLCanvasElement, data: object) {
		function setupChart(_data: object) {
			const chart = new Chart(node, {
				type: "bar",
				data: {
					// @ts-ignore
					labels: _data.keys,
					datasets: [
						{
							label: "Videos Watched",
							// @ts-ignore
							data: _data.values,
							backgroundColor: "rgba(54, 162, 235, 0.2)",
							borderColor: "rgba(54, 162, 235, 1)",
							borderWidth: 1,
						},
					],
				},
				options: {
					indexAxis: "y", // Horizontal bar chart
					scales: {
						x: {
							beginAtZero: true,
						},
					},
					plugins: {
						legend: {
							display: false, // Hide legend
						},
					},
				},
			});
		}
		setupChart(data);
		return {
			update(data: object) {
				// @ts-ignore
				chart?.destroy();
				setupChart(data);
			},
		};
	}
</script>

<canvas class="w-full h-64 lg:h-96" use:chart={$state.snapshot(props)}></canvas>
