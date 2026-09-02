/**
 * Expected rendered values, extracted from Figma.
 *
 * Consumed by scripts/visual-verify.mjs. Each entry pins what a component must
 * actually MEASURE in a browser — not what its CSS says.
 *
 * CHECK SHAPE
 *   {
 *     label: 'sm height',                  // shown in the report
 *     sel:   '.input-field.input-sm',      // querySelectorAll
 *     nth:   0,                            // optional index, default 0
 *     get:   'height',                     // 'height' | 'width' | 'visible' | 'text'
 *                                          //   | any CSS property
 *                                          //   | '::placeholder.color' for a pseudo
 *     expect: 25,                          // number (px), string, or { token }
 *     tol:   0.01,                         // numeric tolerance, default 0.01
 *     hover: true,                         // park the pointer first, to
 *                                          //   assert a :hover style
 *     hoverSel: '.nav-group',              // hover THIS instead of `sel`, for
 *                                          //   parent-hover-reveals-child
 *     hoverNth: 0,                         //   optional index for hoverSel
 *     not: true,                           // invert — assert it is anything
 *                                          //   BUT `expect`
 *     contains: true,                      // substring match, for a token
 *                                          //   embedded in a larger value
 *                                          //   (gradient stop, shadow colour)
 *     absent: true,                        // assert the selector matches
 *                                          //   NOTHING (no `get`/`expect`)
 *     before: [{ click: '.x', wait: 200 }] // optional interactions first
 *   }
 *
 * COLOURS: compare with `{ token: '--color-surface-card' }`, never a literal.
 * The theme emits oklch(), so a hardcoded rgb() string will always fail even
 * when the colour is correct.
 *
 * TOLERANCES: default to exact. Only widen where the delta is understood and
 * written down — a bare loose tolerance hides regressions.
 */


