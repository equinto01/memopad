/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'pastel-pink': '#FFB3D9',
        'pastel-blue': '#B3D9FF',
        'pastel-purple': '#D9B3FF',
        'pastel-green': '#B3FFD9',
        'pastel-lavender': '#E6D9FF',
        'pastel-mint': '#D9FFE6',
        'pastel-peach': '#FFD9B3',
        'pastel-sky': '#B3E6FF',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        dark: {
          "primary": "#B3D9FF",
          "secondary": "#D9B3FF",
          "accent": "#FFB3D9",
          "neutral": "#2a2e37",
          "base-100": "#1a1d24",
          "base-200": "#252932",
          "base-300": "#2f3440",
          "info": "#7dd3fc",
          "success": "#86efac",
          "warning": "#fde047",
          "error": "#fca5a5",
        },
      },
    ],
  },
};
