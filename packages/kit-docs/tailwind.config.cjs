/* eslint-disable @typescript-eslint/no-var-requires */

const {
  kitDocsFontFamily,
  kitDocsScreens,
  kitDocsColors,
  kitDocsKeyframes,
  kitDocsAnimations,
  kitDocsTypography,
  kitDocsVariants,
} = require('./tailwind.cjs');

module.exports = {
  content: ['./src/lib/**/*.{html,svelte}'],
  darkMode: 'class',
  theme: {
    fontFamily: kitDocsFontFamily,
    screens: kitDocsScreens,
    extend: {
      colors: kitDocsColors,
      keyframes: kitDocsKeyframes,
      animation: kitDocsAnimations,
      typography: kitDocsTypography,
    },
  },
  plugins: [require('@tailwindcss/typography'), kitDocsVariants],
};
