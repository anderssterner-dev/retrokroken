/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0E27',
        magenta: '#FF008C',
        cyan: '#00F5D4',
        card: '#12172E',
        border: '#1E2545',
        paper: '#FFFFFF',
        ink: '#111827',
        mist: '#F4F7FB',
        'border-light': '#D8E0EC',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        pixel: ['"Press Start 2P"', 'monospace'],
        vcr: ['"VCR OSD Mono"', '"Press Start 2P"', 'monospace'],
        ethnocentric: ['"Audiowide"', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 24px rgba(255,0,140,0.35)',
        'neon-cyan': '0 0 24px rgba(0,245,212,0.35)',
        card: '0 4px 32px rgba(0,0,0,0.6)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%, 100%': { textShadow: '0 0 8px #FF006E, 0 0 20px #FF006E' },
          '50%': { textShadow: '0 0 16px #FF006E, 0 0 40px #FF006E, 0 0 60px #FF006E' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        glow: 'glow 3s ease-in-out infinite',
        scanline: 'scanline 6s linear infinite',
      },
    },
  },
  plugins: [],
}
