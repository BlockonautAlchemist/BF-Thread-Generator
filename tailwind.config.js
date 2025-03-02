/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-purple': '#ad19d1',
        'custom-dark': '#280836',
        'custom-darker': '#1a0521',
        'custom-cyan': '#5cfbf7',
        'custom-gold': '#fed66d',
      },
      boxShadow: {
        'glow-purple': '0 0 15px rgba(173, 25, 209, 0.4)',
        'glow-cyan': '0 0 15px rgba(92, 251, 247, 0.4)',
        'glow-gold': '0 0 15px rgba(254, 214, 109, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'pulse-subtle': 'pulseShadow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseShadow: {
          '0%': { boxShadow: '0 0 0 rgba(173, 25, 209, 0)' },
          '50%': { boxShadow: '0 0 10px rgba(173, 25, 209, 0.3)' },
          '100%': { boxShadow: '0 0 0 rgba(173, 25, 209, 0)' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #280836 0%, #3a0d4f 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #1a0521 0%, #280836 50%, #3a0d4f 100%)',
        'gradient-accent': 'linear-gradient(135deg, #ad19d1 0%, #5cfbf7 100%)',
        'gradient-gold-cyan': 'linear-gradient(135deg, #fed66d 0%, #5cfbf7 100%)',
      },
      transitionProperty: {
        'transform-shadow': 'transform, box-shadow',
      },
      transitionDuration: {
        '250': '250ms',
      },
    },
  },
  plugins: [],
};