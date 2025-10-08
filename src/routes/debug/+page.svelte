<script lang="ts">
	import { onMount } from 'svelte';
	import { connectTickers } from '$lib/api/coinbase';

	let wsConnected = false;
	let tickCount = 0;
	let lastTick: { sym?: string; price?: number; time?: string } = {};

	let teardown: (() => void) | null = null;

	onMount(() => {
		const conn = connectTickers(
			(sym, price, isoTime) => {
				tickCount += 1;
				lastTick = { sym, price, time: isoTime || new Date().toISOString() };
			},
			{ log: true }
		); // log:true prints open/subscribe/ticker/close

		wsConnected = true;
		teardown = () => conn.disconnect();

		return () => {
			conn.disconnect();
			wsConnected = false;
		};
	});

	function disconnectNow() {
		if (teardown) {
			teardown();
			wsConnected = false;
		}
	}
</script>

<!-- TEMP DEBUG — remove after Phase 2 -->
<section class="rounded-2xl bg-card p-3 md:col-span-2">
	<h2 class="mb-2 text-sm text-accent">WS Debug</h2>
	<div class="grid grid-cols-2 gap-2 text-sm">
		<div>Connected: <strong>{wsConnected ? 'yes' : 'no'}</strong></div>
		<div>Ticks: <strong>{tickCount}</strong></div>
		<div>Last: <strong>{lastTick.sym ?? '—'}</strong></div>
		<div>
			Price/Time: <strong>{lastTick.price ?? '—'}</strong>
			<span class="opacity-70">{lastTick.time ?? ''}</span>
		</div>
	</div>
	<button
		on:click={disconnectNow}
		class="mt-2 rounded-lg border border-slate-700 bg-[#0f1520] px-3 py-2 text-ink"
	>
		Disconnect
	</button>
</section>
