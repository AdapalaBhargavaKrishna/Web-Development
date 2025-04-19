/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "background-shine": "background-shine 4s linear infinite",
        'background-shine1': 'background-shine 2s linear infinite',
        'background-shine2': 'background-opacity 4s linear infinite',
        'text-gradient': 'text-gradient 2s linear infinite',
      },
      keyframes: {
        'background-shine': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'background-opacity': {
          '0%': { opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'text-gradient': {
          '0%': { backgroundPosition: '0% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
}
