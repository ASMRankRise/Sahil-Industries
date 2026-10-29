/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#101820',
        surface: '#18232e',
        steel: '#5f6b76',
        mist: '#eef1f2',
        safety: '#f6c515',
      },
      boxShadow: {
        safety: '18px 18px 0 rgba(246, 197, 21, .22)',
      },
      letterSpacing: {
        industrial: '.08em',
      },
    },
  },
  plugins: [],
};
