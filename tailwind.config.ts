import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lavender: {
          100: '#f3e8ff',  // light lavender
          200: '#e0c3ff',  // medium light lavender
          300: '#c199ff',  // medium lavender
          400: '#a170ff',  // deep lavender
          500: '#7d46ff',  // primary lavender
          600: '#5920e0',  // dark lavender
          700: '#3f16b3',  // darker lavender
          800: '#2b0c8f',  // even darker lavender
          900: '#1c0573',  // darkest lavender
        },
        purple: {
          500: '#9b5de5',  // primary purple
          600: '#7a40d3',  // dark purple
        },
        pink: {
          500: '#ff85b3',  // primary pink
          600: '#ff4c98',  // deep pink
        },
        white: {
          DEFAULT: '#ffffff',  // white
        },
        gray: {
          50: '#f9fafb', // very light gray, almost white
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    
  },
  plugins: [],
};
export default config;
