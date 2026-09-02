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



// The Skeleton written spec's full dimension matrix (550:7998) — every cell
// swept programmatically. [shape, [sm w,h], [md w,h], [lg w,h]]; square
// shapes carry one number.
const SKELETON_MATRIX = [
  ["text", [120, 12], [200, 16], [320, 20]],
  ["heading", [160, 20], [240, 24], [360, 32]],
  ["circle", [32], [40], [56]],
  ["rectangle", [120, 80], [200, 120], [320, 180]],
  ["button", [64, 32], [96, 36], [128, 40]],
  ["input", [280, 48], [330, 60], [420, 72]],
  ["textarea", [280, 80], [330, 100], [420, 128]],
  ["card", [280, 140], [330, 158], [420, 200]],
  ["switch", [28, 16], [36, 20], [44, 24]],
  ["checkbox", [14], [18], [22]],
  ["badge", [60, 16], [80, 20], [100, 24]],
  ["listitem", [280, 28], [330, 32], [420, 40]],
  ["tab", [80, 28], [100, 32], [120, 36]],
  ["avatar", [32], [40], [56]],
  ["dropdown", [280, 48], [330, 60], [420, 72]],
  ["radio", [16], [20], [24]],
];
const SKELETON_MATRIX_CHECKS = SKELETON_MATRIX.flatMap(([shape, ...sizes]) =>
  sizes.flatMap((dims, i) => {
    const size = ["sm", "md", "lg"][i];
    const sel = `.skeleton-${shape}.skeleton-${size}`;
    const [w, h = w] = dims;
    return [
      { label: `${shape} ${size} width ${w}`, sel, get: "width", expect: w },
      { label: `${shape} ${size} height ${h}`, sel, get: "height", expect: h },
    ];
  }),
);

