<script lang="ts">
	import '../app.css';
</script>

<svelte:head>
	<title>Mini Trade Console</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="min-h-dvh bg-bg text-ink">
	<div class="mx-auto max-w-5xl p-4">
		<header class="mb-4">
			<h1 class="text-xl font-semibold">Mini Trade Console</h1>
			<p class="text-sm text-muted">
				SvelteKit refresher • watchlist • order ticket • positions/P&amp;L
			</p>
		</header>
		<main class="grid gap-3 md:grid-cols-2">
			<slot />
		</main>
	</div>
</div>
