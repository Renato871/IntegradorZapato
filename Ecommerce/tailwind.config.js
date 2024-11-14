// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#2B2D42',
        'light-blue': '#8D99AE',
        'very-light-blue': '#EDF2F4',
        'bright-red': '#EF233C',
        'dark-red': '#D90429',
      },
    },
  },
  plugins: [],
}
