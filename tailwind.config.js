/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
  ],
  theme: {
    extend: {
      borderRadius: {
        'DEFAULT': '2px',
      },
      fontFamily: {
        inter_var: [
          'Inter var',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
        heading: [
          'Instrument Serif',
          'ui-serif',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'serif',
        ],
      },
      colors: {
        primary: {
          50: '#E4E5F4',
          100: '#D0D1EB',
          200: '#A7A9D9',
          300: '#7D80C7',
          400: '#5458B5',
          500: '#2B30A3', // main primary
          600: '#222682',
          700: '#1A1D62',
          800: '#111341',
          900: '#090A21',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b', // main slate
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        neutral: {
          50: '#fafafa', // zinc-50
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b', // zinc-900
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb', // main gray-200
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        success: {
          50: '#CDE7CF',
          100: '#BCDBBD',
          200: '#98C49A',
          300: '#75AC78',
          400: '#519555',
          500: '#2E7D32', // main success
          600: '#256428',
          700: '#1C4B1E',
          800: '#123214',
          900: '#09190A',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // red-500
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
    },
  },
  safelist: [
    // Keep arbitrary value utilities generated at runtime (e.g. bg-[oklab(...)] etc.)
    { pattern: /^(bg|text|outline|shadow|border|from|via|to)-\[.*\]$/ },
    { pattern: /^(w|h|min-w|min-h|max-w|max-h|rounded|tracking|leading)-\[.*\]$/ },
  ],
  plugins: [],
};


