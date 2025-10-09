<script lang="ts">
	import { SYMBOLS } from '$lib/symbols';
	import { lastLatency, positions, type Symbol } from '$lib/stores';
	import type { OrderRequest } from '../../src/routes/api/order/+server';

	let sym = 'ES' as unknown as Symbol;
	let side: 'buy' | 'sell' = 'buy';
	let qty = 1;
	let pending = false;
	let statusMsg = '';

	async function submitOrder(): Promise<void> {
		if (pending) return;

		const q = Number(qty);

		if (!Number.isInteger(q) || q < 1) {
			statusMsg = 'Quantity must be an integer ≥ 1.';
			return;
		}

		pending = true;
		statusMsg = 'Submitting order...';
		const t0 = performance.now();

		try {
			const body: OrderRequest = {
				sym,
				side,
				qty: q
			};
			const res = await fetch('/api/order', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});

			const t1 = performance.now();
			const rtMs = Math.round(t1 - t0);
			lastLatency.set(rtMs);

			if (!res.ok) {
				// Server-side validation or simulated failure
				let err = '';
				try {
					const j = await res.json();
					err = j?.message ?? `HTTP ${res.status}`;
				} catch {
					err = `HTTP ${res.status}`;
				}
				statusMsg = `Order failed: ${err}`;

				return;
			}

			// Success -> optimistically update positions
			const signed = side === 'buy' ? q : -q;
			positions.update((p) => ({ ...p, [sym]: (p[sym] ?? 0) + signed }));

			// Optional: read server-simulated latency if you want to show both
			// const { latency } = (await res.json()) as { latency: number };
			statusMsg = `Filled ${signed > 0 ? 'BUY' : 'SELL'} ${Math.abs(q)} ${sym} in ${rtMs} ms`;
		} catch (error) {
			statusMsg = 'Network error placing order.';
		} finally {
			pending = false;
		}
	}
</script>

<section aria-labelledby="order-h" class="rounded-2xl bg-card p-3 md:col-span-1">
	<h2 id="order-h" class="mb-2 text-sm text-accent">Order Ticket</h2>
	<form on:submit|preventDefault={submitOrder} aria-describedby="order-help" aria-busy={pending}>
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
