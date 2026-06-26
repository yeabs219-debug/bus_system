/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1B1B1F',
        paper: '#F0EEE6',
        panel: '#FFFFFF',
        transit: '#1E5945',
        signal: '#D6713A',
        line: '#DDD9CC',
        sidebar: '#16231E',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};