# Structure — 2026-08-28-basic-signin

Source: **screenshot** (`00-input/design@2x.png`, 2560×1600 px, exactly 2x of a
1280×800 frame). No Figma URL — every `componentKey` below is `null` because a
screenshot carries no component identity; geometry was measured by pixel-edge
scanning at 2x and is stated in 1x frame coordinates (±1px). Component names
describe what each element *visually is*; the component-matching stage maps
them to the library.

Section crops are in `exports/sections/` (all cropped from the 2x image).

---

## Region 1 — Viewport background

Full-bleed `#f0f3f7` fill, 1280×800. Nothing else on the page outside the card
and the corner button.

## Region 2 — Sign-in card (`exports/sections/01-card.png`)

White card, **x 440, y 222, w 400, h 356**, perfectly centered both axes
(center = 640, 400). 1px hairline border (measured `#ededee` over white),
corner radius ≈6px, **no drop shadow**. Content padding ≈16px (19px bottom).

### 2a. Card header (`02-card-header.png`)

| Instance | What it is | Geometry (1x) | Style (measured/est.) | componentKey |
| --- | --- | --- | --- | --- |
| Title | text "Welcome Back" | x 457.5, y 239.5, ink 170.5×17.5 | ~24px / 700, `#16161a` | null (screenshot) |
| Subtitle | text "Sign in to your Valiify Dashboard account." | x 458, y 271, ink 254.5×12.5 | ~13px / 400, `#5b5b68` | null (screenshot) |

### 2b. Form fields (`03-form-fields.png`)

| Instance | What it is | Geometry (1x) | Style (measured/est.) | componentKey |
| --- | --- | --- | --- | --- |
| Email field | label "Email" + prefilled value "user@valiify.com" | label x 458, y 315.5; value x 458, y 343 | label ~14px/600 `#16161a`; value ~13px/400 `#16161a` | null (screenshot) |
| Password field | label "Password" + placeholder "Enter your password" | label x 458, y 380.5; placeholder x 458, y 408.5 | label ~14px/600 `#16161a`; placeholder ~13px/400 `#727280` | null (screenshot) |

> **The inputs have no visible chrome.** A light-structure scan over the whole
> card (every pixel with luminance 180–249) found **no border, background box,
> or underline** around either field — the fields render as bare label + text.
> Either the source render used unstyled/borderless inputs or the design
> intends invisible fields; the matching stage should treat the field *chrome*
> as unspecified rather than absent-by-design.

### 2c. Remember-me row (`03-form-fields.png`)

| Instance | What it is | Geometry (1x) | Style (measured/est.) | componentKey |
| --- | --- | --- | --- | --- |
| Checkbox row | unchecked checkbox + label "Remember me" | box x 457, y 443, 16×16; label x 482.5 (gap 9.5), vertically centered on box | box: white fill, 1px `#767676` border, r≈3; label ~13.5px/400 `#5b5b68` | null (screenshot) |

> The `#767676` border is Chromium's **default form-control color** — this
> reads as a *native unstyled checkbox* in the source render, not a designed
> control. 16×16 is also larger than the library's 15px checkbox/radio.

### 2d. Actions row (`04-actions.png`)

| Instance | What it is | Geometry (1x) | Style (measured/est.) | componentKey |
| --- | --- | --- | --- | --- |
| Primary button | filled button "Sign In" | x 457, y 485, **291×28**, r≈5.5 | fill `#1e4d8c`, label ~13px/600 `#ffffff`, centered | null (screenshot) |
| Outline button | bordered button "Cancel" | x 756, y 485, **67×28**, r≈6 | white fill, 1px `#ededee` border, label ~13px/500 `#16161a` | null (screenshot) |

Row spans the full 366px content width: Sign In (291) + 8px gap + Cancel (67)
— the primary button takes the remaining width, Cancel hugs its label.

### 2e. Forgot-password link (`04-actions.png`)

| Instance | What it is | Geometry (1x) | Style (measured/est.) | componentKey |
| --- | --- | --- | --- | --- |
| Text link | "Forgot password?" | x 582, y 544.5, ink 116×13.5; centered in card (center x = 640) | ~14px/500, `#1e4d8c`, **no underline at rest** | null (screenshot) |

## Region 3 — Fixed utility corner (`05-view-demo.png`)

| Instance | What it is | Geometry (1x) | Style (measured/est.) | componentKey |
| --- | --- | --- | --- | --- |
| Small outline button | "View Demo Info", pinned bottom-right of viewport | x 1152, y 756, **108×24**, inset ~20px from right & bottom, r≈4.5 | transparent fill (interior = page bg `#f0f3f7`), 1px border (measured `#dfe2e7`), label ~12.5px/500 `#16161a` | null (screenshot) |

---

## Color observations (measurements, not extracted variables)

Sampled hex values coincide **exactly** with Valiify library token values —
strong evidence the source render already used the library palette:

| Measured | Where | Coincides with library token |
| --- | --- | --- |
| `#f0f3f7` | page background | `Surface/Frame` |
| `#ffffff` | card, cancel fill | `Surface/Paper` |
| `#1e4d8c` | primary button fill, link | `Primary/Main` |
| `#16161a` | title, labels, values, button text | `Content/Primary` |
| `#5b5b68` | subtitle, remember-me label | `Content/Secondary` / `Secondary/Main` |
| `#727280` | password placeholder | `Content/Tertiary` |
| `#ededee` / `#dfe2e7` | hairlines over white / over `#f0f3f7` | both composite from `rgba(20,20,40,0.08)` = `Stroke/Divider` |

The one off-palette value is the checkbox border `#767676` (native control).
Button heights (28px main pair, 24px corner button) equal the library's `.btn`
md and `.btn-sm` heights.

## Behaviors

None extractable from a screenshot — see `behaviors.json` (explicit
`reactions: []` per interactive-looking node). The writeup describes intended
alert behaviors for Sign In / Cancel / View Demo Info; those are requirements,
not source data.
