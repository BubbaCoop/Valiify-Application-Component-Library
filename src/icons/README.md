# Valiify Short App Icons

Complete icon system with 2,034 Lucide icons + custom icons, delivered as an optimized SVG sprite.

## Quick Start

### 1. Include the sprite

Load the sprite once in your HTML (typically in `<head>` or at the start of `<body>`):

```html
<!-- Option A: Inline (best for performance) -->
<div style="display: none;">
  <?php include 'path/to/sprite.svg'; ?>
</div>

<!-- Option B: External reference -->
<!-- Icons will reference: /path/to/sprite.svg#icon-name -->
```

### 2. Use an icon

```html
<!-- Basic usage -->
<svg class="icon" width="24" height="24">
  <use href="#search" />
</svg>

<!-- With currentColor (inherits text color) -->
<svg class="icon" width="20" height="20" aria-hidden="true">
  <use href="#check" />
</svg>

<!-- Custom icon (prefixed with 'custom-') -->
<svg class="icon" width="24" height="24">
  <use href="#custom-valiify-logo" />
</svg>
```

### 3. Style with CSS

Icons use `currentColor` by default and scale to their container:

```css
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  stroke-width: 2;
  fill: none;
  stroke: currentColor;
}

/* Status icon colors */
.icon-success { color: var(--color-approved); }
.icon-error { color: var(--color-critical); }
.icon-warning { color: var(--color-warning); }

/* Sizes */
.icon-sm { width: 16px; height: 16px; }
.icon-md { width: 20px; height: 20px; }
.icon-lg { width: 24px; height: 24px; }
.icon-xl { width: 32px; height: 32px; }
```

## Icon Library

### Lucide Icons (2,034 icons)

All Lucide icons are available with their original names. Browse the full list:
- **Online**: https://lucide.dev/icons/
- **Local**: See `icon-list.txt` for all available names

Popular icons:
- **UI Actions**: `search`, `filter`, `settings`, `menu`, `more-horizontal`, `more-vertical`
- **Navigation**: `arrow-left`, `arrow-right`, `chevron-down`, `chevron-up`, `x`, `check`
- **File/Data**: `file`, `folder`, `download`, `upload`, `save`, `trash-2`, `edit-3`
- **Status**: `check-circle`, `x-circle`, `alert-circle`, `info`, `help-circle`
- **User**: `user`, `users`, `user-plus`, `log-in`, `log-out`

### Custom Icons

Custom icons are prefixed with `custom-` to avoid naming conflicts.

**Current custom icons:**
- `custom-valiify-logo` - Valiify brand logo

## Adding Custom Icons

1. **Create your SVG file** in `src/icons/custom/`:
   ```bash
   # Example: adding a custom status icon
   touch src/icons/custom/status-verified.svg
   ```

2. **Format requirements**:
   - 24×24 viewBox (or specify custom viewBox)
   - Use `currentColor` for stroke/fill to inherit text color
   - Clean, optimized SVG (remove editor metadata)
   - Meaningful filename (becomes icon ID)

   ```xml
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" 
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
     <path d="M9 11l3 3L22 4"/>
     <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
   </svg>
   ```

3. **Rebuild the sprite**:
   ```bash
   npm run build:icons
   ```

4. **Use your icon**:
   ```html
   <svg class="icon" width="24" height="24">
     <use href="#custom-status-verified" />
   </svg>
   ```

## Icon Component Example

For framework-specific usage, here's a reusable icon component pattern:

### React/JSX
```jsx
function Icon({ name, size = 24, className = '', ...props }) {
  return (
    <svg 
      className={`icon ${className}`} 
      width={size} 
      height={size}
      aria-hidden="true"
      {...props}
    >
      <use href={`#${name}`} />
    </svg>
  );
}

// Usage
<Icon name="search" size={20} className="text-primary" />
<Icon name="custom-valiify-logo" size={32} />
```

### Vue
```vue
<template>
  <svg 
    :class="['icon', className]" 
    :width="size" 
    :height="size"
    aria-hidden="true"
  >
    <use :href="`#${name}`" />
  </svg>
</template>

<script>
export default {
  props: {
    name: { type: String, required: true },
    size: { type: Number, default: 24 },
    className: { type: String, default: '' }
  }
}
</script>
```

### Vanilla HTML/CSS (Framework-agnostic)
```html
<!-- Just use SVG directly -->
<button class="btn btn-primary">
  <svg class="icon" width="20" height="20" aria-hidden="true">
    <use href="#search" />
  </svg>
  Search
</button>
```

## Accessibility

### Decorative icons (most common)
```html
<!-- Icon next to text label -->
<button>
  <svg class="icon" width="20" height="20" aria-hidden="true">
    <use href="#save" />
  </svg>
  Save Changes
</button>
```

### Standalone icons (icon-only buttons)
```html
<!-- Icon is the only label -->
<button aria-label="Close dialog">
  <svg class="icon" width="20" height="20" aria-hidden="true">
    <use href="#x" />
  </svg>
</button>
```

### Meaningful icons (convey information)
```html
<!-- Icon conveys status/information -->
<div class="status">
  <svg class="icon icon-success" width="16" height="16" role="img" aria-label="Verified">
    <use href="#check-circle" />
  </svg>
  <span>Account verified</span>
</div>
```

## Build & Development

```bash
# Generate sprite from Lucide + custom icons
npm run build:icons

# Full build (includes icons)
npm run build

# Watch for changes (CSS only - run build:icons manually for icon changes)
npm run dev
```

## File Structure

```
src/icons/
├── README.md           # This file
├── sprite.svg          # Generated sprite (2034+ icons)
├── icon-list.txt       # Searchable list of all icon names
└── custom/             # Your custom icons
    └── valiify-logo.svg
```

## Distribution

The icon sprite is included in the published package:

```json
{
  "exports": {
    "./icons/sprite.svg": "./src/icons/sprite.svg"
  }
}
```

Consumers can import it:
```js
import spriteUrl from '@valiify/shortapp-ui/icons/sprite.svg';
```

## Tips & Best Practices

### Icon Sizing
- Use design token sizes: 16px (sm), 20px (md), 24px (lg), 32px (xl)
- Icons scale with font-size when using `width: 1em; height: 1em;`
- Maintain consistent sizes within a component

### Performance
- **Inline the sprite** for zero network requests (best for critical icons)
- **External sprite** is cacheable but requires one request
- Sprite is ~300KB with 2034 icons (gzips well)

### Naming Conventions
- **Lucide icons**: Use original name (`search`, `user`, `file-text`)
- **Custom icons**: Prefix with `custom-` (`custom-valiify-logo`)
- **Variants**: Use descriptive suffixes (`custom-icon-filled`, `custom-icon-outline`)

### Stroke Width
- Lucide default: `stroke-width: 2`
- Adjust per icon if needed: `<svg style="stroke-width: 1.5;">`
- Maintain consistency within the same UI context

## Updating Lucide Icons

To get the latest Lucide icons:

```bash
# Update lucide-static package
npm update lucide-static

# Rebuild sprite
npm run build:icons
```

Check release notes: https://github.com/lucide-icons/lucide/releases

## License

- **Lucide Icons**: ISC License (https://lucide.dev/license)
- **Custom Icons**: Valiify proprietary (add your license)
