/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-03-20 16:52:27
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-01-17 10:34:53
 * @Description: 
 */
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
      screens: {
        '3xl': '1600px',
        '4xl': '1800px',
        '5xl': '2000px',
      },
    },
  },
  plugins: [],
}
