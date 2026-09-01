# Valiify Short App UI - PostCSS Starter

Minimal example using PostCSS CLI (no bundler).

## Quick Start

```bash
# Install
npm install

# Build CSS
npm run build

# Watch mode
npm run watch

# Build and serve (requires serve: npm i -g serve)
npm run serve
```

> **Note:** If you copied this example from the GitHub repo, the `package.json` may reference `"file:../.."`. When installing from npm, this is automatically fixed to use the published version. If you see installation errors, check that the dependency is set to a version number like `"^0.1.0-alpha.2"`.

## Key Files

- `postcss.config.js` - PostCSS configuration with @tailwindcss/postcss
- `src/styles.css` - Source stylesheet
- `dist/styles.css` - Built stylesheet (generated)
- `index.html` - HTML file linking to built CSS

## Why @tailwindcss/postcss?

Tailwind v4 requires an integration package. For PostCSS, that's `@tailwindcss/postcss`.

Without it, `@import "tailwindcss"` does nothing and your styles are missing with no error.

## For webpack Users

Same setup, but install `@tailwindcss/webpack` instead of `@tailwindcss/postcss` and add it to your webpack config:

```js
// webpack.config.js
import tailwindcss from "@tailwindcss/webpack";

export default {
  plugins: [tailwindcss()],
};
```
