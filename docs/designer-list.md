# Designer List — open questions & authoring defects in the Short App Figma

Consolidated from the per-component extraction notes in CLAUDE.md (which stay
the canonical per-component record). Every item was found during extraction of
`Updated-Short-App` (PA5pr1Q8KLfbjTxdAbFm0V) and is reproduced faithfully in
the library until the design changes — nothing here blocks shipping, but the
**Systemic** items affect multiple components and are worth fixing at the
source.

_Last updated 2026-09-02 (21 components extracted)._

## Systemic — one Figma fix resolves several components

1. **The Error ramp is defined but applied nowhere.** Every field `Error=Yes`
   variant — Plain Text Field (515:5147/5159/5171) and Dropdown Field
   (521:5308/5318/5328) — binds `Warning/Base` (#b4791c amber), never
   `Error/*` (#c0362c). Settled with both variable reads and pixel samples.
   → Should field errors rebind to the Error ramp? The library ships amber
   verbatim and will follow the file.
2. **`bottomContent` rows have broken authored geometry** (absolute,
   `bottom: -19px`, `right: -313%`, width ~1706px on 413px parents) in
   Plain Text Field, Dropdown Field, Text Area Field, and RadioField. The
   library ships the hint in normal flow as a labeled correction. One
   upstream fix beats four local ones.
3. **Placeholder/stale glyph layer names** — helper icon-buttons everywhere
   nest a glyph named "ChevronLeft" (reads as a placeholder): RadioField,
   all three fields. Also: SelectCard's "ChevronLeft" renders a RIGHT
   chevron; OwnerContainer's "arrow-right" renders a pencil and its
   "ChevronLeft" renders a trash can. A rename pass would prevent every
   future extraction from re-flagging these.
4. **No disabled variant exists on any field** (TextField, DropdownField,
   TextArea, RadioField) — for an application form this is a launch-blocking
   gap; the library invents nothing (cursor-only `:disabled`).
   Radio/Switch/IconButton also model no disabled visual.
5. **Placeholder ink fails WCAG contrast**: `Text/Hint` #8e9195 on
   `BG/Paper` = 3.11:1 (needs 4.5:1). Flagged live by axe on DropdownField
   (real DOM text) and waived with documentation; TextField/TextArea share
   the identical ink inside native `::placeholder` where tools can't see it.
6. **Casing still unconfirmed** for Data Key, Tag & Pill, and the Lockup
   styles (Eyebrow, Button Label, Micro-Label are resolved: styled
   transforms). Confirm per component as they get used.
7. **Skeleton's written spec names a "Surface/Neutral" variable that does
   not exist** in the file's collection — the fill ships as raw #f1f1f4 via
   `--skeleton-fill`. Add the variable and the library will tokenize it.
8. **The `Field Label` type token (13/16/500) is used by nothing** — every
   field label binds `Labels, links & UI/Strong` (14/20/500) instead. Is
   Field Label for a future component, or a leftover?

## Per-component

### Button (1:218)
- Micro's hover and pressed are pixel-identical (0-diff measured).
- Primary's authored height math is 2px short of the 48px frame (13+13+20=46).
- `Primary/Focus` is the literal name of the PRESSED fill (wired to
  `:active`) — confusing name, same on Checkbox.

### Checkbox (1:424)
- Raw 3px radius sits on no Radius token.
- The check glyph's white is unbound (ships as `Text/Contrast` — confirm).

### Radio (1:419)
- Disabled swaps the cursor only — a disabled radio renders identical to an
  enabled one.
- Structure quirk: unchecked variants draw the ring as a child ellipse,
  checked puts the stroke on the frame. Harmless, inconsistent.

### Switch (1:446)
- Off-track paints STROKE-family tokens as fills (naming oddity).
- The knob's faint shadow spill (~1% in one export) is unbound — shipped
  shadowless.

### IconButton (1:429) — post Neutral-rework
- `23:725`'s hand-shrunk 14px glyph still open (shipped 18px).
- Subtle rest ink (60%) is very faint over white.
- (Fixed by designer: the old `23:723` rest-binding slip. ✓)

### ListItem (1:463)
- sm selected rows grow 30→34 (emergent hug: the fixed 18px check exceeds
  sm's line box). Reproduced and spec-pinned.

### DropdownList (1:480)
- "Property 1 = sm/md" toggles which sample row is selected — it is NOT a
  size axis.

### Tabs (23:825)
- Portal active+hover is a near-invisible token swap (Δ6/255).
- The active weight step (400→500) reflows the hug ~1px.

### TextSelector (1:489)
- Duplicate `Hover=yes` variant columns with different treatments; shipped
  reading: modest step = hover, near-black step = open (aria-expanded).

### RadioField (123:6059)
- All six variants' state axes are UNWIRED (identical variables, structure,
  pixels). Top item.
- Option ink is raw #000000 (the file's only raw black) — shipped as
  `Text/Primary`.
- Stray sibling symbol "Radio field" (123:6056, 56×24) — intended component
  or leftover?

### SelectCard (9:367)
- "Pressed" means SELECTED on the radio variant but a transient wash on the
  chevron variant — two strategies on one axis.

### BoxAction (199:12990)
- Per-type disabled inconsistencies (different ring tokens; no distinct
  disabled switch asset).

### Owner (261:13225) / OwnerContainer (274:258)
- A Gate-0 metadata read said 94.5px row height; authored/pixels/math all say
  92.5 (92 + 0.5 hairline). Worth confirming which is current.
- Ownership % type style inferred (single title-level binding) — confirm
  it binds `Display & Title/Medium`.
- Title/contact row heights (34/18) exceed their line boxes with no authored
  padding (frame authority shipped).
- The `tag` Badge boolean is never shown true in any variant.

### TextField (1:291) / DropdownField (1:358)
- Box padding split ambiguity: structure reads 14/20/14, the bound 24px
  line-height closes at 12/24/12 — re-measure the node.
- hover+focus is undrawn — the library ships focus-wins; confirm intended.
- TextField lacks the "Optional Text" label-row slot Dropdown Field has —
  intentional asymmetry?

### TextArea (199:12523)
- 10px y-padding vs the siblings' taller boxes — intended?
- The value node carries the Input style's single-line nowrap/ellipsis
  (copy-paste artifact); no variant demonstrates wrapping or overflow.
- No resize grabber and no overflow state — the library chose
  `resize: none`; confirm.
- No Error axis (unlike the siblings) — deliberate?

### Header (550:7507)
- No scrolled shadow drawn — confirm none is wanted for the sticky state.
- The logo's crimson #CD1041 is the client asset's own colour, deliberately
  untokenized.
