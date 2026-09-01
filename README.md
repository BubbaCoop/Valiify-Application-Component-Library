# @valiify/shortapp-ui

A Tailwind CSS component library for the Valiify Short App — the online
application where applicants apply for accounts.

CSS-only, framework-agnostic, zero JavaScript dependencies. Components are
extracted from the Short App Figma component library and verified against it
with an automated visual harness.

> **Status: infrastructure setup.** This library was bootstrapped from the
> [Valiify Dashboard UI](https://github.com/BubbaCoop/Valiify-dashboard-ui)
> library's build and verification infrastructure. Short App design tokens and
> components have not been extracted yet — the component set is currently
> empty. The dashboard library's components are preserved for pattern reference
> in `_dashboard-archive/` and are not part of this package.

## ⚠️ Important: Read This First

**This package requires a build tool.** Installing
`npm install @valiify/shortapp-ui tailwindcss` is not enough. You also need:

- **Vite:** `@tailwindcss/vite`
- **webpack:** `@tailwindcss/webpack`
- **PostCSS/Next.js:** `@tailwindcss/postcss`
- **No bundler:** `@tailwindcss/cli`

**Without one of these packages, nothing will work.** No errors, no styles.
See [Installation](#installation) below.

## Installation

### Step 1: Install Packages

Choose based on your build tool:

```bash
# Vite (recommended)
npm install @valiify/shortapp-ui tailwindcss @tailwindcss/vite

# webpack
npm install @valiify/shortapp-ui tailwindcss @tailwindcss/webpack

# PostCSS / Next.js
npm install @valiify/shortapp-ui tailwindcss @tailwindcss/postcss

# Tailwind CLI (no bundler)
npm install @valiify/shortapp-ui tailwindcss @tailwindcss/cli
```

> ⚠️ **You need THREE packages, not two.** `tailwindcss` alone doesn't process
> CSS in v4. Missing the integration package (the third one above) causes
> silent failure.

### Step 2: Configure Your Build Tool

**Vite** - create/update `vite.config.js`:

```js
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

**PostCSS** - create/update `postcss.config.js`:

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### Step 3: Create Your Stylesheet

```css
/* Optional fonts — must be the FIRST line if used */
@import "@valiify/shortapp-ui/fonts";

@import "tailwindcss";

/* prebuilt: component classes + tokens as custom properties */
@import "@valiify/shortapp-ui";

/* OR source: the above plus token-generated utilities */
/* @import "@valiify/shortapp-ui/source"; */
```

See [GETTING_STARTED.md](GETTING_STARTED.md) for the complete setup guide and
[TROUBLESHOOTING.md](TROUBLESHOOTING.md) when something doesn't render.

## Components

**None yet** — the Short App component set is being extracted from Figma.
Each component will be documented in [CLAUDE.md](CLAUDE.md) as it lands, with
class reference, states, and copy-pasteable HTML.

## Development

```bash
npm install
npm run storybook        # component workbench at localhost:6006
npm run build            # tokens -> theme -> dist/index.css
npm run new:component X  # scaffold a new component
npm run verify:visual    # assert computed styles against Figma values
npm run verify:a11y      # axe-core over every story
npm run audit            # coverage across the library
```

The component development process is documented in
[docs/component-process.md](docs/component-process.md).

## Development Status

**Current Phase**: Infrastructure Setup Complete
**Next Phase**: Figma Token Extraction & Component Development

Completed:

- ✅ Project infrastructure migrated from the dashboard library
- ✅ Build pipeline and verification tools ready
- ✅ Storybook configured
- ✅ Icon sprite system (Lucide, shared with the dashboard library)
- ✅ Package renamed and rebranded

Next steps:

- ⏳ Extract design tokens from the Short App Figma file
- ⏳ Build first components
- ⏳ Chromatic visual regression (after the full library is complete)
- ⏳ NPM publishing and Storybook deployment

## Architecture

- **CSS-only** — zero JavaScript dependencies, no Tailwind plugin, no `tailwind.config.js`
- **Tailwind v4 `@theme`** — tokens generate utilities automatically
- **Framework-agnostic** — works with React, Vue, Svelte, vanilla HTML
- **Verified** — every component carries a visual spec asserted against Figma

## Links

- **Repository**: https://github.com/BubbaCoop/Valiify-Application-Component-Library
- **Dashboard library (predecessor)**: https://github.com/BubbaCoop/Valiify-dashboard-ui

## License

MIT © Valiify
