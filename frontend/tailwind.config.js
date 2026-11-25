/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Azul institucional (escala completa para no romper tus clases cscs-xxx)
        cscs: {
          50: '#EAF0FF',
          100: '#D6E0FF',
          200: '#B3C4FF',
          300: '#8CA2FA',
          400: '#5F79F0',
          500: '#3A4FDC',
          600: '#2335C9',
          700: '#1B2AA3',
          800: '#0F1650',
          900: '#090E38',
        },
        // Acentos
        sun: '#FFC83D',
        pink: '#FF5FA2',
        violet: '#7B4DFF',
        mint: '#79E0C2',
        coral: '#FF6F59',
        sky: '#3DC8FF',
        tangerine: '#FF9F43',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};