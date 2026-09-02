# Getting Started with @valiify/shortapp-ui

Complete installation guide for all build setups.

> **Note**: 21 components are shipped (see the Quick Reference in CLAUDE.md); the remaining Figma sets (Address Super entry, Layer field, Disclaimer container, User, Confirmation Modal, Portal Specific) are pending extraction.
> Component class names used in the snippets below (e.g. `.btn`, `.chip`) are
> illustrative of how the library is consumed — the real class reference will
> live in [CLAUDE.md](CLAUDE.md) as components land.

## Prerequisites

- Node.js 18+ and npm
- A project (or create one with `npm init`)
- **A bundler or build tool** - This package requires one of: Vite, webpack, PostCSS, or the Tailwind CLI

> **⚠️ IMPORTANT**: Tailwind CSS v4 requires an integration package to function. Installing only `tailwindcss` and `@valiify/shortapp-ui` will fail silently with no styles applied. You **must** install one of the integration packages listed below.

## Quick Start (Vite - Recommended)

The fastest way to get started. Use our verified starter:

```bash
# Copy the starter template
npx degit BubbaCoop/Valiify-Application-Component-Library/examples/vite-starter my-app
cd my-app

# Install dependencies
npm install

# Start dev server
npm run dev
```

That's it. Open [http://localhost:5173](http://localhost:5173) to see a working example.

## Manual Installation

### Step 1: Install Packages

**For Vite:**
```bash
npm install @valiify/shortapp-ui tailwindcss @tailwindcss/vite
```

**For webpack:**
```bash
npm install @valiify/shortapp-ui tailwindcss @tailwindcss/webpack
```

**For PostCSS (including Next.js):**
```bash
npm install @valiify/shortapp-ui tailwindcss @tailwindcss/postcss
```

**For Tailwind standalone CLI:**
```bash
npm install @valiify/shortapp-ui tailwindcss @tailwindcss/cli
```

> **Why three packages?** `tailwindcss` alone doesn't process CSS in v4. You need **both** `tailwindcss` and one of the `@tailwindcss/*` integration packages for anything to work.

### Step 2: Configure Your Build Tool

Choose your build tool:

<details>
<summary><strong>Vite</strong></summary>

Create or update `vite.config.js`:

```js
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

</details>

<details>
<summary><strong>webpack</strong></summary>

Add to your webpack config:

```js
import tailwindcss from "@tailwindcss/webpack";

export default {
  plugins: [tailwindcss()],
};
```

</details>

<details>
<summary><strong>PostCSS</strong></summary>

Create or update `postcss.config.js`:

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

</details>

<details>
<summary><strong>Tailwind CLI</strong></summary>

No config file needed. Build with:

```bash
npx @tailwindcss/cli -i src/styles.css -o dist/styles.css --watch
```

</details>

### Step 3: Create Your Stylesheet

Create a CSS file (e.g., `src/styles.css`):

```css
/* Optional: Load fonts (or self-host for better performance) */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap");

/* Required: Tailwind CSS */
@import "tailwindcss";

/* Required: Valiify Short App UI */
@import "@valiify/shortapp-ui/source";

/* Your custom styles */
```

> **⚠️ CRITICAL**: Import the library from CSS, never from JavaScript. See [Common Mistakes](#common-mistakes) below.

### Step 4: Import Your Stylesheet

In your JavaScript entry point:

```js
// main.js or index.js
import "./styles.css"; // ✅ Import YOUR stylesheet
```

**NOT like this:**

```js
import "@valiify/shortapp-ui/source"; // ❌ NEVER import the library directly
```

### Step 5: Load the Icon Sprite

Add this to your JavaScript entry:

```js
import spriteUrl from "@valiify/shortapp-ui/icons/sprite.svg?url";

fetch(spriteUrl)
  .then((r) => r.text())
  .then((svg) => {
    const host = document.createElement("div");
    host.style.display = "none";
    host.innerHTML = svg;
    document.body.prepend(host);
  });
```

> **Note**: The `?url` suffix is Vite-specific. For other bundlers, you may need to copy the file or use an equivalent loader.

### Step 6: Use Components

```html
<button class="btn btn-primary">Click me</button>

<div class="input-container">
  <div class="input-field">
    <input type="text" class="input" placeholder="Enter text..." />
  </div>
</div>

<span class="chip chip-success">
  <span class="chip-dot"></span>
  <span>Approved</span>
