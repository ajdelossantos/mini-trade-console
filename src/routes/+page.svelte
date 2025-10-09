<script lang="ts">
	import { onMount } from 'svelte';
	import { applyPriceTick } from '$lib/stores';
	import { connectTickers } from '$lib/api/coinbase';
	import Watchlist from '$lib/components/Watchlist.svelte';
	import OrderForm from '$lib/components/OrderForm.svelte';
	import PositionsTable from '$lib/components/PositionsTable.svelte';

	onMount(() => {
		const conn = connectTickers(
			(uiSymbol, price, _isoTime) => {
				applyPriceTick(uiSymbol, price);
			},
			{ log: false }
		);

		return () => conn.disconnect();
	});
</script>

<Watchlist />
<OrderForm />
<PositionsTable />
