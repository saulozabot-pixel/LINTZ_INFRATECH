/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#FFD700", // Gold for LUX
                secondary: "#DAA520", // Goldenrod for depth
                danger: "#FF5252", // Red
                warning: "#FFAB00", // Amber
                dark: {
                    bg: "#0d0d0f",
                    card: "#1a1a1f",
                    border: "#333",
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
