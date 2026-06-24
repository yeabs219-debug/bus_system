/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1B1B1F',
        paper: '#F7F4EC',
        transit: '#1E5945',
        signal: '#D6713A',
        line: '#D8D2C2',
        card: '#FFFFFF',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
