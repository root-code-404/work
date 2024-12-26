/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable dark mode support
  theme: {
    extend: {
      colors: {
        primary: "#fea928",  // Updated primary color
        secondary: "#ed8900",  // Updated secondary color
        accent: "#6366F1",  // Light blue accent color
        darkAccent: "#3B82F6",  // Dark blue for hover/focus
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "3rem",
          md: "4rem",
        },
      }, 
      transitionProperty: {
        transform: "transform",
      },
      // Customizing animations and keyframes
      animation: {
        pulse: "pulse 1.5s infinite",
        ping: "ping 2s infinite",
        fadeIn: "fadeIn 1s ease-in-out",
        scaleUp: "scaleUp 0.5s ease-out",
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
        ping: {
          '75%, 100%': { transform: 'scale(1.2)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      spacing: {
        128: '32rem',  // Custom spacing for larger elements
        144: '36rem',
      },
    },
  },
  plugins: [],
};
