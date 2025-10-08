import type { Symbol } from '$lib/stores';
import { COINCAP_MAP, coincapAssetsCsv } from '$lib/symbols';

export type OnPrice = (uiSymbol: Symbol, price: number, ts: number) => void;

export interface CoincapConnection {
	disconnect: () => void;
}

/**
 * Skeleton for CoinCap WebSocket streaming prices.
 * WS URL shape: wss://ws.coincap.io/prices?assets=bitcoin,ethereum,litecoin
 * NOTE: No implementation yet — fill during build.
 */
export function connectPrices(onPrice: OnPrice): CoincapConnection {
	// TODO: open WebSocket, parse messages { asset: price }, map back to ES/NQ/CL
	// - guard for browser-only usage (avoid SSR)
	// - return a disconnect() that closes the socket

	// --- placeholders to silence TS unused warning
	void onPrice;
	void coincapAssetsCsv;
	void COINCAP_MAP;

	return {
		disconnect: () => {
			// TODO: close the WebSocket connection if opened
		}
	};
}
