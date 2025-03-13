/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          800: '#6A422A', // Button background
          700: '#6A422A', // Back icon
          600: '#8B6F5A', // Secondary text
        },
      },
    },
  },
  plugins: [],
}

