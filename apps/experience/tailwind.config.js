const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  important: "#__next",
  content: ['./src/**/*.{js,jsx,tsx,json}'],
  theme: {
    fontSize: {
      xs: '12px',
      sm: '12px',
      base: '14px',
      md: '14px',
      lg: '16px',
      xl: '18px',
    }
  },
  // plugins: [require('@tailwindcss/forms')],
}
