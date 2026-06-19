import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#064E45',
          800: '#0A6B5E',
          700: '#0D7C6E',
          600: '#0F8F7E',
          500: '#12A28E',
          100: '#D6F0ED',
          50: '#EBF7F6',
          DEFAULT: '#0D7C6E',
        },
        ink: '#111827',
        'ink-muted': '#6B7280',
        'ink-faint': '#9CA3AF',
        border: '#E5E7EB',
        surface: '#F9FAFB',
        success: '#16A34A',
        'success-bg': '#F0FDF4',
        warning: '#D97706',
        'warning-bg': '#FFFBEB',
        info: '#2563EB',
        'info-bg': '#EFF6FF',
        error: '#DC2626',
        'error-bg': '#FEF2F2',
        neutral: '#6B7280',
        'neutral-bg': '#F3F4F6',
      },
      fontFamily: {
        serif: ['DM Serif Display', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.6' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '1.2' }],
        '3xl': ['1.875rem', { lineHeight: '1.2' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        md: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)',
        lg: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
}
export default config
