import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        gradient_move: {
          "0%": {},
          "50%": {
            backgroundPosition: "100% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
        },
        indeterminate: {
          from: {
            left: "-50%",
          },
          to: {
            left: "100%",
          },
        },
      },
      animation: {
        gradient_animation: "gradient-move 5s ease infinite",
        indeterminate: "indeterminate 1s ease-in-out infinite",
      },
      backgroundSize: {
        400: "400%",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
