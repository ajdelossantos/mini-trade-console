/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				bg: '#0b0f14',
				card: '#121821',
				ink: '#e6eef7',
				muted: '#9fb0c2',
				accent: '#5fb3ff'
			},
			borderRadius: {
				xl2: '1rem'
			}
		}
	},
	plugins: []
};
