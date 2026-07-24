/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          bg: '#FAF7F2',
          card: '#F6F3EE',
          glass: 'rgba(255, 255, 255, 0.55)',
        },
        luxury: {
          brown: '#5B4636',
          dark: '#34271D',
          gold: '#C6A164',
          softGold: '#D8B982',
          text: '#2F2F2F',
          border: 'rgba(91, 70, 54, 0.10)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'luxury': '0 20px 60px rgba(0, 0, 0, 0.08)',
        'luxury-sm': '0 8px 30px rgba(91, 70, 54, 0.08)',
        'luxury-gold': '0 10px 30px rgba(198, 161, 100, 0.25)',
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      }
    },
  },
  plugins: [],
}
