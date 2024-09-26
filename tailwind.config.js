/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-thumb': {
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#a0aec0', // gray-400
            borderRadius: '9999px', // fully rounded
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#edf2f7', // gray-200
          },
        },
      });
    },
  ],
}

