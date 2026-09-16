# Valiify Short App Icons

2,034 [Lucide](https://lucide.dev) icons + 2 custom icons, delivered as one checked-in SVG
sprite.

> **There is no `icon` class.** This library ships no generic class for an `<svg>` and no
> `icon-sm`/`icon-md`/`icon-size-*` scale. Earlier versions of this file documented one —
> and even told you to author the CSS yourself. That vocabulary came from the dashboard
> library and never existed here. See
> [ICON-SYSTEM.md](../components/ICON-SYSTEM.md) for the full model; the short version is
> below.

## Quick start

### 1. Load the sprite once

```html
<!-- Option A: inline it (no network request) -->
<div hidden>…contents of sprite.svg…</div>

<!-- Option B: reference it externally, cacheable, one request -->
<!-- symbols resolve as /path/to/sprite.svg#search -->
```

### 2. Reference a symbol

The class on the `<svg>` is the **component slot class** of wherever the icon sits. It
supplies size, colour and stroke, so the markup needs no `width`, `height` or styling:

```html
<div class="va-text-field-box">
  <svg class="va-text-field-icon" aria-hidden="true"><use href="#search" /></svg>
  <input class="va-text-field-input" type="text" />
</div>
```

The slot classes are `.va-text-field-icon`, `.va-action-icon`, `.va-toast-icon` and
`.va-text-selector-icon`. For an icon-only control, the class goes on the `<button>`
instead and the inner `<svg>` takes none:

```html
<button class="va-icon-button va-icon-button-subtle" aria-label="Dismiss">
  <svg aria-hidden="true"><use href="#x" /></svg>
</button>
```

### 3. Standalone icons

Outside a slot, size with `va:size-3.5` / `va:size-4` / `va:size-4.5` / `va:size-5` /
`va:size-8.5` (14, 16, 18, 20, 34px — that is the entire scale) and colour with any
`va:text-*` token utility. The stroke/fill paint block has **no utility yet**, so a bare
`<svg>` outside a slot needs that CSS written by hand. Prefer a slot class.

## Icon library

| set | count | naming |
| --- | --- | --- |
| Lucide | 2,034 | upstream name unchanged — `search`, `user`, `file-text` |
| Custom | 2 | prefixed `custom-` — `custom-help`, `custom-valiify-logo` |

`src/icons/icon-list.txt` lists every available symbol name.

## Framework wrappers

A wrapper is fine as long as the class it receives is a real one — the sprite reference
is the only part the wrapper owns.

### React / JSX

```jsx
function Icon({ name, className = "" }) {
  return (
    <svg className={className} aria-hidden="true">
      <use href={`#${name}`} />
    </svg>
  );
}

// the caller passes the slot class
<Icon name="search" className="va-text-field-icon" />
```

### Vue

```vue
<template>
  <svg :class="slotClass" aria-hidden="true">
    <use :href="`#${name}`" />
  </svg>
</template>

<script>
export default {
  props: {
    name: { type: String, required: true },
    slotClass: { type: String, required: true },
  },
};
</script>
```

## Accessibility

| case | markup |
| --- | --- |
| Decorative (an adjacent text label carries the meaning) | `aria-hidden="true"` on the `<svg>` |
| Icon-only control | `aria-label` on the **button**; `aria-hidden="true"` on the `<svg>` |
| The icon itself carries meaning | `role="img"` plus a `<title>` child |

```html
<button class="va-icon-button" aria-label="Close dialog">
  <svg aria-hidden="true"><use href="#x" /></svg>
</button>

<svg class="va-action-icon" role="img"><title>Verified</title><use href="#check-circle" /></svg>
```

## Adding a custom icon

```sh
cp my-glyph.svg src/icons/custom/   # 24×24 viewBox, stroke-based, no fill
npm run build:icons                 # regenerates sprite.svg
```

It becomes `#custom-my-glyph`. The sprite carries no build timestamp and is a pure
function of its sources, so rebuilding without an icon change produces no diff.

## Build

```sh
npm run build:icons   # sprite only
npm run build         # full build, includes the sprite
```

## File structure

```
src/icons/
├── README.md         # this file
├── sprite.svg        # generated — do not hand-edit
├── icon-list.txt     # every symbol name
└── custom/
    ├── help.svg
    └── valiify-logo.svg
```

## Distribution

The sprite ships with the package:

```json
{ "exports": { "./icons/sprite.svg": "./src/icons/sprite.svg" } }
```

```js
import spriteUrl from "@valiify/shortapp-ui/icons/sprite.svg";
```

It is 505 KB raw and about 88 KB gzipped. Inline it when the icons are critical-path;
reference it externally when cacheability matters more.

## Updating Lucide

```sh
npm update lucide-static
npm run build:icons
```

Release notes: https://github.com/lucide-icons/lucide/releases

## License

- **Lucide**: ISC (https://lucide.dev/license)
- **Custom icons**: Valiify proprietary
