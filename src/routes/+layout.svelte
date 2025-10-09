<script lang="ts">
	import '../app.css';
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Mini Trade Console</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="min-h-dvh bg-bg text-ink">
	<div class="mx-auto max-w-5xl p-4">
		<header class="mb-4">
			<h1 class="text-xl font-semibold">
				<a href={resolve('/')} class="hover:underline">Mini Trade Console</a>
			</h1>
			<p class="text-sm text-muted">
				SvelteKit refresher • Watchlist • Orders • Positions / P&amp;L
			</p>
			<p>
				<a href={resolve('/debug')} class="text-sm text-blue-600 hover:underline">Debug Websocket</a
				>
			</p>
		</header>
		<main class="grid gap-3 md:grid-cols-2">
			<slot />
		</main>
	</div>
</div>
