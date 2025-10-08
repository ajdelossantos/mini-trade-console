import type { Symbol } from '$lib/stores';
import { COINBASE_PRODUCT_MAP, PRODUCT_TO_UI } from '$lib/symbols';

export type OnTicker = (uiSymbol: Symbol, price: number, isoTime: string) => void;

export interface CoinbaseConn {
	disconnect: () => void;
}

/**
 * Coinbase Exchange Market Data feed (public).
 * Production endpoint: wss://ws-feed.exchange.coinbase.com
 * Subscribe to the "ticker" channel with product_ids (e.g., BTC-USD, ETH-USD).
 *
 * Docs:
 * - Overview & endpoints: wss URLs + subscribe rules
 * - Ticker channel: message shape includes product_id, price, best_bid/ask, time
 */
export function connectTickers(onTicker: OnTicker): CoinbaseConn {
	// TODO: implement at build time
	// - Guard: run only in browser (use from onMount)
	// - Open WS to wss://ws-feed.exchange.coinbase.com
	// - Send subscribe message:
	//   {
	//     type: "subscribe",
	//     product_ids: Object.values(COINBASE_PRODUCT_MAP),
	//     channels: ["ticker"]
	//   }
	// - On message: parse JSON; if type==="ticker", map product_id → UI symbol via PRODUCT_TO_UI;
	//   call onTicker(uiSymbol, Number(price), time)
	// - Track socket instance; return disconnect() that removes handlers and closes
	void onTicker;
	void COINBASE_PRODUCT_MAP;
	void PRODUCT_TO_UI;

	return {
		disconnect() {
			// TODO: close websocket if opened
		}
	};
}
