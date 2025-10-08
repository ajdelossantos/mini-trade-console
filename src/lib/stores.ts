import { writable, derived, type Readable, type Writable } from 'svelte/store';

export type Symbol = 'ES' | 'NQ' | 'CL';

export type Prices = Record<Symbol, number | undefined>;
export type Positions = Record<Symbol, number>;
export type PnL = Record<Symbol, number>;

export interface Tick {
	sym: Symbol;
	price: number;
	ts: number;
}

export interface OrderRequest {
	sym: Symbol;
	side: 'buy' | 'sell';
	qty: number; // >=1
}

export interface OrderResponse {
	ok: boolean;
	latency: number; // ms
	message?: string;
}

export const SYMBOLS: Symbol[] = ['ES', 'NQ', 'CL'];

export const prices: Writable<Prices> = writable({
	ES: undefined,
	NQ: undefined,
	CL: undefined
});

export const lastPrices: Writable<Prices> = writable({
	ES: undefined,
	NQ: undefined,
	CL: undefined
});

export const positions: Writable<Positions> = writable({
	ES: 0,
	NQ: 0,
	CL: 0
});

export const lastLatency: Writable<number | null> = writable(null);

export const pnl: Readable<PnL> = derived([prices, positions], ([$prices, $positions]) => {
	console.log('PNL [$prices, $positions]', [$prices, $positions]);

	// TODO: implement naive P&L = qty * (lastPrice - 100)
	return { ES: 0, NQ: 0, CL: 0 };
});
