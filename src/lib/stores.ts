import { writable, derived, get, type Readable, type Writable } from 'svelte/store';

export type Symbol = 'ES' | 'NQ' | 'CL';
export type Prices = Record<Symbol, number | undefined>;
export type Positions = Record<Symbol, number>;
export type PnL = Record<Symbol, number>;

// Stores
export const prices: Writable<Prices> = writable({ ES: undefined, NQ: undefined, CL: undefined });
export const lastPrices: Writable<Prices> = writable({
	ES: undefined,
	NQ: undefined,
	CL: undefined
});
export const positions: Writable<Positions> = writable({ ES: 0, NQ: 0, CL: 0 });
export const lastLatency: Writable<number | null> = writable(null);

/** Naive P&L baseline for interview math */
const BASELINE = 100;

/** Derived P&L = qty * (lastPrice - 100). Tolerates undefined price. */
export const pnl: Readable<PnL> = derived([prices, positions], ([$prices, $positions]) => {
	const calc = (sym: Symbol) => {
		const p = $prices[sym];
		const pos = $positions[sym] ?? 0;
		const last = typeof p === 'number' ? p : BASELINE;

		const val = pos * (last - BASELINE);
		return val === 0 ? 0 : val; // force zero (not -0, NaN, etc)
	};

	return { ES: calc('ES'), NQ: calc('NQ'), CL: calc('CL') };
});

/**
 * Apply a single price tick immutably.
 * - Copies the previous price for *that* symbol into lastPrices[sym]
 * - Writes the new price into prices[sym]
 * - Only touches the changed key (no object nukes), so components don't rerender unnecessarily
 */
export function applyPriceTick(sym: Symbol, newPrice: number): void {
	const prev = get(prices)[sym];

	lastPrices.update((lp) => ({ ...lp, [sym]: prev }));
	prices.update((p) => ({ ...p, [sym]: newPrice }));
}
