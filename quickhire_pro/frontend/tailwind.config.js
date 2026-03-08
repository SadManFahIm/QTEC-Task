/**
 * tailwind.config.js — Tailwind CSS Configuration
 *
 * Extends Tailwind's default theme with project-specific values
 * so we can use classes like `bg-primary`, `text-dark`, and
 * `font-sans` (mapped to Plus Jakarta Sans) throughout the codebase.
 *
 * The `content` array tells Tailwind which files to scan for class names
 * when purging unused styles in the production build.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Files Tailwind scans to build its CSS — must include every file
  // that might contain Tailwind class names
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      // Brand colour palette — referenced as bg-primary, text-primary-dark etc.
      colors: {
        primary: {
          DEFAULT: '#4F46E5', // base indigo
          light:   '#6366F1', // lighter tint
          dark:    '#3730A3', // darker shade (hover states)
        },
        dark: '#1A1A2E', // near-black for headings
      },

      // Default sans-serif font — set to Plus Jakarta Sans
      // Fallback to generic sans-serif if the web font fails to load
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },

  plugins: [],
};
