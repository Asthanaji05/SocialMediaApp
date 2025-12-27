/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--primary-color) / <alpha-value>)", // Use CSS variable
        dark: "#000000",
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
      },
      // tailwind.config.js
      safelist: [
        'bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500',
        'text-red-500', 'text-green-500', 'text-blue-500', 'text-yellow-500', 'text-purple-500',
        'border-red-500', 'border-green-500', 'border-blue-500', 'border-yellow-500', 'border-purple-500',

        'bg-slate-500', 'bg-gray-500', 'bg-zinc-500', 'bg-neutral-500', 'bg-stone-500',
        'bg-orange-500', 'bg-amber-500', 'bg-lime-500', 'bg-emerald-500', 'bg-teal-500',
        'bg-cyan-500', 'bg-sky-500', 'bg-indigo-500', 'bg-violet-500', 'bg-fuchsia-500',
        'bg-pink-500', 'bg-rose-500',

        'border-slate-500', 'border-gray-500', 'border-zinc-500', 'border-neutral-500', 'border-stone-500',
        'border-orange-500', 'border-amber-500', 'border-lime-500', 'border-emerald-500', 'border-teal-500',
        'border-cyan-500', 'border-sky-500', 'border-indigo-500', 'border-violet-500', 'border-fuchsia-500',
        'border-pink-500', 'border-rose-500',
      ],


    },
  },
  plugins: [],
};