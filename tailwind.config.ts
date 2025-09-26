import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#0f0f23',
        'card-bg': 'rgba(255, 255, 255, 0.08)',
        'card-border': 'rgba(255, 255, 255, 0.1)',
        'text-primary': '#ffffff',
        'text-secondary': '#9ca3af',
        'text-tertiary': '#6b7280',
        purple: '#667eea',
        green: '#10b981',
        orange: '#f59e0b',
        red: '#ef4444',
        teal: '#0d9488',
      },
      fontFamily: {
        sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '20px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '48px',
      },
      fontWeight: {
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'purple-glow': '0 8px 20px rgba(102, 126, 234, 0.4)',
        'green-glow': '0 4px 12px rgba(16, 185, 129, 0.3)',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(10px)',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), 
    require("@tailwindcss/typography"),
    function ({ addUtilities }) {
      const newUtilities = {
        '.backdrop-blur': {
          'backdrop-filter': 'blur(10px)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
} satisfies Config;