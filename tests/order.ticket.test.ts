// @vitest-environment jsdom
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { render, screen, within, cleanup } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Page from '../src/routes/+page.svelte';

// Mock the Coinbase WS adapter so tests don't open real sockets
vi.mock('$lib/api/coinbase', () => {
	return {
		connectTickers: () => ({ disconnect: () => {} })
	};
});

describe('order ticket', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		// Default: fast OK response
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				status: 200,
				json: async () => ({ latency: 250 })
			})
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
		cleanup();
	});

	function getOrderTicketSection() {
		// Grab the "Order Ticket" heading, then scope to its nearest <section>
		const heading = screen.getAllByRole('heading', { name: /order ticket/i })[0];
		const section = heading.closest('section');
		if (!section) throw new Error('Order Ticket section not found');
		return within(section);
	}

	it('disables submit while pending, then shows latency and success status', async () => {
		const user = userEvent.setup();
		render(Page);

		const withinTicket = getOrderTicketSection();

		const symSel = await withinTicket.findByLabelText('Symbol');
		const sideSel = await withinTicket.findByLabelText('Side');
		const qtyInput = await withinTicket.findByLabelText('Quantity');
		const submitBtn = await withinTicket.findByRole('button', { name: /submit/i });

		// Choose NQ + SELL + qty=2
		await user.selectOptions(symSel, 'NQ');
		await user.selectOptions(sideSel, 'sell');
		await user.clear(qtyInput);
		await user.type(qtyInput, '2');

		// Delay the first fetch so we can assert disabled during pending
		(fetch as unknown as vi.Mock).mockImplementationOnce(
			() =>
				new Promise((resolve) =>
					setTimeout(
						() =>
							resolve({
								ok: true,
								status: 200,
								json: async () => ({ latency: 300 })
							}),
						50
					)
				)
		);

		await user.click(submitBtn);

		// Immediately disabled
		expect(submitBtn).toHaveProperty('disabled', true);

		// Success message appears in the ticket section and button re-enables
		const status = await withinTicket.findByText(/Filled SELL 2 NQ in \d+ ms/i);
		expect(status).toBeTruthy();
		expect(submitBtn).toHaveProperty('disabled', false);

		// Latency badge shows a number in the same section
		expect(await withinTicket.findByText(/Latency:\s+\d+\s+ms/i)).toBeTruthy();
	});

	it('shows error and re-enables button on failure', async () => {
		const user = userEvent.setup();
		render(Page);

		const withinTicket = getOrderTicketSection();
		const submitBtn = await withinTicket.findByRole('button', { name: /submit/i });

		// Force a failing response
		(fetch as unknown as vi.Mock).mockResolvedValueOnce({
			ok: false,
			status: 503,
			json: async () => ({ message: 'Simulated failure' })
		});

		await user.click(submitBtn);

		// Error shows in ticket section; button re-enabled
		const err = await withinTicket.findByText(/Order failed: Simulated failure/i);
		expect(err).toBeTruthy();
		expect(submitBtn).toHaveProperty('disabled', false);
	});
});
