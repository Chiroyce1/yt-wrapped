<script>
	import { Button } from "$lib/components/ui/button";
	import { ExternalLink } from "lucide-svelte";
</script>

<main
	class="mx-8 w-auto lg:w-2/3 lg:mx-auto my-8 flex items-center flex-col gap-16 text-md lg:text-xl"
>
	<ol class="list-decimal">
		<li>
			Go to <a
				href="https://takeout.google.com"
				target="_blank"
				class="text-sky-500"
				><span class="flex gap-1">takeout.google.com<ExternalLink /></span></a
			>
		</li>
		<li>Click on "Deselect All"</li>
		<details>
			<summary class="cursor-pointer">(view screenshot)</summary>
			<img
				src="./screenshots/deselect_all.png"
				alt="(screenshot of the page)"
			/>
		</details>
		<li>
			Then scroll all the way down, make sure YouTube is selected,<br />and then
			click on "Multiple Formats"
		</li>
		<details>
			<summary class="cursor-pointer">(view screenshot)</summary>
			<img src="./screenshots/select_yt.png" alt="(screenshot of the page)" />
		</details>
		<li>
			Scroll to the bottom and change "history" to the <code class="code"
				>JSON</code
			> format and press "OK"
		</li>
		<details>
			<summary class="cursor-pointer">(view screenshot)</summary>
			<img src="./screenshots/json.png" alt="(screenshot of the page)" />
		</details>
		<li>
			Then click on "All YouTube data included"<br />Deselect all and make sure
			ONLY history is checked
		</li>
		<details>
			<summary class="cursor-pointer">(view screenshot)</summary>
			<img
				src="./screenshots/only_history.png"
				alt="(screenshot of the page)"
			/>
		</details>
		<li>
			Press "OK", then the blue "Next Step" button. <br />
			Change the max file size to 4GB.
		</li>
		<li>
			Wait for an email in your inbox that will let you know when it's ready <br
			/>It'll really only take 5 minutes.
		</li>
		<li>
			Download the zip file from the link sent to your inbox, <br />and finally
			locate the
			<code class="code">watch-history.json</code> file <br /><code
				>./Takeout/YouTube and YouTube Music/history/watch-history.json</code
			>
		</li>
	</ol>

	<Button href="/" class="w-1/2 text-xl mb-8">I've got it!</Button>
</main>

<style>
	img {
		height: 300px;
		border-radius: 5px;
	}

	details {
		margin-bottom: 1em;
	}

	li {
		margin-bottom: 1em;
	}
</style>
