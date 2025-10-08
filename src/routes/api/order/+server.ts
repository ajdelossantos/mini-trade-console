import { json, type RequestHandler } from '@sveltejs/kit';
import type { OrderRequest, OrderResponse } from '$lib/stores';

/**
 * Stub endpoint — returns 501 until implemented.
 * Acceptance later: validate body, simulate 200–500ms latency, return { ok:true, latency }.
 */
export const POST: RequestHandler = async ({ request }) => {
	void ((await request.json()) as OrderRequest); // placeholder
	const payload: OrderResponse = { ok: false, latency: 0, message: 'Not implemented' };
	return json(payload, { status: 501 });
};
