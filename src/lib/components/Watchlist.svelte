<script lang="ts">
	import { prices, lastPrices, type Symbol } from '$lib/stores';
	import { fmtPrice, delta, deltaUI } from '$lib/utils';
	import { SYMBOLS } from '$lib/symbols';
</script>

<section aria-labelledby="watchlist-h" class="rounded-2xl bg-card p-3 md:col-span-1">
	<h2 id="watchlist-h" class="mb-2 text-sm text-accent">Watchlist (Realtime)</h2>
	<table class="w-full border-collapse" aria-describedby="watchlist-desc">
		<caption id="watchlist-desc" class="sr-only">ES/NQ/CL last price and delta</caption>
		<thead>
			<tr>
				<th class="border-b border-slate-800 p-2 text-left">Symbol</th>
				<th class="border-b border-slate-800 p-2 text-left">Last</th>
				<th class="border-b border-slate-800 p-2 text-left">Δ</th>
			</tr>
		</thead>
		<tbody>
			{#each SYMBOLS as s (s)}
				{#key s}
					{#await Promise.resolve() then _}
						<!-- Force re-render on each price update -->
						{@const cur = $prices[s as Symbol]}
						{@const last = $lastPrices[s as Symbol]}
						{@const d = delta(cur, last)}
						{@const ui = deltaUI(d.dir as -1 | 0 | 1)}

						<tr>
							<td class="border-b border-slate-800 p-2 font-semibold">{s}</td>
							<td class="border-b border-slate-800 p-2">{fmtPrice(cur)}</td>
							<td class="border-b border-slate-800 p-2 {ui.cls}">
								<span aria-hidden="true">{ui.arrow}</span>
								{#if d.dir !== 0}
									<span class="ml-1">{d.text}</span>
								{:else}
									<span class="opacity=70 ml-1">{d.text}</span>
								{/if}
								<span class="sr-only">
									{ui.sr}
									{d.dir === 0 ? '' : d.text}
								</span>
							</td>
						</tr>
					{/await}
				{/key}
			{/each}
		</tbody>
	</table>
</section>
