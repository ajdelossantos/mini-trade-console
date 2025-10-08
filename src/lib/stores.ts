import { writable, derived, type Readable, type Writable } from 'svelte/store';

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

// Derived (TODO implement)
export const pnl: Readable<PnL> = derived([prices, positions], ([$prices, $positions]) => {
	console.log('PNL [$prices, $positions]', [$prices, $positions]);
	// TODO: naive P&L = qty * (lastPrice - 100), tolerate undefined
	return { ES: 0, NQ: 0, CL: 0 };
});
