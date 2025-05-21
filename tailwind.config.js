

/** @type {import('tailwindcss').Config} */
module.exports = {

 content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
   
        tertiary: "#3DB166", // Primary Green
        secondary: "#51BE78", // Lighter Green
        primary: "#000080", // Dark Blue
        accent: "#FFAE42", // Gold/Orange
        textDark: "#213152",
        background: "#FFFFFF", // Light Background
        backgroundsecondary: "#F4F4F4", // Gray Background
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
