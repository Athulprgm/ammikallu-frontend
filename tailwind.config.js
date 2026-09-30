/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-bg':       '#F5F1E8',
        'brand-surface':  '#FFFFFF',
        'brand-dark':     '#171714',
        'brand-secondary':'#68645B',
        'brand-border':   '#DDD7CA',
        'brand-gold':     '#C99518',
        'brand-chilli':   '#A63D2F',
        'brand-leaf':     '#46513A',
        /* legacy compat */
        'warm-ivory':     '#F5F1E8',
        'deep-charcoal':  '#171714',
        'terracotta': {
          DEFAULT: '#A63D2F',
          500: '#A63D2F',
          600: '#8E3326',
        },
        'turmeric-gold':  { DEFAULT: '#C99518', 500: '#C99518' },
        'leaf-green':     { DEFAULT: '#46513A', 500: '#46513A' },
        'ammikallu': {
          bg:     '#F5F1E8',
          card:   '#FFFFFF',
          text:   '#171714',
          muted:  '#68645B',
          border: '#DDD7CA',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        serif:   ['Instrument Serif', 'Georgia', 'serif'],
        display: ['Instrument Serif', 'serif'],
      },
      fontSize: {
        'display': ['clamp(4rem,9vw,9rem)', { lineHeight: '0.88', letterSpacing: '-0.05em' }],
      },
      animation: {
        'fade-in':     'fadeIn 0.5s ease-out forwards',
        'fade-in-up':  'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'line-pulse':  'linePulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp:  { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        linePulse: { '0%,100%': { transform: 'scaleY(1)' }, '50%': { transform: 'scaleY(1.4)' } },
      },
      boxShadow: {
        'editorial':    '0 1px 0 0 #DDD7CA',
        'warm-sm':      '0 2px 12px -4px rgba(23,23,20,0.06)',
        'warm-md':      '0 8px 32px -8px rgba(23,23,20,0.10)',
        'warm-lg':      '0 20px 48px -12px rgba(23,23,20,0.14)',
        'warm-xl':      '0 32px 64px -16px rgba(23,23,20,0.18)',
      },
      aspectRatio: {
        '4/3': '4 / 3',
        '4/5': '4 / 5',
        '3/4': '3 / 4',
        '2/3': '2 / 3',
        '16/9':'16 / 9',
      },
      transitionTimingFunction: {
        'power3': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
