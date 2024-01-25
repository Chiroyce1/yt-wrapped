<script lang="ts">
  import { year, filterVideos, processData } from "./lib/data";
  import type { Days, TopChannels } from "./lib/types";
  import Wrapped from "./lib/components/Wrapped.svelte"
	
  let files: FileList;
  let data: {
	days: Days;
	top: TopChannels;
} | undefined = undefined;

function createWrapped(file: File): void {
	file.text().then(contents => {
    const VIDEOS = JSON.parse(contents);
    let filteredVideos = filterVideos(VIDEOS);
    data = processData(filteredVideos);
		delete data['top']['[deleted or unknown]']
  })
}

  $: if (files) {
    // https://svelte.dev/repl/file-inputs?version=4.2.9
    createWrapped(files[0])
	}
</script>


<main>
	<h1><span class="gradient">YouTube Wrapped {year}</span></h1>
	{#if !files}
		<div class="file">
			<p>Upload your <code>watch-history.json</code> file</p>
			<p><b>Note:</b> This remains on device and is not sent to any server. </p>
			<input type="file" accept="application/json" bind:files />
		</div>
		<div class="extra"><details>
			<summary>How do I get this file?</summary>
			<ol>
				<li>Go to <a href="https://takeout.google.com" target="_blank">takeout.google.com</a></li>
				<li>Click on "Deselect All"</li>
				<img src="./screenshots/deselect_all.png" alt="(screenshot of the page)">
				<li>Then scroll all the way down, make sure YouTube is selected,<br>and then click on "Multiple Formats"</li>
				<img src="./screenshots/select_yt.png" alt="(screenshot of the page)">
				<li>Scroll to the bottom and change "history" to the <code>JSON</code> format and press "OK"</li>
				<img src="./screenshots/json.png" alt="(screenshot of the page)">
				<li>Then click on "All YouTube data included"<br>Deselect all and make sure ONLY history is checked</li>
				<img src="./screenshots/only_history.png" class="tall" alt="(screenshot of the page)">
				<li>Press "OK", then the blue "Next Step" button. <br>
					Change the max file size to 4GB.</li>
				<li>Wait for an email in your inbox that will let you know when it's ready <br>It'll really only take 5 minutes. </li>
				<li>Download the zip file from the link sent to your inbox, <br>and finally locate the
					<code>watch-history.json</code> file <br><code>./Takeout/YouTube and YouTube Music/history/watch-history.json</code></li>
			</ol>
		</details></div>
	{/if}
  <Wrapped {data} />
	<a href="https://github.com/Chiroyce1/yt-wrapped" target="_blank">
		{#if window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches}
			<img src="./github_dark.png" id="github" alt="View on GitHub">
		{:else}
			<img src="./github_light.png" id="github" alt="View on GitHub">
		{/if}
	</a>
	</main>

<style>
	#github {
  	position: fixed;
    border-radius: 50%;
  	right: 2em;
  	top: 1em;
  	height: 42px;
  	margin: 1em;
  	cursor: pointer;
		transition: all 200ms;
	}

	#github:hover {
		transform: scale(1.2);
	}
</style>