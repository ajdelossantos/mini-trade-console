import type { Symbol } from './stores';

/** UI labels */
export const SYMBOLS: Symbol[] = ['ES', 'NQ', 'CL'];

/** Map UI symbols → Coinbase Exchange product_ids */
export const COINBASE_PRODUCT_MAP: Record<Symbol, string> = {
	ES: 'BTC-USD',
	NQ: 'ETH-USD',
	CL: 'LTC-USD'
};

/** Reverse map for lookup from product_id → UI symbol */
export const PRODUCT_TO_UI: Record<string, Symbol> = Object.fromEntries(
	Object.entries(COINBASE_PRODUCT_MAP).map(([ui, prod]) => [prod, ui as Symbol])
);
