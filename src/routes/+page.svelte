<script lang="ts">
	import { onMount } from 'svelte';
	import { prices, positions, pnl, lastLatency, type Symbol, applyPriceTick } from '$lib/stores';
	import { SYMBOLS } from '$lib/symbols';
	import { connectTickers } from '$lib/api/coinbase';

	// Order form state
	let sym: Symbol = 'ES';
	let side: 'buy' | 'sell' = 'buy';
	let qty = 1;
	let pending = false;
	let statusMsg = '';

	onMount(() => {
		const conn = connectTickers(
			(uiSymbol, price, _isoTime) => {
				applyPriceTick(uiSymbol, price);
			},
			{ log: false }
		);

		return () => conn.disconnect();
	});

	async function submitOrder() {
		// TODO: POST /api/order; optimistic positions; update lastLatency; set statusMsg
	}
</script>

<!-- Watchlist -->
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
			{#each SYMBOLS as s}
				<tr>
					<td class="border-b border-slate-800 p-2 font-semibold">{s}</td>
					<td class="border-b border-slate-800 p-2">{$prices[s] ?? '—'}</td>
					<td class="border-b border-slate-800 p-2">— <!-- TODO: ▲/▼ vs lastPrices --></td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>

<!-- Order Ticket -->
<section aria-labelledby="order-h" class="rounded-2xl bg-card p-3 md:col-span-1">
	<h2 id="order-h" class="mb-2 text-sm text-accent">Order Ticket</h2>
	<form on:submit|preventDefault={submitOrder} aria-describedby="order-help">
		<p id="order-help" class="sr-only">
			Select symbol, side, and quantity (≥ 1). Submit to place a mock order.
		</p>

		<label for="sym" class="mt-2 mb-1 block font-semibold">Symbol</label>
		<select
			id="sym"
			bind:value={sym}
			class="w-full rounded-lg border border-slate-700 bg-[#0f1520] px-3 py-2 text-ink"
		>
			{#each SYMBOLS as s}<option value={s}>{s}</option>{/each}
		</select>

		<label for="side" class="mt-2 mb-1 block font-semibold">Side</label>
		<select
			id="side"
			bind:value={side}
			class="w-full rounded-lg border border-slate-700 bg-[#0f1520] px-3 py-2 text-ink"
		>
			<option value="buy">Buy</option>
			<option value="sell">Sell</option>
		</select>

		<label for="qty" class="mt-2 mb-1 block font-semibold">Quantity</label>
		<input
			id="qty"
			type="number"
			min="1"
			step="1"
			bind:value={qty}
			class="w-full rounded-lg border border-slate-700 bg-[#0f1520] px-3 py-2 text-ink"
		/>

		<div class="mt-2 flex items-center gap-2">
			<button
				type="submit"
				class="rounded-lg border border-slate-700 bg-[#0f1520] px-3 py-2 text-ink disabled:cursor-not-allowed disabled:opacity-60"
				disabled={pending}
			>
				Submit
			</button>
			<span class="text-sm opacity-80">Latency: {$lastLatency ?? '—'} ms</span>
		</div>

		<div aria-live="polite" class="mt-1 text-sm">{statusMsg}</div>
	</form>
</section>

<!-- Positions & PnL -->
<section aria-labelledby="pos-h" class="rounded-2xl bg-card p-3 md:col-span-2">
	<h2 id="pos-h" class="mb-2 text-sm text-accent">Positions &amp; P&amp;L</h2>
	<table class="w-full border-collapse">
		<thead>
			<tr>
				<th class="border-b border-slate-800 p-2 text-left">Symbol</th>
				<th class="border-b border-slate-800 p-2 text-left">Position</th>
				<th class="border-b border-slate-800 p-2 text-left">P&amp;L (naive)</th>
			</tr>
		</thead>
		<tbody>
			{#each SYMBOLS as s}
				<tr>
					<td class="border-b border-slate-800 p-2 font-semibold">{s}</td>
					<td class="border-b border-slate-800 p-2">{$positions[s]}</td>
					<td class="border-b border-slate-800 p-2">{$pnl[s]}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>
