# Icon System Integration Guide

Complete guide for using icons consistently across the Valiify Short App UI.

## Overview

The icon system has three parts that work together:

1. **Icon Sprite** (`src/icons/sprite.svg`) - 2,035 icons (Lucide + custom)
2. **Icon Component** (`icon.css`) - 11 standardized sizes + ring state
3. **Usage Pattern** - How to use icons in components

## The Three-Part System

### 1. Icon Sprite (SVG Library)

All icons live in one optimized SVG sprite file:

```
src/icons/
├── sprite.svg          # Generated sprite (2035 icons)
├── icon-list.txt       # Searchable names
└── custom/             # Your custom icons
    └── valiify-logo.svg
```

**Build command**: `npm run build:icons`

### 2. Icon Component (Size Container)

CSS classes that enforce consistent sizing:

```css
.icon                 /* Base: 16×16px (default) */
.icon-size-10         /* 10×10px */
.icon-size-11         /* 11×11px */
.icon-size-12         /* 12×12px */
.icon-size-13         /* 13×13px */
.icon-size-14         /* 14×14px */
.icon-size-15         /* 15×15px */
.icon-size-16         /* 16×16px ⭐ Common */
.icon-size-18         /* 18×18px */
.icon-size-20         /* 20×20px ⭐ Common */
.icon-size-22         /* 22×22px */
.icon-size-24         /* 24×24px ⭐ Common */
.icon-ring            /* Adds circular border (selected/active) */
```

### 3. Usage Pattern (The Standard)

**Every icon in the system uses this exact pattern:**

```html
<svg class="icon icon-size-20" aria-hidden="true">
  <use href="#icon-name" />
</svg>
```

## Icon Sizing Standards

### Recommended Sizes by Context

| Context | Size | Class | Use Case |
|---------|------|-------|----------|
| **Micro** | 12px | `icon-size-12` | Inline text indicators, badges |
| **Small** | 13px | `icon-size-13` | Small buttons (24px) |
| **Medium** | 14px | `icon-size-14` | ⭐ **Default buttons (28px)** |
| **Large** | 15px | `icon-size-15` | Large buttons (32px) |
| **XL** | 20-24px | `icon-size-20/24` | Headers, hero elements |
| **Custom** | varies | `icon-size-*` | Special cases |

### Component-Specific Sizing

| Component | Recommended Size | Example |
|-----------|------------------|---------|
| **Button (small)** | 13px | `icon-size-13` |
| **Button (medium)** | 14px | `icon-size-14` |
| **Button (large)** | 15px | `icon-size-15` |
| **Chip/Badge** | 12-14px | `icon-size-12` or `icon-size-14` |
| **Input** | 16px | `icon-size-16` |
| **Navigation** | 20-24px | `icon-size-20` or `icon-size-24` |
| **Status indicators** | 12-16px | `icon-size-12` to `icon-size-16` |

## Complete Usage Examples

### Basic Icon
```html
<!-- Standalone icon -->
<svg class="icon icon-size-20" aria-hidden="true">
  <use href="#search" />
</svg>
```

### Icon in Button
```html
<!-- Icon with text label -->
<button class="btn btn-primary">
  <svg class="icon icon-size-14" aria-hidden="true">
    <use href="#save" />
  </svg>
  Save Changes
</button>

<!-- Icon-only button (requires aria-label) -->
<button class="btn btn-outline" aria-label="Close">
  <svg class="icon icon-size-13" aria-hidden="true">
    <use href="#x" />
  </svg>
</button>
```

### Icon with Ring State (Selected)
```html
<!-- Active/selected icon with circular border -->
<svg class="icon icon-size-20 icon-ring" role="img" aria-label="Selected">
  <use href="#check" />
</svg>
```

### Icon with Status Color
```html
<!-- Success icon -->
<svg class="icon icon-size-16 text-approved" aria-hidden="true">
  <use href="#check-circle" />
</svg>

<!-- Error icon -->
<svg class="icon icon-size-16 text-critical" aria-hidden="true">
  <use href="#x-circle" />
</svg>

<!-- Warning icon -->
<svg class="icon icon-size-16 text-warning" aria-hidden="true">
  <use href="#alert-circle" />
</svg>
```

### Custom Icon
```html
<!-- Custom icons are prefixed with 'custom-' -->
<svg class="icon icon-size-24" aria-hidden="true">
  <use href="#custom-valiify-logo" />
</svg>
```

## Component Integration Patterns

### Button Component

**Standard pattern for buttons:**

```html
<!-- Small button (13px icons) -->
<button class="btn btn-outline btn-sm">
  <svg class="icon icon-size-13" aria-hidden="true">
    <use href="#filter" />
  </svg>
  Filter
</button>

<!-- Medium button (14px icons) - DEFAULT -->
<button class="btn btn-primary">
  <svg class="icon icon-size-14" aria-hidden="true">
    <use href="#save" />
  </svg>
  Save
</button>

<!-- Large button (15px icons) -->
<button class="btn btn-primary btn-lg">
  <svg class="icon icon-size-15" aria-hidden="true">
    <use href="#download" />
  </svg>
  Download
</button>
```

### Input Component

```html
<!-- Input with leading icon -->
<div class="input-wrapper">
  <svg class="icon icon-size-16" aria-hidden="true">
    <use href="#search" />
  </svg>
  <input type="text" class="input" placeholder="Search..." />
</div>
```

