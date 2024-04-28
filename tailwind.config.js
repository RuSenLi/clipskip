/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx,html}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: { themes: ['light', 'dark'] },
}
