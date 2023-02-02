/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,json}', '../amis-lib/src/**/*.{js,jsx,ts,tsx,json}'],
  theme: {
    fontSize: {
      xs: '12px',
      sm: '12px',
      base: '14px',
      md: '14px',
      lg: '16px',
      xl: '18px',
    },
    extend: {
    },
  },
  plugins: [],
}
