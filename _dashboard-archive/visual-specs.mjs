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
  // ---------------------------------------------------------- NavigationRail
  NavigationRail: {
    figma:
      "Nav Rail 728:20677 (2) · Nav Items 723:18649 (10) · " +
      "Nav Group Container 726:18779 (8) · Nav Badge 724:18701 (2) · " +
      "Nav Title 727:18963 (4)",
    /** Variants drawn in Figma across the rail and its four sub-components. */
    variants: 26,
    stories: {
      "components-navigationrail--item-states": [
        {
          label: "item height 32",
          sel: ".nav-item",
          get: "height",
          expect: 32,
        },
        {
          label: "item radius 4 (Radius/XS)",
          sel: ".nav-item",
          get: "border-radius",
          expect: "4px",
        },
        {
          label: "item padding-x 8",
          sel: ".nav-item",
          get: "padding-left",
          expect: "8px",
        },
        { label: "item gap 12", sel: ".nav-item", get: "gap", expect: "12px" },
        {
          label: "label type 13px (Body 1 - Bold)",
          sel: ".nav-item-label",
          get: "font-size",
          expect: "13px",
        },
        {
          label: "label weight 500",
          sel: ".nav-item-label",
          get: "font-weight",
          expect: "500",
        },

        // Rest is the ONLY state where label and icon differ in colour.
        {
          label: "rest label Content/Secondary",
          sel: ".nav-item",
          nth: 0,
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        {
          label: "rest icon Content/Tertiary",
          sel: ".nav-item-icon",
          nth: 0,
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },

        // Figma "Passive" — the BLUE current-page look. Not de-emphasised.
        {
          label: "current bg Primary/Soft",
          sel: '.nav-item[aria-current="page"]',
          get: "background-color",
          expect: { token: "--color-primary-soft" },
        },
        {
          label: "current text Primary/Main",
          sel: '.nav-item[aria-current="page"]',
          get: "color",
          expect: { token: "--color-primary" },
        },

        // Figma "Active" — the NEUTRAL GREY highlight. Not the current page.
        {
          label: "active bg Action/Selected",
          sel: ".nav-item-active",
          get: "background-color",
          expect: { token: "--color-action-selected" },
        },
        {
          label: "active text Content/Primary",
          sel: ".nav-item-active",
          get: "color",
          expect: { token: "--color-content-primary" },
        },

        // Hover must be parked, or the rule is unverifiable.
        {
          label: "hover bg Action/Hover",
          sel: ".nav-item",
          nth: 0,
          get: "background-color",
          expect: { token: "--color-action-hover" },
          hover: true,
        },
        {
          label: "hover text Content/Primary",
          sel: ".nav-item",
          nth: 0,
          get: "color",
          expect: { token: "--color-content-primary" },
          hover: true,
        },
      ],

      "components-navigationrail--item-slots": [
        {
          label: "count type 12px mono (Data xs)",
          sel: ".nav-item-count",
          get: "font-size",
          expect: "12px",
        },
        {
          label: "count Content/Tertiary in every state",
          sel: ".nav-item-count",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
        {
          label: "badge height 14",
          sel: ".nav-badge",
          get: "height",
          expect: 14,
        },
        {
          label: "badge radius 2 (Radius/Micro)",
          sel: ".nav-badge",
          get: "border-radius",
          expect: "2px",
        },
        {
          label: "badge padding-x 4",
          sel: ".nav-badge",
          get: "padding-left",
          expect: "4px",
        },
        {
          label: "badge bg Primary/Soft",
          sel: ".nav-badge",
          get: "background-color",
          expect: { token: "--color-primary-soft" },
        },
        {
          label: "badge text Primary/Dark",
          sel: ".nav-badge",
          get: "color",
          expect: { token: "--color-primary-dark" },
        },
        // Odd token for a resting element, but it is what Figma binds.
        {
          label: "badge border Primary/Disabled",
          sel: ".nav-badge",
          get: "border-top-color",
          expect: { token: "--color-primary-disabled" },
        },
        {
          label: "badge type 8.5px (Micro Data M)",
          sel: ".nav-badge",
          get: "font-size",
          expect: "8.5px",
        },
        // --text-* cannot carry font-family, so this asserts the pairing held.
        {
          label: "badge is mono",
          sel: ".nav-badge",
          get: "font-family",
          expect: "JetBrains Mono",
          contains: true,
        },
      ],

      // The real rail, expanded — Figma 728:20677 Expanded=yes.
      "components-navigationrail--rail": [
        {
          label: "rail width 240",
          sel: ".nav-rail",
          get: "width",
          expect: 240,
        },
        // 8px horizontal, 0 vertical, and it does NOT change on collapse.
        {
          label: "rail padding-x 8",
          sel: ".nav-rail",
          get: "padding-left",
          expect: "8px",
        },
        {
          label: "rail padding-y 0",
          sel: ".nav-rail",
          get: "padding-top",
          expect: "0px",
        },
        // The 149px of slack in Figma is absorbed this way — there is no spacer
        // node, so the footer is pinned by the container's own distribution.
        {
          label: "footer pinned via space-between",
          sel: ".nav-rail",
          get: "justify-content",
          expect: "space-between",
        },
        // The rail is transparent: no fill, border, or shadow in either variant.
        {
          label: "rail has no surface of its own",
          sel: ".nav-rail",
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
        },
        {
          label: "rail has no border",
          sel: ".nav-rail",
          get: "border-top-width",
          expect: "0px",
        },
        {
          label: "section gap 20",
          sel: ".nav-rail-content",
          get: "gap",
          expect: "20px",
        },
        // Rows butt directly against each other; the breathing room is the 32px
        // row height against a 19.5px line box.
        {
          label: "gap inside a section 0",
          sel: ".nav-rail-section",
          get: "gap",
          expect: "0px",
        },
        // Composition check: items FILL the 224px column. Figma's standalone
        // 208px never appears inside the rail.
        {
          label: "item fills column 224",
          sel: ".nav-item",
          get: "width",
          expect: 224,
        },
        {
          label: "title fills column 224",
          sel: ".nav-title",
          get: "width",
          expect: 224,
        },
        {
          label: "group fills column 224",
          sel: ".nav-group",
          get: "width",
          expect: 224,
        },
        // Three status-dot colours are in use; neutral is the unqualified base.
        {
          label: "status dot base Neutral/Main",
          sel: ".nav-item-status:not([class*=' nav-item-status-'])",
          get: "background-color",
          expect: { token: "--color-neutral" },
        },
        {
          label: "status dot warning",
          sel: ".nav-item-status-warning",
          get: "background-color",
          expect: { token: "--color-warning" },
        },
        {
          label: "status dot primary",
          sel: ".nav-item-status-primary",
          get: "background-color",
          expect: { token: "--color-primary" },
        },
        {
          label: "status dot 5px",
          sel: ".nav-item-status",
          get: "width",
          expect: 5,
        },
      ],

      // The same rail collapsed — one class on the container flips every part.
      "components-navigationrail--rail-collapsed": [
        {
          label: "collapsed rail width 60",
          sel: ".nav-rail",
          get: "width",
          expect: 60,
        },
        // Padding is unchanged; only the content column narrows.
        {
          label: "collapsed padding-x still 8",
          sel: ".nav-rail",
          get: "padding-left",
          expect: "8px",
        },
        {
          label: "item fills column 44",
          sel: ".nav-item",
          get: "width",
          expect: 44,
        },
        {
          label: "item centres its icon",
          sel: ".nav-item",
          get: "justify-content",
          expect: "center",
        },
        // sr-only, NOT display:none. Before this, axe found 16 of 21 focusable
        // nodes in the collapsed rail with no accessible name — the label is a
        // nav item's only text, so hiding it with `display:none` leaves an
        // anonymous link in the tab order. Asserted both halves: invisible, and
        // still in the accessibility tree.
        {
          label: "collapsed item label visually hidden (1px)",
          sel: ".nav-item-label",
          get: "width",
          expect: 1,
        },
        {
          label: "collapsed item label still named (not display:none)",
          sel: ".nav-item-label",
          get: "display",
          expect: "none",
          not: true,
        },
        {
          label: "collapsed title keeps its name (details sr-only)",
          sel: ".nav-title-details",
          get: "width",
          expect: 1,
        },
        // The badge genuinely goes: Figma drops it, and left visible it
        // rendered 30.4px in a 44px row — 7px of overflow.
        {
          label: "collapsed badge dropped",
          sel: ".nav-badge",
          get: "display",
          expect: "none",
        },
        {
          label: "title fills column 44",
          sel: ".nav-title",
          get: "width",
          expect: 44,
        },

        {
          label: "title action dropped",
          sel: ".nav-title-action",
          get: "display",
          expect: "none",
        },
        // CORRECTED BY THE RAIL SPEC. The standalone group hugs to 38.5px, and
        // that half pixel looked like an artefact. Inside the rail all three
        // headers are set to fill, so they render 44 wide like everything else.
        // 38.5 is the hug width of a component nobody uses standalone.
        {
          label: "group fills column 44 (not 38.5)",
          sel: ".nav-group",
          get: "width",
          expect: 44,
        },
        {
          label: "group height still 26",
          sel: ".nav-group",
          get: "height",
          expect: 26,
        },
        // sr-only, NOT display:none — .nav-group is a <button>, and dropping its
        // only text would leave it with no accessible name. Hidden visually,
        // present in the accessibility tree. Asserted both ways.
        {
          label: "collapsed label visually hidden (1px)",
          sel: ".nav-group-label",
          get: "width",
          expect: 1,
        },
        {
          label: "collapsed label still in a11y tree (not display:none)",
          sel: ".nav-group-label",
          get: "display",
          expect: "none",
          not: true,
        },
        {
          label: "collapsed label out of flow",
          sel: ".nav-group-label",
          get: "position",
          expect: "absolute",
        },
        {
          label: "rule shown",
          sel: ".nav-group-rule",
          get: "display",
          expect: "block",
        },
        {
          label: "rule width 22.5",
          sel: ".nav-group-rule",
          get: "width",
          expect: 22.5,
        },
        {
          label: "rule Stroke/Divider",
          sel: ".nav-group-rule",
          get: "border-top-color",
          expect: { token: "--color-stroke-divider" },
        },
        // The footer survives collapse — Settings and Collapse stay as icon rows.
        {
          label: "footer still present",
          sel: ".nav-rail-footer .nav-item",
          get: "width",
          expect: 44,
        },
      ],

      // Group disclosure. Figma draws only the chevron rotation, so the
      // hiding is ours — which makes it exactly the kind of behaviour that
      // needs pinning, since nothing in the design file would catch a
      // regression.
      "components-navigationrail--group-collapsed": [
        {
          label: "closed group hides its rows",
          sel: "#closed-1",
          get: "display",
          expect: "none",
        },
        {
          label: "open sibling group keeps its rows",
          sel: "#closed-2",
          get: "display",
          expect: "flex",
        },
        {
          label: "closed chevron rotated",
          sel: '.nav-group[aria-expanded="false"] .nav-group-chevron',
          get: "rotate",
          expect: "-90deg",
        },
        // Disclosure is deliberately inert in a collapsed rail: the header is a
        // bare rule there, so hiding rows would strand them with no affordance.
        {
          label: "collapsed rail ignores disclosure",
          sel: "#closed-3",
          get: "display",
          expect: "flex",
        },
      ],

      "components-navigationrail--title": [
        {
          label: "title height 46",
          sel: ".nav-title",
          get: "height",
          expect: 46,
        },
        {
          label: "title radius 4 (Radius/XS)",
          sel: ".nav-title",
          get: "border-radius",
          expect: "4px",
        },
        {
          label: "title padding-x 8",
          sel: ".nav-title",
          get: "padding-left",
          expect: "8px",
        },
        { label: "title gap 8", sel: ".nav-title", get: "gap", expect: "8px" },
        {
          label: "logo tile 30px",
          sel: ".nav-title-logo",
          get: "width",
          expect: 30,
        },
        {
          label: "logo tile radius 6 (Radius/SM)",
          sel: ".nav-title-logo",
          get: "border-radius",
          expect: "6px",
        },
        {
          label: "logo tile bg Surface/Paper",
          sel: ".nav-title-logo",
          get: "background-color",
          expect: { token: "--color-surface-paper" },
        },
        {
          label: "logo tile border Stroke/Divider",
          sel: ".nav-title-logo",
          get: "border-top-color",
          expect: { token: "--color-stroke-divider" },
        },
        // Style is named "Body 1 - Bold" but resolves to Medium/500 in Figma.
        {
          label: "name type 13px",
          sel: ".nav-title-name",
          get: "font-size",
          expect: "13px",
        },
        {
          label: "name weight 500 not 700",
          sel: ".nav-title-name",
          get: "font-weight",
          expect: "500",
        },
        {
          label: "name Content/Primary",
          sel: ".nav-title-name",
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        {
          label: "subtitle type 11px",
          sel: ".nav-title-subtitle",
          get: "font-size",
          expect: "11px",
        },
        {
          label: "subtitle Content/Secondary",
          sel: ".nav-title-subtitle",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        {
          label: "action box 18px",
          sel: ".nav-title-action",
          get: "width",
          expect: 18,
        },
        // Hover is a single-property change on this component: background only.
        {
          label: "title hover bg Action/Hover",
          sel: ".nav-title",
          nth: 0,
          get: "background-color",
          expect: { token: "--color-action-hover" },
          hover: true,
        },
      ],

      "components-navigationrail--groups": [
        {
          label: "group height 26",
          sel: ".nav-group",
          get: "height",
          expect: 26,
        },
        {
          label: "group radius 4 (Radius/XS)",
          sel: ".nav-group",
          get: "border-radius",
          expect: "4px",
        },
        {
          label: "group padding-x 8",
          sel: ".nav-group",
          get: "padding-left",
          expect: "8px",
        },
        { label: "group gap 3", sel: ".nav-group", get: "gap", expect: "3px" },
        // Style named "Micro L - Bold" resolves to Medium/500, and is NOT
        // uppercase — Figma renders "Analyze" in mixed case.
        {
          label: "label type 11px",
          sel: ".nav-group-label",
          get: "font-size",
          expect: "11px",
        },
        {
          label: "label weight 500",
          sel: ".nav-group-label",
          get: "font-weight",
          expect: "500",
        },
        {
          label: "label Content/Tertiary",
          sel: ".nav-group-label",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
        {
          label: "label NOT uppercase",
          sel: ".nav-group-label",
          get: "text-transform",
          expect: "none",
        },
        // The chevron is hover-only in Figma. That is why the row grows
        // 58 -> 77px on hover, and why a collapsed group is indistinguishable
        // from an open one at rest. Both halves asserted.
        {
          label: "chevron hidden at rest",
          sel: ".nav-group-chevron",
          nth: 0,
          get: "display",
          expect: "none",
        },
        // Hover the GROUP and measure the CHEVRON — the chevron has no box of
        // its own until the group is hovered, so it cannot be its own hover
        // target. This is what `hoverSel` is for.
        {
          label: "chevron revealed by hovering the group",
          sel: ".nav-group-chevron",
          nth: 0,
          get: "display",
          expect: "none",
          not: true,
          hover: true,
          hoverSel: ".nav-group",
          hoverNth: 0,
        },
        {
          label: "group hover bg Action/Hover",
          sel: ".nav-group",
          nth: 0,
          get: "background-color",
          expect: { token: "--color-action-hover" },
          hover: true,
        },
        // Same glyph rotated, not a swapped icon.
        // Tailwind v4 emits the standalone `rotate` property, not `transform`,
        // so `transform` reads as "none" here — same assertion style as
        // DropdownField and Pill. No hover needed: the rotation is not
        // hover-dependent, and `rotate` resolves while display:none.
        {
          label: "collapsed group chevron rotated -90deg",
          sel: '.nav-group[aria-expanded="false"] .nav-group-chevron',
          get: "rotate",
          expect: "-90deg",
        },
      ],
    },
  },

  // ----------------------------------------------------------------- Button
  Button: {
    figma: "Button 73:180 — 42 variants",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 42,
    stories: {
      "components-button--small": [
        { label: "sm height", sel: ".btn", get: "height", expect: 24 },
        {
          label: "sm padding-x",
          sel: ".btn",
          get: "padding-left",
          expect: "8px",
        },
        { label: "sm gap", sel: ".btn", get: "gap", expect: "5px" },
        // Each size uses a DIFFERENT Figma text style. One shared style was
        // shipped until 2026-08-22, which was wrong for sm and md.
        {
          label: "sm type = Action S",
          sel: ".btn",
          get: "font-size",
          expect: "12px",
        },
      ],
      "components-button--default": [
        { label: "md height", sel: ".btn", get: "height", expect: 28 },
        {
          label: "md padding-x",
          sel: ".btn",
          get: "padding-left",
          expect: "12px",
        },
        { label: "md gap", sel: ".btn", get: "gap", expect: "5px" },
        {
          label: "md type = Action M",
          sel: ".btn",
          get: "font-size",
          expect: "12.5px",
        },
        {
          label: "radius",
          sel: ".btn",
          get: "border-top-left-radius",
          expect: "6px",
        },
      ],
      "components-button--large": [
        { label: "lg height", sel: ".btn", get: "height", expect: 32 },
        {
          label: "lg padding-x",
          sel: ".btn",
          get: "padding-left",
          expect: "16px",
        },
        { label: "lg gap", sel: ".btn", get: "gap", expect: "6px" },
        {
          label: "lg type = Action L",
          sel: ".btn",
          get: "font-size",
          expect: "13px",
        },
      ],
      "components-button--all-variants": [
        {
          label: "primary fill",
          sel: ".btn-primary",
          get: "background-color",
          expect: { token: "--color-primary" },
        },
        {
          label: "primary text",
          sel: ".btn-primary",
          get: "color",
          expect: { token: "--color-content-contrast" },
        },
        {
          label: "outline hairline",
          sel: ".btn-outline",
          get: "border-top-color",
          expect: { token: "--color-stroke-divider" },
        },
        {
          label: "outline text",
          sel: ".btn-outline",
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        {
          label: "outline disabled dimmed",
          sel: ".btn-outline:disabled",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
        {
          label: "empty disabled dimmed",
          sel: ".btn-empty:disabled",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
        // Modal scopes its footer cancel label to Content/Secondary. Pin the
        // unscoped default so that override cannot quietly become global.
        {
          label: "empty text is Content/Primary",
          sel: ".btn-empty",
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        // btn-critical is NOT in Figma's Button set — it comes from Modal's
        // destructive confirm. Asserted here because it lives in button.css.
        {
          label: "critical fill",
          sel: ".btn-critical",
          get: "background-color",
          expect: { token: "--color-critical" },
        },
        {
          label: "critical text",
          sel: ".btn-critical",
          get: "color",
          expect: { token: "--color-content-contrast" },
        },
        // --- The interaction matrix ---------------------------------------
        // None of this was asserted before 2026-08-24, which is why two bugs
        // shipped: .btn-empty had no hover or selected at all, and a bare .btn
        // took outline's rest appearance while responding to nothing.

        // Figma gives outline and empty ONE ramp, so assert they agree.
        {
          label: "outline hover is Action/Subtle",
          sel: ".btn-outline",
          get: "background-color",
          expect: { token: "--color-action-subtle" },
          hover: true,
        },
        {
          label: "empty hover is Action/Subtle too",
          sel: ".btn-empty",
          get: "background-color",
          expect: { token: "--color-action-subtle" },
          hover: true,
        },
        {
          label: "outline selected is Action/Hover",
          sel: '.btn-outline[aria-selected="true"]',
          get: "background-color",
          expect: { token: "--color-action-hover" },
        },
        {
          label: "empty selected is Action/Hover too",
          sel: '.btn-empty[aria-selected="true"]',
          get: "background-color",
          expect: { token: "--color-action-hover" },
        },
        // Empty keeps no border in any state; outline keeps its hairline.
        {
          label: "empty stays borderless when selected",
          sel: '.btn-empty[aria-selected="true"]',
          get: "border-top-color",
          expect: "rgba(0, 0, 0, 0)",
        },

        // A bare .btn must behave exactly like .btn-outline, not merely look
        // like it at rest — that equivalence is the whole point of the base.
        {
          label: "bare .btn rest matches outline",
          sel: "#bare-rest",
          get: "border-top-color",
          expect: { token: "--color-stroke-divider" },
        },
        {
          label: "bare .btn hovers",
          sel: "#bare-rest",
          get: "background-color",
          expect: { token: "--color-action-subtle" },
          hover: true,
        },
        {
          label: "bare .btn is NOT inert on hover",
          sel: "#bare-rest",
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
          not: true,
          hover: true,
        },
        {
          label: "bare .btn shows selection",
          sel: "#bare-selected",
          get: "background-color",
          expect: { token: "--color-action-hover" },
        },

        // The filled displays must override the base ramp on every axis. The
        // text colour is the one that regressed while making this change: the
        // base :active sets Primary/Main, so a pressed primary went blue-on-blue.
        {
          label: "primary hover is Primary/Dark",
          sel: ".btn-primary",
          get: "background-color",
          expect: { token: "--color-primary-dark" },
          hover: true,
        },
        {
          label: "primary hover is NOT the base ramp",
          sel: ".btn-primary",
          get: "background-color",
          expect: { token: "--color-action-subtle" },
          not: true,
          hover: true,
        },
        {
          label: "primary keeps its label on hover",
          sel: ".btn-primary",
          get: "color",
          expect: { token: "--color-content-contrast" },
          hover: true,
        },
        {
          label: "critical hover is Critical/Strong",
          sel: ".btn-critical",
          get: "background-color",
          expect: { token: "--color-critical-strong" },
          hover: true,
        },
        {
          label: "critical keeps its label on hover",
          sel: ".btn-critical",
          get: "color",
          expect: { token: "--color-content-contrast" },
          hover: true,
        },
        // Filled variants never grow the base ramp's border.
        {
          label: "primary stays borderless on hover",
          sel: ".btn-primary",
          get: "border-top-color",
          expect: "rgba(0, 0, 0, 0)",
          hover: true,
        },

        {
          label: "critical hover steps darker",
          sel: ".btn-critical",
          get: "background-color",
          expect: { token: "--color-critical-strong" },
          hover: true,
        },
      ],
      // The Disabled story is the PRIMARY variant, whose label stays contrast
      // because its fill already drops to Primary/Disabled. The dimmed label
      // applies to the non-filled variants, which live in AllVariants.
      "components-button--disabled": [
        {
          label: "primary disabled keeps contrast",
          sel: ".btn-primary",
          get: "color",
          expect: { token: "--color-content-contrast" },
        },
      ],
    },
  },

  // ------------------------------------------------------------------ Input
  Input: {
    figma: "Text Input Container 854:24665 — 96 variants",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 84,
    stories: {
      "components-input--all-sizes": [
        {
          label: "sm height",
          sel: ".input-field.input-sm",
          get: "height",
          expect: 25,
        },
        {
          label: "md height",
          sel: ".input-field.input-md",
          get: "height",
          expect: 29,
        },
        {
          label: "lg height",
          sel: ".input-field.input-lg",
          get: "height",
          expect: 35,
        },
        {
          label: "sm padding-y",
          sel: ".input-field.input-sm",
          get: "padding-top",
          expect: "5.5px",
        },
        {
          label: "md padding-y",
          sel: ".input-field.input-md",
          get: "padding-top",
          expect: "4px",
        },
        {
          label: "lg padding-y",
          sel: ".input-field.input-lg",
          get: "padding-top",
          expect: "7px",
        },
        {
          label: "sm padding-x",
          sel: ".input-field.input-sm",
          get: "padding-left",
          expect: "8px",
        },
        {
          label: "md padding-x",
          sel: ".input-field.input-md",
          get: "padding-left",
          expect: "10px",
        },
        {
          label: "lg padding-x",
          sel: ".input-field.input-lg",
          get: "padding-left",
          expect: "12px",
        },
        {
          label: "sm type",
          sel: ".input-field.input-sm",
          get: "font-size",
          expect: "11px",
        },
        {
          label: "md type",
          sel: ".input-field.input-md",
          get: "font-size",
          expect: "13px",
        },
        {
          label: "lg type",
          sel: ".input-field.input-lg",
          get: "font-size",
          expect: "13px",
        },
        {
          label: "radius",
          sel: ".input-field.input-lg",
          get: "border-top-left-radius",
          expect: "6px",
        },
      ],
      // A 14px icon must not push the row past its Figma frame.
      "components-input--with-icons": [
        {
          label: "lg + 14px icon height",
          sel: ".input-field",
          get: "height",
          expect: 35,
        },
      ],
      "components-input--background-variants": [
        {
          label: "BG=Neutral is Surface/Card",
          sel: ".input-field.input-bg-neutral",
          get: "background-color",
          expect: { token: "--color-surface-card" },
        },
      ],
      "components-input--interactive": [
        {
          label: "placeholder colour",
          sel: ".input",
          get: "::placeholder.color",
          expect: { token: "--color-content-tertiary" },
        },
      ],
      "components-input--error-state": [
        {
          label: "error hairline",
          sel: ".input-field.input-error",
          get: "border-top-color",
          expect: { token: "--color-critical" },
        },
      ],
    },
  },

  // -------------------------------------------------------------- Textarea
  Textarea: {
    figma: "Text Field Container 854:24876 — 12 variants, no Size property",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 12,
    stories: {
      // Height is deliberately NOT asserted: the field hugs its <textarea> and
      // the consumer owns the size via `rows`, a utility, or the resize handle.
      "components-textarea--interactive": [
        {
          label: "padding-y",
          sel: ".textarea-field",
          get: "padding-top",
          expect: "7px",
        },
        {
          label: "padding-x",
          sel: ".textarea-field",
          get: "padding-left",
          expect: "12px",
        },
        {
          label: "radius",
          sel: ".textarea-field",
          get: "border-top-left-radius",
          expect: "6px",
        },
        { label: "type", sel: ".textarea", get: "font-size", expect: "13px" },
        {
          label: "resizable",
          sel: ".textarea",
          get: "resize",
          expect: "vertical",
        },
        {
          label: "background",
          sel: ".textarea-field",
          get: "background-color",
          expect: { token: "--color-surface-paper" },
        },
      ],
      "components-textarea--background-variants": [
        {
          label: "BG=Neutral is Surface/Card",
          sel: ".textarea-field.textarea-bg-neutral",
          get: "background-color",
          expect: { token: "--color-surface-card" },
        },
      ],
    },
  },

  // --------------------------------------------------------- DropdownField
  DropdownField: {
    figma: "Dropdown Field Container 854:24966 — 36 variants",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 36,
    stories: {
      "components-dropdownfield--all-sizes": [
        {
          label: "sm height",
          sel: ".dropdown-field-sm",
          get: "height",
          expect: 25,
        },
        {
          label: "md height",
          sel: ".dropdown-field-md",
          get: "height",
          expect: 29,
        },
        {
          label: "lg height",
          sel: ".dropdown-field-lg",
          get: "height",
          expect: 35,
        },
        {
          label: "sm padding-x",
          sel: ".dropdown-field-sm",
          get: "padding-left",
          expect: "8px",
        },
        {
          label: "sm gap",
          sel: ".dropdown-field-sm",
          get: "gap",
          expect: "6px",
        },
        {
          label: "lg padding-x",
          sel: ".dropdown-field-lg",
          get: "padding-left",
          expect: "12px",
        },
        {
          label: "lg gap",
          sel: ".dropdown-field-lg",
          get: "gap",
          expect: "8px",
        },
      ],
      "components-dropdownfield--background-variants": [
        {
          label: "BG=Neutral is Surface/Card",
          sel: ".dropdown-field-bg-neutral",
          get: "background-color",
          expect: { token: "--color-surface-card" },
        },
      ],
      // The whole point of this component: it has to actually open.
      "components-dropdownfield--interactive": [
        {
          label: "panel starts closed",
          sel: ".dropdown-panel",
          get: "visible",
          expect: false,
        },
        {
          label: "opens on click",
          sel: ".dropdown-panel",
          get: "visible",
          expect: true,
          before: [{ click: ".dropdown-field" }],
        },
        {
          label: "chevron flips",
          sel: ".dropdown-field-chevron",
          get: "rotate",
          expect: "180deg",
        },
        {
          label: "open ring",
          sel: ".dropdown-field",
          get: "outline-width",
          expect: "2px",
        },
        {
          label: "closes on select",
          sel: ".dropdown-panel",
          get: "visible",
          expect: false,
          before: [{ click: ".dropdown-panel .menu-item", nth: 2 }],
        },
        {
          label: "value filled in",
          sel: ".dropdown-field-value",
          get: "text",
          expect: "Monthly",
        },
        {
          label: "Escape closes",
          sel: ".dropdown-panel",
          get: "visible",
          expect: false,
          before: [{ click: ".dropdown-field" }, { key: "Escape" }],
        },
      ],
      "components-dropdownfield--error-state": [
        {
          label: "error hairline",
          sel: ".dropdown-field-error",
          get: "border-top-color",
          expect: { token: "--color-critical" },
        },
      ],
    },
  },

  // ---------------------------------------------------------- DropdownMenu
  DropdownMenu: {
    figma: "Dropdown Menu 139:798",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 1,
    stories: {
      "components-dropdownmenu--default": [
        {
          label: "panel padding",
          sel: ".dropdown-menu",
          get: "padding-top",
          expect: "4px",
        },
        {
          label: "panel radius",
          sel: ".dropdown-menu",
          get: "border-top-left-radius",
          expect: "8px",
        },
        {
          label: "panel background",
          sel: ".dropdown-menu",
          get: "background-color",
          expect: { token: "--color-surface-paper" },
        },
        {
          label: "selected row is primary",
          sel: '.menu-item[aria-selected="true"]',
          get: "color",
          expect: { token: "--color-primary" },
        },
      ],
      "components-dropdownmenu--with-divider": [
        // Chrome rounds the 0.5px token up to 1px — see CLAUDE.md.
        {
          label: "divider top rule",
          sel: ".dropdown-menu-divider",
          get: "border-top-width",
          expect: "1px",
        },
        {
          label: "divider not a box (r)",
          sel: ".dropdown-menu-divider",
          get: "border-right-width",
          expect: "0px",
        },
        {
          label: "divider not a box (b)",
          sel: ".dropdown-menu-divider",
          get: "border-bottom-width",
          expect: "0px",
        },
        {
          label: "divider not a box (l)",
          sel: ".dropdown-menu-divider",
          get: "border-left-width",
          expect: "0px",
        },
      ],
    },
  },

  // -------------------------------------------------------------- MenuItem
  MenuItem: {
    figma: "Menu Item 114:805 — 7 variants",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 7,
    stories: {
      // Heights are content-driven on purpose: rows must grow for subtitles
      // (Figma's own Combined variant is 55px tall). The ~1px slack is Chrome's
      // Auto line box for 11px Inter (14px) vs Figma's (13px).
      "components-menuitem--all-sizes": [
        {
          // Unlike Pill's, this expectation is CORRECT — 25 is Figma's value.
          // The divergence is the renderer: the Auto line box makes the height
          // font-metric dependent, so Chrome gives 26 where Figma computes 25.
          // The fix is therefore tolerance, not a new expected value; keeping 25
          // is what preserves "Figma says 25" as the assertion.
          //
          // ±1.1 against a standing 1.0px divergence left 0.10px of slack — the
          // tightest margin in the suite, and below the ~0.9px macOS/Linux
          // rasterisation delta, so it would have failed on the next runner
          // change. ±2.5 keeps ~1.5px of real margin.
          label: "sm height (Auto ±1)",
          sel: ".menu-item-sm",
          get: "height",
          expect: 25,
          tol: 2.5,
        },
        {
          label: "md height",
          sel: ".menu-item-md",
          get: "height",
          expect: 29,
          tol: 0.6,
        },
        {
          // Same Auto-line-box divergence as sm above; 42 is Figma's value and
          // stays. 0.5px of standing divergence against ±1.1 left 0.60px, also
          // under the ~0.9px platform delta.
          label: "lg height (Auto ±1)",
          sel: ".menu-item-lg",
          get: "height",
          expect: 42,
          tol: 2.5,
        },
        { label: "gap", sel: ".menu-item-md", get: "gap", expect: "10px" },
        {
          label: "sm padding-x",
          sel: ".menu-item-sm",
          get: "padding-left",
          expect: "10px",
        },
        {
          label: "md padding-x",
          sel: ".menu-item-md",
          get: "padding-left",
          expect: "12px",
        },
        {
          label: "lg padding-y",
          sel: ".menu-item-lg",
          get: "padding-top",
          expect: "11px",
        },
      ],
      "components-menuitem--all-slots": [
        {
          label: "subtitle is tertiary",
          sel: ".menu-item-subtitle",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
        {
          label: "combined row is primary",
          sel: ".menu-item-combined",
          get: "color",
          expect: { token: "--color-primary" },
        },
        {
          label: "combined check inherits primary",
          sel: ".menu-item-combined svg.icon",
          get: "color",
          expect: { token: "--color-primary" },
        },
        { label: "avatar is 20px", sel: ".avatar", get: "height", expect: 20 },
        {
          label: "badge is 20px",
          sel: ".menu-item-badge",
          get: "height",
          expect: 20,
        },
      ],
    },
  },

  // ----------------------------------------------------------------- Avatar
  Avatar: {
    figma:
      "Avatar 79:230 — 8 variants (4 sizes x Disabled), plus a Ring boolean",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 8,
    stories: {
      // Four sizes but only THREE type styles — xs and sm share Micro S - Bold.
      "components-avatar--all-sizes": [
        { label: "xs 16px", sel: ".avatar-xs", get: "height", expect: 16 },
        { label: "sm 18px", sel: ".avatar-sm", get: "height", expect: 18 },
        { label: "md 20px", sel: ".avatar-md", get: "height", expect: 20 },
        { label: "lg 34px", sel: ".avatar-lg", get: "height", expect: 34 },
        { label: "xs is square", sel: ".avatar-xs", get: "width", expect: 16 },
        { label: "lg is square", sel: ".avatar-lg", get: "width", expect: 34 },
        {
          label: "xs type 8px",
          sel: ".avatar-xs",
          get: "font-size",
          expect: "8px",
        },
        {
          label: "sm type 8px (same as xs)",
          sel: ".avatar-sm",
          get: "font-size",
          expect: "8px",
        },
        {
          label: "md type 8.5px",
          sel: ".avatar-md",
          get: "font-size",
          expect: "8.5px",
        },
        {
          label: "lg type 11px",
          sel: ".avatar-lg",
          get: "font-size",
          expect: "11px",
        },
        {
          label: "fill",
          sel: ".avatar-md",
          get: "background-color",
          expect: { token: "--color-primary" },
        },
        {
          label: "initials colour",
          sel: ".avatar-md",
          get: "color",
          expect: { token: "--color-content-contrast" },
        },
        {
          label: "hairline",
          sel: ".avatar-md",
          get: "border-top-color",
          expect: { token: "--color-stroke-divider" },
        },
      ],
      "components-avatar--disabled": [
        {
          label: "disabled fill",
          sel: ".avatar-disabled",
          get: "background-color",
          expect: { token: "--color-primary-disabled" },
        },
        // Disabled dims the fill only — the initials must NOT dim with it.
        {
          label: "initials stay contrast",
          sel: ".avatar-disabled",
          get: "color",
          expect: { token: "--color-content-contrast" },
        },
        {
          label: "size unchanged",
          sel: ".avatar-md.avatar-disabled",
          get: "height",
          expect: 20,
        },
      ],
      "components-avatar--with-ring": [
        {
          label: "ring is inset",
          sel: ".avatar.with-ring",
          get: "--tw-ring-inset",
          expect: "inset",
        },
      ],
    },
  },

  // ------------------------------------------------------------- Breadcrumbs
  Breadcrumbs: {
    figma:
      "Breadcrumbs 880:31218 + Item 1046:22649 + Separator 1046:22654 — " +
      "restructured 2026-08-25",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 2,
    stories: {
      "components-breadcrumbs--both-variants": [
        {
          label: "row gap 8px",
          sel: ".breadcrumbs",
          get: "gap",
          expect: "8px",
        },
        {
          label: "row centres its items",
          sel: ".breadcrumbs",
          get: "align-items",
          expect: "center",
        },

        // The crumb is a padded, rounded box as of the restructure — it used to
        // be a bare text node with no geometry of its own.
        {
          label: "crumb padding-y 2px",
          sel: ".breadcrumb",
          get: "padding-top",
          expect: "2px",
        },
        {
          label: "crumb padding-x 4px",
          sel: ".breadcrumb",
          get: "padding-left",
          expect: "4px",
        },
        {
          label: "crumb radius 4px (Radius/XS)",
          sel: ".breadcrumb",
          get: "border-radius",
          expect: "4px",
        },

        // Type is now BOUND to Body 1 / Body 1 - Bold. The previous spec
        // asserted the opposite of the line-height check below.
        {
          label: "crumb 13px",
          sel: ".breadcrumb",
          get: "font-size",
          expect: "13px",
        },
        {
          label: "crumb weight 400",
          sel: ".breadcrumb",
          get: "font-weight",
          expect: "400",
        },
        {
          label: "crumb leading is 19.5 (Body 1), no longer Auto",
          sel: ".breadcrumb",
          get: "line-height",
          expect: "19.5px",
        },
        {
          label: "ancestor is Content/Secondary",
          sel: ".breadcrumb",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        {
          label: "ancestor link is not underlined",
          sel: ".breadcrumb",
          get: "text-decoration-line",
          expect: "none",
        },

        // Current now steps WEIGHT as well as colour.
        {
          label: "current is Content/Primary",
          sel: ".breadcrumb-current",
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        {
          label: "current is weight 500 (Body 1 - Bold)",
          sel: ".breadcrumb-current",
          get: "font-weight",
          expect: "500",
        },
        {
          label: "current is NOT 400",
          sel: ".breadcrumb-current",
          get: "font-weight",
          expect: "400",
          not: true,
        },
        {
          label: "current keeps 19.5 leading",
          sel: ".breadcrumb-current",
          get: "line-height",
          expect: "19.5px",
        },

        // Home icon — a step lighter than the crumbs beside it.
        {
          label: "home icon is 14px",
          sel: ".breadcrumb-home",
          get: "height",
          expect: 14,
        },
        {
          label: "home icon is Content/Tertiary",
          sel: ".breadcrumb-home",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
        {
          label: "home icon is NOT the crumb colour",
          sel: ".breadcrumb-home",
          get: "color",
          expect: { token: "--color-content-secondary" },
          not: true,
        },

        // Separators are uniform now: both types 12px Regular.
        {
          label: "separator is Content/Tertiary",
          sel: ".breadcrumb-separator",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
        {
          label: "separator is 12px",
          sel: ".breadcrumb-separator",
          get: "font-size",
          expect: "12px",
        },
        {
          label: "separator is NOT the old 13px",
          sel: ".breadcrumb-separator",
          get: "font-size",
          expect: "13px",
          not: true,
        },
        {
          label: "separator is Regular",
          sel: ".breadcrumb-separator",
          get: "font-weight",
          expect: "400",
        },
        {
          label: "separators are unselectable",
          sel: ".breadcrumb-separator",
          get: "user-select",
          expect: "none",
        },

        // The loose middot: 13px where the separators are 12, and Regular where
        // the previous design had it Bold.
        {
          label: "dot separator is 13px",
          sel: ".breadcrumb-separator-dot",
          get: "font-size",
          expect: "13px",
        },
        {
          label: "dot separator is Regular, no longer bold",
          sel: ".breadcrumb-separator-dot",
          get: "font-weight",
          expect: "400",
        },

        // Hover LAST — the harness leaves the pointer parked, so any rest-state
        // check placed after these would silently read the hovered value.
        // Figma's State=Focus is unassertable here: the harness can park a
        // pointer but cannot drive :focus-visible.
        {
          label: "hover paints a rule, not text-decoration",
          sel: ".breadcrumb",
          get: "background-image",
          expect: "linear-gradient",
          contains: true,
          hover: true,
        },
        {
          label: "hover rule is 0.5px, the authored hairline",
          sel: ".breadcrumb",
          get: "background-size",
          expect: "0.5px",
          contains: true,
          hover: true,
        },
        {
          label: "hover still adds no text-decoration",
          sel: ".breadcrumb",
          get: "text-decoration-line",
          expect: "none",
          hover: true,
        },
      ],
    },
  },

  // -------------------------------------------------------------------- Step
  Step: {
    figma:
      "Step 1032:2012 — State (Completed / Active / Upcoming), + Step Title",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 3,
    stories: {
      "components-step--all-states": [
        {
          label: "stacks vertically",
          sel: ".step",
          get: "flex-direction",
          expect: "column",
        },
        { label: "gap 6px", sel: ".step", get: "gap", expect: "6px" },
        {
          label: "centres its marker",
          sel: ".step",
          get: "align-items",
          expect: "center",
        },

        // The marker is 24px in every state — completed carries a transparent
        // border purely so the boxes agree under border-box.
        {
          label: "completed marker 24px",
          sel: ".step:not(.step-active):not(.step-upcoming) .step-marker",
          get: "width",
          expect: 24,
        },
        {
          label: "active marker 24px",
          sel: ".step-active .step-marker",
          get: "width",
          expect: 24,
        },
        {
          label: "upcoming marker 24px",
          sel: ".step-upcoming .step-marker",
          get: "width",
          expect: 24,
        },
        {
          label: "marker is a circle",
          sel: ".step-marker",
          get: "border-top-left-radius",
          expect: { token: "--radius-pill", kind: "length" },
        },

        // Completed — filled, no visible border.
        {
          label: "completed fill is Primary/Main",
          sel: ".step:not(.step-active):not(.step-upcoming) .step-marker",
          get: "background-color",
          expect: { token: "--color-primary" },
        },
        {
          label: "completed border is transparent",
          sel: ".step:not(.step-active):not(.step-upcoming) .step-marker",
          get: "border-top-color",
          expect: "rgba(0, 0, 0, 0)",
        },
        {
          label: "completed check is 12px",
          sel: ".step:not(.step-active):not(.step-upcoming) .icon",
          get: "width",
          expect: 12,
        },

        // Active — the two border widths are DIFFERENT tokens, not one value at
        // two sizes, so assert each against its own.
        {
          label: "active fill is Surface/Paper",
          sel: ".step-active .step-marker",
          get: "background-color",
          expect: { token: "--color-surface-paper" },
        },
        {
          label: "active ring is 2px (Stroke/Micro)",
          sel: ".step-active .step-marker",
          get: "border-top-width",
          expect: "2px",
        },
        {
          label: "active ring is Primary/Main",
          sel: ".step-active .step-marker",
          get: "border-top-color",
          expect: { token: "--color-primary" },
        },
        {
          label: "active number is Primary/Main",
          sel: ".step-active .step-marker",
          get: "color",
          expect: { token: "--color-primary" },
        },

        // Upcoming.
        {
          label: "upcoming ring is 1px (Stroke/Line)",
          sel: ".step-upcoming .step-marker",
          get: "border-top-width",
          expect: "1px",
        },
        {
          label: "upcoming ring is NOT 2px",
          sel: ".step-upcoming .step-marker",
          get: "border-top-width",
          expect: "2px",
          not: true,
        },
        {
          label: "upcoming ring is Content/Faint",
          sel: ".step-upcoming .step-marker",
          get: "border-top-color",
          expect: { token: "--color-content-faint" },
        },
        {
          label: "upcoming number is Neutral/Strong",
          sel: ".step-upcoming .step-marker",
          get: "color",
          expect: { token: "--color-neutral-strong" },
        },

        // Labels. The ramp is INVERTED in Figma — completed is lighter than
        // upcoming — and the weights run the other way. Both are pinned so a
        // future "tidy-up" cannot quietly normalise them.
        {
          label: "label 10px",
          sel: ".step-label",
          get: "font-size",
          expect: "10px",
        },
        {
          label: "label tracking 0.5px",
          sel: ".step-label",
          get: "letter-spacing",
          expect: "0.5px",
        },
        {
          label: "label is uppercased",
          sel: ".step-label",
          get: "text-transform",
          expect: "uppercase",
        },
        {
          label: "completed label is Content/Tertiary",
          sel: ".step:not(.step-active):not(.step-upcoming) .step-label",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
        {
          label: "active label is Primary/Main",
          sel: ".step-active .step-label",
          get: "color",
          expect: { token: "--color-primary" },
        },
        {
          label: "upcoming label is Neutral/Strong",
          sel: ".step-upcoming .step-label",
          get: "color",
          expect: { token: "--color-neutral-strong" },
        },
        {
          label: "completed label weight 500",
          sel: ".step:not(.step-active):not(.step-upcoming) .step-label",
          get: "font-weight",
          expect: "500",
        },
        {
          label: "upcoming label weight 400",
          sel: ".step-upcoming .step-label",
          get: "font-weight",
          expect: "400",
        },
      ],

      "components-step--without-labels": [
        {
          label: "Step Title=off drops the label",
          sel: ".step .step-label",
          absent: true,
        },
        {
          label: "marker survives alone",
          sel: ".step-marker",
          get: "width",
          expect: 24,
        },
      ],
    },
  },

  // ----------------------------------------------------------------- Stepper
  Stepper: {
    figma: "Stepper 1032:2013 — one symbol, + Stepper Title boolean",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 1,
    stories: {
      "components-stepper--default": [
        {
          label: "stacks vertically",
          sel: ".stepper",
          get: "flex-direction",
          expect: "column",
        },
        {
          label: "title gap 16px",
          sel: ".stepper",
          get: "gap",
          expect: "16px",
        },
        {
          label: "title 11px",
          sel: ".stepper-title",
          get: "font-size",
          expect: "11px",
        },
        {
          label: "title weight 500",
          sel: ".stepper-title",
          get: "font-weight",
          expect: "500",
        },
        {
          label: "title tracking 0.5px",
          sel: ".stepper-title",
          get: "letter-spacing",
          expect: "0.5px",
        },
        {
          label: "title is uppercased",
          sel: ".stepper-title",
          get: "text-transform",
          expect: "uppercase",
        },
        // Content/Secondary here, where Progress Bar's identical-looking title
        // is Content/Primary. Both raw in Figma; pinned so the difference is
        // deliberate rather than drift.
        {
          label: "title is Content/Secondary",
          sel: ".stepper-title",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        {
          label: "title is NOT Content/Primary",
          sel: ".stepper-title",
          get: "color",
          expect: { token: "--color-content-primary" },
          not: true,
        },

        // The row: 10px of side padding is what keeps the end markers off the edge.
        {
          label: "row centres its children",
          sel: ".stepper-steps",
          get: "align-items",
          expect: "center",
        },
        {
          label: "row pads 10px each side",
          sel: ".stepper-steps",
          get: "padding-left",
          expect: "10px",
        },
        {
          label: "row pads 10px right",
          sel: ".stepper-steps",
          get: "padding-right",
          expect: "10px",
        },

        // Connectors carry the progress and absorb the leftover width.
        {
          label: "connector is 2px tall",
          sel: ".stepper-connector",
          get: "height",
          expect: 2,
        },
        {
          label: "connector flexes",
          sel: ".stepper-connector",
          get: "flex-grow",
          expect: "1",
        },
        {
          label: "connector is fully rounded",
          sel: ".stepper-connector",
          get: "border-top-left-radius",
          expect: { token: "--radius-pill", kind: "length" },
        },
        {
          label: "passed connector is Primary/Main",
          sel: ".stepper-connector-complete",
          get: "background-color",
          expect: { token: "--color-primary" },
        },
        {
          label: "unreached connector is Stroke/Border",
          sel: ".stepper-connector:not(.stepper-connector-complete)",
          get: "background-color",
          expect: { token: "--color-stroke-border" },
        },
        {
          label: "the two connectors differ",
          sel: ".stepper-connector:not(.stepper-connector-complete)",
          get: "background-color",
          expect: { token: "--color-primary" },
          not: true,
        },

        // Steps must not stretch — the connectors do.
        {
          label: "steps do not flex",
          sel: ".stepper-steps .step",
          get: "flex-shrink",
          expect: "0",
        },
      ],
    },
  },

  // ------------------------------------------------------------- ProgressBar
  ProgressBar: {
    figma:
      'Progress Bar 1032:1991 — 2 variants (a misnamed "Has Legend" axis that actually swaps colour), + Top/Bottom Content',
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 2,
    stories: {
      "components-progressbar--both-schemes": [
        // Layout.
        {
          label: "stacks vertically",
          sel: ".progress-bar",
          get: "flex-direction",
          expect: "column",
        },
        {
          label: "section gap 12px",
          sel: ".progress-bar",
          get: "gap",
          expect: "12px",
        },
        {
          label: "header spreads",
          sel: ".progress-bar-header",
          get: "justify-content",
          expect: "space-between",
        },

        // Track and fill.
        {
          label: "track is 5px tall",
          sel: ".progress-bar-track",
          get: "height",
          expect: 5,
        },
        {
          label: "track is a pill",
          sel: ".progress-bar-track",
          get: "border-top-left-radius",
          expect: { token: "--radius-pill", kind: "length" },
        },
        {
          label: "track is Stroke/Divider",
          sel: ".progress-bar-track",
          get: "background-color",
          expect: { token: "--color-stroke-divider" },
        },
        // Clipping is what keeps the fill inside the pill at low percentages.
        {
          label: "track clips its fill",
          sel: ".progress-bar-track",
          get: "overflow-x",
          expect: "hidden",
        },
        {
          label: "fill spans the track height",
          sel: ".progress-bar-fill",
          get: "height",
          expect: 5,
        },

        // Type — all raw in Figma; these pin what a token would have carried.
        {
          label: "title 11px",
          sel: ".progress-bar-title",
          get: "font-size",
          expect: "11px",
        },
        {
          label: "title weight 500",
          sel: ".progress-bar-title",
          get: "font-weight",
          expect: "500",
        },
        {
          label: "title tracking 0.5px",
          sel: ".progress-bar-title",
          get: "letter-spacing",
          expect: "0.5px",
        },
        {
          label: "title is uppercased",
          sel: ".progress-bar-title",
          get: "text-transform",
          expect: "uppercase",
        },
        {
          label: "title is Content/Primary",
          sel: ".progress-bar-title",
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        {
          label: "value 13px",
          sel: ".progress-bar-value",
          get: "font-size",
          expect: "13px",
        },
        {
          label: "value weight 500",
          sel: ".progress-bar-value",
          get: "font-weight",
          expect: "500",
        },
        {
          label: "legend label 12px",
          sel: ".progress-bar-legend-label",
          get: "font-size",
          expect: "12px",
        },
        {
          label: "legend label is Content/Secondary",
          sel: ".progress-bar-legend-label",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },

        // Legend geometry.
        {
          label: "legend gap 16px",
          sel: ".progress-bar-legend",
          get: "gap",
          expect: "16px",
        },
        {
          label: "legend item gap 6px",
          sel: ".progress-bar-legend-item",
          get: "gap",
          expect: "6px",
        },
        {
          label: "swatch is 8px",
          sel: ".progress-bar-legend-swatch",
          get: "width",
          expect: 8,
        },
        {
          label: "swatch radius is Radius/Micro",
          sel: ".progress-bar-legend-swatch",
          get: "border-top-left-radius",
          expect: { token: "--radius-micro", kind: "length" },
        },

        // The base scheme — Figma's `Has Legend=false`.
        {
          label: "base value is Primary/Main",
          sel: ".progress-bar:not(.progress-bar-success) .progress-bar-value",
          get: "color",
          expect: { token: "--color-primary" },
        },
        {
          label: "base fill is Primary/Main",
          sel: ".progress-bar:not(.progress-bar-success) .progress-bar-fill",
          get: "background-color",
          expect: { token: "--color-primary" },
        },

        // The success scheme — Figma's `Has Legend=true`. It splits two Approved
        // tokens, the same way Modal's positive variant does, so assert both.
        {
          label: "success value is Approved/CONTENT",
          sel: ".progress-bar-success .progress-bar-value",
          get: "color",
          expect: { token: "--color-approved-content" },
        },
        {
          label: "success value is NOT Approved/Main",
          sel: ".progress-bar-success .progress-bar-value",
          get: "color",
          expect: { token: "--color-approved" },
          not: true,
        },
        {
          label: "success fill is Approved/MAIN",
          sel: ".progress-bar-success .progress-bar-fill",
          get: "background-color",
          expect: { token: "--color-approved" },
        },
        {
          label: "success swatch is Approved/Main",
          sel: ".progress-bar-success .progress-bar-legend-swatch:not(.progress-bar-legend-swatch-neutral)",
          get: "background-color",
          expect: { token: "--color-approved" },
        },
        // The remainder swatch is Neutral in BOTH schemes — the scheme rule must
        // not recolour it.
        {
          label: "remainder swatch is Neutral/Main",
          sel: ".progress-bar-legend-swatch-neutral",
          get: "background-color",
          expect: { token: "--color-neutral" },
        },
        {
          label: "success remainder stays Neutral",
          sel: ".progress-bar-success .progress-bar-legend-swatch-neutral",
          get: "background-color",
          expect: { token: "--color-neutral" },
        },
        {
          label: "success remainder is NOT Approved",
          sel: ".progress-bar-success .progress-bar-legend-swatch-neutral",
          get: "background-color",
          expect: { token: "--color-approved" },
          not: true,
        },
      ],

      "components-progressbar--booleans": [
        // Both booleans remove a row outright.
        {
          label: "Bottom Content=off drops the legend",
          sel: ".progress-bar:not(.progress-bar-success) .progress-bar-legend",
          absent: true,
        },
        {
          label: "Top Content=off drops the header",
          sel: ".progress-bar-success .progress-bar-header",
          absent: true,
        },
        // ...and the track survives either way, which is the point.
        {
          label: "track survives without the header",
          sel: ".progress-bar-success .progress-bar-track",
          get: "height",
          expect: 5,
        },
      ],
    },
  },

  // -------------------------------------------------------- LoadingIndicator
  LoadingIndicator: {
    figma:
      "Loading Indicator 1028:1992 — Type (Circle / Dots) x Size (XS/SM/MD/LG)",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 8,
    stories: {
      "components-loadingindicator--all-variants": [
        // Circle. Every value here came out of the exported SVG, because Figma
        // flattens both types and reports no variables at all.
        {
          label: "xs box 12px",
          sel: ".loading-indicator:not(.loading-indicator-dots)",
          get: "width",
          expect: 12,
        },
        {
          label: "sm box 16px",
          sel: ".loading-indicator-sm:not(.loading-indicator-dots)",
          get: "width",
          expect: 16,
        },
        {
          label: "md box 24px",
          sel: ".loading-indicator-md:not(.loading-indicator-dots)",
          get: "width",
          expect: 24,
        },
        {
          label: "lg box 32px",
          sel: ".loading-indicator-lg:not(.loading-indicator-dots)",
          get: "width",
          expect: 32,
        },
        // Ring thickness — the masked stroke-widths are exactly double these.
        {
          // Integers on purpose — Chrome floors half-pixels while Figma rounds
          // them up, so these reproduce Figma's rendered 2/2/3/3. See the CSS.
          label: "xs ring is 1.5px (authored, exact)",
          sel: ".loading-indicator:not(.loading-indicator-dots)",
          get: "--loading-ring",
          expect: "1.5px",
        },
        {
          label: "sm ring is 2px (authored, exact)",
          sel: ".loading-indicator-sm:not(.loading-indicator-dots)",
          get: "--loading-ring",
          expect: "2px",
        },
        {
          label: "md ring is 2.52px (authored, exact)",
          sel: ".loading-indicator-md:not(.loading-indicator-dots)",
          get: "--loading-ring",
          expect: "2.52px",
        },
        {
          label: "lg ring is 3.04px (authored, exact)",
          sel: ".loading-indicator-lg:not(.loading-indicator-dots)",
          get: "--loading-ring",
          expect: "3.04px",
        },
        {
          // A masked conic-gradient, NOT a border: Chrome floors fractional
          // border-width (1.5 -> 1, 2.52 -> 2), so a bordered ring cannot carry
          // the authored values at all. Asserting the absence keeps it that way.
          label: "circle draws no border",
          sel: ".loading-indicator:not(.loading-indicator-dots)",
          get: "border-top-width",
          expect: "0px",
        },
        {
          label: "circle is round",
          sel: ".loading-indicator:not(.loading-indicator-dots)",
          get: "border-top-left-radius",
          expect: { token: "--radius-pill", kind: "length" },
        },
        // Track vs arc: one coloured side of a round border IS the 90 degree arc.
        {
          // The track and arc are conic-gradient stops now, not border sides,
          // so they are matched inside the serialised gradient.
          label: "track is Stroke/Divider",
          sel: ".loading-indicator:not(.loading-indicator-dots)",
          get: "background-image",
          contains: true,
          expect: { token: "--color-stroke-divider" },
        },
        {
          // The track and arc are conic-gradient stops now, not border sides,
          // so they are matched inside the serialised gradient.
          label: "arc is Primary/Main",
          sel: ".loading-indicator:not(.loading-indicator-dots)",
          get: "background-image",
          contains: true,
          expect: { token: "--color-primary" },
        },
        {
          label: "the two stops differ",
          sel: ".loading-indicator:not(.loading-indicator-dots)",
          get: "background-image",
          expect: { token: "--color-stroke-divider" },
          not: true,
        },
        // The motion is a library decision, but its absence would be a bug.

        // NOTE: the animation is deliberately unasserted here. The harness
        // injects `animation: none !important` so mid-animation values cannot
        // corrupt colour checks, which makes motion unobservable to it by
        // design. It is exercised in the Motion story instead.

        // Dots. Diameter and gap are always the same number, which is the whole
        // reason each Figma frame is exactly 5x its height.
        {
          label: "xs dot 2px",
          sel: ".loading-indicator-dots .loading-indicator-dot",
          get: "width",
          expect: 2,
        },
        {
          label: "xs gap matches the dot",
          sel: ".loading-indicator-dots",
          get: "gap",
          expect: "2px",
        },
        {
          label: "sm dot 3px",
          sel: ".loading-indicator-dots.loading-indicator-sm .loading-indicator-dot",
          get: "width",
          expect: 3,
        },
        {
          label: "sm gap matches the dot",
          sel: ".loading-indicator-dots.loading-indicator-sm",
          get: "gap",
          expect: "3px",
        },
        {
          label: "md dot 4px",
          sel: ".loading-indicator-dots.loading-indicator-md .loading-indicator-dot",
          get: "width",
          expect: 4,
        },
        {
          label: "md gap matches the dot",
          sel: ".loading-indicator-dots.loading-indicator-md",
          get: "gap",
          expect: "4px",
        },
        {
          label: "lg dot 5px",
          sel: ".loading-indicator-dots.loading-indicator-lg .loading-indicator-dot",
          get: "width",
          expect: 5,
        },
        {
          label: "lg gap matches the dot",
          sel: ".loading-indicator-dots.loading-indicator-lg",
          get: "gap",
          expect: "5px",
        },
        {
          label: "dots are round",
          sel: ".loading-indicator-dot",
          get: "border-top-left-radius",
          expect: { token: "--radius-pill", kind: "length" },
        },
        // Secondary/Main, NOT the circle's Primary — the easiest thing to conflate.
        {
          label: "dots are Secondary/Main",
          sel: ".loading-indicator-dot",
          get: "background-color",
          expect: { token: "--color-secondary" },
        },
        {
          label: "dots are NOT Primary/Main",
          sel: ".loading-indicator-dot",
          get: "background-color",
          expect: { token: "--color-primary" },
          not: true,
        },
        // The size classes must not give the dots container a circle border.
        {
          label: "dots container has no border",
          sel: ".loading-indicator-dots.loading-indicator-lg",
          get: "border-top-width",
          expect: "0px",
        },
      ],
    },
  },

  // ----------------------------------------------------------- LoadingInline
  LoadingInline: {
    figma: "Loading Inline 1028:2013 — Size (XS/SM/MD/LG)",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 4,
    stories: {
      "components-loadinginline--all-sizes": [
        {
          label: "xs gap 6px",
          sel: '.loading-inline:not([class*="loading-inline-"])',
          get: "gap",
          expect: "6px",
        },
        {
          label: "sm gap 8px",
          sel: ".loading-inline-sm",
          get: "gap",
          expect: "8px",
        },
        {
          label: "md gap 10px",
          sel: ".loading-inline-md",
          get: "gap",
          expect: "10px",
        },
        {
          label: "lg gap 12px",
          sel: ".loading-inline-lg",
          get: "gap",
          expect: "12px",
        },

        {
          label: "xs label 11/17",
          sel: '.loading-inline:not([class*="loading-inline-"])',
          get: "font-size",
          expect: "11px",
        },
        {
          label: "xs leading 17px",
          sel: '.loading-inline:not([class*="loading-inline-"])',
          get: "line-height",
          expect: "17px",
        },
        {
          label: "sm label 12/18",
          sel: ".loading-inline-sm",
          get: "font-size",
          expect: "12px",
        },
        {
          label: "sm leading 18px",
          sel: ".loading-inline-sm",
          get: "line-height",
          expect: "18px",
        },
        {
          label: "md label 14/21",
          sel: ".loading-inline-md",
          get: "font-size",
          expect: "14px",
        },
        {
          label: "md leading 21px",
          sel: ".loading-inline-md",
          get: "line-height",
          expect: "21px",
        },
        {
          label: "lg label 16/24",
          sel: ".loading-inline-lg",
          get: "font-size",
          expect: "16px",
        },
        {
          label: "lg leading 24px",
          sel: ".loading-inline-lg",
          get: "line-height",
          expect: "24px",
        },
        {
          label: "label is Content/Secondary",
          sel: ".loading-inline",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },

        // The finding worth pinning: Figma embeds a Size=XS indicator in ALL
        // four variants, so the spinner must stay 12px while the label grows.
        {
          label: "xs indicator is 12px",
          sel: '.loading-inline:not([class*="loading-inline-"]) .loading-indicator',
          get: "width",
          expect: 12,
        },
        {
          label: "lg indicator is STILL 12px",
          sel: ".loading-inline-lg .loading-indicator",
          get: "width",
          expect: 12,
        },
        {
          label: "lg indicator did not scale to 32",
          sel: ".loading-inline-lg .loading-indicator",
          get: "width",
          expect: 32,
          not: true,
        },
      ],
    },
  },

  // ----------------------------------------------------------------- Divider
  Divider: {
    figma: "Divider 880:31270 — Type (labeled / simple / metadata)",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 3,
    stories: {
      "components-divider--all-types": [
        // simple — a 1px rule. Drawn as a background, not a border, so nothing
        // here gains height from the border-box hairline trap.
        {
          label: "rule is 1px tall",
          sel: ".divider",
          get: "height",
          expect: 1,
        },
        {
          label: "rule is Stroke/Divider",
          sel: ".divider",
          get: "background-color",
          expect: { token: "--color-stroke-divider" },
        },
        {
          label: "rule has no border",
          sel: ".divider",
          get: "border-top-width",
          expect: "0px",
        },
        // <hr> carries a UA margin that would break the labeled row.
        {
          label: "rule has no margin",
          sel: ".divider",
          get: "margin-top",
          expect: "0px",
        },

        // labeled — built from two .divider rules flanking the label.
        {
          label: "labeled gap 16px",
          sel: ".divider-labeled",
          get: "gap",
          expect: "16px",
        },
        {
          label: "labeled centres vertically",
          sel: ".divider-labeled",
          get: "align-items",
          expect: "center",
        },
        {
          label: "flanking rules flex",
          sel: ".divider-labeled > .divider",
          get: "flex-grow",
          expect: "1",
        },
        {
          label: "label does not shrink",
          sel: ".divider-label",
          get: "flex-shrink",
          expect: "0",
        },
        // Label S Sans - Bold, which the type-label utility bundles with casing.
        {
          label: "label 10px",
          sel: ".divider-label",
          get: "font-size",
          expect: "10px",
        },
        {
          label: "label weight 600",
          sel: ".divider-label",
          get: "font-weight",
          expect: "600",
        },
        {
          label: "label tracking 0.1em",
          sel: ".divider-label",
          get: "letter-spacing",
          expect: "1px",
        },
        // The utility supplies the uppercase — asserting it is the point of
        // using type-label-* rather than text-label-*.
        {
          label: "label case is NOT forced",
          sel: ".divider-label",
          get: "text-transform",
          expect: "none",
        },
        {
          label: "label is Content/Tertiary",
          sel: ".divider-label",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },

        // metadata.
        {
          label: "metadata gap 16px",
          sel: ".divider-metadata",
          get: "gap",
          expect: "16px",
        },
        {
          label: "metadata pair gap 6px",
          sel: ".divider-metadata-item",
          get: "gap",
          expect: "6px",
        },
        {
          label: "key is Content/Tertiary",
          sel: ".divider-metadata-key",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
        {
          label: "value is Content/Primary",
          sel: ".divider-metadata-value",
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        {
          label: "key weight 400",
          sel: ".divider-metadata-key",
          get: "font-weight",
          expect: "400",
        },
        {
          label: "value weight 500",
          sel: ".divider-metadata-value",
          get: "font-weight",
          expect: "500",
        },
        {
          label: "metadata type 12px",
          sel: ".divider-metadata-key",
          get: "font-size",
          expect: "12px",
        },
        // Auto leading, NOT --text-caption's 18px — that would make the row 18px
        // where Figma is 16.
        {
          label: "metadata leading is Auto not 18px",
          sel: ".divider-metadata-key",
          get: "line-height",
          expect: "18px",
          not: true,
        },

        // The separator is the heavier token, which is the easiest thing here
        // to get wrong — assert both that it IS Border and is NOT Divider.
        {
          label: "separator is 1px wide",
          sel: ".divider-metadata-separator",
          get: "width",
          expect: 1,
        },
        {
          label: "separator is 16px tall",
          sel: ".divider-metadata-separator",
          get: "height",
          expect: 16,
        },
        {
          label: "separator is Stroke/Border",
          sel: ".divider-metadata-separator",
          get: "background-color",
          expect: { token: "--color-stroke-border" },
        },
        {
          label: "separator is NOT Stroke/Divider",
          sel: ".divider-metadata-separator",
          get: "background-color",
          expect: { token: "--color-stroke-divider" },
          not: true,
        },
        // Mono is a call-site choice, so the base value class must stay Inter.
        {
          label: "value class is not mono by default",
          sel: ".divider-metadata-item:nth-child(3) .divider-metadata-value",
          get: "font-family",
          expect: { token: "--font-mono", kind: "font" },
          not: true,
        },
      ],
    },
  },

  // -------------------------------------------------------------------- Link
  Link: {
    figma:
      "Link 880:31368 — Style (strong/quiet/monospace/critical/inline) x State",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 15,
    stories: {
      "components-link--all-styles": [
        // Type. All four standalone styles are RAW in Figma — no text style is
        // bound — so these pin the values a token would otherwise have carried.
        {
          label: "strong 14px",
          sel: ".link:not(.link-quiet):not(.link-monospace):not(.link-critical)",
          get: "font-size",
          expect: "14px",
        },
        {
          label: "strong weight 600",
          sel: ".link:not(.link-quiet):not(.link-monospace):not(.link-critical)",
          get: "font-weight",
          expect: "600",
        },
        // Figma Auto — must not become Tailwind's leading-normal (1.5 = 21px).
        {
          label: "leading is Auto not 1.5",
          sel: ".link",
          get: "line-height",
          expect: "21px",
          not: true,
        },
        {
          label: "quiet weight 400",
          sel: ".link-quiet",
          get: "font-weight",
          expect: "400",
        },
        {
          label: "quiet 14px",
          sel: ".link-quiet",
          get: "font-size",
          expect: "14px",
        },
        {
          label: "monospace 13px",
          sel: ".link-monospace",
          get: "font-size",
          expect: "13px",
        },
        {
          label: "monospace weight 500",
          sel: ".link-monospace",
          get: "font-weight",
          expect: "500",
        },
        {
          label: "monospace is JetBrains Mono",
          sel: ".link-monospace",
          get: "font-family",
          expect: { token: "--font-mono", kind: "font" },
        },
        {
          label: "critical weight 500",
          sel: ".link-critical",
          get: "font-weight",
          expect: "500",
        },

        // Rest colours — each style starts somewhere different.
        {
          label: "strong rest is Primary/Main",
          sel: ".link:not(.link-quiet):not(.link-monospace):not(.link-critical)",
          get: "color",
          expect: { token: "--color-primary" },
        },
        {
          label: "quiet rest is Content/Secondary",
          sel: ".link-quiet",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        {
          label: "monospace rest is Content/Primary",
          sel: ".link-monospace",
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        {
          label: "critical rest is Critical/Main",
          sel: ".link-critical",
          get: "color",
          expect: { token: "--color-critical" },
        },

        // The underline rule: a constant everywhere EXCEPT strong, where it is
        // a state. This is the most surprising thing about the component.
        {
          label: "strong has NO underline at rest",
          sel: ".link:not(.link-quiet):not(.link-monospace):not(.link-critical)",
          get: "text-decoration-line",
          expect: "none",
        },
        {
          label: "strong gains one on hover",
          sel: ".link:not(.link-quiet):not(.link-monospace):not(.link-critical)",
          get: "text-decoration-line",
          expect: "underline",
          hover: true,
        },
        {
          label: "quiet is underlined at rest",
          sel: ".link-quiet",
          get: "text-decoration-line",
          expect: "underline",
        },
        {
          label: "monospace is underlined at rest",
          sel: ".link-monospace",
          get: "text-decoration-line",
          expect: "underline",
        },
        {
          label: "critical is underlined at rest",
          sel: ".link-critical",
          get: "text-decoration-line",
          expect: "underline",
        },

        // Hover ramps differ in length — quiet and monospace only reach Main
        // because they start outside the primary scale.
        {
          label: "strong hover is Primary/Dark",
          sel: ".link:not(.link-quiet):not(.link-monospace):not(.link-critical)",
          get: "color",
          expect: { token: "--color-primary-dark" },
          hover: true,
        },
        {
          label: "quiet hover reaches only Primary/Main",
          sel: ".link-quiet",
          get: "color",
          expect: { token: "--color-primary" },
          hover: true,
        },
        {
          label: "quiet hover is NOT Primary/Dark",
          sel: ".link-quiet",
          get: "color",
          expect: { token: "--color-primary-dark" },
          not: true,
          hover: true,
        },
        {
          label: "monospace hover is Primary/Main",
          sel: ".link-monospace",
          get: "color",
          expect: { token: "--color-primary" },
          hover: true,
        },
        {
          label: "critical hover is Critical/Strong",
          sel: ".link-critical",
          get: "color",
          expect: { token: "--color-critical-strong" },
          hover: true,
        },
        // critical must not pick up the base ramp.
        {
          label: "critical hover is NOT Primary/Dark",
          sel: ".link-critical",
          get: "color",
          expect: { token: "--color-primary-dark" },
          not: true,
          hover: true,
        },

        // critical's icon slot.
        {
          label: "critical gap 6px",
          sel: ".link-critical",
          get: "gap",
          expect: "6px",
        },
        {
          label: "strong gap 4px",
          sel: ".link:not(.link-quiet):not(.link-monospace):not(.link-critical)",
          get: "gap",
          expect: "4px",
        },
        {
          label: "critical icon is 12px",
          sel: ".link-critical .icon",
          get: "width",
          expect: 12,
        },
      ],

      "components-link--inline": [
        // inline is a PARAGRAPH, not a link — the class carries body type and
        // the anchors are styled as descendants.
        {
          label: "inline body is 12px",
          sel: ".link-inline",
          get: "font-size",
          expect: "12px",
        },
        {
          label: "inline body leading 18px",
          sel: ".link-inline",
          get: "line-height",
          expect: "18px",
        },
        {
          label: "inline body is Content/Primary",
          sel: ".link-inline",
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        // ...and specifically NOT link-coloured, which is the whole distinction.
        {
          label: "inline body is NOT Primary/Main",
          sel: ".link-inline",
          get: "color",
          expect: { token: "--color-primary" },
          not: true,
        },
        {
          label: "inline anchors are Primary/Main",
          sel: ".link-inline a",
          get: "color",
          expect: { token: "--color-primary" },
        },
        {
          label: "inline anchors are underlined",
          sel: ".link-inline a",
          get: "text-decoration-line",
          expect: "underline",
        },
        {
          label: "inline anchor hover is Primary/Dark",
          sel: ".link-inline a",
          get: "color",
          expect: { token: "--color-primary-dark" },
          hover: true,
        },
      ],
    },
  },

  // ---------------------------------------------------------- FilterSegment
  FilterSegment: {
    figma:
      "Filter Segment 678:21020 — Position x Hover x Selected x Size, + Text/Icon/Ring",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 18,
    stories: {
      "components-filtersegment--all-variants": [
        // Geometry. Both heights are pinned: Figma fixes them, and the 0.5px
        // hairlines would each add 2px under border-box.
        {
          label: "sm height pinned to 21px",
          sel: ".filter-segment",
          get: "height",
          expect: 21,
        },
        {
          label: "md height pinned to 28px",
          sel: ".filter-segment-md",
          get: "height",
          expect: 28,
        },
        {
          label: "padding-x 8px",
          sel: ".filter-segment",
          get: "padding-left",
          expect: "8px",
        },
        {
          label: "padding-y 4px",
          sel: ".filter-segment",
          get: "padding-top",
          expect: "4px",
        },
        {
          label: "gap 10px",
          sel: ".filter-segment",
          get: "gap",
          expect: "10px",
        },
        // md shares sm's padding and type — it is only a taller box.
        {
          label: "md padding is unchanged",
          sel: ".filter-segment-md",
          get: "padding-left",
          expect: "8px",
        },
        {
          label: "md type is unchanged",
          sel: ".filter-segment-md",
          get: "font-size",
          expect: "11px",
        },
        {
          label: "type 11px",
          sel: ".filter-segment",
          get: "font-size",
          expect: "11px",
        },
        // Micro L is Figma "Auto" — must NOT compute to 11px.
        {
          label: "leading is Auto not 1",
          sel: ".filter-segment",
          get: "line-height",
          expect: "11px",
          not: true,
        },

        // Rest colours.
        {
          label: "rest fill is Surface/Card",
          sel: ".filter-segment",
          get: "background-color",
          expect: { token: "--color-surface-card" },
        },
        {
          label: "rest label is Content/Secondary",
          sel: ".filter-segment",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },

        // Borders — the heart of the position axis. Every segment draws t/r/b
        // and omits the left, so neighbours share an edge instead of doubling.
        {
          label: "draws a top border",
          sel: ".filter-segment",
          get: "border-top-width",
          expect: "1px",
        },
        {
          label: "draws a right border",
          sel: ".filter-segment",
          get: "border-right-width",
          expect: "1px",
        },
        {
          label: "draws a bottom border",
          sel: ".filter-segment",
          get: "border-bottom-width",
          expect: "1px",
        },
        // middle is the base, so a bare .filter-segment must have NO left border.
        {
          label: "middle has no left border",
          sel: ".filter-segment:not(.filter-segment-first):not(.filter-segment-last)",
          get: "border-left-width",
          expect: "0px",
        },
        {
          label: "border is Stroke/Divider",
          sel: ".filter-segment",
          get: "border-top-color",
          expect: { token: "--color-stroke-divider" },
        },
        // Only first draws the group's left edge.
        {
          label: "first draws a left border",
          sel: ".filter-segment-first",
          get: "border-left-width",
          expect: "1px",
        },
        {
          label: "last has no left border",
          sel: ".filter-segment-last",
          get: "border-left-width",
          expect: "0px",
        },

        // Radius — only the outer corners of the group.
        {
          label: "first rounds its left",
          sel: ".filter-segment-first",
          get: "border-top-left-radius",
          expect: { token: "--radius-control", kind: "length" },
        },
        {
          label: "first stays square on the right",
          sel: ".filter-segment-first",
          get: "border-top-right-radius",
          expect: "0px",
        },
        {
          label: "last rounds its right",
          sel: ".filter-segment-last",
          get: "border-top-right-radius",
          expect: { token: "--radius-control", kind: "length" },
        },
        {
          label: "last stays square on the left",
          sel: ".filter-segment-last",
          get: "border-top-left-radius",
          expect: "0px",
        },
        {
          label: "middle is square both ends",
          sel: ".filter-segment:not(.filter-segment-first):not(.filter-segment-last)",
          get: "border-top-left-radius",
          expect: "0px",
        },

        // States. Both REPLACE the opaque card fill with a translucent Action
        // token, so the page shows through rather than the card.
        {
          label: "hover swaps to Action/Hover",
          sel: '.filter-segment:not([aria-pressed="true"])',
          get: "background-color",
          expect: { token: "--color-action-hover" },
          hover: true,
        },
        {
          label: "hover darkens the label",
          sel: '.filter-segment:not([aria-pressed="true"])',
          get: "color",
          expect: { token: "--color-content-primary" },
          hover: true,
        },
        {
          label: "selected is Action/Selected",
          sel: '.filter-segment[aria-pressed="true"]',
          get: "background-color",
          expect: { token: "--color-action-selected" },
        },
        {
          label: "selected darkens the label",
          sel: '.filter-segment[aria-pressed="true"]',
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        // Figma draws no hover+selected, so hover must not repaint a selected
        // segment — the defect class the library audit found in seven places.
        {
          label: "hover does NOT override selected",
          sel: '.filter-segment[aria-pressed="true"]',
          get: "background-color",
          expect: { token: "--color-action-selected" },
          hover: true,
        },
      ],

      "components-filtersegment--in-a-group": [
        // The group is a bare row: no gap, so segments abut and share edges.
        {
          label: "group has no gap",
          sel: ".filter-segments",
          get: "gap",
          expect: "normal",
        },
        {
          label: "group centres its segments",
          sel: ".filter-segments",
          get: "align-items",
          expect: "center",
        },
        // The remove control is an IconButton instance, not a new part.
        {
          label: "icon slot is an 18px IconButton",
          sel: ".filter-segment .icon-button",
          get: "width",
          expect: 18,
        },
        {
          label: "icon glyph is 14px",
          sel: ".filter-segment .icon-button .icon",
          get: "width",
          expect: 14,
        },
        // Figma's example keeps the REST background on every segment and varies
        // only the text — assert that, so nobody "fixes" it into a real state.
        {
          label: "example values keep the rest fill",
          sel: ".filter-segments .text-content-primary",
          get: "background-color",
          expect: { token: "--color-surface-card" },
        },
        {
          label: "example chosen value steps to 500",
          sel: ".filter-segments .text-micro-l-bold",
          get: "font-weight",
          expect: "500",
        },
      ],
    },
  },

  // ------------------------------------------------------------- Pagination
  Pagination: {
    figma: "Pagination 880:31248 — Type (numbered / simple)",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 2,
    stories: {
      "components-pagination--both-types": [
        // Both types share the same root, which is why no modifier class exists.
        {
          label: "bar spreads its ends",
          sel: ".pagination",
          get: "justify-content",
          expect: "space-between",
        },
        {
          label: "bar centres vertically",
          sel: ".pagination",
          get: "align-items",
          expect: "center",
        },
        // Width is deliberately NOT pinned — Figma's 1208px is the artboard
        // content width, not a spec.

        // numbered.
        {
          label: "cell gap 4px",
          sel: ".pagination-pages",
          get: "gap",
          expect: "4px",
        },
        {
          label: "cells do not shrink",
          sel: ".pagination-pages",
          get: "flex-shrink",
          expect: "0",
        },
        {
          label: "summary 12px",
          sel: ".pagination-summary",
          get: "font-size",
          expect: "12px",
        },
        {
          label: "summary is JetBrains Mono",
          sel: ".pagination-summary",
          get: "font-family",
          expect: { token: "--font-mono", kind: "font" },
        },
        {
          label: "summary is Content/Secondary",
          sel: ".pagination-summary",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        // The cells inside are real PaginationItems, not restyled here.
        {
          label: "cells are 32px",
          sel: ".pagination-pages .pagination-item",
          get: "width",
          expect: 32,
        },

        // simple. Prev/Next are Button instances in Figma, so the assertion
        // that matters is that they resolved to btn-outline btn-sm geometry.
        {
          label: "simple buttons are 24px tall",
          sel: ".pagination .btn-sm",
          get: "height",
          expect: 24,
        },
        {
          label: "simple buttons pad 8px",
          sel: ".pagination .btn-sm",
          get: "padding-left",
          expect: "8px",
        },
        {
          label: "simple buttons gap 5px",
          sel: ".pagination .btn-sm",
          get: "gap",
          expect: "5px",
        },
        {
          label: "simple buttons are outline",
          sel: ".pagination .btn-outline",
          get: "border-top-color",
          expect: { token: "--color-stroke-divider" },
        },
        {
          label: "simple button icon is 13px",
          sel: ".pagination .btn-sm .icon",
          get: "width",
          expect: 13,
        },
        {
          label: "status 13px",
          sel: ".pagination-status",
          get: "font-size",
          expect: "13px",
        },
        {
          label: "status is Content/Secondary",
          sel: ".pagination-status",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        // The current page steps to Semi Bold, which no 13px token carries —
        // --text-body-1-bold is Medium/500, so assert 600 explicitly.
        {
          label: "current page is 600 not 500",
          sel: ".pagination-status-current",
          get: "font-weight",
          expect: "600",
        },
        {
          label: "current page is Content/Primary",
          sel: ".pagination-status-current",
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        {
          label: "status body is NOT 600",
          sel: ".pagination-status",
          get: "font-weight",
          expect: "600",
          not: true,
        },
      ],
    },
  },

  // ---------------------------------------------------------- PaginationItem
  PaginationItem: {
    figma:
      "Pagination Item 894:1495 — State (default/active/ellipsis/nav, each with hover and pressed except ellipsis)",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 10,
    stories: {
      "components-paginationitem--all-kinds": [
        // A fixed 32x32 cell in every kind.
        {
          label: "box is 32px",
          sel: ".pagination-item",
          get: "width",
          expect: 32,
        },
        {
          label: "box is square",
          sel: ".pagination-item",
          get: "height",
          expect: 32,
        },
        {
          label: "centres its content",
          sel: ".pagination-item",
          get: "justify-content",
          expect: "center",
        },
        // 4px is raw in Figma but exactly --radius-tight.
        {
          label: "radius 4px",
          sel: ".pagination-item",
          get: "border-top-left-radius",
          expect: { token: "--radius-tight", kind: "length" },
        },
        {
          label: "border 1px",
          sel: ".pagination-item",
          get: "border-top-width",
          expect: "1px",
        },

        // default. The rest border is the one colour in this component that IS
        // an exact token match — sampled at #e1e1e3, which is Stroke/Border
        // composited over white.
        {
          label: "default fill is Surface/Paper",
          sel: ".pagination-item",
          get: "background-color",
          expect: { token: "--color-surface-paper" },
        },
        {
          label: "default border is Stroke/Border",
          sel: ".pagination-item",
          get: "border-top-color",
          expect: { token: "--color-stroke-border" },
        },
        {
          label: "default label is Content/Secondary",
          sel: ".pagination-item",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        // 13px JetBrains Mono Medium — not a named Figma style, and --text-data-s
        // is Regular, so the weight is stepped explicitly. Assert both.
        {
          label: "label 13px",
          sel: ".pagination-item",
          get: "font-size",
          expect: "13px",
        },
        {
          // The weight varies by kind and the size/family do not, which makes
          // it easy to miss — an earlier revision shipped Medium for all three.
          label: "default weight is Medium 500",
          sel: ".pagination-item",
          get: "font-weight",
          expect: "500",
        },
        {
          label: "active weight is Bold 700",
          sel: ".pagination-item-active",
          get: "font-weight",
          expect: "700",
        },
        {
          label: "ellipsis weight is Regular 400",
          sel: ".pagination-item-ellipsis",
          get: "font-weight",
          expect: "400",
        },
        {
          label: "label is JetBrains Mono",
          sel: ".pagination-item",
          get: "font-family",
          expect: { token: "--font-mono", kind: "font" },
        },

        // active — Primary/Main with NO stroke in Figma.
        {
          label: "active fill is Primary/Main",
          sel: ".pagination-item-active",
          get: "background-color",
          expect: { token: "--color-primary" },
        },
        {
          label: "active label is Content/Contrast",
          sel: ".pagination-item-active",
          get: "color",
          expect: { token: "--color-content-contrast" },
        },
        {
          label: "active border is transparent",
          sel: ".pagination-item-active",
          get: "border-top-color",
          expect: "rgba(0, 0, 0, 0)",
        },
        // The transparent border must not change the box.
        {
          label: "active is still 32px",
          sel: ".pagination-item-active",
          get: "width",
          expect: 32,
        },

        // ellipsis — a label, not a control.
        {
          label: "ellipsis has no fill",
          sel: ".pagination-item-ellipsis",
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
        },
        {
          label: "ellipsis has no border",
          sel: ".pagination-item-ellipsis",
          get: "border-top-color",
          expect: "rgba(0, 0, 0, 0)",
        },
        {
          label: "ellipsis is Content/Tertiary",
          sel: ".pagination-item-ellipsis",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
        {
          label: "ellipsis is not clickable",
          sel: ".pagination-item-ellipsis",
          get: "cursor",
          expect: "default",
        },
        // Figma draws no hover for it, and it is a <span> that :hover would
        // otherwise still match — this is the check that proves the exclusion.
        {
          label: "ellipsis does NOT fill on hover",
          sel: ".pagination-item-ellipsis",
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
          hover: true,
        },

        // nav — the default box, Secondary/Main glyph.
        {
          label: "nav glyph is Secondary/Main",
          sel: ".pagination-item-nav",
          get: "color",
          expect: { token: "--color-secondary" },
        },
        {
          label: "nav icon is 14px",
          sel: ".pagination-item-nav .icon",
          get: "width",
          expect: 14,
        },
        {
          label: "nav keeps the default border",
          sel: ".pagination-item-nav",
          get: "border-top-color",
          expect: { token: "--color-stroke-border" },
        },

        // Hover. Figma's raw #f2f2f5 is not a token; Action/Hover is 3.3 away
        // and is the semantically correct step. Documented in the CSS header.
        {
          // The LABEL darkens too — Figma #40404d hover, #2e2e38 pressed. An
          // earlier revision changed only the background, so this axis went
          // unnoticed. Both greys are un-tokenised; these pin the nearest.
          label: "hover darkens the label",
          sel: ".pagination-item",
          get: "color",
          expect: { token: "--color-secondary-strong" },
          hover: true,
        },
        {
          label: "hover label is NOT the rest colour",
          sel: ".pagination-item",
          get: "color",
          expect: { token: "--color-content-secondary" },
          not: true,
          hover: true,
        },
        {
          label: "default hover fills Action/Hover",
          sel: ".pagination-item",
          get: "background-color",
          expect: { token: "--color-action-hover" },
          hover: true,
        },
        // active runs its own ramp, and must not pick up the shared hover.
        {
          label: "active hover is Primary/Dark",
          sel: ".pagination-item-active",
          get: "background-color",
          expect: { token: "--color-primary-dark" },
          hover: true,
        },
        {
          label: "active hover is NOT Action/Hover",
          sel: ".pagination-item-active",
          get: "background-color",
          expect: { token: "--color-action-hover" },
          not: true,
          hover: true,
        },
      ],

      "components-paginationitem--disabled": [
        {
          label: "disabled label dims",
          sel: ".pagination-item:disabled:not(.pagination-item-active)",
          get: "color",
          expect: { token: "--color-content-faint" },
        },
        {
          label: "disabled border lightens",
          sel: ".pagination-item:disabled:not(.pagination-item-active)",
          get: "border-top-color",
          expect: { token: "--color-stroke-disabled" },
        },
        // No blanket opacity — the treatment the harness rejected on IconButton.
        {
          label: "no blanket opacity",
          sel: ".pagination-item:disabled",
          get: "opacity",
          expect: "1",
        },
        // A disabled current page must keep its fill rather than turning white.
        {
          label: "disabled active keeps a primary fill",
          sel: ".pagination-item-active:disabled",
          get: "background-color",
          expect: { token: "--color-primary-disabled" },
        },
        {
          label: "disabled active is NOT Surface/Paper",
          sel: ".pagination-item-active:disabled",
          get: "background-color",
          expect: { token: "--color-surface-paper" },
          not: true,
        },
      ],
    },
  },

  // ------------------------------------------------------- FieldVerification
  FieldVerification: {
    figma:
      "Field Verification 142:350 — State (verified/pending/none/mismatch preview/mismatch details), + Ring",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 5,
    stories: {
      "components-fieldverification--all-states": [
        // Shared row geometry. Nothing is width-pinned — Figma's 83/111/16/159
        // are its sample strings, not specs.
        {
          label: "gap 7px",
          sel: ".field-verification",
          get: "gap",
          expect: "7px",
        },
        {
          label: "rows centre their icon",
          sel: ".field-verification-verified",
          get: "align-items",
          expect: "center",
        },
        // The expanded state tops-aligns instead, driven by :has() rather than
        // an extra class. Asserting it is what proves the :has() rule fires.
        {
          label: "expanded state tops-aligns",
          sel: ".field-verification:has(.field-verification-details)",
          get: "align-items",
          expect: "flex-start",
        },
        {
          label: "label 12px",
          sel: ".field-verification-label",
          get: "font-size",
          expect: "12px",
        },
        {
          label: "label leading 18px",
          sel: ".field-verification-label",
          get: "line-height",
          expect: "18px",
        },

        // State colours. verified is the only one whose icon and label differ.
        {
          label: "verified label is Content/Tertiary",
          sel: ".field-verification-verified .field-verification-label",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
        {
          label: "verified icon is Approved/Main",
          sel: ".field-verification-verified .section-marker-approve",
          get: "color",
          expect: { token: "--color-approved" },
        },
        // pending draws Section Marker's circle but binds a DIFFERENT token, so
        // assert both the right one and the wrong one.
        {
          label: "pending is Content/Tertiary",
          sel: ".field-verification-pending .field-verification-label",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
        {
          label: "pending icon is Content/Tertiary",
          sel: ".field-verification-pending .section-marker",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
        {
          label: "pending is NOT Secondary/Main",
          sel: ".field-verification-pending .section-marker",
          get: "color",
          expect: { token: "--color-secondary" },
          not: true,
        },
        {
          label: "pending glyph is 14px",
          sel: ".field-verification-pending .icon",
          get: "width",
          expect: 14,
        },
        {
          label: "mismatch label is Critical/Main",
          sel: ".field-verification-mismatch .field-verification-label",
          get: "color",
          expect: { token: "--color-critical" },
        },
        {
          label: "mismatch icon is Critical/Main",
          sel: ".field-verification-mismatch .field-verification-icon",
          get: "color",
          expect: { token: "--color-critical" },
        },
        {
          label: "mismatch glyph is 15px",
          sel: ".field-verification-mismatch .field-verification-icon",
          get: "width",
          expect: 15,
        },

        // none and pending are Section Marker INSTANCES in Figma, not bare
        // icons and not a drawn rule. The 16px box is load-bearing: without it
        // the label shifts 2px and a column of fields misaligns.
        {
          label: "none uses a 16px Section Marker",
          sel: ".field-verification-none .section-marker",
          get: "width",
          expect: 16,
        },
        {
          label: "pending uses a 16px Section Marker",
          sel: ".field-verification-pending .section-marker",
          get: "width",
          expect: 16,
        },
        {
          label: "none glyph is 14px",
          sel: ".field-verification-none .icon",
          get: "width",
          expect: 14,
        },
        {
          // The rule that an earlier revision invented must be gone.
          label: "no bespoke dash element",
          sel: ".field-verification-dash",
          absent: true,
        },
        {
          label: "none is Content/Tertiary",
          sel: ".field-verification-none",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
        {
          label: "none carries no label",
          sel: ".field-verification-none .field-verification-label",
          absent: true,
        },

        // The expanded block.
        {
          label: "details gap 4px",
          sel: ".field-verification-details",
          get: "gap",
          expect: "4px",
        },
        {
          label: "details stack vertically",
          sel: ".field-verification-details",
          get: "flex-direction",
          expect: "column",
        },
        // The one line that does NOT take the critical colour.
        {
          label: "detail line is Content/Secondary",
          sel: ".field-verification-detail",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        {
          label: "detail line is NOT critical",
          sel: ".field-verification-detail",
          get: "color",
          expect: { token: "--color-critical" },
          not: true,
        },
        {
          label: "detail line is JetBrains Mono",
          sel: ".field-verification-detail",
          get: "font-family",
          expect: { token: "--font-mono", kind: "font" },
        },
        {
          label: "detail line leading 16.5px",
          sel: ".field-verification-detail",
          get: "line-height",
          expect: "16.5px",
        },
        // The action is plain text, not a Text Button — assert it has none of
        // the Text Button geometry, so a future refactor to one is caught.
        {
          label: "action gap 7px",
          sel: ".field-verification-action",
          get: "gap",
          expect: "7px",
        },
        {
          label: "action is Critical/Main",
          sel: ".field-verification-action",
          get: "color",
          expect: { token: "--color-critical" },
        },
        {
          label: "action is not a text-button",
          sel: ".field-verification-action.text-button",
          absent: true,
        },
      ],
    },
  },

  // ---------------------------------------------------------- SectionMarker
  SectionMarker: {
    figma:
      "Section Marker 141:1071 — Status (approve/mismatch/unverified/na), + Ring",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 4,
    stories: {
      "components-sectionmarker--all-statuses": [
        // A fixed 16x16 box in every status, so a column of markers aligns.
        {
          label: "box is 16px",
          sel: ".section-marker",
          get: "width",
          expect: 16,
        },
        {
          label: "box is square",
          sel: ".section-marker",
          get: "height",
          expect: 16,
        },
        {
          label: "centres its mark",
          sel: ".section-marker",
          get: "justify-content",
          expect: "center",
        },
        {
          label: "does not shrink",
          sel: ".section-marker",
          get: "flex-shrink",
          expect: "0",
        },
        // No radius — which is also why the ring is square. See the CSS header.
        {
          label: "no corner radius",
          sel: ".section-marker",
          get: "border-top-left-radius",
          expect: "0px",
        },

        // Colours. unverified binds the Secondary ramp, not Content/Secondary —
        // same hex, different token, so this pins the one Figma actually uses.
        {
          label: "approve is Approved/Main",
          sel: ".section-marker-approve",
          get: "color",
          expect: { token: "--color-approved" },
        },
        {
          label: "mismatch is Critical/Main",
          sel: ".section-marker-mismatch",
          get: "color",
          expect: { token: "--color-critical" },
        },
        {
          label: "unverified is Secondary/Main",
          sel: ".section-marker-unverified",
          get: "color",
          expect: { token: "--color-secondary" },
        },

        // The marks themselves. Two glyphs, one shape, one nothing.
        {
          label: "approve glyph is 14px",
          sel: ".section-marker-approve .icon",
          get: "width",
          expect: 14,
        },
        {
          label: "unverified glyph is 14px",
          sel: ".section-marker-unverified .icon",
          get: "width",
          expect: 14,
        },
        // Measured from the Figma render: 8x8 centred, leaving a 4px inset.
        {
          label: "mismatch dot is 8px",
          sel: ".section-marker-dot",
          get: "width",
          expect: 8,
        },
        {
          label: "mismatch dot is round",
          sel: ".section-marker-dot",
          get: "border-top-left-radius",
          expect: { token: "--radius-pill", kind: "length" },
        },
        // bg-current, so the dot tracks the status colour rather than repeating it.
        {
          label: "mismatch dot inherits the colour",
          sel: ".section-marker-dot",
          get: "background-color",
          expect: { token: "--color-critical" },
        },

        // na draws nothing but still occupies its box — that is the whole point
        // of asserting it, since "renders nothing" and "is not there" look alike.
        {
          label: "na box still 16px",
          sel: '.section-marker:not([class*="section-marker-"])',
          get: "width",
          expect: 16,
        },
        {
          label: "na has no glyph",
          sel: '.section-marker:not([class*="section-marker-"]) .icon',
          absent: true,
        },
        {
          label: "na has no dot",
          sel: '.section-marker:not([class*="section-marker-"]) .section-marker-dot',
          absent: true,
        },
        {
          // Pairs with the with-ring story: without the class there is no ring,
          // so "ring renders" there is actually asserting something.
          label: "no ring without the class",
          sel: ".section-marker-approve",
          get: "box-shadow",
          expect: "none",
        },
      ],

      "components-sectionmarker--with-ring": [
        {
          // The ring is a Tailwind ring (box-shadow), not an outline, so the
          // meaningful assertion is that it is absent by default and present
          // with the class — see the paired check in AllStatuses.
          label: "ring is inset, not an outline",
          sel: ".section-marker.with-ring",
          get: "outline-style",
          expect: "none",
        },
        // The ring is a box-shadow (Tailwind ring), so assert it is present and
        // that the box stays 16px — an outset ring would grow the layout.
        {
          label: "ring does not grow the box",
          sel: ".section-marker.with-ring",
          get: "width",
          expect: 16,
        },
        {
          label: "ring renders",
          sel: ".section-marker.with-ring",
          get: "box-shadow",
          expect: "none",
          not: true,
        },
      ],
    },
  },

  // ------------------------------------------------------------------ Alert
  Alert: {
    figma:
      "Alert 880:31080 — Type (critical/warning/success/info/neutral), + Icon, Action Button, Dismiss",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 5,
    stories: {
      "components-alert--all-types": [
        // Geometry. Width is deliberately NOT pinned — Figma's 828px is an
        // artboard leftover, not a spec, so the banner fills its container.
        {
          label: "padding 16px",
          sel: ".alert-body",
          get: "padding-left",
          expect: "16px",
        },
        {
          label: "padding-top 16px",
          sel: ".alert-body",
          get: "padding-top",
          expect: "16px",
        },
        {
          label: "icon gap 12px",
          sel: ".alert-body",
          get: "gap",
          expect: "12px",
        },
        {
          label: "content gap 4px",
          sel: ".alert-content",
          get: "gap",
          expect: "4px",
        },
        {
          label: "aligns to the top",
          sel: ".alert",
          get: "align-items",
          expect: "flex-start",
        },
        {
          label: "radius 8px",
          sel: ".alert",
          get: "border-top-left-radius",
          expect: { token: "--radius-surface", kind: "length" },
        },
        // The rail is a 3px left border, not a child element — identical
        // pixels, one less DOM node. See the CSS header.
        {
          label: "rail is 3px",
          sel: ".alert",
          get: "border-left-width",
          expect: "3px",
        },
        {
          label: "no top border",
          sel: ".alert",
          get: "border-top-width",
          expect: "0px",
        },
        {
          label: "no right border",
          sel: ".alert",
          get: "border-right-width",
          expect: "0px",
        },
        // Clipping is what makes the rail follow the radius.
        {
          label: "clips its rail",
          sel: ".alert",
          get: "overflow-x",
          expect: "hidden",
        },
        { label: "icon is 18px", sel: ".alert-icon", get: "width", expect: 18 },

        // Type. All five follow {Type}/Soft + {Type}/Main, except neutral's icon.
        {
          label: "critical fill",
          sel: ".alert-critical",
          get: "background-color",
          expect: { token: "--color-critical-soft" },
        },
        {
          label: "critical rail",
          sel: ".alert-critical",
          get: "border-left-color",
          expect: { token: "--color-critical" },
        },
        {
          label: "critical icon",
          sel: ".alert-critical .alert-icon",
          get: "color",
          expect: { token: "--color-critical" },
        },
        {
          label: "warning fill",
          sel: ".alert-warning",
          get: "background-color",
          expect: { token: "--color-warning-soft" },
        },
        {
          label: "warning rail",
          sel: ".alert-warning",
          get: "border-left-color",
          expect: { token: "--color-warning" },
        },
        {
          label: "warning icon",
          sel: ".alert-warning .alert-icon",
          get: "color",
          expect: { token: "--color-warning" },
        },
        // success maps to the Approved ramp, not a "success" token.
        {
          label: "success fill is Approved/Soft",
          sel: ".alert-success",
          get: "background-color",
          expect: { token: "--color-approved-soft" },
        },
        {
          label: "success rail is Approved/Main",
          sel: ".alert-success",
          get: "border-left-color",
          expect: { token: "--color-approved" },
        },
        {
          label: "success icon is Approved/Main",
          sel: ".alert-success .alert-icon",
          get: "color",
          expect: { token: "--color-approved" },
        },
        // info maps to the Primary ramp — there are no info-* colours.
        {
          label: "info fill is Primary/Soft",
          sel: ".alert-info",
          get: "background-color",
          expect: { token: "--color-primary-soft" },
        },
        {
          label: "info rail is Primary/Main",
          sel: ".alert-info",
          get: "border-left-color",
          expect: { token: "--color-primary" },
        },
        {
          label: "info icon is Primary/Main",
          sel: ".alert-info .alert-icon",
          get: "color",
          expect: { token: "--color-primary" },
        },
        {
          label: "neutral fill",
          sel: ".alert-neutral",
          get: "background-color",
          expect: { token: "--color-neutral-soft" },
        },
        {
          label: "neutral rail is Neutral/Main",
          sel: ".alert-neutral",
          get: "border-left-color",
          expect: { token: "--color-neutral" },
        },
        // The one exception in the whole set — verified by sampling the Figma
        // render, so assert the odd token AND that it is not the usual one.
        {
          label: "neutral icon is Neutral/CONTENT",
          sel: ".alert-neutral .alert-icon",
          get: "color",
          expect: { token: "--color-neutral-content" },
        },
        {
          label: "neutral icon is NOT Neutral/Main",
          sel: ".alert-neutral .alert-icon",
          get: "color",
          expect: { token: "--color-neutral" },
          not: true,
        },

        // Typography is shared by every type.
        {
          label: "title 12.5px",
          sel: ".alert-title",
          get: "font-size",
          expect: "12.5px",
        },
        {
          label: "title weight 500 not 700",
          sel: ".alert-title",
          get: "font-weight",
          expect: "500",
        },
        {
          label: "title leading 12.5px",
          sel: ".alert-title",
          get: "line-height",
          expect: "12.5px",
        },
        {
          label: "title is Content/Primary",
          sel: ".alert-title",
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        {
          label: "message 12px",
          sel: ".alert-message",
          get: "font-size",
          expect: "12px",
        },
        {
          label: "message leading 18px",
          sel: ".alert-message",
          get: "line-height",
          expect: "18px",
        },
        {
          label: "message is Content/Secondary",
          sel: ".alert-message",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        // Type must not leak into the text.
        {
          label: "critical title is not tinted",
          sel: ".alert-critical .alert-title",
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        // The action is a Text Button instance — assert it resolved as one.
        {
          label: "action is a Primary text button",
          sel: ".alert-content .text-button-primary",
          get: "color",
          expect: { token: "--color-primary" },
        },
        {
          label: "action has no padding",
          sel: ".alert-content .text-button-primary",
          get: "padding-left",
          expect: "0px",
        },
      ],

      "components-alert--booleans": [
        // All three booleans remove a layer outright rather than hiding it.
        {
          label: "Icon=off drops the glyph",
          sel: ".alert-success .alert-icon",
          absent: true,
        },
        {
          label: "Action=off drops the button",
          sel: ".alert-info .text-button",
          absent: true,
        },
        {
          label: "Dismiss=on adds an IconButton",
          sel: ".alert-warning .icon-button",
          get: "width",
          expect: 18,
        },
        // Removing the icon must not disturb the text block.
        {
          label: "no-icon keeps its padding",
          sel: ".alert-success .alert-body",
          get: "padding-left",
          expect: "16px",
        },
        {
          label: "no-icon keeps its title",
          sel: ".alert-success .alert-title",
          get: "font-size",
          expect: "12.5px",
        },
      ],
    },
  },

  // ------------------------------------------------------------------ Toast
  Toast: {
    figma: "Toast 880:31121 — Type (success/error/info) x Style (Full/Simple)",
    /** Variants drawn in Figma, from the drift sweep. Simple exists only for info. */
    variants: 4,
    stories: {
      "components-toast--all-types": [
        // Full geometry.
        { label: "width 356px", sel: ".toast", get: "width", expect: 356 },
        {
          label: "padding 16px",
          sel: ".toast",
          get: "padding-left",
          expect: "16px",
        },
        {
          label: "padding-top 16px",
          sel: ".toast",
          get: "padding-top",
          expect: "16px",
        },
        { label: "row gap 12px", sel: ".toast", get: "gap", expect: "12px" },
        {
          label: "stacks vertically",
          sel: ".toast",
          get: "flex-direction",
          expect: "column",
        },
        {
          label: "radius 8px",
          sel: ".toast",
          get: "border-top-left-radius",
          expect: { token: "--radius-surface", kind: "length" },
        },
        {
          label: "border 1px",
          sel: ".toast",
          get: "border-top-width",
          expect: "1px",
        },
        {
          label: "border is Stroke/Divider",
          sel: ".toast",
          get: "border-top-color",
          expect: { token: "--color-stroke-divider" },
        },
        {
          label: "fill is Surface/Paper",
          sel: ".toast",
          get: "background-color",
          expect: { token: "--color-surface-paper" },
        },
        {
          label: "has a drop shadow",
          sel: ".toast",
          get: "box-shadow",
          expect: "none",
          not: true,
        },

        // Header.
        {
          label: "header spreads",
          sel: ".toast-header",
          get: "justify-content",
          expect: "space-between",
        },
        {
          label: "icon gap 12px",
          sel: ".toast-main",
          get: "gap",
          expect: "12px",
        },
        { label: "icon is 18px", sel: ".toast-icon", get: "width", expect: 18 },
        {
          label: "text stack gap 4px",
          sel: ".toast-text",
          get: "gap",
          expect: "4px",
        },
        // Body 2 - Bold reports Medium/500 despite the name. Line-height equals
        // the font size on purpose, which is what keeps the two lines tight.
        {
          label: "title 12.5px",
          sel: ".toast-title",
          get: "font-size",
          expect: "12.5px",
        },
        {
          label: "title weight 500 not 700",
          sel: ".toast-title",
          get: "font-weight",
          expect: "500",
        },
        {
          label: "title leading 12.5px",
          sel: ".toast-title",
          get: "line-height",
          expect: "12.5px",
        },
        {
          label: "title is Content/Primary",
          sel: ".toast-title",
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        {
          label: "message 12px",
          sel: ".toast-message",
          get: "font-size",
          expect: "12px",
        },
        {
          label: "message leading 18px",
          sel: ".toast-message",
          get: "line-height",
          expect: "18px",
        },
        {
          label: "message is Content/Secondary",
          sel: ".toast-message",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        // The close is a plain IconButton instance, not a toast part.
        {
          label: "close button is 18px",
          sel: ".toast-header .icon-button",
          get: "width",
          expect: 18,
        },

        // Footer.
        {
          label: "footer spreads",
          sel: ".toast-footer",
          get: "justify-content",
          expect: "space-between",
        },
        {
          label: "timestamp is Content/Faint",
          sel: ".toast-timestamp",
          get: "color",
          expect: { token: "--color-content-faint" },
        },
        {
          label: "timestamp 12px",
          sel: ".toast-timestamp",
          get: "font-size",
          expect: "12px",
        },
        {
          label: "timestamp is JetBrains Mono",
          sel: ".toast-timestamp",
          get: "font-family",
          expect: { token: "--font-mono", kind: "font" },
        },
        // The action is a Text Button instance — assert it resolved as one.
        {
          label: "action is a Primary text button",
          sel: ".toast-footer .text-button-primary",
          get: "color",
          expect: { token: "--color-primary" },
        },
        {
          label: "action has no padding",
          sel: ".toast-footer .text-button-primary",
          get: "padding-left",
          expect: "0px",
        },

        // Type sets the icon colour and nothing else. All three follow the same
        // pattern here, unlike Modal.
        {
          label: "success icon is Approved/Main",
          sel: ".toast-success .toast-icon",
          get: "color",
          expect: { token: "--color-approved" },
        },
        {
          label: "error icon is Critical/Main",
          sel: ".toast-error .toast-icon",
          get: "color",
          expect: { token: "--color-critical" },
        },
        {
          label: "info icon is Primary/Main",
          sel: ".toast-info .toast-icon",
          get: "color",
          expect: { token: "--color-primary" },
        },
        // Type must NOT leak into the card itself.
        {
          label: "error card is still Surface/Paper",
          sel: ".toast-error",
          get: "background-color",
          expect: { token: "--color-surface-paper" },
        },
        {
          label: "error title is not tinted",
          sel: ".toast-error .toast-title",
          get: "color",
          expect: { token: "--color-content-primary" },
        },
      ],

      "components-toast--simple": [
        // Simple contradicts Full on nearly every property, so the point of
        // these checks is that each override actually landed.
        {
          label: "width 280px",
          sel: ".toast-simple",
          get: "width",
          expect: 280,
        },
        {
          label: "lays out in a row",
          sel: ".toast-simple",
          get: "flex-direction",
          expect: "row",
        },
        { label: "gap 9px", sel: ".toast-simple", get: "gap", expect: "9px" },
        {
          label: "padding-x 16px",
          sel: ".toast-simple",
          get: "padding-left",
          expect: "16px",
        },
        {
          label: "padding-y 10px",
          sel: ".toast-simple",
          get: "padding-top",
          expect: "10px",
        },
        {
          // Pinned. Derived, the 1px border would make it 37 — Figma's 35
          // excludes its own stroke. See the CSS header.
          label: "height pinned to 35px",
          sel: ".toast-simple",
          get: "height",
          expect: 35,
        },
        {
          label: "pill radius",
          sel: ".toast-simple",
          get: "border-top-left-radius",
          expect: { token: "--radius-pill", kind: "length" },
        },
        {
          label: "radius is NOT Full's 8px",
          sel: ".toast-simple",
          get: "border-top-left-radius",
          expect: { token: "--radius-surface", kind: "length" },
          not: true,
        },
        // The dark surface, as with Tooltip.
        {
          label: "dark fill",
          sel: ".toast-simple",
          get: "background-color",
          expect: { token: "--color-content-primary" },
        },
        {
          label: "label is Content/Contrast",
          sel: ".toast-simple",
          get: "color",
          expect: { token: "--color-content-contrast" },
        },
        {
          label: "label 12.5px",
          sel: ".toast-simple",
          get: "font-size",
          expect: "12.5px",
        },
        // Body 2 Regular here, where Full's title is Body 2 - Bold.
        {
          label: "label weight 400 not 500",
          sel: ".toast-simple",
          get: "font-weight",
          expect: "400",
        },
        {
          label: "icon is 15px",
          sel: ".toast-simple .icon",
          get: "width",
          expect: 15,
        },
        {
          label: "icon inherits contrast",
          sel: ".toast-simple .icon",
          get: "color",
          expect: { token: "--color-content-contrast" },
        },
      ],
    },
  },

  // ------------------------------------------------------------- TextButton
  TextButton: {
    figma:
      "Text Button 679:21601 — Type x Hover x Pressed x Active, + Icon and Ring",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 11,
    stories: {
      "components-textbutton--all-types": [
        // cell is a genuinely different size from the other two, not a reskin.
        {
          // Pinned, not derived — Micro L's Auto line box measures 16px here.
          label: "cell height pinned to 15px",
          sel: ".text-button-cell",
          get: "height",
          expect: 15,
        },
        {
          label: "cell padding-x 7px",
          sel: ".text-button-cell",
          get: "padding-left",
          expect: "7px",
        },
        {
          label: "cell padding-y 1px",
          sel: ".text-button-cell",
          get: "padding-top",
          expect: "1px",
        },
        {
          label: "cell type 11px",
          sel: ".text-button-cell",
          get: "font-size",
          expect: "11px",
        },
        // Micro L is Figma "Auto" — must NOT compute to 11px. See CLAUDE.md.
        {
          label: "cell leading is Auto not 1",
          sel: ".text-button-cell",
          get: "line-height",
          expect: "11px",
          not: true,
        },

        {
          // No pin needed — an explicit 18px line-height lands exactly.
          label: "text height 18px (natural)",
          sel: ".text-button-text",
          get: "height",
          expect: 18,
        },
        {
          label: "text has NO padding",
          sel: ".text-button-text",
          get: "padding-left",
          expect: "0px",
        },
        {
          label: "text padding-y 0",
          sel: ".text-button-text",
          get: "padding-top",
          expect: "0px",
        },
        {
          label: "text type 12px",
          sel: ".text-button-text",
          get: "font-size",
          expect: "12px",
        },
        {
          label: "text leading 18px",
          sel: ".text-button-text",
          get: "line-height",
          expect: "18px",
        },

        // Shared shape.
        {
          label: "gap 4px",
          sel: ".text-button-cell",
          get: "gap",
          expect: "4px",
        },
        {
          label: "pill radius",
          sel: ".text-button-cell",
          get: "border-top-left-radius",
          expect: { token: "--radius-pill", kind: "length" },
        },
        {
          label: "no background at rest",
          sel: ".text-button-cell",
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
        },

        // Rest colours: two types share Content/Secondary, Primary does not.
        {
          label: "cell rest is Content/Secondary",
          sel: ".text-button-cell",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        {
          label: "text rest is Content/Secondary",
          sel: ".text-button-text",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        {
          label: "Primary rest is Primary/Main",
          sel: ".text-button-primary",
          get: "color",
          expect: { token: "--color-primary" },
        },

        // Hover. cell is the only type that grows a background.
        {
          label: "cell hover fills Action/Hover",
          sel: ".text-button-cell",
          get: "background-color",
          expect: { token: "--color-action-hover" },
          hover: true,
        },
        {
          label: "cell hover darkens label",
          sel: ".text-button-cell",
          get: "color",
          expect: { token: "--color-content-primary" },
          hover: true,
        },
        {
          label: "text hover stays transparent",
          sel: ".text-button-text",
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
          hover: true,
        },
        {
          label: "text hover darkens label",
          sel: ".text-button-text",
          get: "color",
          expect: { token: "--color-content-primary" },
          hover: true,
        },
        // Primary rides the Primary ramp, NOT the Content ramp. This is the
        // pair most likely to break if the rule order in the CSS is disturbed.
        {
          label: "Primary hover is Primary/Dark",
          sel: ".text-button-primary",
          get: "color",
          expect: { token: "--color-primary-dark" },
          hover: true,
        },
        {
          label: "Primary hover is NOT Content/Primary",
          sel: ".text-button-primary",
          get: "color",
          expect: { token: "--color-content-primary" },
          not: true,
          hover: true,
        },

        // Active. Weight steps 400 -> 500, and only cell also fills.
        {
          label: "cell active fills Primary/Soft",
          sel: '.text-button-cell[aria-pressed="true"]',
          get: "background-color",
          expect: { token: "--color-primary-soft" },
        },
        {
          label: "cell active label is Primary",
          sel: '.text-button-cell[aria-pressed="true"]',
          get: "color",
          expect: { token: "--color-primary" },
        },
        {
          label: "cell active weight 500",
          sel: '.text-button-cell[aria-pressed="true"]',
          get: "font-weight",
          expect: "500",
        },
        {
          label: "cell active keeps 11px",
          sel: '.text-button-cell[aria-pressed="true"]',
          get: "font-size",
          expect: "11px",
        },
        {
          label: "cell rest weight 400",
          sel: ".text-button-cell",
          get: "font-weight",
          expect: "400",
        },
        {
          label: "text active label is Primary",
          sel: '.text-button-text[aria-pressed="true"]',
          get: "color",
          expect: { token: "--color-primary" },
        },
        {
          label: "text active weight 500",
          sel: '.text-button-text[aria-pressed="true"]',
          get: "font-weight",
          expect: "500",
        },
        {
          label: "text active does NOT fill",
          sel: '.text-button-text[aria-pressed="true"]',
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
        },
      ],

      "components-textbutton--with-icon": [
        {
          label: "icon is 12px",
          sel: ".text-button .icon",
          get: "width",
          expect: 12,
        },
        {
          label: "icon gap 4px",
          sel: ".text-button",
          get: "gap",
          expect: "4px",
        },
      ],

      "components-textbutton--disabled": [
        {
          label: "disabled label dimmed",
          sel: ".text-button:disabled",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
        // No blanket opacity — the same rule Chip and IconButton follow.
        {
          label: "no blanket opacity",
          sel: ".text-button:disabled",
          get: "opacity",
          expect: "1",
        },
      ],
    },
  },

  // ------------------------------------------------------------------ Modal
  Modal: {
    figma:
      "Modal 908:1580 — Action (destructive/positive/neutral) x Context Window x Leading Icon",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 3,
    stories: {
      "components-modal--interactive": [
        // Geometry. Width is the ONLY fixed dimension — Figma's 299 vs 317px
        // heights are the subtitle wrapping, not a spec, so height is unasserted.
        { label: "width 480px", sel: ".modal", get: "width", expect: 480 },
        {
          label: "padding 32px",
          sel: ".modal",
          get: "padding-left",
          expect: "32px",
        },
        {
          label: "padding-top 32px",
          sel: ".modal",
          get: "padding-top",
          expect: "32px",
        },
        {
          label: "section gap 24px",
          sel: ".modal",
          get: "gap",
          expect: "24px",
        },
        // 12px is past the end of our radius scale (--radius-surface is 8px).
        // Figma hardcodes it too, so it is raw on both sides.
        {
          label: "radius 12px (untokenised)",
          sel: ".modal",
          get: "border-top-left-radius",
          expect: "12px",
        },
        {
          label: "border 1px",
          sel: ".modal",
          get: "border-top-width",
          expect: "1px",
        },
        {
          label: "border is Stroke/Divider",
          sel: ".modal",
          get: "border-top-color",
          expect: { token: "--color-stroke-divider" },
        },
        {
          label: "fill is Surface/Paper",
          sel: ".modal",
          get: "background-color",
          expect: { token: "--color-surface-paper" },
        },
        // A local Figma effect, not the named style behind --shadow-panel.
        {
          label: "has a drop shadow",
          sel: ".modal",
          get: "box-shadow",
          expect: "none",
          not: true,
        },

        // Header.
        {
          label: "header spreads",
          sel: ".modal-header",
          get: "justify-content",
          expect: "space-between",
        },
        {
          label: "title group gap 12px",
          sel: ".modal-title-group",
          get: "gap",
          expect: "12px",
        },
        {
          label: "icon container 36px",
          sel: ".modal-icon",
          get: "width",
          expect: 36,
        },
        {
          label: "icon container is square",
          sel: ".modal-icon",
          get: "height",
          expect: 36,
        },
        {
          label: "icon container is a circle",
          sel: ".modal-icon",
          get: "border-top-left-radius",
          expect: { token: "--radius-pill", kind: "length" },
        },
        {
          label: "title 19px",
          sel: ".modal-title",
          get: "font-size",
          expect: "19px",
        },
        {
          label: "title weight 600",
          sel: ".modal-title",
          get: "font-weight",
          expect: "600",
        },
        {
          label: "title leading 21.8px",
          sel: ".modal-title",
          get: "line-height",
          expect: "21.8px",
        },
        {
          label: "title is Content/Primary",
          sel: ".modal-title",
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        // The close button is a plain IconButton instance, not a modal part.
        {
          label: "close button is 28px",
          sel: ".modal-header .icon-button",
          get: "width",
          expect: 28,
        },

        // Subtitles. Two 12px styles that are NOT interchangeable — the whole
        // point of asserting both is that only line-height and colour separate
        // them, so a copy-paste slip between the two is otherwise invisible.
        {
          label: "subtitle stack gap 8px",
          sel: ".modal-subtitles",
          get: "gap",
          expect: "8px",
        },
        {
          label: "subtitle 12px",
          sel: ".modal-subtitle",
          get: "font-size",
          expect: "12px",
        },
        {
          label: "subtitle leading 18px",
          sel: ".modal-subtitle",
          get: "line-height",
          expect: "18px",
        },
        {
          label: "subtitle is Content/Secondary",
          sel: ".modal-subtitle",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        {
          label: "description also 12px",
          sel: ".modal-description",
          get: "font-size",
          expect: "12px",
        },
        {
          label: "description leading 14px NOT 18",
          sel: ".modal-description",
          get: "line-height",
          expect: "14px",
        },
        {
          label: "description is Content/Tertiary",
          sel: ".modal-description",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },

        // Context window.
        {
          label: "context padding 12px",
          sel: ".modal-context",
          get: "padding-left",
          expect: "12px",
        },
        {
          label: "context radius 8px",
          sel: ".modal-context",
          get: "border-top-left-radius",
          expect: { token: "--radius-surface", kind: "length" },
        },
        {
          label: "context fill is Surface/Frame",
          sel: ".modal-context",
          get: "background-color",
          expect: { token: "--color-surface-frame" },
        },
        // Stroke/Border here, where the modal itself uses Stroke/Divider.
        {
          label: "context border is Stroke/Border",
          sel: ".modal-context",
          get: "border-top-color",
          expect: { token: "--color-stroke-border" },
        },
        {
          label: "context text 12px",
          sel: ".modal-context-text",
          get: "font-size",
          expect: "12px",
        },
        {
          label: "context text leading 16.5px",
          sel: ".modal-context-text",
          get: "line-height",
          expect: "16.5px",
        },
        // Data/Data xs needs font-mono — --text-* carries no family. See CLAUDE.md.
        {
          label: "context text is JetBrains Mono",
          sel: ".modal-context-text",
          get: "font-family",
          expect: { token: "--font-mono", kind: "font" },
        },

        // Footer.
        {
          label: "footer gap 12px",
          sel: ".modal-footer",
          get: "gap",
          expect: "12px",
        },
        {
          label: "footer is right-aligned",
          sel: ".modal-footer",
          get: "justify-content",
          expect: "flex-end",
        },
        {
          label: "footer buttons are btn-lg (32px)",
          sel: ".modal-footer .btn",
          get: "height",
          expect: 32,
        },

        // Default story is destructive.
        {
          label: "destructive icon fill",
          sel: ".modal-destructive .modal-icon",
          get: "background-color",
          expect: { token: "--color-critical-soft" },
        },
        {
          label: "destructive icon colour",
          sel: ".modal-destructive .modal-icon",
          get: "color",
          expect: { token: "--color-critical" },
        },
      ],

      "components-modal--all-actions": [
        // Action drives the icon container. positive and neutral each break the
        // {Action}/Soft + {Action}/Main pattern in a different way — reproduced
        // from Figma, so assert the odd token, not the consistent one.
        {
          label: "positive fill is Approved/Soft",
          sel: ".modal-positive .modal-icon",
          get: "background-color",
          expect: { token: "--color-approved-soft" },
        },
        {
          label: "positive icon is Approved/CONTENT",
          sel: ".modal-positive .modal-icon",
          get: "color",
          expect: { token: "--color-approved-content" },
        },
        {
          label: "positive icon is NOT Approved/Main",
          sel: ".modal-positive .modal-icon",
          get: "color",
          expect: { token: "--color-approved" },
          not: true,
        },
        {
          label: "neutral fill is SURFACE/Neutral",
          sel: ".modal-neutral .modal-icon",
          get: "background-color",
          expect: { token: "--color-surface-neutral" },
        },
        {
          label: "neutral fill is NOT Neutral/Soft",
          sel: ".modal-neutral .modal-icon",
          get: "background-color",
          expect: { token: "--color-neutral-soft" },
          not: true,
        },
        {
          label: "neutral icon is Neutral/Main",
          sel: ".modal-neutral .modal-icon",
          get: "color",
          expect: { token: "--color-neutral" },
        },
        {
          label: "destructive fill is Critical/Soft",
          sel: ".modal-destructive .modal-icon",
          get: "background-color",
          expect: { token: "--color-critical-soft" },
        },

        // Action also picks the confirm button — the finding that needed a
        // screenshot to catch, so it is worth pinning.
        {
          label: "destructive confirms with btn-critical",
          sel: ".modal-destructive .btn-critical",
          get: "background-color",
          expect: { token: "--color-critical" },
        },
        {
          label: "positive confirms with btn-primary",
          sel: ".modal-positive .btn-primary",
          get: "background-color",
          expect: { token: "--color-primary" },
        },
        {
          label: "neutral confirms with btn-outline",
          sel: ".modal-neutral .btn-outline",
          get: "border-top-color",
          expect: { token: "--color-stroke-divider" },
        },
        // Cancel is the same in all three.
        {
          label: "cancel is transparent",
          sel: ".modal-positive .btn-empty",
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
        },
        // Figma's instance override — scoped to the footer, NOT a Button change.
        {
          label: "cancel label is Content/Secondary",
          sel: ".modal-positive .btn-empty",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
      ],

      "components-modal--booleans": [
        // Both booleans remove a layer outright rather than hiding it.
        {
          label: "Context Window=false drops the field",
          sel: "#modal-no-context .modal-context",
          absent: true,
        },
        {
          label: "Leading Icon=false drops the circle",
          sel: "#modal-no-icon .modal-icon",
          absent: true,
        },
        // ...and neither changes the width, which is the thing that could break.
        {
          label: "no-context still 480px",
          sel: "#modal-no-context",
          get: "width",
          expect: 480,
        },
        {
          label: "no-icon still 480px",
          sel: "#modal-no-icon",
          get: "width",
          expect: 480,
        },
        // The title must still be there when the icon is not.
        {
          label: "no-icon keeps its title",
          sel: "#modal-no-icon .modal-title",
          get: "font-size",
          expect: "19px",
        },
      ],
    },
  },

  // ---------------------------------------------------------------- Tooltip
  Tooltip: {
    figma: "Tooltip 880:31125 — single symbol, no variants",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 1,
    stories: {
      "components-tooltip--interactive": [
        { label: "width 280px", sel: ".tooltip", get: "width", expect: 280 },
        {
          label: "padding-x 16px",
          sel: ".tooltip",
          get: "padding-left",
          expect: "16px",
        },
        {
          label: "padding-y 12px",
          sel: ".tooltip",
          get: "padding-top",
          expect: "12px",
        },
        { label: "gap 6px", sel: ".tooltip", get: "gap", expect: "6px" },
        {
          label: "radius 6px",
          sel: ".tooltip",
          get: "border-top-left-radius",
          expect: "6px",
        },
        // The only dark surface in the library.
        {
          label: "dark fill",
          sel: ".tooltip",
          get: "background-color",
          expect: { token: "--color-content-primary" },
        },
        {
          label: "has the panel shadow",
          sel: ".tooltip",
          get: "box-shadow",
          expect: "none",
          not: true,
        },
        // Text tokens invert against the dark fill.
        {
          label: "title is faint",
          sel: ".tooltip-title",
          get: "color",
          expect: { token: "--color-content-faint" },
        },
        {
          label: "title 11px",
          sel: ".tooltip-title",
          get: "font-size",
          expect: "11px",
        },
        {
          label: "body is contrast",
          sel: ".tooltip-content",
          get: "color",
          expect: { token: "--color-content-contrast" },
        },
        {
          label: "body 12px",
          sel: ".tooltip-content",
          get: "font-size",
          expect: "12px",
        },
        {
          label: "subtext matches title",
          sel: ".tooltip-subtext",
          get: "color",
          expect: { token: "--color-content-faint" },
        },
        // The divider is Content/Secondary, NOT Stroke/Divider — the latter
        // would be invisible on this background. Read from the SVG asset.
        {
          label: "divider is Content/Secondary",
          sel: ".tooltip-divider",
          get: "background-color",
          expect: { token: "--color-content-secondary" },
        },
        {
          label: "divider has no border",
          sel: ".tooltip-divider",
          get: "border-top-width",
          expect: "0px",
        },
      ],
      "components-tooltip--parts": [
        // Body-only is the common case and must stand alone.
        {
          label: "body-only still 280px",
          sel: "#tt-body-only",
          get: "width",
          expect: 280,
        },
        {
          label: "body-only renders no divider",
          sel: "#tt-body-only .tooltip-divider",
          absent: true,
        },
        {
          label: "body-only renders no title",
          sel: "#tt-body-only .tooltip-title",
          absent: true,
        },
      ],
    },
  },

  // ------------------------------------------------------------------- Tabs
  Tabs: {
    figma: "Tabs 108:653 — Type x Size x Hover x Active (sm is underline-only)",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 12,
    stories: {
      "components-tabs--all-types": [
        {
          label: "underline height 32px",
          sel: ".tab-underline",
          get: "height",
          expect: 32,
        },
        {
          label: "underline padding-x",
          sel: ".tab-underline",
          get: "padding-left",
          expect: "6px",
        },
        {
          label: "underline padding-y",
          sel: ".tab-underline",
          get: "padding-top",
          expect: "8px",
        },
        {
          label: "underline type 13px",
          sel: ".tab-underline",
          get: "font-size",
          expect: "13px",
        },
        {
          label: "underline rest has no rule",
          sel: ".tab-underline",
          get: "border-bottom-width",
          expect: "0px",
        },
        // Active: a 2px rule and a step up to semibold.
        {
          label: "active rule is 2px",
          sel: '.tab-underline[aria-selected="true"]',
          get: "border-bottom-width",
          expect: "2px",
        },
        {
          label: "active rule is primary",
          sel: '.tab-underline[aria-selected="true"]',
          get: "border-bottom-color",
          expect: { token: "--color-primary" },
        },
        {
          label: "active weight 600",
          sel: '.tab-underline[aria-selected="true"]',
          get: "font-weight",
          expect: "600",
        },
        {
          label: "rest weight 500",
          sel: ".tab-underline",
          get: "font-weight",
          expect: "500",
        },
        {
          label: "active gap widens to 10px",
          sel: '.tab-underline[aria-selected="true"]',
          get: "gap",
          expect: "10px",
        },
        {
          label: "rest gap 8px",
          sel: ".tab-underline",
          get: "gap",
          expect: "8px",
        },
        // Underline hover was a no-op until 2026-08-22 — rest and hover bound
        // two different variables that resolved to the same hex, so this could
        // not be asserted. The designer rebound hover to Content/Primary, so
        // it now can be: hover reaches the ACTIVE colour while keeping rest's
        // weight and gaining no rule.
        {
          label: "hover reaches active colour",
          sel: ".tab-underline",
          get: "color",
          expect: { token: "--color-content-primary" },
          hover: true,
        },
        {
          label: "rest is NOT that colour",
          sel: ".tab-underline",
          get: "color",
          expect: { token: "--color-secondary" },
        },

        // chip and segment are one control with two skins — they differ in
        // exactly two declarations, so assert both the sameness and the delta.
        {
          label: "chip height 26px",
          sel: ".tab-chip",
          get: "height",
          expect: 26,
        },
        {
          label: "segment height 26px",
          sel: ".tab-segment",
          get: "height",
          expect: 26,
        },
        {
          label: "chip padding-x 12px",
          sel: ".tab-chip",
          get: "padding-left",
          expect: "12px",
        },
        {
          label: "segment padding-x 12px",
          sel: ".tab-segment",
          get: "padding-left",
          expect: "12px",
        },
        { label: "chip gap 4px", sel: ".tab-chip", get: "gap", expect: "4px" },
        {
          label: "segment gap 4px",
          sel: ".tab-segment",
          get: "gap",
          expect: "4px",
        },
        {
          label: "chip type 12px",
          sel: ".tab-chip",
          get: "font-size",
          expect: "12px",
        },
        // The two properties that actually differ:
        {
          label: "chip radius 6px",
          sel: ".tab-chip",
          get: "border-top-left-radius",
          expect: "6px",
        },
        {
          label: "segment radius 2px",
          sel: ".tab-segment",
          get: "border-top-left-radius",
          expect: "2px",
        },
        {
          label: "chip active is a grey tint",
          sel: '.tab-chip[aria-selected="true"]',
          get: "background-color",
          expect: { token: "--color-action-selected" },
        },
        {
          label: "segment active is white",
          sel: '.tab-segment[aria-selected="true"]',
          get: "background-color",
          expect: { token: "--color-surface-paper" },
        },
        // Neither chip nor segment changes weight when active — only underline does.
        {
          label: "chip active weight unchanged",
          sel: '.tab-chip[aria-selected="true"]',
          get: "font-weight",
          expect: "500",
        },
        {
          label: "segment active weight unchanged",
          sel: '.tab-segment[aria-selected="true"]',
          get: "font-weight",
          expect: "500",
        },
      ],
      "components-tabs--underline-sizes": [
        {
          label: "lg 32px",
          sel: ".tab-underline:not(.tab-sm)",
          get: "height",
          expect: 32,
        },
        { label: "sm 26px", sel: ".tab-sm", get: "height", expect: 26 },
        {
          label: "sm type 12px",
          sel: ".tab-sm",
          get: "font-size",
          expect: "12px",
        },
        {
          label: "sm active weight 600",
          sel: '.tab-sm[aria-selected="true"]',
          get: "font-weight",
          expect: "600",
        },
        // Padding and indicator thickness are identical across sizes.
        {
          label: "sm padding-x",
          sel: ".tab-sm",
          get: "padding-left",
          expect: "6px",
        },
        {
          label: "sm padding-y",
          sel: ".tab-sm",
          get: "padding-top",
          expect: "6px",
        },
        {
          label: "sm rule still 2px",
          sel: '.tab-sm[aria-selected="true"]',
          get: "border-bottom-width",
          expect: "2px",
        },
      ],
      "components-tabs--slots": [
        // The badge slot is the existing Chip component, not a new part.
        {
          label: "badge is the Chip badge",
          sel: ".tab .badge",
          get: "height",
          expect: 15,
        },
        {
          label: "subtitle 8px",
          sel: ".tab-subtitle",
          get: "font-size",
          expect: "8px",
        },
        // Not the muted colour you would expect of a subtitle.
        {
          label: "subtitle is primary",
          sel: ".tab-subtitle",
          get: "color",
          expect: { token: "--color-primary" },
        },
        // Figma's Navigation set defines a container per type: the underline
        // row is 8px gap, the chip row 12px plus inset padding.
        {
          label: "underline row gap 8px",
          sel: ".tabs",
          get: "gap",
          expect: "8px",
        },
      ],
      "components-tabs--chip-row": [
        {
          label: "chip row gap 12px",
          sel: ".tabs-chip",
          get: "gap",
          expect: "12px",
        },
        {
          label: "chip row padding-x 12px",
          sel: ".tabs-chip",
          get: "padding-left",
          expect: "12px",
        },
        {
          label: "chip row padding-y 6px",
          sel: ".tabs-chip",
          get: "padding-top",
          expect: "6px",
        },
      ],
    },
  },

  // -------------------------------------------------------- SegmentSelector
  SegmentSelector: {
    figma:
      "Segment Selector 784:34686 — the container that wraps Tabs Type=segment",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 1,
    stories: {
      "components-segmentselector--default": [
        {
          label: "frame fill",
          sel: ".segment-selector",
          get: "background-color",
          expect: { token: "--color-surface-frame" },
        },
        {
          label: "radius 4px",
          sel: ".segment-selector",
          get: "border-top-left-radius",
          expect: "4px",
        },
        {
          label: "padding 1px",
          sel: ".segment-selector",
          get: "padding-top",
          expect: "1px",
        },
        {
          label: "no gap between segments",
          sel: ".segment-selector",
          get: "gap",
          expect: "0px",
        },
        {
          label: "no border on the frame",
          sel: ".segment-selector",
          get: "border-top-width",
          expect: "0px",
        },
        // Figma's 160x28 example: 1 + 26 + 1 tall, children hug.
        {
          label: "height 28px",
          sel: ".segment-selector",
          get: "height",
          expect: 28,
        },
        {
          label: "children are 26px",
          sel: ".segment-selector .tab-segment",
          get: "height",
          expect: 26,
        },
        // Selected differs in exactly three things; assert all three.
        {
          label: "selected is white",
          sel: '[aria-checked="true"]',
          get: "background-color",
          expect: { token: "--color-surface-paper" },
        },
        {
          label: "selected has a hairline",
          sel: '[aria-checked="true"]',
          get: "border-top-color",
          expect: { token: "--color-stroke-border" },
        },
        {
          label: "selected text",
          sel: '[aria-checked="true"]',
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        {
          label: "unselected text",
          sel: '[aria-checked="false"]',
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
        // There is no sliding thumb — the frame casts no shadow either.
        {
          label: "frame has no shadow",
          sel: ".segment-selector",
          get: "box-shadow",
          expect: "none",
        },
      ],
      "components-segmentselector--grows-with-content": [
        // Children hug, so the container grows rather than the children shrinking.
        {
          label: "2 segments narrower than 3",
          sel: ".segment-selector",
          nth: 0,
          get: "width",
          expect: 158,
          tol: 30,
        },
        {
          label: "5 segments widest",
          sel: ".segment-selector",
          nth: 2,
          get: "width",
          expect: 360,
          tol: 90,
        },
      ],
    },
  },

  // -------------------------------------------------------------------- Tag
  Tag: {
    figma:
      "Tag 79:251 — Hover x Active x Disabled x Size, plus 4 boolean slots",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 8,
    stories: {
      "components-tag--all-states": [
        { label: "sm height 21px", sel: ".tag-sm", get: "height", expect: 21 },
        { label: "md height 24px", sel: ".tag-md", get: "height", expect: 24 },
        {
          label: "padding-x",
          sel: ".tag-sm",
          get: "padding-left",
          expect: "9px",
        },
        {
          label: "padding-y",
          sel: ".tag-sm",
          get: "padding-top",
          expect: "4px",
        },
        // Gap is LARGER on the smaller size. Counter-intuitive but faithful.
        { label: "sm gap 10px", sel: ".tag-sm", get: "gap", expect: "10px" },
        { label: "md gap 8px", sel: ".tag-md", get: "gap", expect: "8px" },
        {
          label: "sm type 11px",
          sel: ".tag-sm",
          get: "font-size",
          expect: "11px",
        },
        {
          label: "md type 12px",
          sel: ".tag-md",
          get: "font-size",
          expect: "12px",
        },
        // Rest is transparent, not white — it reads as content, unlike Pill.
        {
          label: "rest is transparent",
          sel: ".tag-sm",
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
        },
        {
          label: "hairline",
          sel: ".tag-sm",
          get: "border-top-color",
          expect: { token: "--color-stroke-divider" },
        },
        // Active is a SOLID fill, where Pill's is a soft tint.
        {
          label: "active fill is solid",
          sel: '.tag-sm[aria-pressed="true"]',
          get: "background-color",
          expect: { token: "--color-primary" },
        },
        {
          label: "active text",
          sel: '.tag-sm[aria-pressed="true"]',
          get: "color",
          expect: { token: "--color-content-contrast" },
        },
        // Only md bumps the weight when active; sm has no equivalent step.
        {
          label: "md active weight 500",
          sel: '.tag-md[aria-pressed="true"]',
          get: "font-weight",
          expect: "500",
        },
        {
          label: "sm active stays 400",
          sel: '.tag-sm[aria-pressed="true"]',
          get: "font-weight",
          expect: "400",
        },
        // Disabled dims the label ONLY — border and background untouched.
        {
          label: "disabled label dims",
          sel: ".tag-sm:disabled",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
        {
          label: "disabled keeps hairline",
          sel: ".tag-sm:disabled",
          get: "border-top-color",
          expect: { token: "--color-stroke-divider" },
        },
        {
          label: "disabled keeps background",
          sel: ".tag-sm:disabled",
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
        },
        {
          label: "no blanket opacity",
          sel: ".tag-sm:disabled",
          get: "opacity",
          expect: "1",
        },
      ],
      "components-tag--slots": [
        // The slots are existing components, not redrawn parts.
        {
          label: "avatar slot is Avatar xs",
          sel: ".tag .avatar-xs",
          get: "height",
          expect: 16,
        },
        {
          label: "status dot is the Dot primitive",
          sel: ".tag .dot",
          get: "height",
          expect: 5,
        },
        // Not a badge: bare mono text, no box.
        {
          label: "count type 12px",
          sel: ".tag-count",
          get: "font-size",
          expect: "12px",
        },
        {
          label: "count is mono",
          sel: ".tag-count",
          get: "font-family",
          expect: { token: "--font-mono", kind: "font" },
        },
        {
          label: "count colour",
          sel: ".tag-count",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
        {
          label: "count has no background",
          sel: ".tag-count",
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
        },
      ],
      "components-tag--disabled": [
        // Disabled does not cascade into the slots — the Avatar stays enabled.
        {
          label: "disabled keeps avatar fill",
          sel: ".tag:disabled .avatar-xs",
          get: "background-color",
          expect: { token: "--color-primary" },
        },
      ],
    },
  },

  // ------------------------------------------------------------------- Pill
  Pill: {
    figma: "Pill 91:505 — 6 variants (State x Dropdown), plus a Ring boolean",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 6,
    stories: {
      "components-pill--all-variants": [
        // 17px is pinned. Without a chevron the 9.5px Auto line box alone would
        // give ~15.5px, but Figma is 17 with or without one.
        { label: "height 17px", sel: ".pill", get: "height", expect: 17 },
        {
          label: "height without chevron",
          sel: "[aria-pressed]",
          get: "height",
          expect: 17,
        },
        {
          label: "padding-x",
          sel: ".pill",
          get: "padding-left",
          expect: "9px",
        },
        { label: "padding-y", sel: ".pill", get: "padding-top", expect: "2px" },
        { label: "gap", sel: ".pill", get: "gap", expect: "5px" },
        {
          label: "type 9.5px",
          sel: ".pill",
          get: "font-size",
          expect: "9.5px",
        },
        // The style is called "Statecap" but Figma applies no transform.
        {
          label: "NOT uppercase",
          sel: ".pill",
          get: "text-transform",
          expect: "none",
        },
        {
          label: "no border",
          sel: ".pill",
          get: "border-top-width",
          expect: "0px",
        },
        // Rest really is Action/Hover and hover really is Action/Focused.
        // The token names are off by one against the states they serve.
        {
          label: "rest fill = Action/Hover",
          sel: ".pill",
          get: "background-color",
          expect: { token: "--color-action-hover" },
        },
        {
          label: "rest text",
          sel: ".pill",
          get: "color",
          expect: { token: "--color-content-secondary" },
        },
        {
          label: "open fill",
          sel: '[aria-expanded="true"]',
          get: "background-color",
          expect: { token: "--color-primary-soft" },
        },
        {
          label: "open text",
          sel: '[aria-expanded="true"]',
          get: "color",
          expect: { token: "--color-primary" },
        },
        {
          label: "open flips chevron",
          sel: '[aria-expanded="true"] .pill-chevron',
          get: "rotate",
          expect: "180deg",
        },
        // Selected shares the fill but must NOT rotate anything.
        {
          label: "selected fill",
          sel: '[aria-pressed="true"]',
          get: "background-color",
          expect: { token: "--color-primary-soft" },
        },
        {
          label: "selected text",
          sel: '[aria-pressed="true"]',
          get: "color",
          expect: { token: "--color-primary" },
        },
        {
          label: "ring is inset",
          sel: ".pill.with-ring",
          get: "--tw-ring-inset",
          expect: "inset",
        },
      ],
      // Width is hug — Figma's 88/70 are just the sample string's width.
      "components-pill--hugs-its-label": [
        {
          // 33.6 was an ESTIMATE, and it was never right. It is not a Figma
          // value: Figma's pills hug, and its two sample strings measure 88 and
          // 70 — it never drew one containing "All". Back out the geometry and
          // 33.6 implies 15.6px of text inside 9+9 padding, which is 3 chars x
          // 5.2px, i.e. the "average character width" rule of thumb. "All" in
          // 9.5px Inter SemiBold actually renders 11.891px, so the estimate
          // over-counted by 31%.
          //
          // NOT a component regression, which is the thing worth ruling out
          // before retargeting a test: pill.css has zero commits since this
          // check was written, and the story has always said "All".
          //
          // 29.5 sits between the two platforms — macOS renders 29.891, the
          // Ubuntu CI runner 29.0 — and tol 2 leaves ~1.5px either side. The
          // old ±4 sounded generous but the 3.7px error ate 93% of it, leaving
          // 0.29px, which is why a 0.9px rasterisation difference failed it.
          label: "short label narrower",
          sel: ".pill",
          nth: 0,
          get: "width",
          expect: 29.5,
          tol: 2,
        },
        {
          label: "long label wider",
          sel: ".pill",
          nth: 4,
          get: "width",
          expect: 170,
          tol: 25,
        },
      ],
    },
  },

  // ------------------------------------------------------------------- Chip
  Chip: {
    figma: "Status 79:275 — chip / badge / dot",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 54,
    stories: {
      "components-chip--all-chips": [
        { label: "chip height", sel: ".chip", get: "height", expect: 20 },
        {
          label: "chip padding-x",
          sel: ".chip",
          get: "padding-left",
          expect: "9px",
        },
        {
          label: "chip padding-y",
          sel: ".chip",
          get: "padding-top",
          expect: "5px",
        },
        { label: "chip gap", sel: ".chip", get: "gap", expect: "4px" },
        { label: "chip type", sel: ".chip", get: "font-size", expect: "8px" },
        { label: "chip dot 5px", sel: ".chip-dot", get: "height", expect: 5 },
        {
          label: "warning fill",
          sel: ".chip-warning",
          get: "background-color",
          expect: { token: "--color-warning-soft" },
        },
        {
          label: "warning text",
          sel: ".chip-warning",
          get: "color",
          expect: { token: "--color-warning" },
        },
        // success maps to the Approved/* family, not Success/*
        {
          label: "success fill = Approved",
          sel: ".chip-success",
          get: "background-color",
          expect: { token: "--color-approved-soft" },
        },
        // neutral foreground is Neutral/Strong, not Neutral/Main
        {
          label: "neutral text = Strong",
          sel: ".chip-neutral",
          get: "color",
          expect: { token: "--color-neutral-strong" },
        },
      ],
      "components-chip--all-badges": [
        { label: "badge 15x15", sel: ".badge", get: "height", expect: 15 },
        { label: "badge width", sel: ".badge", get: "width", expect: 15 },
        {
          label: "badge padding",
          sel: ".badge",
          get: "padding-top",
          expect: "4px",
        },
        { label: "badge type", sel: ".badge", get: "font-size", expect: "8px" },
      ],
      "components-chip--all-dots": [
        { label: "dot 5x5", sel: ".dot", get: "height", expect: 5 },
        { label: "dot width", sel: ".dot", get: "width", expect: 5 },
      ],
      // Size property added 2026-08-22. Note MD does NOT change the chip's
      // padding, nor its inner dot — only the badge grows its box.
      "components-chip--all-sizes": [
        { label: "chip sm height", sel: ".chip-sm", get: "height", expect: 20 },
        { label: "chip md height", sel: ".chip-md", get: "height", expect: 23 },
        { label: "chip sm gap", sel: ".chip-sm", get: "gap", expect: "4px" },
        { label: "chip md gap", sel: ".chip-md", get: "gap", expect: "6px" },
        {
          label: "chip sm type",
          sel: ".chip-sm",
          get: "font-size",
          expect: "8px",
        },
        {
          label: "chip md type",
          sel: ".chip-md",
          get: "font-size",
          expect: "11px",
        },
        // padding is shared across both sizes
        {
          label: "chip md padding-x unchanged",
          sel: ".chip-md",
          get: "padding-left",
          expect: "9px",
        },
        {
          label: "chip md padding-y unchanged",
          sel: ".chip-md",
          get: "padding-top",
          expect: "5px",
        },
        // the chip's inner dot stays 5px at both sizes
        {
          label: "chip md inner dot stays 5px",
          sel: ".chip-md .chip-dot",
          get: "height",
          expect: 5,
        },
        {
          label: "badge md box 19px",
          sel: ".badge-md",
          get: "height",
          expect: 19,
        },
        { label: "badge md width", sel: ".badge-md", get: "width", expect: 19 },
        {
          label: "badge md padding",
          sel: ".badge-md",
          get: "padding-top",
          expect: "6px",
        },
        {
          label: "badge sm box stays 15px",
          sel: ".badge-sm",
          get: "height",
          expect: 15,
        },
        {
          label: "badge sm type",
          sel: ".badge-sm",
          get: "font-size",
          expect: "8px",
        },
        {
          label: "badge md type",
          sel: ".badge-md",
          get: "font-size",
          expect: "11px",
        },
        { label: "dot sm 5px", sel: ".dot-sm", get: "height", expect: 5 },
        { label: "dot md 7px", sel: ".dot-md", get: "height", expect: 7 },
        { label: "dot md width", sel: ".dot-md", get: "width", expect: 7 },
      ],
      // Figma's BG axis. The spec claimed variants: 54 but asserted nothing
      // about BG, which is why half the matrix shipped unreachable. These pin
      // both treatments so the gap cannot reopen silently.
      "components-chip--background-axis": [
        // BG=yes — the default, no class. Unchanged from before this axis existed.
        {
          label: "BG=yes chip is filled",
          sel: "#bg-yes .chip-warning",
          get: "background-color",
          expect: { token: "--color-warning-soft" },
        },
        {
          label: "BG=yes badge is filled",
          sel: "#bg-yes .badge-critical",
          get: "background-color",
          expect: { token: "--color-critical-soft" },
        },
        // BG=no — no fill at all. The core assertion of this axis.
        {
          label: "BG=no chip has no fill",
          sel: "#bg-no .chip-warning",
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
        },
        {
          label: "BG=no badge has no fill",
          sel: "#bg-no .badge-critical",
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
        },
        // ...and specifically NOT the soft tint, so the override is proven to
        // beat the colour variant rather than merely coexisting with it.
        {
          label: "BG=no chip is NOT the soft tint",
          sel: "#bg-no .chip-warning",
          get: "background-color",
          expect: { token: "--color-warning-soft" },
          not: true,
        },
        // The badge circle is gone: no fill AND no border. The audit verified
        // Figma draws no hairline here, so assert its absence explicitly.
        {
          label: "BG=no badge has no border",
          sel: "#bg-no .badge-critical",
          get: "border-top-width",
          expect: "0px",
        },
        {
          label: "BG=no chip has no border",
          sel: "#bg-no .chip-warning",
          get: "border-top-width",
          expect: "0px",
        },
        // Only the fill changes — colour tokens are untouched across the axis.
        {
          label: "BG=no keeps its text colour",
          sel: "#bg-no .chip-warning",
          get: "color",
          expect: { token: "--color-warning" },
        },
        {
          label: "BG=no keeps its dot colour",
          sel: "#bg-no .chip-warning .chip-dot",
          get: "background-color",
          expect: { token: "--color-warning" },
        },
        // Geometry is unchanged, so the two treatments stay interchangeable.
        {
          label: "BG=no chip keeps its height",
          sel: "#bg-no .chip-warning",
          get: "height",
          expect: 20,
        },
        {
          label: "BG=no badge keeps its box",
          sel: "#bg-no .badge-critical",
          get: "width",
          expect: 15,
        },
        // dot: BG is a no-op, so the same class list must still be filled.
        {
          label: "dot is filled regardless of BG",
          sel: "#bg-dot .dot-warning",
          get: "background-color",
          expect: { token: "--color-warning" },
        },
      ],

      "components-chip--with-ring": [
        // Figma's Ring is inset:0 in Primary/Main. It used to render outset in
        // the variant's own colour; both were wrong.
        {
          label: "ring is inset",
          sel: ".with-ring",
          get: "--tw-ring-inset",
          expect: "inset",
        },
      ],
    },
  },

  // ----------------------------------------------------------------- Switch
  Switch: {
    figma: "Switch 108:563 — 6 variants",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 6,
    stories: {
      "components-switch--default": [
        { label: "track 32x18", sel: ".switch", get: "width", expect: 32 },
        { label: "track height", sel: ".switch", get: "height", expect: 18 },
        {
          label: "track padding",
          sel: ".switch",
          get: "padding-top",
          expect: "2px",
        },
        {
          label: "off = Action/Focused",
          sel: ".switch",
          get: "background-color",
          expect: { token: "--color-action-focused" },
        },
      ],
      "components-switch--checked": [
        {
          label: "on = Primary/Main",
          sel: ".switch",
          get: "background-color",
          expect: { token: "--color-primary" },
        },
      ],
      "components-switch--disabled": [
        {
          label: "disabled off = Secondary/Soft",
          sel: ".switch",
          get: "background-color",
          expect: { token: "--color-secondary-soft" },
        },
      ],
      "components-switch--disabled-checked": [
        {
          label: "disabled on = Primary/Disabled",
          sel: ".switch",
          get: "background-color",
          expect: { token: "--color-primary-disabled" },
        },
      ],
    },
  },

  // ------------------------------------------------------------ RadioSelect
  RadioSelect: {
    figma: "Radio 139:1049 — 4 variants",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 4,
    stories: {
      "components-radioselect--default": [
        {
          label: "circle 15px",
          sel: ".radio-select-input",
          get: "height",
          expect: 15,
        },
        {
          label: "circle width",
          sel: ".radio-select-input",
          get: "width",
          expect: 15,
        },
        {
          label: "border 1px",
          sel: ".radio-select-input",
          get: "border-top-width",
          expect: "1px",
        },
        {
          label: "gap to label",
          sel: ".radio-select",
          get: "gap",
          expect: "9px",
        },
        {
          label: "label type",
          sel: ".radio-select-label",
          get: "font-size",
          expect: "12px",
        },
        {
          label: "label line-height",
          sel: ".radio-select-label",
          get: "line-height",
          expect: "18px",
        },
        {
          label: "rest border = Stroke/Border",
          sel: ".radio-select-input",
          get: "border-top-color",
          expect: { token: "--color-stroke-border" },
        },
      ],
      "components-radioselect--selected": [
        {
          label: "selected border = Primary",
          sel: ".radio-select-input",
          get: "border-top-color",
          expect: { token: "--color-primary" },
        },
      ],
      "components-radioselect--disabled": [
        {
          label: "disabled border = Stroke/Divider",
          sel: ".radio-select-input",
          get: "border-top-color",
          expect: { token: "--color-stroke-divider" },
        },
        {
          label: "disabled label",
          sel: ".radio-select-label",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
      ],
    },
  },

  // ------------------------------------------------------------- IconButton
  IconButton: {
    figma: "Icon Button 78:210 — 12 variants",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 12,
    stories: {
      // Figma declares Spacing/6 on all three sizes, but the fixed frame
      // clamps it: the real offsets are 6 / 2 / 0.
      "components-iconbutton--all-sizes": [
        {
          label: "xs box 12px",
          sel: ".icon-button-xs",
          get: "height",
          expect: 12,
        },
        {
          label: "xs padding",
          sel: ".icon-button-xs",
          get: "padding-top",
          expect: "0px",
        },
        {
          label: "md box 18px",
          sel: ".icon-button-md",
          get: "height",
          expect: 18,
        },
        {
          label: "md padding",
          sel: ".icon-button-md",
          get: "padding-top",
          expect: "2px",
        },
        {
          label: "lg box 28px",
          sel: ".icon-button-lg",
          get: "height",
          expect: 28,
        },
        {
          label: "lg padding",
          sel: ".icon-button-lg",
          get: "padding-top",
          expect: "6px",
        },
        {
          label: "radius",
          sel: ".icon-button-lg",
          get: "border-top-left-radius",
          expect: "6px",
        },
        {
          label: "rest glyph = Secondary/Main",
          sel: ".icon-button-lg",
          get: "color",
          expect: { token: "--color-secondary" },
        },
      ],
      "components-iconbutton--disabled": [
        // Figma dims the glyph with a token; opacity-50 was not the design.
        {
          label: "disabled glyph token",
          sel: ".icon-button",
          get: "color",
          expect: { token: "--color-secondary-disabled" },
        },
        {
          label: "no blanket opacity",
          sel: ".icon-button",
          get: "opacity",
          expect: "1",
        },
      ],
    },
  },

  // ------------------------------------------------------------------- Icon
  Icon: {
    figma: "Icon Container 69:6944 — 11 sizes, no styling of its own",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 11,
    stories: {
      "components-icon--all-sizes": [
        { label: "10px", sel: ".icon-size-10", get: "height", expect: 10 },
        { label: "12px", sel: ".icon-size-12", get: "height", expect: 12 },
        { label: "14px", sel: ".icon-size-14", get: "height", expect: 14 },
        { label: "16px", sel: ".icon-size-16", get: "height", expect: 16 },
        { label: "20px", sel: ".icon-size-20", get: "height", expect: 20 },
        { label: "24px", sel: ".icon-size-24", get: "height", expect: 24 },

        // Stroke weight per size, from the Figma exports (69:6944). These are
        // USER UNITS over the sprite's 24 viewBox, so the rendered pixel width
        // is value * size / 24 — which is why they are not monotonic. The px
        // each one targets is in the label. See src/components/icon.css.
        {
          label: "10px stroke -> 0.75px",
          sel: ".icon-size-10",
          get: "stroke-width",
          expect: "1.8px",
        },
        {
          label: "11px stroke -> 0.75px",
          sel: ".icon-size-11",
          get: "stroke-width",
          expect: "1.63636px",
        },
        {
          label: "12px stroke -> 1px",
          sel: ".icon-size-12",
          get: "stroke-width",
          expect: "2px",
        },
        {
          label: "13px stroke -> 1px",
          sel: ".icon-size-13",
          get: "stroke-width",
          expect: "1.84615px",
        },
        {
          label: "14px stroke -> 1.25px",
          sel: ".icon-size-14",
          get: "stroke-width",
          expect: "2.14286px",
        },
        {
          label: "15px stroke -> 1.25px",
          sel: ".icon-size-15",
          get: "stroke-width",
          expect: "2px",
        },
        {
          label: "16px stroke -> 1.25px",
          sel: ".icon-size-16",
          get: "stroke-width",
          expect: "1.875px",
        },
        {
          label: "18px stroke -> 1.25px",
          sel: ".icon-size-18",
          get: "stroke-width",
          expect: "1.66667px",
        },
        {
          label: "20px stroke -> 1.5px",
          sel: ".icon-size-20",
          get: "stroke-width",
          expect: "1.8px",
        },
        {
          label: "22px stroke -> 1.5px",
          sel: ".icon-size-22",
          get: "stroke-width",
          expect: "1.63636px",
        },
        {
          label: "24px stroke -> 2px",
          sel: ".icon-size-24",
          get: "stroke-width",
          expect: "2px",
        },
      ],
    },
  },

  SensitiveData: {
    figma: "Sensitive Data 296:5303 — Checked (yes / no), plus a Ring boolean",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 2,
    stories: {
      "components-sensitivedata--both-variants": [
        {
          label: "row gap 4px (Spacing/4)",
          sel: ".sensitive-data",
          get: "gap",
          expect: "4px",
        },
        {
          label: "row centres its items",
          sel: ".sensitive-data",
          get: "align-items",
          expect: "center",
        },

        // Body Content/Caption — the one bound text style on this component.
        {
          label: "value 12px",
          sel: ".sensitive-data-value",
          get: "font-size",
          expect: "12px",
        },
        {
          label: "value leading 18px",
          sel: ".sensitive-data-value",
          get: "line-height",
          expect: "18px",
        },
        {
          label: "value weight 400",
          sel: ".sensitive-data-value",
          get: "font-weight",
          expect: "400",
        },
        {
          label: "value is Content/Primary",
          sel: ".sensitive-data-value",
          get: "color",
          expect: { token: "--color-content-primary" },
        },

        // The toggle is a reused Icon Button, not a part of this component.
        // These pin the composition, so a change to icon-button-md that broke
        // the 18/14 pairing would surface here too.
        {
          label: "toggle is the 18px Icon Button",
          sel: ".sensitive-data .icon-button",
          get: "height",
          expect: 18,
        },
        {
          label: "toggle glyph is 14px",
          sel: ".sensitive-data .icon",
          get: "height",
          expect: 14,
        },
        {
          label: "toggle glyph is Secondary/Main at rest",
          sel: ".sensitive-data .icon-button",
          get: "color",
          expect: { token: "--color-secondary" },
        },

        // Figma's two variants are visually identical, so there is nothing
        // state-dependent to assert. `:focus-visible` on the toggle is
        // unassertable here by design: the harness can park a pointer for
        // `hover: true` but cannot drive keyboard focus. Exercised in the
        // Focus story instead.
      ],
    },
  },

  DataRow: {
    figma:
      "Data Row 165:678 — Hover x Icon, plus comment / help / Ring booleans",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 4,
    stories: {
      "components-datarow--all-variants": [
        {
          label: "row height 38px",
          sel: ".data-row",
          get: "height",
          expect: 38,
        },
        {
          label: "column gap 16px (Spacing/16)",
          sel: ".data-row",
          get: "gap",
          expect: "16px",
        },
        {
          label: "padding-x 4px",
          sel: ".data-row",
          get: "padding-left",
          expect: "4px",
        },
        {
          label: "padding-y 12.5px (Spacing/12-5)",
          sel: ".data-row",
          get: "padding-top",
          expect: "12.5px",
        },
        {
          label: "radius 4px (Radius/XS)",
          sel: ".data-row",
          get: "border-radius",
          expect: "4px",
        },
        {
          label: "row centres its columns",
          sel: ".data-row",
          get: "align-items",
          expect: "center",
        },

        // Field label — Body 2, truncating, fixed 200px column.
        {
          label: "field column 200px",
          sel: ".data-row-field",
          get: "width",
          expect: 200,
        },
        {
          label: "field is Body 2 (12.5px)",
          sel: ".data-row-field",
          get: "font-size",
          expect: "12.5px",
        },
        {
          label: "field leading 12.5px",
          sel: ".data-row-field",
          get: "line-height",
          expect: "12.5px",
        },
        {
          label: "field is Content/Tertiary",
          sel: ".data-row-field",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
        {
          label: "field truncates",
          sel: ".data-row-field",
          get: "text-overflow",
          expect: "ellipsis",
        },

        // Value — same type, different colour, fixed 400px column.
        {
          label: "value column 400px",
          sel: ".data-row-value",
          get: "width",
          expect: 400,
        },
        {
          label: "value is Content/Primary",
          sel: ".data-row-value",
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        {
          label: "value is Body 2, not Caption",
          sel: ".data-row-value",
          get: "font-size",
          expect: "12.5px",
        },

        // Composition: these assert the reused components still line up, so a
        // change to either would surface here as well as in its own spec.
        {
          label: "status slot stretches (flex-1)",
          sel: ".data-row-status",
          get: "flex-grow",
          expect: "1",
        },
        {
          label: "status keeps FieldVerification's 7px gap",
          sel: ".data-row-status",
          get: "gap",
          expect: "7px",
        },
        {
          label: "status check is Approved/Main",
          sel: ".data-row-status .section-marker",
          get: "color",
          expect: { token: "--color-approved" },
        },
        {
          label: "status label is Caption 12px",
          sel: ".data-row-status .field-verification-label",
          get: "font-size",
          expect: "12px",
        },

        // Actions are laid out but invisible at rest — Figma's opacity-0.
        {
          label: "action hidden at rest",
          sel: ".data-row-action",
          get: "opacity",
          expect: "0",
        },
        {
          label: "action still occupies space",
          sel: ".data-row-action",
          get: "height",
          expect: 18,
        },

        // Hover LAST — the harness leaves the pointer parked, so any rest-state
        // check after these would silently read the hovered value.
        // NOT asserted: :focus-within reveal, and the row has no focus state of
        // its own. The harness can park a pointer but cannot drive focus —
        // exercised in the KeyboardReveal story instead.
        {
          label: "hover fills with Action/Subtle",
          sel: ".data-row",
          get: "background-color",
          expect: { token: "--color-action-subtle" },
          hover: true,
        },
        {
          label: "hover reveals the action",
          sel: ".data-row-action",
          get: "opacity",
          expect: "1",
          hover: true,
        },
      ],
    },
  },

  Checkbox: {
    figma:
      "Checkbox 108:607 — Active x Hover x Disabled, plus label / subtitle / icon / Ring",
    /** Variants drawn in Figma, from the drift sweep. 4 of 8 combinations. */
    variants: 4,
    stories: {
      "components-checkbox--all-variants": [
        {
          label: "row gap 9px (Spacing/9)",
          sel: ".checkbox",
          get: "gap",
          expect: "9px",
        },
        {
          label: "row centres its items",
          sel: ".checkbox",
          get: "align-items",
          expect: "center",
        },

        // The box IS the native input, drawn directly — no faux element.
        {
          label: "control box is 15px",
          sel: ".checkbox-input",
          get: "height",
          expect: 15,
        },
        {
          label: "box radius 4px (Radius/XS)",
          sel: ".checkbox-input",
          get: "border-radius",
          expect: "4px",
        },
        {
          label: "box border 1px (Stroke/Line)",
          sel: ".checkbox-input",
          get: "border-top-width",
          expect: "1px",
        },
        {
          label: "rest border is Stroke/Divider",
          sel: ".checkbox-input",
          get: "border-top-color",
          expect: { token: "--color-stroke-divider" },
        },
        {
          label: "rest has no fill",
          sel: ".checkbox-input",
          get: "background-color",
          expect: "rgba(0, 0, 0, 0)",
        },
        {
          label: "native appearance is reset",
          sel: ".checkbox-input",
          get: "appearance",
          expect: "none",
        },

        // Checkmark — Lucide check at 10px, hidden until checked.
        {
          label: "checkmark is 10px",
          sel: ".checkbox-check",
          get: "height",
          expect: 10,
        },
        {
          label: "checkmark is Content/Contrast",
          sel: ".checkbox-check",
          get: "color",
          expect: { token: "--color-content-contrast" },
        },
        {
          label: "checkmark hidden when unchecked",
          sel: ".checkbox-check",
          get: "opacity",
          expect: "0",
        },

        // Checked — Primary/Main fill and border.
        {
          label: "checked fill is Primary/Main",
          sel: ".checkbox-input:checked",
          get: "background-color",
          expect: { token: "--color-primary" },
        },
        {
          label: "checked border is Primary/Main",
          sel: ".checkbox-input:checked",
          get: "border-top-color",
          expect: { token: "--color-primary" },
        },
        {
          label: "checked hover fill is Primary/Dark",
          sel: ".checkbox-input:checked",
          get: "background-color",
          expect: { token: "--color-primary-dark" },
          hover: true,
        },
        {
          label: "checked hover border is Primary/Dark",
          sel: ".checkbox-input:checked",
          get: "border-top-color",
          expect: { token: "--color-primary-dark" },
          hover: true,
        },

        // Label — Caption, and the inverted ramp: lighter when checked.
        {
          label: "label is Caption 12px",
          sel: ".checkbox-label",
          get: "font-size",
          expect: "12px",
        },
        {
          label: "label leading 18px",
          sel: ".checkbox-label",
          get: "line-height",
          expect: "18px",
        },
        {
          label: "unchecked label is Content/Primary",
          sel: ".checkbox-label",
          get: "color",
          expect: { token: "--color-content-primary" },
        },
        {
          label: "checked label dims to Content/Tertiary",
          sel: ".checkbox:has(.checkbox-input:checked) .checkbox-label",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },
        {
          label: "disabled label is Content/Tertiary",
          sel: ".checkbox:has(.checkbox-input:disabled) .checkbox-label",
          get: "color",
          expect: { token: "--color-content-tertiary" },
        },

        // Disabled — token swap, never opacity.
        {
          label: "disabled border is Stroke/Disabled",
          sel: ".checkbox-input:disabled",
          get: "border-top-color",
          expect: { token: "--color-stroke-disabled" },
        },
        {
          label: "disabled does NOT fade the control",
          sel: ".checkbox-input:disabled",
          get: "opacity",
          expect: "1",
        },

        // Hover LAST — the harness leaves the pointer parked, so any rest-state
        // check placed after these would silently read the hovered value.
        // NOT asserted, by necessity: :focus-visible and :indeterminate. The
        // harness can park a pointer but cannot drive keyboard focus, and
        // indeterminate is JS-only. Both live in stories — KeyboardAndFocus
        // and IndeterminateGap.
        {
          label: "hover border is Neutral/Main",
          sel: ".checkbox-input",
          get: "border-top-color",
          expect: { token: "--color-neutral" },
          hover: true,
        },
        {
          label: "hover fill is Action/Hover",
          sel: ".checkbox-input",
          get: "background-color",
          expect: { token: "--color-action-hover" },
          hover: true,
        },
      ],
    },
  },

  Skeleton: {
    figma:
      "Skeleton 1063:24034 — Shape x Size (15 variants); usage spec 1081:1986",
    /** Variants drawn in Figma, from the drift sweep. */
    variants: 15,
    stories: {
      "components-skeleton--all-variants": [
        // Fill — the only bound token in the whole component.
        {
          label: "fill is Surface/Neutral",
          sel: ".skeleton",
          get: "background-color",
          expect: { token: "--color-surface-neutral" },
        },

        // Radius is carried by SHAPE, and this is the only component using four
        // of the five radius tokens.
        {
          label: "line radius 4px (Radius/XS)",
          sel: ".skeleton-line",
          get: "border-radius",
          expect: "4px",
        },
        {
          label: "heading radius 4px (Radius/XS)",
          sel: ".skeleton-heading",
          get: "border-radius",
          expect: "4px",
        },
        {
          label: "button radius 6px (Radius/SM)",
          sel: ".skeleton-button",
          get: "border-radius",
          expect: "6px",
        },
        {
          label: "rectangle radius 8px (Radius/MD)",
          sel: ".skeleton-rectangle",
          get: "border-radius",
          expect: "8px",
        },
        {
          label: "circle is fully round",
          sel: ".skeleton-circle",
          get: "border-radius",
          expect: "9999px",
        },

        // Dimensions are carried by SHAPE x SIZE — a 5x3 matrix, not one box
        // with three scales. All 15 pairs asserted.
        {
          label: "line SM 120x12",
          sel: ".skeleton-line.skeleton-sm",
          get: "width",
          expect: 120,
        },
        {
          label: "line SM height 12",
          sel: ".skeleton-line.skeleton-sm",
          get: "height",
          expect: 12,
        },
        {
          label: "line MD 200x16",
          sel: ".skeleton-line.skeleton-md",
          get: "width",
          expect: 200,
        },
        {
          label: "line MD height 16",
          sel: ".skeleton-line.skeleton-md",
          get: "height",
          expect: 16,
        },
        {
          label: "line LG 320x20",
          sel: ".skeleton-line.skeleton-lg",
          get: "width",
          expect: 320,
        },
        {
          label: "line LG height 20",
          sel: ".skeleton-line.skeleton-lg",
          get: "height",
          expect: 20,
        },

        {
          label: "heading SM 160x20",
          sel: ".skeleton-heading.skeleton-sm",
          get: "width",
          expect: 160,
        },
        {
          label: "heading SM height 20",
          sel: ".skeleton-heading.skeleton-sm",
          get: "height",
          expect: 20,
        },
        {
          label: "heading MD 240x24",
          sel: ".skeleton-heading.skeleton-md",
          get: "width",
          expect: 240,
        },
        {
          label: "heading MD height 24",
          sel: ".skeleton-heading.skeleton-md",
          get: "height",
          expect: 24,
        },
        {
          label: "heading LG 360x32",
          sel: ".skeleton-heading.skeleton-lg",
          get: "width",
          expect: 360,
        },
        {
          label: "heading LG height 32",
          sel: ".skeleton-heading.skeleton-lg",
          get: "height",
          expect: 32,
        },

        {
          label: "circle SM 32",
          sel: ".skeleton-circle.skeleton-sm",
          get: "width",
          expect: 32,
        },
        {
          label: "circle SM is square",
          sel: ".skeleton-circle.skeleton-sm",
          get: "height",
          expect: 32,
        },
        {
          label: "circle MD 40",
          sel: ".skeleton-circle.skeleton-md",
          get: "width",
          expect: 40,
        },
        {
          label: "circle MD is square",
          sel: ".skeleton-circle.skeleton-md",
          get: "height",
          expect: 40,
        },
        {
          label: "circle LG 56",
          sel: ".skeleton-circle.skeleton-lg",
          get: "width",
          expect: 56,
        },
        {
          label: "circle LG is square",
          sel: ".skeleton-circle.skeleton-lg",
          get: "height",
          expect: 56,
        },

        {
          label: "rectangle SM 120x80",
          sel: ".skeleton-rectangle.skeleton-sm",
          get: "width",
          expect: 120,
        },
        {
          label: "rectangle SM height 80",
          sel: ".skeleton-rectangle.skeleton-sm",
          get: "height",
          expect: 80,
        },
        {
          label: "rectangle MD 200x120",
          sel: ".skeleton-rectangle.skeleton-md",
          get: "width",
          expect: 200,
        },
        {
          label: "rectangle MD height 120",
          sel: ".skeleton-rectangle.skeleton-md",
          get: "height",
          expect: 120,
        },
        {
          label: "rectangle LG 320x180",
          sel: ".skeleton-rectangle.skeleton-lg",
          get: "width",
          expect: 320,
        },
        {
          label: "rectangle LG height 180",
          sel: ".skeleton-rectangle.skeleton-lg",
          get: "height",
          expect: 180,
        },

        {
          label: "button SM 64x32",
          sel: ".skeleton-button.skeleton-sm",
          get: "width",
          expect: 64,
        },
        {
          label: "button SM height 32",
          sel: ".skeleton-button.skeleton-sm",
          get: "height",
          expect: 32,
        },
        {
          label: "button MD 96x36",
          sel: ".skeleton-button.skeleton-md",
          get: "width",
          expect: 96,
        },
        {
          label: "button MD height 36",
          sel: ".skeleton-button.skeleton-md",
          get: "height",
          expect: 36,
        },
        {
          label: "button LG 128x40",
          sel: ".skeleton-button.skeleton-lg",
          get: "width",
          expect: 128,
        },
        {
          label: "button LG height 40",
          sel: ".skeleton-button.skeleton-lg",
          get: "height",
          expect: 40,
        },

        // NOT ASSERTED: that a bare `.skeleton` carries no dimensions or
        // radius. Both axes are required, so no story renders one — and
        // adding an invalid element purely to satisfy a check would be
        // gaming the harness. The requirement is enforced by the types and
        // documented in CLAUDE.md instead.
        //
        // MOTION IS NOT ASSERTED HERE, by necessity: the harness injects
        // `animation: none !important` so mid-animation opacity cannot corrupt
        // colour checks. The pulse (2s / ease-in-out / 1 -> 0.4) and the
        // prefers-reduced-motion guard are exercised in the Motion story.
      ],
    },
  },

  // Card is intentionally absent. It is Phase 1 placeholder scaffolding with no
  // Figma source (see src/components/card.css) — verifying it would only assert
  // that a placeholder still matches itself. Add a spec when the real component
  // is extracted from Figma.
};
