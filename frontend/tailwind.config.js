/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00FFFF',
        'neon-pink': '#FF00FF',
        'neon-purple': '#BF00FF',
        'neon-green': '#39FF14',
        'neon-blue': '#0FF0FF',
        'neon-magenta': '#FF1493',
        'neon-yellow': '#FFFF00',
        'pastel-pink': '#FFB3D9',
        'pastel-blue': '#B3D9FF',
        'pastel-purple': '#D9B3FF',
        'pastel-green': '#B3FFD9',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        dark: {
          "primary": "#00FFFF",
          "secondary": "#FF00FF",
          "accent": "#BF00FF",
          "neutral": "#2a2e37",
          "base-100": "#1a1d24",
          "base-200": "#252932",
          "base-300": "#2f3440",
          "info": "#0FF0FF",
          "success": "#39FF14",
          "warning": "#FFFF00",
          "error": "#FF1493",
        },
      },
    ],
  },
};
