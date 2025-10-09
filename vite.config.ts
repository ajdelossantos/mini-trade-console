// vite.config.ts
import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
	// Ensure Svelte resolves client-side entry (so onMount/mount exist)
	resolve: {
		conditions: ['browser']
	},
	test: {
		environment: 'jsdom',
		css: true,
		// Optional: if you have any global test setup
		// setupFiles: ['./vitest-setup-client.ts'],
		include: ['tests/**/*.{test,spec}.{js,ts}']
	}
});
