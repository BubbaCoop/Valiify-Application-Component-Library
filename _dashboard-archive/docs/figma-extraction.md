# Figma Design Token Extraction Workflow

**Status**: Done. Tokens were extracted and the pipeline is live — this
document is the reference for re-running it when Figma changes, not a plan.

The generated theme is `src/themes/valiify.css`, produced from
`tokens/figma-tokens.json` by `npm run build:theme`. **Edit the JSON, never the
CSS.** To build a *component*, see [component-process.md](component-process.md)
— this file is only about tokens.

This document outlines the process for extracting design tokens from Figma and implementing them in the component library.

## Prerequisites

Before beginning extraction:

- [ ] Figma designs finalized and reviewed by design team
- [ ] Code Connect access configured
- [ ] Figma MCP tool available in Claude Code
- [ ] Commercial-Designs file (key: FdcEV83HPv44bzLPAQU1hR) ready

> **Audit with `search_design_system`, not `get_variable_defs`.**
> `get_variable_defs` only returns variables *applied to a layer*. A token that
> exists in Figma but is unused anywhere comes back absent. That is exactly how
> `Surface/Card` (`#fafafb`) stayed missing long enough for CLAUDE.md to assert
> the surface stack had three levels when it had four.

## Process Overview

### Phase 1: Extract Design Tokens

Use Figma MCP tool to extract all design variables from the finalized Figma file:

```bash
claude --skill figma:figma-use "Extract all design tokens from Commercial-Designs"
```

Current output — `npm run build:theme` prints this, so it is self-verifying:

> 39 colors, 5 radii, 3 border widths, 37 text styles, 6 label utilities and 2 effects

By category:

- Color/Content (5 tokens)
- Color/Surface (4 tokens)
- Color/Stroke (3 tokens)
- Color/Action (4 tokens)
- Color/Brand & Neutral (11 tokens)
- Color/Status (11 tokens)
- Numbers (4 tokens)
- Typography (18 tokens)
- Effects (1 token)

### Phase 2: Map Tokens to CSS Custom Properties

For each extracted token:

1. **Colors** → Convert to OKLch notation
   - Figma hex → OKLch converter
   - Maintain alpha channel for overlay/soft variants
   - Example: `#1e4d8c` → `oklch(0.45 0.15 250)`

2. **Spacing/Numbers** → Convert to pixel values

   Radii are named by role in code, not by the Figma t-shirt size. Map them:

   | Figma   | Code token               | Used for              |
   | ------- | ------------------------ | --------------------- |
   | Thin    | `--border-thin` (0.5px)  | hairline borders      |
   | SM      | `--radius-control` (6px) | buttons, inputs       |
   | MD      | `--radius-surface` (8px) | cards, panels         |
   | Rounded | `--radius-pill` (9999px) | badges, tags, avatars |

   Do **not** name these `--radius-sm` / `--radius-md`. Tailwind v4 ships tokens
   by those names, and redefining them silently changes what `rounded-sm` and
   `rounded-md` mean for consumers.

3. **Typography** → Map font specs
   - Family: Inter (UI), JetBrains Mono (data)
   - Weight: 400 (Regular), 500 (Medium), 600 (SemiBold)
   - Size/line-height pairs
   - Letter-spacing where applicable

### Phase 3: Update Theme Files

Replace placeholder values in `src/themes/valiify.css`. Change only the values —
the token **names** are the contract every component is authored against, so
renaming one means updating each component that uses it.

Tokens live in a Tailwind `@theme` block (not a `[data-theme]` selector), which
is what makes each one generate utilities like `bg-primary` and `rounded-control`:

```css
@theme {
  /* Replace the value, keep the name */
  --color-primary: oklch(0.45 0.15 250); /* real value from Figma */
}
```

After updating, run `npm run build` and confirm the tokens landed:

```bash
grep -- '--color-primary:' dist/index.css
```

**Checklist**:

- [x] All tokens mapped
- [ ] Color values in OKLch format
- [ ] Typography specs complete (Inter + JetBrains Mono)
- [ ] Spacing values confirmed
- [ ] Effects/shadows documented

### Phase 4: Verify Against Figma

For each component:

1. **Visual Comparison**
   - Render component in Storybook
   - Compare side-by-side with Figma
   - Check: colors, spacing, typography, borders, shadows

