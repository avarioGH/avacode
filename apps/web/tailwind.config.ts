import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: '#1677FF',
          foreground: '#FFFFFF',
        },
        purple: {
          DEFAULT: '#A855F7',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#08111F',
          muted: '#111827',
          light: '#E5E7EB',
        },
        accent: {
          blue: '#22D3EE',
          green: '#10B981',
        },
        card: 'var(--card)',
        border: 'var(--border)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(22, 119, 255, 0.4)',
        'glow-purple': '0 0 40px rgba(168, 85, 247, 0.4)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        mesh: 'radial-gradient(circle at 15% 50%, rgba(22, 119, 255, 0.15), transparent 40%), radial-gradient(circle at 85% 30%, rgba(168, 85, 247, 0.15), transparent 40%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
};

export default config;
