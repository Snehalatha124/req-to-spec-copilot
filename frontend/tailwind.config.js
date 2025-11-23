/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'cosmic': {
          'dark': '#1E0D2C',
          'darker': '#1A0B2E',
          'panel': '#120A1F',
        },
        'purple': {
          'vibrant': '#9B4DE0',
          'vibrant-alt': '#A559E8',
          'light': '#D8B4FF',
        },
        'magenta': {
          'bright': '#E945E9',
          'bright-alt': '#D946EF',
        },
        'cyan': {
          'neon': '#00D4FF',
        },
        'text': {
          'main': '#FFFFFF',
          'light': '#F8F5FF',
          'secondary': '#B8A8D8',
        }
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #9B4DE0 0%, #D946EF 100%)',
        'gradient-cosmic': 'linear-gradient(135deg, #1E0D2C 0%, #1A0B2E 50%, #120A1F 100%)',
        'gradient-vibrant': 'linear-gradient(135deg, #9B4DE0 0%, #A559E8 50%, #D946EF 100%)',
      }
    },
  },
  plugins: [],
}

