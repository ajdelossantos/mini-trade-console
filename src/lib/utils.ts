// Formatters
const nf2 = new Intl.NumberFormat(undefined, {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});

/**
 * Formats a number as a price string with 2 decimal places.
 *
 * @param n - The number to format as a price, or undefined
 * @returns A formatted price string using nf2 formatter, or an em dash (—) if the input is not a finite number
 */
export function fmtPrice(n: number | undefined) {
	return typeof n === 'number' && Number.isFinite(n) ? nf2.format(n) : '—';
}

/**
 * Calculates the delta (difference) between current and last values.
 *
 * @param cur - The current numeric value
 * @param last - The previous numeric value to compare against
 * @returns An object containing:
 *   - `dir`: Direction indicator (1 for positive, -1 for negative, 0 for no change)
 *   - `text`: Formatted string representation of the delta or fallback symbols
 *
 * @remarks
 * - Returns `{ dir: 0, text: '—' }` if current value is not a finite number
 * - Uses the current value as baseline if last value is not a number
 * - Normalizes negative zero to positive zero for UI consistency
 * - Returns '0.00' for zero delta, otherwise uses `nf2.format()` for formatting
 */
export function delta(cur: number | undefined, last: number | undefined) {
	if (typeof cur !== 'number' || !Number.isFinite(cur)) return { dir: 0, text: '—' };

	const d = cur - (typeof last === 'number' ? last : cur);
	const norm = d === 0 ? 0 : d; // kill negative zero for UI sanity
	const dir = norm > 0 ? 1 : norm < 0 ? -1 : 0;

	return { dir, text: dir === 0 ? '0.00' : nf2.format(norm) };
}

/**
 * Generates UI styling and display elements based on a directional value.
 *
 * @param dir - The direction indicator: 1 for positive/up, -1 for negative/down, 0 for neutral/no change
 * @returns An object containing:
 *   - `cls`: CSS class string for styling (green for up, red for down, opacity for neutral)
 *   - `arrow`: Unicode arrow character (▲ for up, ▼ for down, — for neutral)
 *   - `sr`: Screen reader friendly text description ("up", "down", or "no change")
 */
export function deltaUI(dir: -1 | 0 | 1) {
	return {
		cls: dir === 1 ? 'text-green-400' : dir === -1 ? 'text-red-400' : 'opacity-70',
		arrow: dir === 1 ? '▲' : dir === -1 ? '▼' : '—',
		sr: dir === 1 ? 'up' : dir === -1 ? 'down' : 'no change'
	};
}
