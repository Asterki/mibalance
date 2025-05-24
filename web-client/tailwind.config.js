/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#0081c9",
				secondary: "#ed7700",
				gray1: "#425363",
				gray2: "#bbbbbb",
				gray3: "#aaaaaa",
			},
		},
	},
	plugins: [],
};
