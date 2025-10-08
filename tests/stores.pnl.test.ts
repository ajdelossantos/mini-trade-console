import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { prices, positions, pnl } from '$lib/stores';

describe('pnl store', () => {
	beforeEach(() => {
		prices.set({ ES: undefined, NQ: undefined, CL: undefined });
		positions.set({ ES: 0, NQ: 0, CL: 0 });
	});

	it('computes naive P&L from prices and positions (baseline=100)', () => {
		// 1) With undefined prices, P&L should treat price as baseline (0 impact)
		const BASELINE = 100;
		positions.set({ ES: 1, NQ: -2, CL: 0 });

		let v = get(pnl);

		expect(v.ES).toEqual(0);
		expect(v.NQ).toEqual(0);
		expect(v.CL).toEqual(0);

		// 2) Set prices and positions → verify signs & math
		prices.set({ ES: 105, NQ: 95, CL: 110 });
		positions.set({ ES: 2, NQ: -1, CL: 0 });
		v = get(pnl);

		expect(v.ES).toEqual(2 * (105 - BASELINE));
		expect(v.NQ).toEqual(-1 * (95 - BASELINE));
		expect(v.CL).toEqual(0 * (110 - BASELINE));
		// 3) Update a single price only → derived updates without touching others
		prices.update((p) => ({ ...p, ES: 106 })); // +1 more on ES
		v = get(pnl);

		expect(v.ES).toEqual(2 * (106 - BASELINE));
		expect(v.NQ).toEqual(-1 * (95 - BASELINE));
		expect(v.CL).toEqual(0);
	});
});
