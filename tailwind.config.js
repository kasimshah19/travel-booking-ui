/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Core Palettes provided by user
        "alice-blue": { 50: "#e7f4fd", 100: "#cfe9fc", 200: "#a0d3f8", 300: "#70bef5", 400: "#40a8f2", 500: "#1192ee", 600: "#0d75bf", 700: "#0a588f", 800: "#073a5f", 900: "#031d30", 950: "#021421" },
        "icy-blue": { 50: "#e7f3fe", 100: "#cfe8fc", 200: "#9fd1f9", 300: "#6eb9f7", 400: "#3ea2f4", 500: "#0e8bf1", 600: "#0b6fc1", 700: "#085391", 800: "#063860", 900: "#031c30", 950: "#021322" },
        "sky-blue": { 50: "#e7f3fe", 100: "#cfe8fc", 200: "#9ed1fa", 300: "#6eb9f7", 400: "#3da2f5", 500: "#0d8bf2", 600: "#0a6fc2", 700: "#085391", 800: "#053861", 900: "#031c30", 950: "#021322" },
        "cool-sky": { 50: "#e7f3fe", 100: "#cfe8fc", 200: "#9ed1fa", 300: "#6eb9f7", 400: "#3da2f5", 500: "#0d8bf2", 600: "#0a6fc2", 700: "#085391", 800: "#053861", 900: "#031c30", 950: "#021322" },
        "dodger-blue": { 50: "#e7f3fe", 100: "#cfe8fc", 200: "#9ed1fa", 300: "#6eb9f7", 400: "#3da2f5", 500: "#0d8bf2", 600: "#0a6fc2", 700: "#085391", 800: "#053861", 900: "#031c30", 950: "#021322" },
        "brilliant-azure": { 50: "#e8f3fc", 100: "#d1e7fa", 200: "#a4cff4", 300: "#76b7ef", 400: "#489eea", 500: "#1b86e4", 600: "#156bb7", 700: "#105189", 800: "#0b365b", 900: "#051b2e", 950: "#041320" },
        "twitter-blue": { 50: "#e8f2fc", 100: "#d1e5fa", 200: "#a4ccf4", 300: "#76b2ef", 400: "#4899ea", 500: "#1b7fe4", 600: "#1566b7", 700: "#104c89", 800: "#0b335b", 900: "#05192e", 950: "#041220" },
        "ocean-deep": { 50: "#e8f2fc", 100: "#d1e4fa", 200: "#a3c9f5", 300: "#75aef0", 400: "#4794eb", 500: "#1979e6", 600: "#1461b8", 700: "#0f488a", 800: "#0a305c", 900: "#05182e", 950: "#041120" },
        "cobalt-blue": { 50: "#e7f0fd", 100: "#d0e1fb", 200: "#a1c3f7", 300: "#71a5f4", 400: "#4288f0", 500: "#136aec", 600: "#0f55bd", 700: "#0b3f8e", 800: "#082a5e", 900: "#04152f", 950: "#030f21" },

        // Semantic mapping to prevent breaking existing classes
        teal: { DEFAULT: "#05182e", light: "#0f488a" }, // Maps to ocean-deep-900 and 700
        sand: "#e7f3fe", // Maps to sky-blue-50
        coral: { DEFAULT: "#1b7fe4", dark: "#1566b7" }, // Maps to twitter-blue-500 and 600
        ink: "#041120", // Maps to ocean-deep-950
        sage: "#a0d3f8", // Maps to alice-blue-200
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
