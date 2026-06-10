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
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        diatype: [
          "ABC Diatype Semi Mono",
          "Inter",
          "sans-serif",
        ],
      },
      colors: {
        ink: {
          900: "#0a0b0f",
          800: "#1a1c24",
          700: "#3d4150",
          500: "#6b7080",
          400: "#9498a8",
          300: "#b8bcc8",
          200: "#e4e6ec",
          100: "#f0f1f5",
        },
        canvas: "#f5f5f7",
        bg: "#fafafa",
        surface: "#ffffff",
        raised: "#f5f5f7",
        card: "#ffffff",
        brand: {
          50: "#f4effe",
          100: "#ebe3fd",
          200: "#d4c4fb",
          300: "#b89dfc",
          400: "#9d6bf9",
          500: "#7132f5",
          600: "#5d21e0",
          700: "#4a18b8",
        },
        mint: {
          50: "#ecfdf5",
          100: "#d1fae5",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
        amber: {
          50: "#fffbeb",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
        danger: {
          50: "#fff1f2",
          100: "#ffe4e6",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
        },
      },
      boxShadow: {
        card: "0 2px 24px -4px rgba(10,11,15,0.08), 0 8px 32px -8px rgba(10,11,15,0.06)",
        float: "0 24px 48px -12px rgba(113,50,245,0.22)",
        glow: "0 0 0 4px rgba(113,50,245,0.12)",
        device:
          "0 50px 100px -20px rgba(10,11,15,0.25), 0 0 0 1px rgba(10,11,15,0.04)",
        button: "0 8px 24px -6px rgba(113,50,245,0.45)",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "28px",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        shimmer: "shimmer 2.4s linear infinite",
        pulseSoft: "pulseSoft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
