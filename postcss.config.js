/**
 * PostCSS configuration.
 *
 * @tailwindcss/postcss is the only plugin needed. Tailwind v4 handles vendor
 * prefixing internally via Lightning CSS, so autoprefixer is redundant here
 * and the two can fight over the same declarations.
 */
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
