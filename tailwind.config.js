// Palette mirrors src/constants/theme.ts (Colors) — keep both in sync
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#208AEF', soft: '#D6E9FC', 'soft-dark': '#0F2E4D' },
        danger: '#E5484D',
        success: '#30A46C',
        warning: '#F5A524',
        surface: { DEFAULT: '#F0F0F3', dark: '#212225' },
        'surface-2': { DEFAULT: '#E0E1E6', dark: '#2E3135' },
        muted: { DEFAULT: '#60646C', dark: '#B0B4BA' },
      },
    },
  },
  plugins: [],
};
