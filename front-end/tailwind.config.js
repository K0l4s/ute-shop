/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '100':'100'
      },
      width: {
        '128': '32rem'
      },
      height: {
        '112': '28rem',
        '128': '32rem'
      },
      maxHeight: {
        '112': '28rem',
        '128': '32rem'
      }
    },
  },
  plugins: [],
}

