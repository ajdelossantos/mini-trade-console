import type { Symbol } from './stores.ts';

/**
 * Map our UI symbols to CoinCap asset ids.
 * We keep ES/NQ/CL labels but fetch btc/eth/ltc prices for demo purposes.
 */
export const COINCAP_MAP: Record<Symbol, string> = {
	ES: 'bitcoin',
	NQ: 'ethereum',
	CL: 'litecoin'
};

/** Convenience list for the WS query string */
export const coincapAssetsCsv = Object.values(COINCAP_MAP).join(',');
