// tailwind.config.ts - COMPLETE LUXURY VERSION (FIXED FOR bg-luxury-slate-50)
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-doran)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },

      colors: {
        // ===== Brand Colors (Original) =====
        brand: {
          bg: '#F9F9F9',
          dark: '#1A1A1A',
          gold: '#C6A87C',
          light: '#F5F5F0',
          gray: '#666666',
        },

        // ===== FLAT Luxury Palettes (match classes like bg-luxury-slate-50) =====
        'luxury-gold': {
          DEFAULT: '#D4AF37',
          50: '#FAF6E9',
          100: '#F5EDD3',
          200: '#EBDAA7',
          300: '#E0C77B',
          400: '#D6B44F',
          500: '#D4AF37',
          600: '#B8941F',
          700: '#8A6F17',
          800: '#5C4A10',
          900: '#2E2508',
          950: '#1A1504',
        },

        'luxury-slate': {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },

        'luxury-emerald': {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },

        'luxury-rose': {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48',
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
          950: '#4C0519',
        },

        'luxury-amber': {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },

        'luxury-sky': {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
          950: '#082F49',
        },

        'luxury-purple': {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7E22CE',
          800: '#6B21A8',
          900: '#581C87',
          950: '#3B0764',
        },

        'luxury-teal': {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
        },

        'luxury-indigo': {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },

        'luxury-pink': {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#EC4899',
          600: '#DB2777',
          700: '#BE185D',
          800: '#9D174D',
          900: '#831843',
          950: '#500724',
        },

        'luxury-cyan': {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
          950: '#083344',
        },

        'luxury-orange': {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          950: '#431407',
        },

        'luxury-lime': {
          50: '#F7FEE7',
          100: '#ECFCCB',
          200: '#D9F99D',
          300: '#BEF264',
          400: '#A3E635',
          500: '#84CC16',
          600: '#65A30D',
          700: '#4D7C0F',
          800: '#3F6212',
          900: '#365314',
          950: '#1A2E05',
        },

        'luxury-fuchsia': {
          50: '#FDF4FF',
          100: '#FAE8FF',
          200: '#F5D0FE',
          300: '#F0ABFC',
          400: '#E879F9',
          500: '#D946EF',
          600: '#C026D3',
          700: '#A21CAF',
          800: '#86198F',
          900: '#701A75',
          950: '#4A044E',
        },

        'luxury-violet': {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
        },
      },

      // ===== Custom Animations =====
      animation: {
        'spin-slow': 'spin 15s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        shimmer: 'shimmer 2s linear infinite',
        glow: 'glow 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.4s.ease-out',
        'slide-in-left': 'slideInLeft 0.4s.ease-out',
        'slide-in-down': 'slideInDown 0.4s.ease-out',
        'slide-in-up': 'slideInUp 0.4s.ease-out',
        wiggle: 'wiggle 1s.ease-in-out infinite',
        float: 'float 3s.ease-in-out infinite',
        'gradient-x': 'gradient-x 3s.ease infinite',
        'gradient-y': 'gradient-y 3s.ease infinite',
        'gradient-xy': 'gradient-xy 3s.ease infinite',
        'scale-in': 'scaleIn 0.3s.ease-out',
        'rotate-in': 'rotateIn 0.5s.ease-out',
        flip: 'flip 0.6s.ease-in-out',
        shake: 'shake 0.5s.ease-in-out',
        heartbeat: 'heartbeat 1.5s.ease-in-out infinite',
      },

      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'gradient-y': {
          '0%, 100%': { backgroundPosition: '50% 0%' },
          '50%': { backgroundPosition: '50% 100%' },
        },
        'gradient-xy': {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '25%': { backgroundPosition: '100% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '75%': { backgroundPosition: '0% 100%' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        rotateIn: {
          '0%': { transform: 'rotate(-180deg) scale(0)', opacity: '0' },
          '100%': { transform: 'rotate(0) scale(1)', opacity: '1' },
        },
        flip: {
          '0%': { transform: 'rotateY(0)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.1)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.1)' },
          '56%': { transform: 'scale(1)' },
        },
      },

      backdropBlur: {
        xs: '2px',
      },

      boxShadow: {
        luxury: '0 10px 40px rgba(212, 175, 55, 0.1)',
        'luxury-lg': '0 20px 60px rgba(212, 175, 55, 0.15)',
        'luxury-xl': '0 30px 80px rgba(212, 175, 55, 0.2)',
        glow: '0 0 20px rgba(212, 175, 55, 0.4)',
        'glow-lg': '0 0 40px rgba(212, 175, 55, 0.6)',
        'glow-xl': '0 0 60px rgba(212, 175, 55, 0.8)',
        'inner-luxury': 'inset 0 2px 4px 0 rgba(212, 175, 55, 0.06)',
        'gold-soft': '0 4px 20px rgba(212, 175, 55, 0.08)',
        'emerald-glow': '0 0 20px rgba(16, 185, 129, 0.4)',
        'rose-glow': '0 0 20px rgba(244, 63, 94, 0.4)',
        'purple-glow': '0 0 20px rgba(168, 85, 247, 0.4)',
      },

      borderRadius: {
        luxury: '1.5rem',
        'luxury-sm': '0.75rem',
        'luxury-lg': '2rem',
        'luxury-xl': '3rem',
      },

      spacing: {
        18: '4.5rem',
        88: '22rem',
        100: '25rem',
        104: '26rem',
        112: '28rem',
        128: '32rem',
      },

      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '3xl': ['2rem', { lineHeight: '2.5rem' }],
        '4xl': ['2.5rem', { lineHeight: '3rem' }],
        '5xl': ['3rem', { lineHeight: '3.5rem' }],
        '6xl': ['3.75rem', { lineHeight: '4.25rem' }],
        '7xl': ['4.5rem', { lineHeight: '5rem' }],
        '8xl': ['6rem', { lineHeight: '6.5rem' }],
        '9xl': ['8rem', { lineHeight: '8.5rem' }],
      },

      letterSpacing: {
        tightest: '-0.075em',
        luxury: '-0.02em',
      },

      lineHeight: {
        'extra-loose': '2.5',
        luxury: '1.75',
      },

      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },

      minHeight: {
        'screen-75': '75vh',
        'screen-80': '80vh',
        'screen-90': '90vh',
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'luxury-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F5E6C8 100%)',
        'luxury-gradient-reverse': 'linear-gradient(135deg, #F5E6C8 0%, #D4AF37 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
        noise:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },

      backgroundSize: {
        auto: 'auto',
        cover: 'cover',
        contain: 'contain',
        '200%': '200%',
        '300%': '300%',
      },

      blur: {
        '3xl': '64px',
        '4xl': '80px',
      },

      brightness: {
        25: '.25',
        175: '1.75',
        200: '2',
      },

      contrast: {
        25: '.25',
        175: '1.75',
        200: '2',
      },

      saturate: {
        25: '.25',
        175: '1.75',
        200: '2',
      },

      scale: {
        102: '1.02',
        103: '1.03',
        175: '1.75',
        200: '2',
      },

      rotate: {
        135: '135deg',
        270: '270deg',
      },

      skew: {
        15: '15deg',
        30: '30deg',
      },

      transitionDuration: {
        0: '0ms',
        2000: '2000ms',
        3000: '3000ms',
      },

      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        smooth: 'cubic-bezier(0.33, 1, 0.68, 1)',
      },

      gridTemplateColumns: {
        13: 'repeat(13, minmax(0, 1fr))',
        14: 'repeat(14, minmax(0, 1fr))',
        15: 'repeat(15, minmax(0, 1fr))',
        16: 'repeat(16, minmax(0, 1fr))',
      },

      gridTemplateRows: {
        7: 'repeat(7, minmax(0, 1fr))',
        8: 'repeat(8, minmax(0, 1fr))',
        9: 'repeat(9, minmax(0, 1fr))',
        10: 'repeat(10, minmax(0, 1fr))',
      },

      aspectRatio: {
        golden: '1.618',
        '4/3': '4 / 3',
        '21/9': '21 / 9',
      },

      content: {
        empty: '""',
        space: '" "',
        bullet: '"•"',
        check: '"✓"',
        star: '"★"',
      },

      opacity: {
        15: '0.15',
        35: '0.35',
        65: '0.65',
        85: '0.85',
      },

      ringWidth: {
        6: '6px',
        8: '8px',
        10: '10px',
      },

      ringOffsetWidth: {
        6: '6px',
        8: '8px',
      },

      ringColor: {
        'luxury-gold': 'rgba(212, 175, 55, 0.5)',
      },

      cursor: {
        'zoom-in': 'zoom-in',
        'zoom-out': 'zoom-out',
      },

      willChange: {
        'transform-opacity': 'transform, opacity',
      },
    },
  },
  plugins: [
    function ({ addUtilities, addComponents }: any) {
      addUtilities({
        '.text-shadow': {
          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        '.text-shadow-lg': {
          textShadow: '0 4px 8px rgba(0,0,0,0.15)',
        },
        '.text-shadow-gold': {
          textShadow: '0 2px 8px rgba(212, 175, 55, 0.3)',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
        },
      })

      addComponents({
        '.bg-luxury-gradient-animate': {
          backgroundSize: '200% 200%',
          animation: 'gradient-x 3s ease infinite',
        },
        '.text-luxury-gradient': {
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundImage: 'linear-gradient(135deg, #D4AF37 0%, #F5E6C8 50%, #D4AF37 100%)',
          backgroundSize: '200% auto',
        },
      })
    },
  ],
}

export default config
