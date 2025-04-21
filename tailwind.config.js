/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4a6fdc',
        'primary-light': '#e8eeff',
        secondary: '#f8f9fa',
        border: '#e6e6e6',
        text: '#333',
      },
      boxShadow: {
        'custom': '0 4px 6px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
