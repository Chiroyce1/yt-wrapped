<script lang="ts">
	import { year, filterVideos, processData, monthMap } from "./lib/data";
	import type { Days, TopChannels } from "./lib/types";
	import Wrapped from "./lib/components/Wrapped.svelte";

	let files: FileList;
	let data:
		| {
				days: Days;
				top: TopChannels;
		  }
		| undefined = undefined;

	function createWrapped(file: File, startDate: string, endDate: string): void {
		file.text().then((contents) => {
			const VIDEOS = JSON.parse(contents);
			let filteredVideos = filterVideos(VIDEOS, startDate, endDate);
			data = processData(filteredVideos);
			delete data["top"]["[deleted or unknown]"];
			console.log(data);
			console.log(
				`got videos for ${Object.keys(data.days).length} days from ${startDate} to ${endDate}`,
			);
		});
	}

	$: if (files) {
		createWrapped(files[0], startDate, endDate);
	}

	let startDate = `${year}-01-01`;
	let endDate = new Date().toISOString().split("T")[0];
</script>

<main>
	<h1><span class="gradient">YouTube Wrapped {year}</span></h1>
	{#if !files}
		<hr />
		<p>
			YouTube Wrapped (like Spotify Wrapped) app that shows you an overview of
			the number of videos and channels you've watched this year + supports
			custom date ranges.
		</p>
		<hr />
		<div class="file">
			<p>Upload your <code>watch-history.json</code> file</p>
			<p><b>Note:</b> This remains on device and is not sent to any server.</p>
			<input type="file" accept="application/json" bind:files />
		</div>
		<div class="extra">
			<details>
				<summary>How do I get this file?</summary>
				<ol>
					<li>
						Go to <a href="https://takeout.google.com" target="_blank"
							>takeout.google.com</a
						>
					</li>
					<li>Click on "Deselect All"</li>
					<img
						src="./screenshots/deselect_all.png"
						alt="(screenshot of the page)"
					/>
					<li>
						Then scroll all the way down, make sure YouTube is selected,<br
						/>and then click on "Multiple Formats"
					</li>
					<img
						src="./screenshots/select_yt.png"
						alt="(screenshot of the page)"
					/>
					<li>
						Scroll to the bottom and change "history" to the <code>JSON</code> format
						and press "OK"
					</li>
					<img src="./screenshots/json.png" alt="(screenshot of the page)" />
					<li>
						Then click on "All YouTube data included"<br />Deselect all and make
						sure ONLY history is checked
					</li>
					<img
						src="./screenshots/only_history.png"
						class="tall"
						alt="(screenshot of the page)"
					/>
					<li>
						Press "OK", then the blue "Next Step" button. <br />
						Change the max file size to 4GB.
					</li>
					<li>
						Wait for an email in your inbox that will let you know when it's
						ready <br />It'll really only take 5 minutes.
					</li>
					<li>
						Download the zip file from the link sent to your inbox, <br />and
						finally locate the
						<code>watch-history.json</code> file <br /><code
							>./Takeout/YouTube and YouTube Music/history/watch-history.json</code
						>
					</li>
				</ol>
			</details>
		</div>
	{:else}
		<p>Start and End dates</p>
		<input
			type="date"
			bind:value={startDate}
			on:input={() => createWrapped(files[0], startDate, endDate)}
		/>
		<input
			type="date"
			bind:value={endDate}
			on:input={() => createWrapped(files[0], startDate, endDate)}
		/>
		<Wrapped {data} />
	{/if}
</main>

<style>
	input[type="date"] {
		/* dark theme */
		background-color: var(--bg);
		color: var(--fg);
		border: 1px solid var(--fg);
		border-radius: 5px;
		padding: 0.5em 1em;
		cursor: pointer;
	}
</style>
