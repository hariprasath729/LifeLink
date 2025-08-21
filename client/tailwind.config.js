/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'primary': '#F72585', // A vibrant pink/red
          'primary-dark': '#B5179E',
          'background': '#1D1D27',   // The dark background
          'surface': '#2A2A3A',     // The color for cards and inputs
          'text-primary': '#E5E7EB', // Softer off-white for main text
          'text-secondary': '#9CA3AF',// Lighter gray for secondary text
          'border': '#4E4E6E',
        }
      },
    },
    plugins: [],
  }