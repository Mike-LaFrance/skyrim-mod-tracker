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
        nordic: {
          950: '#07090e',
          900: '#0a0d14',
          850: '#0e121a',
          800: '#111622',
          750: '#151c2b',
          700: '#1a2235',
          600: '#26334d',
          500: '#38496b',
          400: '#566e9c',
          300: '#8ba2cc',
          200: '#cbd7ec',
          100: '#edf2fa',
        },
        gold: {
          300: '#fde68a',
          400: '#fcd34d',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        parchment: {
          50: '#faf8f5',
          100: '#f5f0e6',
          200: '#e8ddc9',
          300: '#d8c5a4',
          400: '#b89d74',
        }
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'nordic-glow': '0 0 25px -5px rgba(245, 158, 11, 0.15)',
        'nordic-card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'gold-glow': '0 0 15px rgba(245, 158, 11, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
