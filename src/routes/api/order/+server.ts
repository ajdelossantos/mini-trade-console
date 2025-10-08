// src/routes/api/order/+server.ts
import { json, type RequestHandler } from '@sveltejs/kit';

/**
 * Mock order endpoint
 * Request:  { sym: 'ES'|'NQ'|'CL', side: 'buy'|'sell', qty: number >= 1 }
 * Response: { ok: true, latency: number }  // latency = simulated server "fill time" in ms
 *
 * Notes:
 * - Client should still measure round-trip latency with performance.now().
 * - Add `?fail=1` to the URL to force an error for demo/testing.
 */

type Symbol = 'ES' | 'NQ' | 'CL';
type Side = 'buy' | 'sell';

interface OrderRequest {
	sym: Symbol;
	side: Side;
	qty: number;
}

interface OrderResponse {
	ok: boolean;
	latency: number;
	message?: string;
}

const SYMBOLS = new Set<Symbol>(['ES', 'NQ', 'CL']);
const SIDES = new Set<Side>(['buy', 'sell']);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function bad(status: number, message: string) {
	const payload: OrderResponse = { ok: false, latency: 0, message };
	return json(payload, { status });
}

export const POST: RequestHandler = async ({ request, url }) => {
	// Parse JSON safely
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return bad(400, 'Invalid JSON payload');
	}

	// Basic validation
	const { sym, side, qty } = body as Partial<OrderRequest>;

	if (!sym || !SYMBOLS.has(sym)) {
		return bad(400, `Invalid "sym". Expected one of ${Array.from(SYMBOLS).join(', ')}`);
	}
	if (!side || !SIDES.has(side)) {
		return bad(400, 'Invalid "side". Expected "buy" or "sell"');
	}
	if (typeof qty !== 'number' || !Number.isInteger(qty) || qty < 1) {
		return bad(400, 'Invalid "qty". Must be an integer ≥ 1');
	}

	// Optional forced failure for demos/tests: /api/order?fail=1
	if (url.searchParams.get('fail') === '1') {
		await sleep(200);
		const payload: OrderResponse = { ok: false, latency: 200, message: 'Simulated failure' };
		return json(payload, { status: 503, headers: { 'cache-control': 'no-store' } });
	}

	// Simulate an exchange fill latency (200–500ms)
	const simulated = 200 + Math.floor(Math.random() * 301);
	await sleep(simulated);

	const payload: OrderResponse = { ok: true, latency: simulated };
	return json(payload, { status: 200, headers: { 'cache-control': 'no-store' } });
};
