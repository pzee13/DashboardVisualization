/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Include all JavaScript/TypeScript files in the src directory
    './public/index.html', // Include your HTML file if needed
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-transparent': 'linear-gradient(to right, rgba(3, 3, 6, 0.5), rgba(4, 4, 4, 0.4))',
      },
      animation: {
        'gradient-animation': 'gradientShift 5s ease infinite',
      },
      keyframes: {
        gradientShift: {
          '0%': {
            backgroundPosition: '0% 0%',
          },
          '100%': {
            backgroundPosition: '100% 100%',
          },
        },
      },
    },
  },
  plugins: [],
}
