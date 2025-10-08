// Optional fallback SSE stub. We use CoinCap WS client-side for live prices.
// Keeping this stub in case I want to narrate "self-contained stream" vs external feed.

import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	return new Response(JSON.stringify({ ok: false, message: 'SSE fallback not implemented' }), {
		status: 501,
		headers: { 'Content-Type': 'application/json' }
	});
};
