/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-blue': {
          500: '#0ea5e9',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 