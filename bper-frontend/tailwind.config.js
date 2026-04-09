/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        corporateBlue: {
          dark: '#001A36',
          DEFAULT: '#185FA5',
          light: '#2A7CC7'
        },
        background: '#F8FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
