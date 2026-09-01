# Quick Reference Card

**One-page reference for common tasks.**

## Installation (Vite)

```bash
npm install @valiify/dashboard-ui tailwindcss @tailwindcss/vite
```

**vite.config.js:**
```js
import tailwindcss from "@tailwindcss/vite";
export default { plugins: [tailwindcss()] };
```

**styles.css:**
```css
@import "tailwindcss";
@import "@valiify/dashboard-ui/source";
```

**main.js:**
```js
import "./styles.css";

// Load sprite
import spriteUrl from "@valiify/dashboard-ui/icons/sprite.svg?url";
fetch(spriteUrl).then(r => r.text()).then(svg => {
  const host = document.createElement("div");
  host.style.display = "none";
  host.innerHTML = svg;
  document.body.prepend(host);
});
```

## Common Components

**Button:**
```html
<button class="btn btn-primary">Save</button>
<button class="btn btn-outline btn-sm">Cancel</button>
```

**Input:**
```html
<div class="input-container">
  <div class="input-field">
    <input type="text" class="input" placeholder="Enter text..." />
  </div>
</div>
```

**Alert:**
```html
<div class="alert alert-warning" role="alert">
  <div class="alert-body">
    <svg class="alert-icon icon icon-size-18" aria-hidden="true">
      <use href="#info" />
    </svg>
    <div class="alert-content">
      <p class="alert-title">Warning</p>
      <p class="alert-message">Message here</p>
    </div>
  </div>
</div>
```

**Chip:**
```html
<span class="chip chip-success">
  <span class="chip-dot"></span>
  <span>Approved</span>
</span>
```

## Dropdown (Minimal JS)

```html
<div class="dropdown">
  <button
    id="trigger"
    class="dropdown-field"
    aria-haspopup="listbox"
    aria-expanded="false"
  >
    <span class="dropdown-field-placeholder">Select...</span>
    <svg class="dropdown-field-chevron icon icon-size-14" aria-hidden="true">
      <use href="#chevron-down" />
    </svg>
  </button>
  <div id="panel" class="dropdown-panel" hidden>
    <div class="dropdown-menu" role="listbox">
      <button class="menu-item" role="option" data-value="1">
        <span class="menu-item-text">
          <span class="menu-item-title">Option 1</span>
        </span>
      </button>
    </div>
  </div>
</div>

<script>
const trigger = document.getElementById("trigger");
const panel = document.getElementById("panel");

trigger.addEventListener("click", () => {
  const isOpen = trigger.getAttribute("aria-expanded") === "true";
  trigger.setAttribute("aria-expanded", !isOpen);
  panel.hidden = isOpen;
});

document.addEventListener("click", (e) => {
  if (!trigger.contains(e.target) && !panel.contains(e.target)) {
    trigger.setAttribute("aria-expanded", "false");
    panel.hidden = true;
  }
});
</script>
```

## Token Utilities

**Only with `/source` entry:**

```html
<div class="bg-approved text-content-contrast rounded-control">
  Approved background
</div>

<p class="text-content-secondary type-label-l">
  UPPERCASE LABEL
</p>

<div class="shadow-panel rounded-surface">
  Card with shadow
</div>
```

## Troubleshooting

**No styles:**
1. Install `@tailwindcss/vite` (or postcss/webpack)
2. Register in config
3. Import from CSS, not JS

**No icons:**
- Add sprite loading code (see Installation above)

**No utilities:**
- Use `@import "@valiify/dashboard-ui/source"` not `@import "@valiify/dashboard-ui"`

**Component broken:**
- Check [COMPONENTS.md](COMPONENTS.md) for required wrapper elements

## Links

- [Complete Installation](GETTING_STARTED.md)
- [All Components](COMPONENTS.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [Examples](examples/)
