# @valiify/shortapp-ui

A Tailwind CSS component library for the Valiify Short App — the online
application where applicants apply for accounts.

CSS-only, framework-agnostic, zero JavaScript dependencies. Components are
extracted from the Short App Figma component library and verified against it
with an automated visual harness.

> **Status: 27 components shipped**, extracted from the Short App Figma file
> and verified against it — 603 computed-style assertions, axe-core clean
> across every story. The complete design-token set (58 colors, 24 text
> styles, effects) ships as Tailwind v4 `@theme` tokens.

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

27 components, each documented in [CLAUDE.md](CLAUDE.md)'s Quick Reference
with class API, state tables, and copy-pasteable HTML:

- **Controls** — Button (Standard: Primary/Secondary/Micro/Bubble),
  UtilityButton (Empty/Filled/Rounded/Text), IconButton, Radio, Checkbox,
  Switch, Tabs, TextSelector
- **Fields** — TextField, DropdownField, TextArea, RadioField
- **Selection & lists** — SelectCard, BoxAction, ListItem (`.list-option`),
  DropdownList, Action
- **Feedback & overlays** — Modal (native `<dialog>`-first), Toast, Tooltip,
  Skeleton, StatusTracker
- **Identity & structure** — Avatar, Badge, Owner, OwnerContainer, Header

Quick taste:

```html
<button class="btn btn-primary">Continue</button>

<div class="text-field">
  <div class="text-field-title-row">
    <label class="text-field-title" for="name">First name</label>
  </div>
  <div class="text-field-box">
    <input id="name" class="text-field-input" type="text" placeholder="Jane" />
  </div>
</div>
```

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

**Current Phase**: Component build-out — 27 shipped, published to npm

Completed:

- ✅ Complete design-token extraction (58 colors, 8 radii, 13 spacing steps,
  24 text styles, 2 effects — full Figma Plugin-API enumeration)
- ✅ 27 components with visual specs (603 assertions), a11y scans, and
  static/bundle gates — all running in CI
- ✅ Published to npm as `@valiify/shortapp-ui`
- ✅ Chromatic visual regression in CI; tag-driven release workflow with
  npm provenance and a real-consumer packaging smoke test

Next steps:

- ⏳ Remaining Figma sets: Address Super entry, Layer field, Disclaimer
  container, User
- ⏳ Storybook deployment

## Architecture

- **CSS-only** — zero JavaScript dependencies, no Tailwind plugin, no `tailwind.config.js`
- **Tailwind v4 `@theme`** — tokens generate utilities automatically
- **Framework-agnostic** — works with React, Vue, Svelte, vanilla HTML
- **Verified** — every component carries a visual spec asserted against Figma

## Releasing

Releases are tag-driven. After merging to a green main:

1. Cut the CHANGELOG: retitle `[Unreleased]` to the new version + date.
2. `npm version patch` (or `minor`) — bumps package.json and creates the tag.
3. `git push origin main --follow-tags`.

The Release workflow re-runs the fast gates plus the packaging smoke test
(`npm run verify:package` — the real tarball in a real Vite consumer build,
both entry points), then publishes to npm with provenance. Requires the
`NPM_TOKEN` repo secret.

## Links

- **npm**: https://www.npmjs.com/package/@valiify/shortapp-ui
- **Repository**: https://github.com/BubbaCoop/Valiify-Application-Component-Library
- **Dashboard library (predecessor)**: https://github.com/BubbaCoop/Valiify-dashboard-ui

## License

MIT © Valiify