</span>
```

See [COMPONENTS.md](COMPONENTS.md) for complete markup examples of every component.

## Common Mistakes

### ❌ Importing from JavaScript

**This breaks silently:**

```js
// main.js
import "@valiify/shortapp-ui/source";
```

Your dev server returns HTTP 200, the page loads, and all library styles are missing with no visible error.

**Why it fails:** Your bundler hands our stylesheet to PostCSS as its own file with no Tailwind context. Every `@apply` becomes unresolvable.

**Fix:** Import from CSS instead:

```css
/* styles.css */
@import "tailwindcss";
@import "@valiify/shortapp-ui/source";
```

```js
// main.js
import "./styles.css";
```

### ❌ Missing Integration Package

**This also breaks silently:**

```bash
npm install tailwindcss @valiify/shortapp-ui
```

Without `@tailwindcss/vite` (or postcss/webpack), `@import "tailwindcss"` does nothing. No error, no styles.

**Fix:** Install the integration package for your build tool (see Step 1).

### ❌ Wrong Import Order

**This fails:**

```css
@import "@valiify/shortapp-ui/source";
@import "tailwindcss";
```

Tailwind must come first. If you get "unknown at-rule" or "@apply not found" errors, check your import order.

### ❌ Using Incomplete Markup

Many components require wrapper elements:

**This looks broken:**

```html
<input class="input" />
```

**This works:**

```html
<div class="input-container">
  <div class="input-field">
    <input class="input" />
  </div>
</div>
```

See [COMPONENTS.md](COMPONENTS.md) for the required structure of each component.

## Framework-Specific Setup

### React

```jsx
// App.jsx
import "./styles.css";

function App() {
  return (
    <button className="btn btn-primary">
      Click me
    </button>
  );
}
```

### Vue

```vue
<script setup>
import "./styles.css";
</script>

<template>
  <button class="btn btn-primary">Click me</button>
</template>
```

### Svelte

```svelte
<script>
  import "./styles.css";
</script>

<button class="btn btn-primary">Click me</button>
```

### Next.js (App Router)

In `app/layout.js`:

```js
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

In `app/globals.css`:

```css
@import "tailwindcss";
@import "@valiify/shortapp-ui/source";
```

Create `postcss.config.js`:

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

## Components That Need JavaScript

These components ship **zero JavaScript** and require you to implement behavior:

### DropdownField / DropdownMenu

Needs:
- Click handler to toggle `aria-expanded`
- Hide/show the panel with the `hidden` attribute
- Outside-click detection to close
- Option selection handlers

**Minimal example:**

```js
const trigger = document.querySelector('[aria-haspopup="listbox"]');
const panel = document.querySelector(".dropdown-panel");

trigger.addEventListener("click", () => {
  const isOpen = trigger.getAttribute("aria-expanded") === "true";
  trigger.setAttribute("aria-expanded", !isOpen);
  panel.hidden = isOpen;
});

// Close on outside click
document.addEventListener("click", (e) => {
  if (!trigger.contains(e.target) && !panel.contains(e.target)) {
    trigger.setAttribute("aria-expanded", "false");
    panel.hidden = true;
  }
});
```

See `examples/vite-starter/src/main.js` for a complete working implementation.

### Tabs

Needs:
- Click handlers on each tab
- Toggle `aria-selected` on clicked tab
- Show/hide corresponding `tabpanel`

### Modal

Either:
- Use native `<dialog>` element (recommended - browser handles everything)
- Or implement: open/close handlers, backdrop click detection, Escape key, focus trapping

**Recommended approach:**

```html
<dialog class="modal modal-positive">
  <!-- modal content -->
</dialog>

<script>
  const modal = document.querySelector("dialog");
  modal.showModal(); // Opens with backdrop, Escape, focus trap for free
</script>
```

### Tooltip

Needs:
- Show/hide on hover/focus
- Positioning logic (or use a library like Floating UI)

## Verification

To verify your installation is working:

1. **Styles apply** - Buttons should have colored backgrounds and rounded corners
2. **Icons render** - If you see `#icon-name` text, the sprite didn't load
3. **Token utilities work** - Try `<div class="bg-approved">` - it should have a green background
4. **No console errors** - Check for 404s on sprite.svg or CSS files

## Next Steps

- Browse components in [COMPONENTS.md](COMPONENTS.md)
- See working examples in `examples/vite-starter/` and `examples/postcss-starter/`
- Read the [README](README.md) for architecture and development info
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) if you hit issues

## Still Having Issues?

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed debugging steps.
