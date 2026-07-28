/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Palette échantillonnée directement sur l'artwork PARTY LIFE.
        void: '#0a0a0a',
        coal: '#141414',
        ink: '#201f2c', // noir teinté violet du fond de pochette
        violet: {
          DEFAULT: '#51208d',
          deep: '#3a1666',
          glow: '#6b2fb5',
        },
        acid: '#e2fa01', // jaune du sticker "PARTY LIFE"
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        wider2: '0.18em',
        wider3: '0.32em',
      },
      keyframes: {
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        bounceSoft: 'bounceSoft 1.8s ease-in-out infinite',
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
};
