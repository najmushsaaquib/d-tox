/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{jsx,tsx,html}',
    './src/popup/**/*.{jsx,tsx}',
    './src/options/**/*.{jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // YouTube-inspired dark theme
        yt: {
          dark: '#0f0f0f',
          darker: '#030303',
          gray: '#272727',
          light: '#f1f1f1',
          red: '#ff0000'
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'sans-serif']
      }
    }
  },
  plugins: [],
  darkMode: 'class'
};