export const SPECS = {
  // The dashboard library's full spec file is preserved at
  // _dashboard-archive/visual-specs.mjs for reference on check patterns.

  // ------------------------------------------------------------------ Button
  Button: {
    figma: "Button 1:218 — 16 variants: Type {Primary, Secondary, Micro, Bubble} × states",
    variants: 16,
    stories: {
      // AllTypes grid order: 0 primary · 1 primary disabled · 2 secondary ·
      // 3 secondary disabled · 4 micro · 5 micro disabled · 6 bubble · 7 bubble disabled
      "components-button--all-types": [
        { label: "primary height 48", sel: ".btn-primary", get: "height", expect: 48 },
        {
          label: "primary radius raw 4px",
          sel: ".btn-primary",
          get: "border-radius",
          expect: "4px",
        },
        {
          label: "primary fill Primary",
          sel: ".btn-primary",
          get: "background-color",
          expect: { token: "--color-primary" },
        },
        {
          label: "primary ink Contrast",
          sel: ".btn-primary",
          get: "color",
          expect: { token: "--color-content-contrast" },
        },
        {
          label: "primary hover fill Primary/Hover",
          sel: ".btn-primary",
          get: "background-color",
          hover: true,
          expect: { token: "--color-primary-hover" },
        },
        {
          label: "primary uppercase is styled, not typed",
          sel: ".btn-primary",
          get: "text-transform",
          expect: "uppercase",
        },
        {
          label: "primary has no border",
          sel: ".btn-primary",
          get: "border-top-width",
          expect: "0px",
        },
        // Disabled primary (nth 1): fill fades, INK DOES NOT.
        {
          label: "primary disabled fill Primary/Disabled",
          sel: ".btn-primary",
          nth: 1,
          get: "background-color",
          expect: { token: "--color-primary-disabled" },
        },
        {
          label: "primary disabled ink stays Contrast (does not fade)",
          sel: ".btn-primary",
          nth: 1,
          get: "color",
          expect: { token: "--color-content-contrast" },
        },
        // Secondary
        { label: "secondary height 48", sel: ".btn-secondary", get: "height", expect: 48 },
        {
          label: "secondary border 1px",
          sel: ".btn-secondary",
          get: "border-top-width",
          expect: "1px",
        },
        {
          label: "secondary border Stroke/Border",
          sel: ".btn-secondary",
          get: "border-top-color",
          expect: { token: "--color-stroke-border" },
        },
        {
          label: "secondary ink Content/Secondary",
          sel: ".btn-secondary",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        {
          label: "secondary hover border Stroke/Hover",
          sel: ".btn-secondary",
          get: "border-top-color",
          hover: true,
          expect: { token: "--color-stroke-hover" },
        },
        {
          label: "secondary hover ink Content/Primary",
          sel: ".btn-secondary",
          get: "color",
          hover: true,
          expect: { token: "--color-content-primary" },
        },
        // The detail the whole Secondary hover system hangs on: the fill
        // appears only at PRESSED — hover must leave it transparent.
        {
          label: "secondary hover fill stays transparent (wash is pressed-only)",
          sel: ".btn-secondary",
          get: "background-color",
          hover: true,
          expect: "rgba(0, 0, 0, 0)",
        },
        {
          label: "secondary disabled border Stroke/Divider",
          sel: ".btn-secondary",
          nth: 1,
          get: "border-top-color",
          expect: { token: "--color-stroke-divider" },
        },
        {
          label: "secondary disabled ink Content/Tertiary",
          sel: ".btn-secondary",
          nth: 1,
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
        // Micro
        { label: "micro height 12", sel: ".btn-micro", get: "height", expect: 12 },
        {
          label: "micro has no box (no border, no fill)",
          sel: ".btn-micro",
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
        },
        {
          label: "micro ink Content/Secondary",
          sel: ".btn-micro",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        {
          label: "micro hover ink Content/Primary",
          sel: ".btn-micro",
          get: "color",
          hover: true,
          expect: { token: "--color-content-primary" },
        },
        {
          label: "micro uppercase styled",
          sel: ".btn-micro",
          get: "text-transform",
          expect: "uppercase",
        },
        {
          label: "micro glyph 12px",
          sel: ".btn-micro svg",
          get: "width",
          expect: 12,
        },
        // Bubble
        { label: "bubble height 34", sel: ".btn-bubble", get: "height", expect: 34 },
        {
          label: "bubble is a pill",
          sel: ".btn-bubble",
          get: "border-radius",
          not: true,
          expect: "4px",
        },
        {
          label: "bubble rest fill invisible",
          sel: ".btn-bubble",
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
        },
        {
          label: "bubble hover fill Action/Hover",
          sel: ".btn-bubble",
          get: "background-color",
          hover: true,
          expect: { token: "--color-action-hover" },
        },
        // The only Type WITHOUT the transform — Pill-precedent explicit pin.
        {
          label: "bubble casing untransformed",
          sel: ".btn-bubble",
          get: "text-transform",
          expect: "none",
        },
        {
          label: "bubble disabled fill stays invisible (ink dims and nothing else)",
          sel: ".btn-bubble",
          nth: 1,
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
        },

        // NOT ASSERTED (harness cannot hold :active): primary pressed
        // (Primary/Focus — Figma's literal name, wired to :active), secondary
        // pressed's Action/HOVER wash (verbatim naming oddity), bubble
        // pressed's Action/Pressed, and micro's hover=pressed no-op pair
        // (0/696 pixel diff in Figma — reproduced as one rule).
        // NO fractional values exist anywhere in this component — stated
        // explicitly because every sibling needed a fractional-survival check.
      ],
    },
  },

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

  // ------------------------------------------------------------------ Avatar
  Avatar: {
    figma: "Avatar 23:670 — 4 variants: {MD 24, SM 20} × Feint",
    variants: 4,
    stories: {
      // AllVariants order: 0 md · 1 sm · 2 md feint · 3 sm feint
      "components-avatar--all-variants": [
        { label: "md 24", sel: ".avatar", get: "width", expect: 24 },
        { label: "md tall 24", sel: ".avatar", get: "height", expect: 24 },
        {
          label: "circle",
          sel: ".avatar",
          get: "border-radius",
          not: true,
          expect: "0px",
        },
        {
          label: "md fill Neutral/Base",
          sel: ".avatar",
          get: "background-color",
          expect: { token: "--color-neutral" },
        },
        {
          label: "md ink Contrast",
          sel: ".avatar",
          get: "color",
          expect: { token: "--color-content-contrast" },
        },
        {
          label: "md type Eyebrow 11px",
          sel: ".avatar",
          get: "font-size",
          expect: "11px",
        },
        {
          label: "initials uppercase via the type style",
          sel: ".avatar",
          get: "text-transform",
          expect: "uppercase",
        },
        { label: "sm 20", sel: ".avatar", nth: 1, get: "width", expect: 20 },
        {
          label: "sm type Micro-Label 9px",
          sel: ".avatar",
          nth: 1,
          get: "font-size",
          expect: "9px",
        },
        {
          label: "feint fill Neutral/BG",
          sel: ".avatar",
          nth: 2,
          get: "background-color",
          expect: { token: "--color-neutral-bg" },
        },
        {
          label: "feint ink Secondary",
          sel: ".avatar",
          nth: 2,
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
      ],
    },
  },

  // ------------------------------------------------------------------- Badge
  Badge: {
    figma: "Badge 28:507 — a single symbol, no variant axes",
    variants: 1,
    stories: {
      "components-badge--interactive": [
        { label: "height 16", sel: ".badge", get: "height", expect: 16 },
        {
          label: "pill",
          sel: ".badge",
          get: "border-radius",
          not: true,
          expect: "0px",
        },
        {
          label: "fill Neutral/BG",
          sel: ".badge",
          get: "background-color",
          expect: { token: "--color-neutral-bg" },
        },
        {
          label: "ink Secondary",
          sel: ".badge",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        {
          label: "type Eyebrow 11px",
          sel: ".badge",
          get: "font-size",
          expect: "11px",
        },
        {
          label: "uppercase via the type style",
          sel: ".badge",
          get: "text-transform",
          expect: "uppercase",
        },
        {
          label: "padding-x 8",
          sel: ".badge",
          get: "padding-left",
          expect: "8px",
        },
        {
          label: "no border",
          sel: ".badge",
          get: "border-top-width",
          expect: "0px",
        },
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

        // NOT ASSERTED: disabled (cursor only); the PRESSED ramp added in the
        // 2026-09-02 rework (Neutral/Pressed glyph both ramps, Action/Focused halo)
        // — the harness cannot hold :active; pinned from the variable diff.
      ],
    },
  },

  // ---------------------------------------------------------------- ListItem
  ListItem: {
    figma: "List Item 1:463 — 24 variants: Size × Selected × Hover × LastItem",
    variants: 24,
    stories: {
      // AllSizes: three columns of [unselected, selected]: nth 0/1 sm, 2/3 md, 4/5 lg
      "components-listitem--all-sizes": [
        // Per-size type bindings — Help & Caption / Labels Default / Input.
        { label: "sm type 12px Help & Caption", sel: ".list-option-sm", get: "font-size", expect: "12px" },
        { label: "sm line 14px", sel: ".list-option-sm", get: "line-height", expect: "14px" },
        { label: "md type 14px Labels Default", sel: ".list-option-md", get: "font-size", expect: "14px" },
        { label: "md line 20px", sel: ".list-option-md", get: "line-height", expect: "20px" },
        { label: "lg type 16px Input", sel: ".list-option-lg", get: "font-size", expect: "16px" },
        { label: "lg line 24px", sel: ".list-option-lg", get: "line-height", expect: "24px" },
        // The gap-collapse trick: 10px unconditional; the hidden check
        // contributes none, so unselected rows read gap-0 visually.
        { label: "gap unconditional 10", sel: ".list-option-sm", get: "gap", expect: "10px" },
        { label: "sm unselected 30", sel: ".list-option-sm", get: "height", expect: 30 },
        {
          label: "sm SELECTED grows to 34 (Figma's emergent hug, reproduced)",
          sel: ".list-option-sm",
          nth: 1,
          get: "height",
          expect: 34,
        },
        { label: "md 36", sel: ".list-option-md", get: "height", expect: 36 },
        {
          label: "md selected stays 36",
          sel: ".list-option-md",
          nth: 1,
          get: "height",
          expect: 36,
        },
        { label: "lg 40", sel: ".list-option-lg", get: "height", expect: 40 },
        {
          label: "lg selected stays 40",
          sel: ".list-option-lg",
          nth: 1,
          get: "height",
          expect: 40,
        },
        { label: "padding-x 12", sel: ".list-option-sm", get: "padding-left", expect: "12px" },
        { label: "padding-y 8", sel: ".list-option-sm", get: "padding-top", expect: "8px" },
        {
          label: "unselected ink Text/Primary",
          sel: ".list-option-sm",
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        {
          label: "selected ink Primary (text and check inherit together)",
          sel: ".list-option-sm",
          nth: 1,
          get: "color",
          expect: { token: "--color-primary" },
        },
        {
          label: "check hidden unselected",
          sel: ".list-option-sm .list-option-check",
          get: "display",
          expect: "none",
        },
        {
          label: "check shown selected, 18px fixed at every size",
          sel: ".list-option-sm .list-option-check",
          nth: 1,
          get: "width",
          expect: 18,
        },
        {
          label: "hover fills Action/Hover on an UNSELECTED row",
          sel: ".list-option-sm",
          get: "background-color",
          hover: true,
          expect: { token: "--color-action-hover" },
        },
        {
          label: "hover fills the SELECTED row too (a real Figma variant)",
          sel: ".list-option-sm",
          nth: 1,
          get: "background-color",
          hover: true,
          expect: { token: "--color-action-hover" },
        },
        {
          label: "hover leaves the selected ink unchanged",
          sel: ".list-option-sm",
          nth: 1,
          get: "color",
          hover: true,
          expect: { token: "--color-primary" },
        },
      ],
      "components-listitem--dividers": [
        // The divider is an INSET SHADOW, not a border — Figma's stroke is
        // inside-aligned within the frame heights (a border added +1px,
        // caught by this spec's first run).
        {
          label: "divider (inset shadow) on non-last rows",
          sel: ".list-option",
          get: "box-shadow",
          contains: true,
          expect: { token: "--color-stroke-divider" },
        },
        {
          label: "divider does not add height (unselected row stays 30)",
          sel: ".list-option",
          nth: 1,
          get: "height",
          expect: 30,
        },
        {
          label: "no divider on the last row (:last-child, not a class)",
          sel: ".list-option",
          nth: 2,
          get: "box-shadow",
          expect: "none",
        },
      ],
    },
  },

  // ------------------------------------------------------------ DropdownList
  DropdownList: {
    figma: "Dropdown List 1:480 — 2 variants (row-1 selection toggle, NOT a size axis)",
    variants: 2,
    stories: {
      "components-dropdownlist--interactive": [
        {
          label: "fill Paper",
          sel: ".dropdown-list",
          get: "background-color",
          expect: { token: "--color-surface-paper" },
        },
        {
          label: "border Stroke/Divider 1px",
          sel: ".dropdown-list",
          get: "border-top-width",
          expect: "1px",
        },
        {
          label: "border colour",
          sel: ".dropdown-list",
          get: "border-top-color",
          expect: { token: "--color-stroke-divider" },
        },
        {
          label: "radius 4px (authored literal wins over the coarse 1x corner-fit)",
          sel: ".dropdown-list",
          get: "border-radius",
          expect: "4px",
        },
        {
          label: "zero padding (rows are flush)",
          sel: ".dropdown-list",
          get: "padding-top",
          expect: "0px",
        },
        { label: "zero gap", sel: ".dropdown-list", get: "row-gap", expect: "normal" },
        {
          label: "overflow clip (library extension — hover fills must not poke past corners)",
          sel: ".dropdown-list",
          get: "overflow-x",
          expect: "clip",
        },
        // filter, not box-shadow: overflow-clip eats a box's own box-shadow;
        // drop-shadow() applies to the clipped composite and survives.
        {
          label: "shadow ships as filter drop-shadow (raw, unbound in Figma)",
          sel: ".dropdown-list",
          get: "filter",
          contains: true,
          expect: "drop-shadow",
        },
      ],
    },
  },

  // --------------------------------------------------------------- BoxAction
  BoxAction: {
    figma: "Box action 199:12990 — 8 variants: Type {Checkbox, Switch} × {rest, hover, active, disabled}",
    variants: 8,
    stories: {
      // AllStates: nth 0-2 checkbox (rest, active, disabled) · 3-5 switch (same)
      "components-boxaction--all-states": [
        { label: "checkbox row 48", sel: ".box-action-checkbox", get: "height", expect: 48 },
        { label: "switch row 44", sel: ".box-action-switch", get: "height", expect: 44 },
        { label: "radius 4px", sel: ".box-action", get: "border-radius", expect: "4px" },
        { label: "padding-x 16", sel: ".box-action", get: "padding-left", expect: "16px" },
        { label: "gap 12", sel: ".box-action", get: "gap", expect: "12px" },
        {
          label: "rest ring Stroke/Divider (inset — Figma inside stroke)",
          sel: ".box-action",
          get: "box-shadow",
          contains: true,
          expect: { token: "--color-stroke-divider" },
        },
        {
          label: "no real border",
          sel: ".box-action",
          get: "border-top-width",
          expect: "0px",
        },
        {
          label: "rest fill Paper",
          sel: ".box-action",
          get: "background-color",
          expect: { token: "--color-surface-paper" },
        },
        {
          label: "hover ring Stroke/Hover",
          sel: ".box-action",
          get: "box-shadow",
          contains: true,
          hover: true,
          expect: { token: "--color-stroke-hover" },
        },
        {
          label: "hover leaves the fill unchanged (byte-proven in Figma)",
          sel: ".box-action",
          get: "background-color",
          hover: true,
          expect: { token: "--color-surface-paper" },
        },
        {
          label: "checkbox label text-input 16px, Text/Primary",
          sel: ".box-action-checkbox .box-action-label",
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        {
          label: "switch label 13px Text/Secondary",
          sel: ".box-action-switch .box-action-label",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        // Active via :has(:checked) — nth 1 per type
        {
          label: "active ring Primary",
          sel: ".box-action-checkbox",
          nth: 1,
          get: "box-shadow",
          contains: true,
          expect: { token: "--color-primary" },
        },
        {
          label: "active fill Primary/BG",
          sel: ".box-action-checkbox",
          nth: 1,
          get: "background-color",
          expect: { token: "--color-primary-bg" },
        },
        {
          label: "active checkbox label steps to 500 (Lead & Subtitle)",
          sel: ".box-action-checkbox .box-action-label",
          nth: 1,
          get: "font-weight",
          expect: "500",
        },
        {
          label: "active checkbox label ink UNCHANGED",
          sel: ".box-action-checkbox .box-action-label",
          nth: 1,
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        {
          label: "active switch label does NOT step weight (copy-paste guard)",
          sel: ".box-action-switch .box-action-label",
          nth: 1,
          get: "font-weight",
          expect: "400",
        },
        {
          label: "the nested control paints itself (composition sanity)",
          sel: ".box-action-switch .switch",
          nth: 1,
          get: "background-color",
          expect: { token: "--color-primary" },
        },
        {
          label: "hover must not restyle an active row",
          sel: ".box-action-checkbox",
          nth: 1,
          get: "box-shadow",
          contains: true,
          hover: true,
          expect: { token: "--color-primary" },
        },
        // Disabled via :has(:disabled) — nth 2 per type
        {
          label: "disabled fill BG/App Page",
          sel: ".box-action-checkbox",
          nth: 2,
          get: "background-color",
          expect: { token: "--color-surface-app-page" },
        },
        {
          label: "disabled checkbox ring 0.5px survives (fractional trap)",
          sel: ".box-action-checkbox",
          nth: 2,
          get: "box-shadow",
          contains: true,
          expect: "0.5px",
        },
        {
          label: "disabled switch ring Stroke/Border (per-type token difference)",
          sel: ".box-action-switch",
          nth: 2,
          get: "box-shadow",
          contains: true,
          expect: { token: "--color-stroke-border" },
        },
        {
          label: "disabled label Tertiary",
          sel: ".box-action-checkbox .box-action-label",
          nth: 2,
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
        {
          label: "disabled cursor",
          sel: ".box-action-checkbox",
          nth: 2,
          get: "cursor",
          expect: "not-allowed",
        },
      ],
    },
  },

  // -------------------------------------------------------------- SelectCard
  SelectCard: {
    figma: "Card 9:367 — 6 variants: Hover × Radio × Pressed (pressed = selected on the radio variant)",
    variants: 6,
    stories: {
      // RadioVariants: nth 0 unselected, nth 1 selected
      "components-selectcard--radio-variants": [
        { label: "height 76 (content-driven: 32 pad + 20+4+20 text)", sel: ".select-card", get: "height", expect: 76 },
        { label: "radius 6px", sel: ".select-card", get: "border-radius", expect: "6px" },
        { label: "padding 16", sel: ".select-card", get: "padding-left", expect: "16px" },
        { label: "row gap 12", sel: ".select-card", get: "gap", expect: "12px" },
        // The ring is an inset box-shadow (Figma inside stroke; a border added
        // +2px to the content-driven 76px height — caught by this spec).
        {
          label: "rest ring Stroke/Divider (inset shadow)",
          sel: ".select-card",
          get: "box-shadow",
          contains: true,
          expect: { token: "--color-stroke-divider" },
        },
        {
          label: "no real border (ring must not double up)",
          sel: ".select-card",
          get: "border-top-width",
          expect: "0px",
        },
        {
          label: "rest fill Paper",
          sel: ".select-card",
          get: "background-color",
          expect: { token: "--color-surface-paper" },
        },
        {
          label: "hover ring Stroke/Hover",
          sel: ".select-card",
          get: "box-shadow",
          contains: true,
          hover: true,
          expect: { token: "--color-stroke-hover" },
        },
        {
          label: "hover leaves the fill UNCHANGED (perimeter-only, pixel-proven)",
          sel: ".select-card",
          get: "background-color",
          hover: true,
          expect: { token: "--color-surface-paper" },
        },
        {
          label: "title 20px line-height (explicit, no Auto trap)",
          sel: ".select-card-title",
          get: "line-height",
          expect: "20px",
        },
        // Selected via :has(:checked) — nth 1
        {
          label: "selected ring Primary",
          sel: ".select-card",
          nth: 1,
          get: "box-shadow",
          contains: true,
          expect: { token: "--color-primary" },
        },
        {
          label: "selected fill Primary/BG",
          sel: ".select-card",
          nth: 1,
          get: "background-color",
          expect: { token: "--color-primary-bg" },
        },
        {
          label: "nested radio really renders checked (Primary ring)",
          sel: ".select-card .radio",
          nth: 1,
          get: "box-shadow",
          contains: true,
          expect: { token: "--color-primary" },
        },
        {
          label: "hover does not touch the selected card",
          sel: ".select-card",
          nth: 1,
          get: "box-shadow",
          contains: true,
          hover: true,
          expect: { token: "--color-primary" },
        },
      ],
      "components-selectcard--chevron-variant": [
        {
          label: "chevron 18px, Neutral/Base (variable-bound; visually unconfirmed — designer list)",
          sel: ".select-card-chevron",
          get: "width",
          expect: 18,
        },
        {
          label: "chevron colour",
          sel: ".select-card-chevron",
          get: "color",
          expect: { token: "--color-neutral" },
        },
        {
          label: "chevron variant has no radio",
          sel: ".select-card .radio",
          absent: true,
        },
      ],

      // NOT ASSERTED: the chevron-variant pressed wash (Action/Pressed) — the
      // harness cannot hold :active. Pinned in CSS from 3-lane agreement.
    },
  },

  // ------------------------------------------------------------------ Header
  Header: {
    figma:
      "Header 550:7507 — Web/Mobile variants (label + width only). Sticky, full width, and the 768px breakpoint are labeled library extensions.",
    variants: 2,
    stories: {
      // Harness default viewport is 1100×900 — above the 768px breakpoint,
      // so the DESKTOP side renders; the mobile side is asserted hidden.
      "components-header--interactive": [
        { label: "height 60", sel: ".header", get: "height", expect: 60 },
        {
          label: "fill Paper",
          sel: ".header",
          get: "background-color",
          expect: { token: "--color-surface-paper" },
        },
        {
          label: "bottom border Stroke/Divider 1px (real border — pinned height absorbs it)",
          sel: ".header",
          get: "border-bottom-width",
          expect: "1px",
        },
        {
          label: "bottom border colour",
          sel: ".header",
          get: "border-bottom-color",
          expect: { token: "--color-stroke-divider" },
        },
        { label: "sticky", sel: ".header", get: "position", expect: "sticky" },
        { label: "top 0", sel: ".header", get: "top", expect: "0px" },
        { label: "z-index 40 (library decision)", sel: ".header", get: "z-index", expect: "40" },
        { label: "padding-x 20", sel: ".header", get: "padding-left", expect: "20px" },
        { label: "logo slot 30 tall", sel: ".header-logo", get: "height", expect: 30 },
        {
          label: "logo absolutely centered (holds true center)",
          sel: ".header-logo",
          get: "position",
          expect: "absolute",
        },
        {
          label: "desktop selector participates in flex (display: contents wrapper)",
          sel: ".header-desktop",
          get: "display",
          expect: "contents",
        },
        {
          label: "mobile selector hidden above the breakpoint",
          sel: ".header-mobile",
          get: "display",
          expect: "none",
        },
        // Header must not cascade onto the composed TextSelector.
        {
          label: "composed text-selector keeps its own label token",
          sel: ".header .text-selector-label",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
      ],
    },
  },

  // -------------------------------------------------------------- RadioField
  RadioField: {
    figma:
      "Radio Fields 123:6059 — 6 declared variants; ALL state axes unwired (three-lane-verified 0-pixel diffs). Real states come from the composed .radio.",
    variants: 6,
    stories: {
      "components-radiofield--interactive": [
        {
          label: "title Labels/Strong 500 in Text/Secondary",
          sel: ".radio-field-title",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        {
          label: "title weight 500",
          sel: ".radio-field-title",
          get: "font-weight",
          expect: "500",
        },
        {
          label: "title bottom padding 5",
          sel: ".radio-field-title",
          get: "padding-bottom",
          expect: "5px",
        },
        {
          label: "actions row 40 tall",
          sel: ".radio-field-options",
          get: "height",
          expect: 40,
        },
        { label: "options 24 apart", sel: ".radio-field-options", get: "gap", expect: "24px" },
        { label: "radio-to-label 8", sel: ".radio-field-option", get: "gap", expect: "8px" },
        {
          label: "option text Input 16px",
          sel: ".radio-field-option",
          get: "font-size",
          expect: "16px",
        },
        {
          label: "option ink Text/Primary (Figma's raw #000 not copied — designer list)",
          sel: ".radio-field-option",
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        {
          label: "composed radio is the shipped 20px control",
          sel: ".radio-field .radio",
          get: "width",
          expect: 20,
        },
        {
          label: "the field itself draws no box (unwired axes reproduced as absence)",
          sel: ".radio-field",
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
        },
      ],
      "components-radiofield--filled": [
        // Figma's Filled axis renders nothing; ours is the real checked input.
        {
          label: "checked radio renders the crimson ring (native, from .radio)",
          sel: ".radio-field .radio",
          get: "box-shadow",
          contains: true,
          expect: { token: "--color-primary" },
        },
      ],
    },
  },

  // -------------------------------------------------------------------- Tabs
  Tabs: {
    figma: "Tabs 23:825 — 7 variants: Type {Portal, Application} × Hover × Active",
    variants: 7,
    stories: {
      // BothTypes: portal row (nth 0 selected, 1 rest) then application row
      // (nth 2 selected, 3 rest) across .tab
      "components-tabs--both-types": [
        // Height 34 at every state pins the inset-shadow decision — a real
        // border would render the bordered Application type at 36.
        { label: "portal height 34", sel: ".tab-portal", get: "height", expect: 34 },
        { label: "application height 34 (the inset-shadow check)", sel: ".tab-application", get: "height", expect: 34 },
        { label: "padding-x 12", sel: ".tab", get: "padding-left", expect: "12px" },
        { label: "padding-y 7", sel: ".tab", get: "padding-top", expect: "7px" },
        { label: "gap 8", sel: ".tab", get: "gap", expect: "8px" },
        { label: "radius 4", sel: ".tab", get: "border-radius", expect: "4px" },
        { label: "icon 16", sel: ".tab svg", get: "width", expect: 16 },
        {
          label: "no text-transform (Labels styles carry none)",
          sel: ".tab",
          get: "text-transform",
          expect: "none",
        },
        // Portal selected (nth 0), portal rest (nth 1)
        {
          label: "portal active wash Action/Active",
          sel: ".tab-portal",
          get: "background-color",
          expect: { token: "--color-action-active" },
        },
        {
          label: "portal active weight 500",
          sel: ".tab-portal",
          get: "font-weight",
          expect: "500",
        },
        {
          label: "portal active+hover steps to Action/Focused (near-invisible but two real tokens)",
          sel: ".tab-portal",
          get: "background-color",
          hover: true,
          expect: { token: "--color-action-focused" },
        },
        {
          label: "portal rest has NO box",
          sel: ".tab-portal",
          nth: 1,
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
        },
        {
          label: "portal rest has no ring",
          sel: ".tab-portal",
          nth: 1,
          get: "box-shadow",
          expect: "none",
        },
        {
          label: "portal rest ink Secondary",
          sel: ".tab-portal",
          nth: 1,
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        {
          label: "portal hover ink Primary, weight UNCHANGED",
          sel: ".tab-portal",
          nth: 1,
          get: "font-weight",
          hover: true,
          expect: "400",
        },
        // Application selected (nth 0 in its row = overall .tab-application nth 0)
        {
          label: "application active ink Primary/Text",
          sel: ".tab-application",
          get: "color",
          expect: { token: "--color-primary-text" },
        },
        {
          label: "application active fill Primary/BG",
          sel: ".tab-application",
          get: "background-color",
          expect: { token: "--color-primary-bg" },
        },
        {
          label: "application active ring Primary",
          sel: ".tab-application",
          get: "box-shadow",
          contains: true,
          expect: { token: "--color-primary" },
        },
        // The undrawn combination: hover must not restyle the selected tab.
        {
          label: "application active+hover excluded (undrawn in Figma)",
          sel: ".tab-application",
          get: "background-color",
          hover: true,
          expect: { token: "--color-primary-bg" },
        },
        // Application rest (nth 1)
        {
          label: "application rest fill Paper",
          sel: ".tab-application",
          nth: 1,
          get: "background-color",
          expect: { token: "--color-surface-paper" },
        },
        {
          label: "application rest ring Stroke/Divider",
          sel: ".tab-application",
          nth: 1,
          get: "box-shadow",
          contains: true,
          expect: { token: "--color-stroke-divider" },
        },
        {
          label: "application hover fill Action/Hover, ring UNCHANGED",
          sel: ".tab-application",
          nth: 1,
          get: "box-shadow",
          contains: true,
          hover: true,
          expect: { token: "--color-stroke-divider" },
        },
        {
          label: "no real border anywhere",
          sel: ".tab-application",
          get: "border-top-width",
          expect: "0px",
        },
      ],
    },
  },

  // ---------------------------------------------------------------- Skeleton
  Skeleton: {
    figma:
      "Skeleton 525:4650 (16 shapes) + written spec 550:7998 (authoritative for the size matrix, radii, animation)",
    variants: 16,
    stories: {
      "components-skeleton--all-shapes": [
        // Radius groups — one probe per group.
        { label: "text radius 4", sel: ".skeleton-text", get: "border-radius", expect: "4px" },
        { label: "button radius 6", sel: ".skeleton-button", get: "border-radius", expect: "6px" },
        { label: "card radius 8", sel: ".skeleton-card", get: "border-radius", expect: "8px" },
        { label: "badge radius 10 (rounded-xl override)", sel: ".skeleton-badge", get: "border-radius", expect: "10px" },
        {
          label: "avatar fully round",
          sel: ".skeleton-avatar",
          get: "border-radius",
          not: true,
          expect: "10px",
        },
        // Spot dimensions across the matrix (md defaults).
        { label: "text md 200×16", sel: ".skeleton-text", get: "width", expect: 200 },
        { label: "heading md 24 tall", sel: ".skeleton-heading", get: "height", expect: 24 },
        { label: "input md 330×60", sel: ".skeleton-input", get: "width", expect: 330 },
        { label: "card md 158 tall", sel: ".skeleton-card", get: "height", expect: 158 },
        { label: "switch md 36×20", sel: ".skeleton-switch", get: "width", expect: 36 },
        { label: "radio md 20", sel: ".skeleton-radio", get: "width", expect: 20 },
        // The fill: raw #f1f1f4 — the written spec names a variable that does
        // NOT exist in the file (verified by full enumeration). Literal
        // comparison is correct here; tokenize when the designer adds it.
        {
          label: "fill raw #f1f1f4 (no matching variable exists — designer list)",
          sel: ".skeleton",
          get: "background-color",
          expect: "rgb(241, 241, 244)",
        },
        // NOTE: the pulse animation is deliberately NOT asserted here — the
        // harness freezes animations to keep colour reads deterministic. The
        // 2s ease-in-out 1→0.4 spec is pinned in CSS per the written spec.
      ],
      // The full written-spec matrix (16 shapes × 3 sizes × w/h), generated
      // from SKELETON_MATRIX above — every cell swept, not spot-checked.
      "components-skeleton--all-sizes": SKELETON_MATRIX_CHECKS,
    },
  },

  // ------------------------------------------------------------ TextSelector
  TextSelector: {
    figma: "Text Selector 1:489 — 12 variants: Hover × Active × Mobile (duplicate hover columns resolved as hover vs open)",
    variants: 12,
    stories: {
      // AllStates order: 0 closed · 1 open · 2 closed EN · 3 open EN
      "components-textselector--all-states": [
        { label: "row 18 tall", sel: ".text-selector", get: "height", expect: 18 },
        { label: "gap 4", sel: ".text-selector", get: "gap", expect: "4px" },
        {
          label: "ink-only: no box at rest",
          sel: ".text-selector",
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
        },
        { label: "globe 16", sel: ".text-selector-icon", get: "width", expect: 16 },
        { label: "chevron 18", sel: ".text-selector-chevron", get: "width", expect: 18 },
        {
          label: "rest label Tertiary",
          sel: ".text-selector-label",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
        {
          label: "rest icons Neutral/Disabled (lighter than the label)",
          sel: ".text-selector-icon",
          get: "color",
          expect: { token: "--color-neutral-disabled" },
        },
        {
          label: "hover label Secondary (the col-2 modest step)",
          sel: ".text-selector-label",
          get: "color",
          hover: true,
          hoverSel: ".text-selector",
          expect: { token: "--color-content-secondary" },
        },
        {
          label: "hover leaves the icons at rest ink",
          sel: ".text-selector-icon",
          get: "color",
          hover: true,
          hoverSel: ".text-selector",
          expect: { token: "--color-neutral-disabled" },
        },
        {
          label: "no transform on the label (Help & Caption carries none)",
          sel: ".text-selector-label",
          get: "text-transform",
          expect: "none",
        },
        // Tailwind v4's rotate-180 sets the CSS `rotate` property, not
        // `transform` (same lesson as Switch's translate).
        {
          label: "closed chevron unrotated",
          sel: ".text-selector-chevron",
          get: "rotate",
          expect: "none",
        },
        // Open (nth 1) — the col-3 two-property step
        {
          label: "open label Primary",
          sel: ".text-selector-label",
          nth: 1,
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        {
          label: "open icons Neutral/Base full opacity",
          sel: ".text-selector-icon",
          nth: 1,
          get: "color",
          expect: { token: "--color-neutral" },
        },
        {
          label: "open chevron rotates 180",
          sel: ".text-selector-chevron",
          nth: 1,
          get: "rotate",
          expect: "180deg",
        },
        {
          label: "open still has no box",
          sel: ".text-selector",
          nth: 1,
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
        },
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

  // ------------------------------------------------------------------- Owner
  Owner: {
    figma: "Owner 261:13225 — 3 variants: Type {individual, Add, company}, all 34×34, no state axis",
    variants: 3,
    stories: {
      // AllTypes order: 0 user (individual) · 1 plus (Add) · 2 building (company)
      "components-owner--all-types": [
        { label: "tile 34×34", sel: ".owner", get: "width", expect: 34 },
        { label: "tile height 34", sel: ".owner", get: "height", expect: 34 },
        {
          label: "radius 4px (authored wins over the 1x arc under-read)",
          sel: ".owner",
          get: "border-radius",
          expect: "4px",
        },
        {
          label: "fill Neutral/BG",
          sel: ".owner",
          get: "background-color",
          expect: { token: "--color-neutral-bg" },
        },
        {
          label: "no border on any tile (Add scanned NOT dashed)",
          sel: ".owner",
          get: "border-top-width",
          expect: "0px",
        },
        { label: "glyph 18px", sel: ".owner svg", get: "width", expect: 18 },
        {
          label: "glyph ink Neutral/Base",
          sel: ".owner",
          get: "color",
          expect: { token: "--color-neutral" },
        },
        // The Type axis is a glyph swap and NOTHING else — the Add and
        // company tiles must compute identically to individual.
        {
          label: "Add tile fill identical (variant = glyph swap only)",
          sel: ".owner",
          nth: 1,
          get: "background-color",
          expect: { token: "--color-neutral-bg" },
        },
        {
          label: "company tile ink identical",
          sel: ".owner",
          nth: 2,
          get: "color",
          expect: { token: "--color-neutral" },
        },

        // NOT ASSERTED: states (Figma models none — the tile is static
        // decoration); initials/text (no text layer exists in any variant —
        // Owner is icon-only, unlike the circular Avatar).
      ],
    },
  },

  // --------------------------------------------------------- OwnerContainer
  OwnerContainer: {
    figma:
      "Owner Container 274:258 — 2 variants: Property 1 {Person, Company}, 509×92.5, zero deltas beyond glyph + copy",
    variants: 2,
    stories: {
      "components-ownercontainer--person": [
        {
          label: "row height 92.5 (92 content + 0.5 hairline; fractional must survive)",
          sel: ".owner-container",
          get: "height",
          expect: 92.5,
        },
        { label: "padding x 20", sel: ".owner-container", get: "padding-left", expect: "20px" },
        { label: "padding y 16", sel: ".owner-container", get: "padding-top", expect: "16px" },
        { label: "gap 16 tile→info", sel: ".owner-container", get: "gap", expect: "16px" },
        {
          label: "divider is a box-shadow, never a border (floor-to-1px trap)",
          sel: ".owner-container",
          get: "border-bottom-width",
          expect: "0px",
        },
        {
          label: "divider shadow carries Stroke/Divider",
          sel: ".owner-container",
          get: "box-shadow",
          contains: true,
          expect: { token: "--color-stroke-divider" },
        },
        {
          label: "row draws no background (bare list row, not a card)",
          sel: ".owner-container",
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
        },
        { label: "title row pinned 34", sel: ".owner-container-title", get: "height", expect: 34 },
        {
          label: "contact row pinned 18",
          sel: ".owner-container-contact",
          get: "height",
          expect: 18,
        },
        {
          label: "name ink Content/Primary",
          sel: ".owner-container-name",
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        {
          label: "name type title-medium 16px",
          sel: ".owner-container-name",
          get: "font-size",
          expect: "16px",
        },
        {
          label: "name weight 500",
          sel: ".owner-container-name",
          get: "font-weight",
          expect: "500",
        },
        {
          label: "percent same style as name (single title-level binding; medium confidence)",
          sel: ".owner-container-percent",
          get: "font-size",
          expect: "16px",
        },
        {
          label: "percent ink Content/Primary",
          sel: ".owner-container-percent",
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        {
          label: "contact ink Content/Secondary",
          sel: ".owner-container-contact",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        {
          label: "contact type help-caption 12px",
          sel: ".owner-container-contact",
          get: "font-size",
          expect: "12px",
        },
        {
          label: "badge hidden by default (Figma's tag boolean, default false)",
          sel: ".owner-container .badge",
          get: "display",
          expect: "none",
        },
        {
          label: "composed Owner tile 34px",
          sel: ".owner-container .owner",
          get: "width",
          expect: 34,
        },
        {
          label: "actions gap 12",
          sel: ".owner-container-actions",
          get: "gap",
          expect: "12px",
        },
        {
          label: "composed Edit is the shipped micro button (12px row)",
          sel: ".owner-container .btn-micro",
          get: "height",
          expect: 12,
        },
        {
          label: "composed delete is IconButton sm+State (18px box)",
          sel: ".owner-container .icon-button",
          get: "width",
          expect: 18,
        },
      ],
      "components-ownercontainer--company": [
        // Person vs Company must be computationally identical — glyph + copy only.
        {
          label: "Company row height identical 92.5",
          sel: ".owner-container",
          get: "height",
          expect: 92.5,
        },
        {
          label: "Company name style identical",
          sel: ".owner-container-name",
          get: "font-size",
          expect: "16px",
        },
      ],
      "components-ownercontainer--with-badge": [
        {
          label: "unhidden badge renders (the tag boolean on)",
          sel: ".owner-container .badge",
          get: "height",
          expect: 16,
        },
      ],

      // NOT ASSERTED: row states (Figma models none — hover/selected/disabled
      // do not exist on either axis); long-name truncation (applied as the
      // library convention, no Figma variant tests overflow); the Figma glyph
      // layer misnames (ships #pencil / #trash-2 regardless — designer list).
    },
  },

  // --------------------------------------------------------------- TextField
  TextField: {
    figma:
      "Plain Text Field 1:291 — 9 variants: Filled × Hover × Focus × Error (partial). Error binds Warning/Base verbatim.",
    variants: 9,
    stories: {
      // AllStates order: 0 rest-empty · 1 filled · 2 error (+hint)
      "components-textfield--all-states": [
        { label: "field total 73 (label 25 + box 48)", sel: ".text-field", get: "height", expect: 73 },
        { label: "label row 25", sel: ".text-field-title-row", get: "height", expect: 25 },
        { label: "box pinned 48", sel: ".text-field-box", get: "height", expect: 48 },
        { label: "box radius 4 (authored)", sel: ".text-field-box", get: "border-radius", expect: "4px" },
        { label: "box border 1px", sel: ".text-field-box", get: "border-top-width", expect: "1px" },
        { label: "box padding 12", sel: ".text-field-box", get: "padding-left", expect: "12px" },
        {
          label: "rest border Stroke/Border",
          sel: ".text-field-box",
          get: "border-top-color",
          expect: { token: "--color-stroke-border" },
        },
        {
          label: "hover border Stroke/Hover",
          sel: ".text-field-box",
          get: "border-top-color",
          hover: true,
          expect: { token: "--color-stroke-hover" },
        },
        {
          label: "fill Paper (constant across states)",
          sel: ".text-field-box",
          get: "background-color",
          expect: { token: "--color-surface-paper" },
        },
        {
          label: "label ink Content/Secondary (never recolours)",
          sel: ".text-field-title",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        { label: "label type label-strong 14", sel: ".text-field-title", get: "font-size", expect: "14px" },
        {
          label: "placeholder ink Content/Hint",
          sel: ".text-field-input",
          get: "::placeholder.color",
          expect: { token: "--color-content-hint" },
        },
        { label: "input type 16/24", sel: ".text-field-input", get: "font-size", expect: "16px" },
        {
          label: "value ink Content/Primary",
          sel: ".text-field-input",
          nth: 1,
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        // Error (nth 2) — the Warning ramp, verbatim from Figma.
        {
          label: "error border Warning/Base (NOT the Error ramp)",
          sel: ".text-field-box",
          nth: 2,
          get: "border-top-color",
          expect: { token: "--color-warning" },
        },
        {
          label: "error+hover UNCHANGED (unwired in Figma — no Stroke/Hover leak)",
          sel: ".text-field-box",
          nth: 2,
          get: "border-top-color",
          hover: true,
          expect: { token: "--color-warning" },
        },
        {
          label: "error label ink unchanged",
          sel: ".text-field-title",
          nth: 2,
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        {
          label: "error hint ink Warning/Text (inferred binding — designer to confirm)",
          sel: ".text-field-hint",
          get: "color",
          expect: { token: "--color-warning-text" },
        },
        // Focus — click into the field, let the border/outline transition settle.
        {
          label: "focus border Primary",
          sel: ".text-field-box",
          get: "border-top-color",
          before: [{ click: ".text-field-input", wait: 450 }],
          expect: { token: "--color-primary" },
        },
        {
          label: "focus ring 3px",
          sel: ".text-field-box",
          get: "outline-width",
          before: [{ click: ".text-field-input", wait: 450 }],
          expect: "3px",
        },
        {
          label: "focus ring Primary/Ring",
          sel: ".text-field-box",
          get: "outline-color",
          before: [{ click: ".text-field-input", wait: 450 }],
          expect: { token: "--color-primary-ring" },
        },
        // The compound Figma draws: amber border + crimson ring on error+focus.
        {
          label: "error+focus border STAYS Warning (amber wins the tie)",
          sel: ".text-field-box",
          nth: 2,
          get: "border-top-color",
          before: [{ click: ".text-field:nth-of-type(3) .text-field-input", wait: 450 }],
          expect: { token: "--color-warning" },
        },
        {
          label: "error+focus ring STILL crimson Primary/Ring",
          sel: ".text-field-box",
          nth: 2,
          get: "outline-color",
          before: [{ click: ".text-field:nth-of-type(3) .text-field-input", wait: 450 }],
          expect: { token: "--color-primary-ring" },
        },
      ],
      "components-textfield--with-slots": [
        { label: "icon slot 18", sel: ".text-field-icon", get: "width", expect: 18 },
        { label: "help icon-button 18", sel: ".text-field-help", get: "width", expect: 18 },
        { label: "hint type help-caption 12", sel: ".text-field-hint", get: "font-size", expect: "12px" },
        {
          label: "hint ink Content/Secondary (non-error)",
          sel: ".text-field-hint",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
      ],

      // NOT ASSERTED: disabled (no axis in Figma — flagged as a real-form gap,
      // designer list); empty+error and hover+focus (undrawn; focus wins by
      // source order — library decision).
    },
  },

  // ----------------------------------------------------------- DropdownField
  DropdownField: {
    figma:
      "Dropdown Field 1:358 — 9 variants (same partial matrix as TextField) + chevron 180° flip on the open state.",
    variants: 9,
    stories: {
      // AllStates order: 0 placeholder · 1 filled · 2 open · 3 error(+hint) · 4 error+open
      "components-dropdownfield--all-states": [
        { label: "field total 73 (no hint)", sel: ".dropdown-field", get: "height", expect: 73 },
        { label: "trigger pinned 48", sel: ".dropdown-field-trigger", get: "height", expect: 48 },
        { label: "trigger radius 4", sel: ".dropdown-field-trigger", get: "border-radius", expect: "4px" },
        { label: "trigger px 12", sel: ".dropdown-field-trigger", get: "padding-left", expect: "12px" },
        { label: "trigger gap 8", sel: ".dropdown-field-trigger", get: "gap", expect: "8px" },
        { label: "chevron 18", sel: ".dropdown-field-chevron", get: "width", expect: 18 },
        {
          label: "rest border Stroke/Border",
          sel: ".dropdown-field-trigger",
          get: "border-top-color",
          expect: { token: "--color-stroke-border" },
        },
        {
          label: "hover border Stroke/Hover",
          sel: ".dropdown-field-trigger",
          get: "border-top-color",
          hover: true,
          expect: { token: "--color-stroke-hover" },
        },
        {
          label: "placeholder ink Content/Hint",
          sel: ".dropdown-field-value",
          get: "color",
          expect: { token: "--color-content-hint" },
        },
        {
          label: "value ink Content/Primary",
          sel: ".dropdown-field-value",
          nth: 1,
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        {
          label: "chevron ink Neutral/Base at rest",
          sel: ".dropdown-field-chevron",
          get: "color",
          expect: { token: "--color-neutral" },
        },
        { label: "chevron closed: no rotation", sel: ".dropdown-field-chevron", get: "rotate", expect: "none" },
        // Open (nth 2): Primary border + ring + 180° chevron.
        {
          label: "open border Primary",
          sel: ".dropdown-field-trigger",
          nth: 2,
          get: "border-top-color",
          expect: { token: "--color-primary" },
        },
        {
          label: "open ring 3px",
          sel: ".dropdown-field-trigger",
          nth: 2,
          get: "outline-width",
          expect: "3px",
        },
        {
          label: "open chevron rotated 180",
          sel: ".dropdown-field-chevron",
          nth: 2,
          get: "rotate",
          expect: "180deg",
        },
        // Error (nth 3): amber border, chevron ink UNCHANGED.
        {
          label: "error border Warning/Base (NOT the Error ramp)",
          sel: ".dropdown-field-trigger",
          nth: 3,
          get: "border-top-color",
          expect: { token: "--color-warning" },
        },
        {
          label: "error+hover UNCHANGED (unwired)",
          sel: ".dropdown-field-trigger",
          nth: 3,
          get: "border-top-color",
          hover: true,
          expect: { token: "--color-warning" },
        },
        {
          label: "error chevron ink STILL Neutral/Base (no amber tint)",
          sel: ".dropdown-field-chevron",
          nth: 3,
          get: "color",
          expect: { token: "--color-neutral" },
        },
        {
          label: "error hint ink Warning/Text (inferred — designer to confirm)",
          sel: ".dropdown-field-hint",
          get: "color",
          expect: { token: "--color-warning-text" },
        },
        // Error+open (nth 4): the compound — amber border wins, ring + flip persist.
        {
          label: "error+open border STAYS Warning",
          sel: ".dropdown-field-trigger",
          nth: 4,
          get: "border-top-color",
          expect: { token: "--color-warning" },
        },
        {
          label: "error+open ring STILL applies",
          sel: ".dropdown-field-trigger",
          nth: 4,
          get: "outline-width",
          expect: "3px",
        },
        {
          label: "error+open chevron still flipped",
          sel: ".dropdown-field-chevron",
          nth: 4,
          get: "rotate",
          expect: "180deg",
        },
        {
          label: "fill Paper constant",
          sel: ".dropdown-field-trigger",
          nth: 4,
          get: "background-color",
          expect: { token: "--color-surface-paper" },
        },
      ],

      // NOT ASSERTED: disabled / empty+error / hover+open (undrawn in Figma);
      // bare :focus-visible border+ring (the harness cannot hold synthetic
      // keyboard focus reliably — wired identically to [aria-expanded] minus
      // the rotation, pinned by code review); panel positioning (consumer's).
    },
  },

  // ---------------------------------------------------------------- TextArea
  TextArea: {
    figma:
      "Text Area Field 199:12523 — 6 variants (Filled × Hover × Focus). No Error axis. py-10 is authored (family inconsistency).",
    variants: 6,
    stories: {
      // AllStates order: 0 empty · 1 filled(multi-line) · 2 empty+hint
      "components-textarea--all-states": [
        { label: "field total 104 (label 25 + box 79)", sel: ".text-area", get: "height", expect: 104 },
        { label: "label row 25", sel: ".text-area-title-row", get: "height", expect: 25 },
        { label: "box pinned 79 (off-scale, arbitrary on purpose)", sel: ".text-area-input", get: "height", expect: 79 },
        {
          label: "y-padding 10 — authored, NOT the siblings' centering",
          sel: ".text-area-input",
          get: "padding-top",
          expect: "10px",
        },
        { label: "x-padding 12", sel: ".text-area-input", get: "padding-left", expect: "12px" },
        { label: "radius 4", sel: ".text-area-input", get: "border-radius", expect: "4px" },
        {
          label: "rest border Stroke/Border",
          sel: ".text-area-input",
          get: "border-top-color",
          expect: { token: "--color-stroke-border" },
        },
        {
          label: "hover border Stroke/Hover",
          sel: ".text-area-input",
          get: "border-top-color",
          hover: true,
          expect: { token: "--color-stroke-hover" },
        },
        {
          label: "focus border Primary",
          sel: ".text-area-input",
          get: "border-top-color",
          before: [{ click: ".text-area-input", wait: 450 }],
          expect: { token: "--color-primary" },
        },
        {
          label: "focus ring 3px Primary/Ring",
          sel: ".text-area-input",
          get: "outline-color",
          before: [{ click: ".text-area-input", wait: 450 }],
          expect: { token: "--color-primary-ring" },
        },
        {
          label: "fill Paper constant",
          sel: ".text-area-input",
          get: "background-color",
          expect: { token: "--color-surface-paper" },
        },
        {
          label: "placeholder ink Content/Hint",
          sel: ".text-area-input",
          get: "::placeholder.color",
          expect: { token: "--color-content-hint" },
        },
        {
          label: "value ink Content/Primary",
          sel: ".text-area-input",
          nth: 1,
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        {
          label: "resize none (library decision — Figma draws no grabber)",
          sel: ".text-area-input",
          get: "resize",
          expect: "none",
        },
        {
          label: "wrapping enabled (regression guard vs Figma's copy-paste nowrap defect)",
          sel: ".text-area-input",
          get: "white-space",
          not: true,
          expect: "nowrap",
        },
        {
          label: "label ink Content/Secondary",
          sel: ".text-area-title",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        {
          label: "hint ink Content/Secondary",
          sel: ".text-area-hint",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
      ],

      // NOT ASSERTED: Error (no axis exists — none invented); disabled;
      // hover+focus (undrawn; focus wins by source order).
    },
  },
};