2. **Measure Values**
   - Use browser dev tools to inspect
   - Compare computed values to Figma specs
   - Document any intentional differences

3. **Test States**
   - Hover, focus, active, disabled
   - Ensure interaction states match design

### Phase 5: Set Up Code Connect

Map each component to its Figma counterpart:

```bash
claude --skill figma:figma-code-connect
```

For each component:

1. Identify Figma component node ID
2. Map to code implementation path
3. Document variant mappings
4. Add usage examples

**Example mapping**:

```json
{
  "figmaNode": "73:174",
  "component": "Button",
  "file": "src/components/button.css",
  "variants": {
    "variant": ["default", "primary", "outline"],
    "size": ["sm", "md", "lg"]
  }
}
```

## Token Categories (Expected from Figma)

### Color - Content (ink/text)

| Token               | Expected         |
| ------------------- | ---------------- |
| `Content/Primary`   | Dark text color  |
| `Content/Secondary` | Medium gray text |
| `Content/Tertiary`  | Light gray text  |
| `Content/Faint`     | Very light gray  |
| `Content/Contrast`  | White (on dark)  |

### Color - Surface (backgrounds)

| Token             | Expected        |
| ----------------- | --------------- |
| `Surface/Frame`   | App background  |
| `Surface/Neutral` | Neutral zones   |
| `Surface/Card`    | Card background |
| `Surface/Paper`   | Foreground      |

### Color - Stroke

| Token             | Expected        |
| ----------------- | --------------- |
| `Stroke/Divider`  | Light border    |
| `Stroke/Border`   | Standard border |
| `Stroke/Disabled` | Disabled border |

### Color - Action (interaction states)

| Token             | Expected       |
| ----------------- | -------------- |
| `Action/Subtle`   | Resting fill   |
| `Action/Hover`    | Hover state    |
| `Action/Selected` | Selected state |
| `Action/Focused`  | Focus state    |

### Color - Status

| Token             | Expected           |
| ----------------- | ------------------ |
| `Approved/Main`   | Success color      |
| `Approved/Soft`   | Success background |
| `Approved/Strong` | Success emphasis   |
| `Critical/Main`   | Error color        |
| `Critical/Soft`   | Error background   |
| `Critical/Strong` | Error emphasis     |
| `Warning/Main`    | Warning color      |
| `Warning/Soft`    | Warning background |
| `Warning/Strong`  | Warning emphasis   |
| `Info/Main`       | Info color         |
| `Info/Strong`     | Info emphasis      |

### Numbers (spacing/radius)

| Token             | Expected            |
| ----------------- | ------------------- |
| `Numbers/Thin`    | 0.5px border        |
| `Numbers/SM`      | 6px radius          |
| `Numbers/MD`      | 8px radius          |
| `Numbers/Rounded` | 9999px (full round) |

### Typography


## Validation Checklist

Before marking extraction complete:

- [x] All tokens extracted from Figma
- [ ] All colors converted to OKLch
- [ ] Typography specs match (Inter + JetBrains Mono)
- [ ] Spacing values confirmed in pixels
- [ ] Code Connect mappings created for all components
- [ ] Visual comparison passed for each component
- [ ] Interaction states verified
- [ ] Documentation updated (CLAUDE.md, README.md)
- [ ] Storybook examples match Figma designs

## Post-Extraction Tasks

1. **Update Documentation**
   - Update CLAUDE.md with real token values
   - Remove "placeholder" warnings
   - Add token reference tables

2. **Component Implementation**
   - Build remaining components (20+ total)
   - Follow per-component workflow (see docs/component-roadmap.md)
   - Test each component against Figma

3. **Quality Assurance**
   - Run accessibility tests (WCAG AA)
   - Test in multiple browsers
   - Verify theme switching works
   - Check responsive behavior

## Tools & Resources

- **Figma File**: Commercial-Designs (FdcEV83HPv44bzLPAQU1hR)
- **OKLch Converter**: https://oklch.com
- **Claude Skills**: `figma:figma-use`, `figma:figma-code-connect`

## Notes

- Design tokens are the source of truth - code follows design
- OKLch provides perceptually uniform colors across themes
- Inter and JetBrains Mono are required fonts
- All measurements in pixels unless specified
- Alpha channels preserved for overlay colors