### Chip Component

```html
<!-- Chip with status icon -->
<span class="chip chip-success">
  <svg class="icon icon-size-12" aria-hidden="true">
    <use href="#check" />
  </svg>
  <span class="chip-text">Approved</span>
</span>
```

## Accessibility Patterns

### Decorative Icons (Most Common)
Icons that accompany text labels:

```html
<button>
  <svg class="icon icon-size-20" aria-hidden="true">
    <use href="#save" />
  </svg>
  Save
</button>
```

**Rule**: Add `aria-hidden="true"` when icon is decorative.

### Standalone Icons
Icon-only buttons or links:

```html
<button aria-label="Close dialog">
  <svg class="icon icon-size-20" aria-hidden="true">
    <use href="#x" />
  </svg>
</button>
```

**Rule**: `aria-label` on the button/link, `aria-hidden="true"` on the icon.

### Meaningful Icons
Icons that convey information:

```html
<div class="status">
  <svg class="icon icon-size-16 text-approved" role="img" aria-label="Verified">
    <use href="#check-circle" />
  </svg>
  <span>Account verified</span>
</div>
```

**Rule**: Use `role="img"` and `aria-label` on the icon itself.

## Color and Theming

Icons use `currentColor` by default, inheriting the text color:

```css
/* Icon inherits button text color */
.btn-primary {
  color: var(--color-content-contrast);
}
.btn-primary .icon {
  stroke: currentColor; /* Inherits white color */
}

/* Override icon color independently */
.icon-success {
  color: var(--color-approved);
}
.icon-error {
  color: var(--color-critical);
}
```

## Icon Naming Conventions

### Lucide Icons
Use the original Lucide icon name:

```html
<use href="#search" />          <!-- ✅ Correct -->
<use href="#lucide-search" />   <!-- ❌ Wrong -->
```

Browse all names: https://lucide.dev/icons/

### Custom Icons
Prefix with `custom-`:

```html
<use href="#custom-valiify-logo" />     <!-- ✅ Correct -->
<use href="#valiify-logo" />            <!-- ❌ Wrong -->
```

## Common Mistakes to Avoid

### ❌ Wrong: Mixing size approaches
```html
<!-- Don't set width/height directly on icon class -->
<svg class="icon" width="20" height="20">
  <use href="#search" />
</svg>
```

### ✅ Right: Use size classes
```html
<svg class="icon icon-size-20" aria-hidden="true">
  <use href="#search" />
</svg>
```

### ❌ Wrong: Hardcoded icon sizing
```html
<button style="font-size: 20px;">
  <svg width="20" height="20">...</svg>
</button>
```

### ✅ Right: Standard icon component
```html
<button class="btn">
  <svg class="icon icon-size-20" aria-hidden="true">
    <use href="#save" />
  </svg>
</button>
```

### ❌ Wrong: Missing accessibility
```html
<!-- Icon-only button without label -->
<button class="btn">
  <svg class="icon icon-size-20">
    <use href="#x" />
  </svg>
</button>
```

### ✅ Right: Proper accessibility
```html
<button class="btn" aria-label="Close">
  <svg class="icon icon-size-20" aria-hidden="true">
    <use href="#x" />
  </svg>
</button>
```

## Adding New Icons

### 1. Add to Custom Icons
```bash
# Drop your SVG in custom directory
cp my-icon.svg src/icons/custom/

# Rebuild sprite
npm run build:icons
```

### 2. Use in Components
```html
<!-- Custom icons are automatically prefixed with 'custom-' -->
<svg class="icon icon-size-20" aria-hidden="true">
  <use href="#custom-my-icon" />
</svg>
```

### 3. Document Usage
Add to component documentation if it's a commonly-used custom icon.

## Quick Reference

### Icon Sizes
```
10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24
```

### Most Common Sizes
```
16px - Small UI elements
20px - Default buttons
24px - Large buttons, headers
```

### Standard Pattern
```html
<svg class="icon icon-size-{SIZE}" aria-hidden="true">
  <use href="#{ICON-NAME}" />
</svg>
```

### With Status Color
```html
<svg class="icon icon-size-16 text-{STATUS}">
  <use href="#icon-name" />
</svg>
```

### With Ring State
```html
<svg class="icon icon-size-20 icon-ring">
  <use href="#icon-name" />
</svg>
```

## Files Reference

- **Icon component CSS**: `src/components/icon.css`
- **Icon sprite**: `src/icons/sprite.svg`
- **Icon list**: `src/icons/icon-list.txt`
- **Custom icons**: `src/icons/custom/*.svg`
- **Icon README**: `src/icons/README.md`
- **Build script**: `scripts/build-sprite.mjs`
- **Storybook showcase**: `stories/foundations/Icons.stories.ts`
- **Component showcase**: `stories/components/Icon.stories.ts`

## Summary

✅ **DO**:
- Use `icon icon-size-*` classes for all icons
- Use sprite system (`<use href="#icon-name" />`)
- Add `aria-hidden="true"` for decorative icons
- Use standard sizes (16, 20, 24 most common)
- Let icons inherit color via `currentColor`

❌ **DON'T**:
- Hardcode icon dimensions
- Mix sizing approaches
- Forget accessibility attributes
- Create one-off icon sizing
- Import icon files individually

---

**Questions?** See `src/icons/README.md` for sprite system details or `stories/components/Icon.stories.ts` for visual examples.
