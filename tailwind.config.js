/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        'fira': ['Fira Code', 'monospace'],
        'tech': ['Fira Code', 'monospace'],
      },
      colors: {
        'primary': '#00234b',
        'secondary': '#17467c',
        'accent': '#031c32',
        'highlight': '#0f72ce',
        'orange': '#FE9900',
        'background': '#00234b',
        'background-light': '#01264f',
        'foreground': '#ffffff',
        'border': '#123e6f',
        'card': '#01264f',
        'card-hover': '#022c5a',
        'card-dark': '#032253',
        'highlight-dark': '#0c61af',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
      },
    },
  },
  plugins: [],
} 