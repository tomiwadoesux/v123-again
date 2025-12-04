/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        fino: ['Fino', 'serif'],
        merriweather: ['Merriweather', 'serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      colors: {
        accent: '#EB8E41',
      }
    }
  },
  plugins: []
};