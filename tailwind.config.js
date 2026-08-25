/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f3ea',
          100: '#ece0d1',
          200: '#dbc4a3',
          300: '#c6a175',
          400: '#a97d52',
          500: '#8b5e3c',
          600: '#6b4529',
          700: '#54371f',
          800: '#3d2b1f',
          900: '#2e2117',
          950: '#1a120c',
        },
        nude: {
          50: '#faf6ef',
          100: '#f3ece0',
          200: '#e8dcc7',
          300: '#dac4a3',
          400: '#c7a87c',
          500: '#b3905e',
          600: '#95744a',
          700: '#785d3c',
          800: '#5f4a32',
          900: '#4d3c2a',
        },
        accent: {
          50: '#f9f2ea',
          100: '#f0e0cb',
          200: '#e0c194',
          300: '#cc9f66',
          400: '#b98449',
          500: '#9c6b37',
          600: '#7d552d',
          700: '#634426',
          800: '#4f3721',
          900: '#412e1d',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out both',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
