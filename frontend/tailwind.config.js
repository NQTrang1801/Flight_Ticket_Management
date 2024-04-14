/** @type {import('tailwindcss').Config} */

/*eslint-env node*/
export const content = ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"];
export const theme = {
    fontFamily: {
        montserrat: ["Montserrat"]
    },
    colors: {
        transparent: "transparent",
        current: "currentColor",
        white: "#ffffff",
        black: "#000",
        background: "#242531",
        background_80: "rgba(36,37,49,0.8)",
        // primary: "#8d7cdd",
        primary: "#1883ba",
        primary_10: "rgba(141,124,221,0.1)",
        disabled: "#7f7f8e",
        blue: "#53a6de",
        lightBlue: "#BBE1FA",
        placeholder: "#5674d01a",
        border: "#373845",
        block: "#262a38",
        red: "#e69473",
        deepRed: "#ff0000",
        mdRed: "#ff5f56",
        pink: "#DE3163"
    },
    extend: {}
};
export const plugins = [];