export const SPECS = {
  // The dashboard library's full spec file is preserved at
  // _dashboard-archive/visual-specs.mjs for reference on check patterns.

  // ------------------------------------------------------------------- Radio
  Radio: {
    figma: "Radio 1:419 — 4 variants across Active × Hover × Pressed",
    variants: 4,
    stories: {
      // nth 0 = unchecked, nth 1 = checked
      "components-radio--both-rest-states": [
        { label: "width 20", sel: ".radio", get: "width", expect: 20 },
        { label: "height 20", sel: ".radio", get: "height", expect: 20 },
        {
          label: "true circle (radius not 0)",
          sel: ".radio",
          get: "border-radius",
          not: true,
          expect: "0px",
        },
        // The ring is an inset box-shadow, not a border — Chrome floors a
        // fractional border-width, so only a shadow can carry Figma's 1.5px.
        {
          label: "ring colour Stroke/Border",
          sel: ".radio",
          get: "box-shadow",
          contains: true,
          expect: { token: "--color-stroke-border" },
        },
        {
          label: "ring width 1.5px survives (fractional-border trap)",
          sel: ".radio",
          get: "box-shadow",
          contains: true,
          expect: "1.5px",
        },
        {
          label: "ring is inside-aligned (inset)",
          sel: ".radio",
          get: "box-shadow",
          contains: true,
          expect: "inset",
        },
        {
          label: "no border (the ring must not double up)",
          sel: ".radio",
          get: "border-top-width",
          expect: "0px",
        },
        {
          label: "rest has no fill",
          sel: ".radio",
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
        },
        {
          label: "unchecked draws no dot",
          sel: ".radio",
          get: "::before.content",
          expect: "none",
        },
        {
          label: "hover fills Action/Hover",
          sel: ".radio",
          get: "background-color",
          hover: true,
          expect: { token: "--color-action-hover" },
        },
        // Checked (nth 1)
        {
          label: "checked ring is Primary/Primary",
          sel: ".radio",
          nth: 1,
          get: "box-shadow",
          contains: true,
          expect: { token: "--color-primary" },
        },
        {
          label: "checked keeps the 1.5px ring width",
          sel: ".radio",
          nth: 1,
          get: "box-shadow",
          contains: true,
          expect: "1.5px",
        },
        {
          label: "checked has no fill (only the dot)",
          sel: ".radio",
          nth: 1,
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
        },
        {
          label: "dot 10px wide",
          sel: ".radio",
          nth: 1,
          get: "::before.width",
          expect: "10px",
        },
        {
          label: "dot 10px tall",
          sel: ".radio",
          nth: 1,
          get: "::before.height",
          expect: "10px",
        },
        {
          label: "dot fill Primary/Primary",
          sel: ".radio",
          nth: 1,
          get: "::before.background-color",
          expect: { token: "--color-primary" },
        },
        // Figma draws no checked+hover variant, so the hover tint deliberately
        // excludes :checked — pin that the exclusion holds.
        {
          label: "hover does not tint a checked radio",
          sel: ".radio",
          nth: 1,
          get: "background-color",
          hover: true,
          expect: "rgba(0, 0, 0, 0)",
        },

        // NOT ASSERTED: the pressed fill (Action/Pressed) — the harness can
        // hover but cannot hold a mousedown, so :active is unreachable here.
        // The token is pinned in the theme and the rule mirrors hover's shape.
        // NOT ASSERTED: disabled styling — Figma models no disabled variant
        // and the CSS deliberately invents none (cursor only).
      ],
    },
  },

  // ---------------------------------------------------------------- Checkbox
  Checkbox: {
    figma: "Checkbox 1:424 — 8 variants across Active × Hover × Pressed × Disabled",
    variants: 8,
    stories: {
      // nth 0 = unchecked, 1 = checked, 2 = disabled unchecked, 3 = disabled checked
      "components-checkbox--all-states": [
        { label: "control 18 wide", sel: ".checkbox-control", get: "width", expect: 18 },
        { label: "control 18 tall", sel: ".checkbox-control", get: "height", expect: 18 },
        {
          label: "radius raw 3px (off the Radius scale, deliberate)",
          sel: ".checkbox-input",
          get: "border-radius",
          expect: "3px",
        },
        {
          label: "unchecked ring Stroke/Border",
          sel: ".checkbox-input",
          get: "box-shadow",
          contains: true,
          expect: { token: "--color-stroke-border" },
        },
        {
          label: "unchecked ring 1.5px survives (fractional-border trap)",
          sel: ".checkbox-input",
          get: "box-shadow",
          contains: true,
          expect: "1.5px",
        },
        {
          label: "no real border (ring must not double up)",
          sel: ".checkbox-input",
          get: "border-top-width",
          expect: "0px",
        },
        {
          label: "unchecked rest fill Paper",
          sel: ".checkbox-input",
          get: "background-color",
          expect: { token: "--color-surface-paper" },
        },
        {
          label: "unchecked hover fill Action/Hover",
          sel: ".checkbox-input",
          get: "background-color",
          hover: true,
          expect: { token: "--color-action-hover" },
        },
        // The ring token does NOT change on hover — the darker border in
        // Figma's render is the translucent token compositing over the
        // darker fill, not a second token.
        {
          label: "hover ring UNCHANGED (still 1.5px Stroke/Border)",
          sel: ".checkbox-input",
          get: "box-shadow",
          hover: true,
          contains: true,
          expect: "1.5px",
        },
        {
          label: "glyph hidden unchecked",
          sel: ".checkbox-check",
          get: "opacity",
          expect: "0",
        },
        // Checked (nth 1)
        {
          label: "checked fill Primary",
          sel: ".checkbox-input",
          nth: 1,
          get: "background-color",
          expect: { token: "--color-primary" },
        },
        {
          label: "checked draws NO ring at all",
          sel: ".checkbox-input",
          nth: 1,
          get: "box-shadow",
          expect: "none",
        },
        {
          label: "checked hover fill Primary/Hover (a real Figma variant)",
          sel: ".checkbox-input",
          nth: 1,
          get: "background-color",
          hover: true,
          expect: { token: "--color-primary-hover" },
        },
        {
          label: "glyph visible checked",
          sel: ".checkbox-check",
          nth: 1,
          get: "opacity",
          expect: "1",
        },
        {
          label: "glyph 16px",
          sel: ".checkbox-check",
          nth: 1,
          get: "width",
          expect: 16,
        },
        {
          label: "glyph colour Text/Contrast (unbound in Figma, inferred — see CSS header)",
          sel: ".checkbox-check",
          nth: 1,
          get: "color",
          expect: { token: "--color-content-contrast" },
        },
        // Disabled unchecked (nth 2): TWO simultaneous authored changes.
        {
          label: "disabled ring thins to 1px",
          sel: ".checkbox-input",
          nth: 2,
          get: "box-shadow",
          contains: true,
          expect: "1px",
        },
        {
          label: "disabled ring is NOT still 1.5px",
          sel: ".checkbox-input",
          nth: 2,
          get: "box-shadow",
          contains: true,
          not: true,
          expect: "1.5px",
        },
        {
          label: "disabled ring colour Stroke/Divider",
          sel: ".checkbox-input",
          nth: 2,
          get: "box-shadow",
          contains: true,
          expect: { token: "--color-stroke-divider" },
        },
        // Disabled checked (nth 3): the translucent token applied as-is.
        {
          label: "disabled checked fill Primary/Disabled",
          sel: ".checkbox-input",
          nth: 3,
          get: "background-color",
          expect: { token: "--color-primary-disabled" },
        },

        // NOT ASSERTED: pressed fills (Action/Pressed unchecked;
        // Primary/Focus checked — Figma's literal token name for PRESSED,
        // wired to :active) — the harness cannot hold a mousedown. Verify by
        // hand; the Primary/Focus naming trap is called out in the CSS.
      ],
    },
  },

  // -------------------------------------------------------------- IconButton
  IconButton: {
    figma: "icon button 1:429 — 16 variants across Size × Type × Hover × Subtle",
    variants: 16,
    stories: {
      // nth order: 0 md · 1 md subtle · 2 md state · 3 md state subtle ·
      //            4 sm · 5 sm subtle · 6 sm state · 7 sm state subtle
      "components-iconbutton--all-variants": [
        { label: "md box 18", sel: ".icon-button", get: "width", expect: 18 },
        { label: "md glyph 18", sel: ".icon-button svg", get: "width", expect: 18 },
        {
          label: "md rest colour Neutral/Base",
          sel: ".icon-button",
          get: "color",
          expect: { token: "--color-neutral" },
        },
        {
          label: "md hover colour Neutral/Hover",
          sel: ".icon-button",
          get: "color",
          hover: true,
          expect: { token: "--color-neutral-hover" },
        },
        // Icon Only NEVER grows chrome — the check that would catch a
        // copy-paste of State's hover rule onto the base.
        {
          label: "Icon Only hover draws NO background",
          sel: ".icon-button",
          get: "background-color",
          hover: true,
          expect: "rgba(0, 0, 0, 0)",
        },
        // Subtle ramp (nth 1): Disabled ink at rest, Base on hover — never
        // Neutral/Hover ("hover cancels the muting", faithful to Figma).
        {
          label: "subtle rest colour Neutral/Disabled",
          sel: ".icon-button",
          nth: 1,
          get: "color",
          expect: { token: "--color-neutral-disabled" },
        },
        {
          label: "subtle hover restores Neutral/Base",
          sel: ".icon-button",
          nth: 1,
          get: "color",
          hover: true,
          expect: { token: "--color-neutral" },
        },
        // State type (nth 2): padded hit target, halo on hover only.
        { label: "state box 24", sel: ".icon-button", nth: 2, get: "width", expect: 24 },
        {
          label: "state glyph stays 18 (padding, not scaling)",
          sel: ".icon-button svg",
          nth: 2,
          get: "width",
          expect: 18,
        },
        {
          label: "state rest has no halo",
          sel: ".icon-button",
          nth: 2,
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
        },
        {
          label: "state hover halo Action/Hover",
          sel: ".icon-button",
          nth: 2,
          get: "background-color",
          hover: true,
          expect: { token: "--color-action-hover" },
        },
        {
          label: "state hover halo is a circle",
          sel: ".icon-button",
          nth: 2,
          get: "border-radius",
          hover: true,
          not: true,
          expect: "0px",
        },
        // Note: shipped rest colour for State is Neutral/Base — Figma's own
        // 23:723 instance binds Neutral/Disabled (3-lane-confirmed authoring
        // slip; designer list). This asserts the shipped consistent reading.
        {
          label: "state rest colour Neutral/Base (Figma's 23:723 slip not copied)",
          sel: ".icon-button",
          nth: 2,
          get: "color",
          expect: { token: "--color-neutral" },
        },
        // sm (nth 4): same bindings, smaller boxes.
        { label: "sm box 14", sel: ".icon-button", nth: 4, get: "width", expect: 14 },
        { label: "sm glyph 14", sel: ".icon-button svg", nth: 4, get: "width", expect: 14 },
        {
          label: "sm rest colour identical to md (AA made it SAMPLE lighter; the token is the same)",
          sel: ".icon-button",
          nth: 4,
          get: "color",
          expect: { token: "--color-neutral" },
        },
        // sm State (nth 6)
        { label: "sm state box 18", sel: ".icon-button", nth: 6, get: "width", expect: 18 },
        {
          label: "sm state glyph stays 14",
          sel: ".icon-button svg",
          nth: 6,
          get: "width",
          expect: 14,
        },
        // The sprite's native stroke must survive — an override here would
        // change every icon's painted weight.
        {
          label: "glyph stroke-width 2 (user units; renders 1.5px at md)",
          sel: ".icon-button svg",
          get: "stroke-width",
          expect: "2px",
        },

        // NOT ASSERTED: disabled (Figma models none; cursor only) and
        // pressed/focus variants (none exist on the axis).
      ],
    },
  },

  // ------------------------------------------------------------------ Switch
  Switch: {
    figma: "Switch 1:446 — 4 variants across Active × Hover",
    variants: 4,
    stories: {
      // nth 0 = off, nth 1 = on
      "components-switch--both-states": [
        { label: "track 36 wide", sel: ".switch", get: "width", expect: 36 },
        { label: "track 20 tall", sel: ".switch", get: "height", expect: 20 },
        {
          label: "pill radius (not 0)",
          sel: ".switch",
          get: "border-radius",
          not: true,
          expect: "0px",
        },
        {
          label: "no border on the track (Stroke tokens are FILLS here)",
          sel: ".switch",
          get: "border-top-width",
          expect: "0px",
        },
        {
          label: "off track Stroke/Border used as fill",
          sel: ".switch",
          get: "background-color",
          expect: { token: "--color-stroke-border" },
        },
        {
          label: "off hover track Stroke/Hover",
          sel: ".switch",
          get: "background-color",
          hover: true,
          expect: { token: "--color-stroke-hover" },
        },
        {
          label: "knob 16px",
          sel: ".switch",
          get: "::before.width",
          expect: "16px",
        },
        {
          label: "knob fill BG/Paper (off)",
          sel: ".switch",
          get: "::before.background-color",
          expect: { token: "--color-surface-paper" },
        },
        // Tailwind v4's translate-x-* sets the CSS `translate` property, not
        // `transform` — read the right one or the assertion is a false pass.
        {
          label: "knob at rest position (translate none)",
          sel: ".switch",
          get: "::before.translate",
          expect: "none",
        },
        {
          label: "knob ships shadowless (unbound in Figma — designer list)",
          sel: ".switch",
          get: "::before.box-shadow",
          expect: "none",
        },
        // On (nth 1)
        {
          label: "on track Primary",
          sel: ".switch",
          nth: 1,
          get: "background-color",
          expect: { token: "--color-primary" },
        },
        {
          label: "on hover track Primary/Hover (a real Figma variant)",
          sel: ".switch",
          nth: 1,
          get: "background-color",
          hover: true,
          expect: { token: "--color-primary-hover" },
        },
        {
          label: "knob travels 16px",
          sel: ".switch",
          nth: 1,
          get: "::before.translate",
          contains: true,
          expect: "16px",
        },
        {
          label: "knob fill unchanged when on (the property states must NOT change)",
          sel: ".switch",
          nth: 1,
          get: "::before.background-color",
          expect: { token: "--color-surface-paper" },
        },

        // NOT ASSERTED: disabled (Figma models none; cursor only).
        // NOTE: knob diameter was the extraction's one cross-lane conflict
        // (authored 16 vs a 15px 1x-raster read) — the 16px assertion above
        // pins the authored-metadata resolution.
      ],
    },
  },
};
