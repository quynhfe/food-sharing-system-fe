/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#2E7D32",
        "primary-light": "#e8f5e9",
        "primary-dark": "#1B5E20",
        accent: "#66BB6A",
        "bg-light": "#F8FAF8",
        surface: "#F1F5F1",
        "text-main": "#1a2e1a",
        "text-secondary": "#5a7a5a",
        success: "#66BB6A",
        danger: "#EF5350",
        warning: "#e65100",
        "border-green": "#d4e8d4",
      },
    }
  },
  plugins: []
};
