# Mapping — primary-contact (business · step 3 of 10)

Concept `02-concept/concept.v2.html`
(sha256 `b1cc6bb0a3788d8da2df74c914df56134b3d69b73b33299c546a10f8ac7d59be`, approved
2026-09-11T16:02:03Z). Every block in the concept is implemented; nothing else is.

Paths are package-relative. `+page.svelte` is
`src/routes/business/primary-contact/+page.svelte`.

| block | region | pattern | class(es) | file:line |
| --- | --- | --- | --- | --- |
| b01 | header | §10 `.header` — logo slot + `.text-selector` (desktop / mobile label) | `header` · `header-logo` · `header-desktop` · `header-mobile` · `text-selector` · `text-selector-icon` · `text-selector-label` · `text-selector-chevron` | `src/lib/components/StepHeader.svelte:11` |
| b02 | shell | §11 Page shell, canvas half — **the page root element** | `bg-surface-app-page` · `px-4` | `+page.svelte:95` |
| b13 | shell | §11 Page shell, body-column half | `py-4 flex flex-col gap-4 mx-auto md:w-140 md:py-12 md:gap-10` | `+page.svelte:96` |
| b03 | title-block | §11 Title block | `flex flex-col gap-2` · `type-eyebrow text-content-tertiary` · `text-primary-text` · `text-display text-content-primary` · `text-input text-content-secondary` | `src/lib/components/TitleBlock.svelte:11` |
| b04 | content | §4 form field stack | `flex flex-col gap-5` | `+page.svelte:104` |
| b05 | field-group | §11 Two-up fields (wrapper only) | `flex flex-col gap-5 md:flex-row md:gap-6` | `+page.svelte:105` |
| b06 | field-group | §10 `.text-field` (First name) | `text-field` · `text-field-title-row` · `text-field-title` · `text-field-box` · `text-field-input` · `text-field-hint` · `md:w-67` | `+page.svelte:107` → `src/lib/components/TextField.svelte:38` |
| b07 | field-group | §10 `.text-field` (Last name) | same as b06, incl. `md:w-67` | `+page.svelte:118` → `src/lib/components/TextField.svelte:38` |
| b08 | field-group | §10 `.text-field` (Job title) | same as b06, no width class | `+page.svelte:131` → `src/lib/components/TextField.svelte:38` |
| b09 | field-group | §10 `.text-field` (Email address, `type="email"`) | same as b08 | `+page.svelte:142` → `src/lib/components/TextField.svelte:38` |
| b10 | field-group | §10 `.text-field` (Mobile phone, `type="tel"`, format placeholder) | same as b08 | `+page.svelte:154` → `src/lib/components/TextField.svelte:38` |
| b11 | button-row | §11 Button row (web), in flow | `hidden md:flex gap-6` · `btn btn-secondary` · `btn btn-primary flex-1` | `src/lib/components/StepButtonRow.svelte:17` |
| b12 | mobile-footer | §11 Mobile footer (interim) — §12 planned component | `h-19 py-3.5 px-4 flex gap-5 bg-surface-paper border-t border-stroke-divider sticky bottom-0 z-40 md:hidden` · `btn btn-secondary` · `btn btn-primary flex-1` | `src/lib/components/MobileActionBar.svelte:16` |

## b02 is the page root (critique F11, carried per 04-approval.md decision 3)

b02 — the `bg-surface-app-page` canvas — **is the page's root element**, not a section inside
one. The header (b01) is its sibling, and the two together are everything the route renders.
This is the naming fix the reviewer carried into the build: it is a label, **not** a height
class, and nothing about what renders changed. Two consequences the dev team owns, both in
HANDOFF §12: the canvas is content-height (a short viewport can leave the area below it
unpainted), and §11's "`.header` as a direct child of the scroll container" clause needs the
document to be the scroll container for the sticky header to stick.

## Two bags, one artifact

The concept declares a class bag per viewport (`<main data-viewport="web">` and
`="mobile">`). The package is one responsive artifact, so the bags are merged mobile-first
over the methodology's single breakpoint (`md`, 768 — §1.2). The merged spellings live in the
provenance comment at the top of `+page.svelte`; the one that is not a pure `md:` prefix
(b13's 16px mobile gutter, moved to b02 as `px-4`) is recorded as deviation D1 in HANDOFF §7.

`focus-ring` is listed in the concept on every interactive block and is not written in the
markup: the library applies it inside each component's own CSS on `:focus-visible` (§10),
exactly as the concept's Unsure section anticipated. `sticky top-0 z-40` on b01 likewise comes
from the library's own `.header` rules (§1.1, "by library contract").
