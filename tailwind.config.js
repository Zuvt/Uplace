module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#fe665b",
      },
    },
  },
  plugins: [require("tailwindcss-scrollbar")],
};
