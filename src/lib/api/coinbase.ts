import type { Symbol } from '$lib/stores';
import { COINBASE_PRODUCT_MAP, PRODUCT_TO_UI } from '$lib/symbols';

export type OnTicker = (uiSymbol: Symbol, price: number, isoTime: string) => void;

export interface CoinbaseConn {
	disconnect: () => void;
}

const WS_URL = 'wss://ws-feed.exchange.coinbase.com';

/**
 * Establishes a WebSocket connection to Coinbase's ticker feed and streams real-time price updates.
 *
 * @param onTicker - Callback function invoked when a ticker update is received.
 *                   Called with (uiSymbol, price, timestamp) parameters.
 * @param opts - Optional configuration object
 * @param opts.log - When true, enables console logging of WebSocket events and messages
 *
 * @returns A connection object with a `disconnect()` method to close the WebSocket
 *          and clean up event listeners. Returns a no-op disconnect function if
 *          running in a non-browser environment.
 *
 * @remarks
 * - Only works in browser environments (checks for `window` object)
 * - Subscribes to ticker updates for all products defined in `COINBASE_PRODUCT_MAP`
 * - Automatically maps Coinbase product IDs to UI symbols using `PRODUCT_TO_UI`
 * - Handles WebSocket lifecycle events (open, message, error, close)
 * - Filters out invalid price data (non-finite numbers)
 *
 * @example
 * ```typescript
 * const connection = connectTickers(
 *   (symbol, price, time) => console.log(`${symbol}: $${price} at ${time}`),
 *   { log: true }
 * );
 *
 * // Later, disconnect when done
 * connection.disconnect();
 * ```
 */
export function connectTickers(onTicker: OnTicker, opts?: { log?: boolean }): CoinbaseConn {
	// - Guard: run only in browser (use from onMount)
	if (typeof window === 'undefined') {
		return { disconnect() {} };
	}

	const productIds = Object.values(COINBASE_PRODUCT_MAP);

	let ws: WebSocket | null = null;

	const log = (...args: unknown[]) => {
		if (opts?.log) console.log('[coinbase]', ...args);
	};

	// - On message: parse JSON; if type==="ticker", map product_id → UI symbol via PRODUCT_TO_UI;

	const handleMessage = (e: MessageEvent) => {
		try {
			const msg = JSON.parse(e.data as string);

			if (msg.type === 'subscriptions') {
				log('subscriptions:', msg);
			}

			if (msg.type === 'ticker' && msg.product_id && msg.price) {
				const ui = PRODUCT_TO_UI[msg.product_id];

				if (!ui) return;

				// call onTicker(uiSymbol, Number(price), time)
				const priceNum = Number(msg.price);
				if (Number.isFinite(priceNum)) {
					onTicker(ui, priceNum, msg.time);
				}
			}
		} catch (err) {
			log('error parsing message', err);
		}
	};

	// Send subscribe message
	const handleOpen = () => {
		const subscribe = {
			type: 'subscribe',
			product_ids: productIds,
			channels: ['ticker']
		};

		ws?.send(JSON.stringify(subscribe));

		log('open -> subscribe', subscribe);
	};

	const handleError = (e: Event) => {
		log('websocket error', e);
	};

	const handleClose = (e: CloseEvent) => {
		log('websocket closed', { code: e.code, reason: e.reason });
	};

	// - Open WS to wss://ws-feed.exchange.coinbase.com
	ws = new WebSocket(WS_URL);
	ws.addEventListener('open', handleOpen);
	ws.addEventListener('message', handleMessage);
	ws.addEventListener('error', handleError);
	ws.addEventListener('close', handleClose);

	// - Track socket instance; return disconnect() that removes handlers and closes
	return {
		disconnect() {
			if (!ws) return;

			ws.removeEventListener('open', handleOpen);
			ws.removeEventListener('message', handleMessage);
			ws.removeEventListener('error', handleError);
			ws.removeEventListener('close', handleClose);

			try {
				ws.close();
			} catch {
				// noop
			}

			ws = null;
		}
	};
}
