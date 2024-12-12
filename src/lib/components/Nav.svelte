<script lang="ts">
	import { LogOut } from "lucide-svelte";
	import Theme from "./Theme.svelte";
	import { Button } from "./ui/button";
	import { goto } from "$app/navigation";
</script>

<div class="w-full flex flex-row items-center justify-between pt-2">
	<h1 class="text-xl font-extrabold lg:text-3xl ml-1 lg:ml-3">
		<a href="/" class="text-theme gradient">ytwrapped</a>
	</h1>
	<div class="self-end flex gap-2">
		<a href="/privacy" class="text-sm" title="privacy">
			<Button class="text-md" variant="link">Privacy</Button>
		</a>

		<span class="sm:ml-2"><Theme /></span>
	</div>
</div>
