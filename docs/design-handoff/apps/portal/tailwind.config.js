/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', 'class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // MW1.2: Safelist para classes dinâmicas do layout mobile-web.
  // Classes construídas com cn() ou template literals precisam estar aqui
  // para não serem purgadas pelo Tailwind no build de produção.
  safelist: [
    // Layout margins — sidebar adaptativa (MW1.3, Wireframe v1: 56px/220px)
    'ml-0',
    'ml-14',
    'ml-[220px]',
    'sm:ml-14',
    'lg:ml-14',
    'lg:ml-[220px]',
    // Sidebar drawer — translate para abrir/fechar (MW1.4)
    'translate-x-0',
    '-translate-x-full',
    // Bottom navigation — safe area (MW1.5)
    'pb-16',
    'pb-safe',
    // Touch targets mínimos 44px (MW5.5)
    'min-h-[44px]',
    'min-w-[44px]',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        'page-bg': 'hsl(var(--page-bg))',
        purple: {
          DEFAULT: 'hsl(var(--purple))',
          bg: 'hsl(var(--purple-bg))',
        },
        orange: {
          DEFAULT: 'hsl(var(--orange))',
          bg: 'hsl(var(--orange-bg))',
        },
        'primary-text': 'hsl(var(--primary-text))',
        'primary-bg': 'hsl(var(--primary-bg))',
        'teal-bg': 'hsl(var(--teal-bg))',
        'blue-bg': 'hsl(var(--blue-bg))',
        'amber-bg': 'hsl(var(--amber-bg))',
        'red-bg': 'hsl(var(--red-bg))',
        'border-light': 'hsl(var(--border-light))',
        shiki: {
          light: 'var(--shiki-light)',
          'light-bg': 'var(--shiki-light-bg)',
          dark: 'var(--shiki-dark)',
          'dark-bg': 'var(--shiki-dark-bg)',
        },
      },
      borderRadius: {
        '2xl': 'var(--radius-modal)' /* 16px — modais */,
        xl: 'var(--radius-card)' /* 12px — cards */,
        lg: 'var(--radius)' /* 8px — default */,
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular'],
      },
      keyframes: {
        'typing-dot-bounce': {
          '0%,40%': {
            transform: 'translateY(0)',
          },
          '20%': {
            transform: 'translateY(-0.25rem)',
          },
        },
      },
      animation: {
        'typing-dot-bounce': 'typing-dot-bounce 1.25s ease-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
