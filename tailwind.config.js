/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "400px",
      },
      fontFamily: {
        sans: [
          "Kraken-Product",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        display: [
          "Kraken-Brand",
          "Kraken-Product",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      colors: {
        // Dark theme: `ink` is the text scale, inverted so 900 = brightest.
        ink: {
          900: "#f6f7f9",
          700: "#c8ccd4",
          500: "#9497a9",
          400: "#787d8c",
          300: "#5a5e6b",
        },
        canvas: "#0c0d10", // page base (Kraken near-black)
        bg: "#0c0d10",
        surface: "#17181d", // card surface
        raised: "#1f2127", // elevated rows / inputs
        card: "#17181d",
        brand: {
          50: "#241640", // dark purple tint surface
          100: "#2d1b50",
          300: "#b89dfc", // light purple text on dark
          400: "#9d6bf9",
          500: "#7132f5",
          600: "#5d21e0",
          700: "#4a18b8",
        },
        mint: {
          50: "#0f2a22", // dark green tint
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#a7f3d0",
        },
        amber: {
          50: "#2e2410", // dark amber tint
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
        danger: {
          50: "#2a1418", // dark red tint
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
        },
      },
      boxShadow: {
        card: "0 8px 28px -18px rgba(0,0,0,0.9)",
        float: "0 22px 55px -22px rgba(113,50,245,0.5)",
        glow: "0 0 0 4px rgba(113,50,245,0.18)",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "20px",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        shimmer: "shimmer 2.4s linear infinite",
      },
    },
  },
  plugins: [],
};
