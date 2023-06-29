/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#03594F",
          "primary-focus": "#03594F",
          "primary-content": "#ffffff",

          "secondary": "#EBF5F4",
          "secondary-focus": "#EBF5F4",
          "secondary-content": "#03594F",

          "base-content": "#000000"
        },
      },
    ],
  }
}

