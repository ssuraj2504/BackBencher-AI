/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
            // Dark mode palette
            background: "#09090b", // zinc-950
            foreground: "#fafafa", // zinc-50
            primary: {
                DEFAULT: "#8b5cf6", // violet-500
                foreground: "#ffffff",
            },
            secondary: {
                DEFAULT: "#27272a", // zinc-800
                foreground: "#fafafa",
            },
            accent: {
                DEFAULT: "#2dd4bf", // teal-400
                foreground: "#000000",
            },
            card: {
                DEFAULT: "#18181b", // zinc-900
                foreground: "#fafafa",
            }
        },
        fontFamily: {
            sans: ['Inter', 'sans-serif'],
        }
      },
    },
    plugins: [
        require("tailwindcss-animate")
    ],
  }
