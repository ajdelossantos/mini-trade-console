<script lang="ts">
	import { SYMBOLS } from '$lib/symbols';
	import { positions, pnl, type Symbol } from '$lib/stores';
	import { fmtPrice } from '$lib/utils';
</script>

<section aria-labelledby="pos-h" class="rounded-2xl bg-card p-3 md:col-span-2">
	<h2 id="pos-h" class="mb-2 text-sm text-accent">Positions &amp; P&amp;L</h2>
	<table class="w-full border-collapse">
		<thead>
			<tr>
				<th class="border-b border-slate-800 p-2 text-left">Symbol</th>
				<th class="border-b border-slate-800 p-2 text-left">Position</th>
				<th class="border-b border-slate-800 p-2 text-right">P&amp;L (naive)</th>
			</tr>
		</thead>
		<tbody>
			{#each SYMBOLS as s}
				<tr>
					<td class="border-b border-slate-800 p-2 font-semibold">{s}</td>
					<td class="border-b border-slate-800 p-2">{$positions[s as Symbol]}</td>
					<td class="border-b border-slate-800 p-2 text-right">{fmtPrice($pnl[s as Symbol])}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>
