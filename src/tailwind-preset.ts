import type { Config } from 'tailwindcss';

/**
 * Simplafy Tailwind 4 Preset
 *
 * Usage in apps:
 *   import { simplafyPreset } from "@simplafy/ui/tailwind-preset";
 *   export default { presets: [simplafyPreset], ... } satisfies Config;
 */
export const simplafyPreset = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-sora)', 'Sora', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        card: {
          DEFAULT: 'var(--color-card)',
          foreground: 'var(--color-card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--color-popover)',
          foreground: 'var(--color-popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          foreground: 'var(--color-secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: 'var(--color-accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)',
          foreground: 'var(--color-destructive-foreground)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          foreground: 'var(--color-success-foreground)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          foreground: 'var(--color-warning-foreground)',
        },
        teal: {
          DEFAULT: 'var(--color-teal)',
          foreground: 'var(--color-teal-foreground)',
        },
        blue: {
          DEFAULT: 'var(--color-blue)',
          foreground: 'var(--color-blue-foreground)',
        },
        purple: {
          DEFAULT: 'var(--color-purple)',
          foreground: 'var(--color-purple-foreground)',
        },
        orange: {
          DEFAULT: 'var(--color-orange)',
          foreground: 'var(--color-orange-foreground)',
        },
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
        sidebar: {
          DEFAULT: 'var(--color-sidebar)',
          foreground: 'var(--color-sidebar-foreground)',
          border: 'var(--color-sidebar-border)',
          accent: 'var(--color-sidebar-accent)',
          'accent-foreground': 'var(--color-sidebar-accent-foreground)',
          ring: 'var(--color-sidebar-ring)',
        },
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      spacing: {
        'sidebar-w': 'var(--sidebar-w)',
        'sidebar-collapsed': 'var(--sidebar-w-collapsed)',
        'topbar-h': 'var(--topbar-h)',
      },
    },
  },
} satisfies Partial<Config>;
