/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#4f46e5', // indigo-600
          secondary: '#1e293b', // slate-800
          accent: '#f59e0b', // amber-500
          neutral: '#374151', // gray-700
          'base-100': '#f3f4f6', // gray-100
          info: '#3b82f6', // blue-500
          success: '#10b981', // emerald-500
          warning: '#f59e0b', // amber-500
          error: '#ef4444', // red-500
        },
      },
    ],
  },
}
