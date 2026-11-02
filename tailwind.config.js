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
        pgot: {
          midnight: "#061426",
          navy: "#0A1B33",
          deep: "#040D1A",
          surface: "rgba(10, 27, 51, 0.7)",
          card: "rgba(10, 27, 51, 0.6)",
          gold: "#D4AF37",
          goldLight: "#F0D98A",
          goldDim: "rgba(212, 175, 55, 0.25)",
          blue: "#168BFF",
          blueGlow: "#00E5FF",
          border: "rgba(212, 175, 55, 0.2)",
          borderBlue: "rgba(22, 139, 255, 0.25)",
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'Cabinet Grotesk', 'sans-serif'],
        tech: ['Space Grotesk', 'monospace'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.28)',
        'gold-glow-lg': '0 0 45px rgba(212, 175, 55, 0.45)',
        'blue-glow': '0 0 25px rgba(22, 139, 255, 0.35)',
        'blue-glow-lg': '0 0 50px rgba(0, 229, 255, 0.4)',
        'cyber-card': '0 10px 30px -10px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(212, 175, 55, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 25s linear infinite',
        'reverse-spin': 'reverseSpin 35s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'laser-sweep': 'laserSweep 4s ease-in-out infinite',
      },
      keyframes: {
        reverseSpin: {
          'from': { transform: 'rotate(360deg)' },
          'to': { transform: 'rotate(0deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        },
        laserSweep: {
          '0%, 100%': { opacity: '0.2', transform: 'scaleX(0.8)' },
          '50%': { opacity: '0.9', transform: 'scaleX(1.1)' }
        }
      }
    },
  },
  plugins: [],
}
