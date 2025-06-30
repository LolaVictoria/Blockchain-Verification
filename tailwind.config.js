/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts, tsx}",
  ],
  theme: {
    extend: {
       colors: {
        border: "hsl(var(--border))",
        // ... other colors
      },
    },
  },
  plugins: [],
}
