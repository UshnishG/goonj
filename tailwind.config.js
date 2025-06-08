/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'amber': {
          800: '#b8763f',
          900: '#a66937',
          100: '#fef3c7',
        },
      },
    },
  },
  plugins: [],
};
