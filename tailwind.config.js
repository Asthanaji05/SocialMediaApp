/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--primary-color) / <alpha-value>)", // Use CSS variable
        dark: "#000000",
      },
      // tailwind.config.js
safelist: [
  'bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500',
  'text-red-500', 'text-green-500', 'text-blue-500', 'text-yellow-500', 'text-purple-500',
  'border-red-500', 'border-green-500', 'border-blue-500', 'border-yellow-500', 'border-purple-500',
],

    },
  },
  plugins: [],
};