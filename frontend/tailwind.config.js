/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'sticky-yellow': '#FFEB3B',
        'sticky-yellow-light': '#FFF59D',
        'sticky-yellow-dark': '#FBC02D',
        'sticky-orange': '#FFC107',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        sticky: {
          "primary": "#FBC02D",
          "secondary": "#FFC107",
          "accent": "#FF9800",
          "neutral": "#3d4451",
          "base-100": "#FFFEF5",
          "base-200": "#FFF9C4",
          "base-300": "#FFF59D",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
      "dracula",
    ],
  },
};
