---
description: Help developers use the Valiify Short App UI component kit
---

# Valiify Short App UI Component Kit Skill

Use this skill when developers ask which Short App component to use, about
component class names and variants, theme customization, or integration
patterns.

**The component set is still being extracted from Figma** (fileKey
`PA5pr1Q8KLfbjTxdAbFm0V`). The authoritative, always-current reference is the
**Quick Reference section of CLAUDE.md** in the repo root — one section per
shipped component with class lists, state tables, traps, and copy-pasteable
HTML. Answer from there rather than from this file.

## Shipped so far

- **Radio** — `.radio` on a native `<input type="radio">`; 20×20 circle,
  1.5px inset-shadow ring, `Primary/Primary` when checked. No label of its
  own — compose label markup at the call site.

## Integration essentials

- CSS-only library; no Tailwind plugin, no `tailwind.config.js`.
- `@import "@valiify/shortapp-ui"` (prebuilt) or
  `@import "@valiify/shortapp-ui/source"` (adds token-generated utilities).
- Fonts are opt-in: `@import "@valiify/shortapp-ui/fonts";` as the FIRST line.
- Tokens generate utilities (`bg-primary`, `text-content-secondary`, …) —
  prefer them over hand-written `var()`.

> Update this file's "Shipped so far" list as components land, or better,
> keep answering from CLAUDE.md. The dashboard library's version of this
> skill (a full cheat-sheet) is at
> `valiify-dashboard-ui/.claude/skills/valiify-dashboard-ui/SKILL.md` as the
> eventual format to grow into.
