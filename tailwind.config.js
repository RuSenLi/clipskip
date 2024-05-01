import { blackA, green, grass, mauve } from '@radix-ui/colors'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx,html}',
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        ...blackA,
        ...green,
        ...grass,
        ...mauve,
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: { themes: ['light', 'dark'] },
}
