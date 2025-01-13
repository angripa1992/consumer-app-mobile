/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
		colors: {
			purple: '#833BF6',
			'dark-purple': '#833BF6',
			gray: '#B0B0B0',
			'light-white': '#EBEBEB',
			'dark-black': '#0D0D0D',
			'dark-gray': '#161616',
			'middle-gray': '#252525',
			'social-media-gray': '#858585',
			'neutral-gray': '#666666',
			'purple-hover': '#F7F3FE',
			'login-gray': '#969696',
			'admin-gray': '#3B3B3B',
			'admin-tag-gray': '#575757',
			'filter-border': '#DEDEDE',
			'button-black': '#1C1C1C',
			'blue-link': '#4A0DAB',
			'purple-lilac': '#C29EFA',
			"error": "#F66079",
			"principal-green": "#75FBCF",
			"gray-button": "#9999990F",
			"layout-black": "#1C1C1C",
			"gray-label":"#BFBFBF",
		},
      	fontFamily: {
			interThin: ['Inter_100Thin'],
			interRegular: ['Inter_400Regular'],
			Inter_900Black: ['Inter_900Black'],
		},
    },
  plugins: [],
}}
