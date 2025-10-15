/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        'nosana-purple': '#a855f7',
        'nosana-cyan': '#06b6d4',
      },
      backgroundColor: {
        'dark': '#0a0b0d',
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { 
            filter: 'brightness(1) drop-shadow(0 0 2px currentColor)' 
          },
          '50%': { 
            filter: 'brightness(1.2) drop-shadow(0 0 8px currentColor)' 
          },
        }
      }
    },
  },
  plugins: [],
}
