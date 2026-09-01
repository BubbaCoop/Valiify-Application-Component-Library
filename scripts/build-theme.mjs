#!/usr/bin/env node
/**
 * Generates src/themes/valiify.css from tokens/figma-tokens.json.
 *
 *   npm run build:theme
 *
 * Why this is scripted rather than hand-written: there are ~95 tokens, and the
 * hex -> OKLCh conversion cannot be done by hand. Both this script and its
 * output are committed; the generated CSS is what the build consumes.
 *
 * Colors are converted to OKLCh but each line keeps its source hex in a
 * trailing comment, because the conversion is lossy and the hex is what a
 * reviewer diffs against Figma. Every conversion is round-tripped back to hex
 * and the build FAILS on any channel drifting more than 1/255 — that assertion
 * is what makes committing converted values safe.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "tokens/figma-tokens.json");
const OUT = join(ROOT, "src/themes/valiify.css");

const tokens = JSON.parse(readFileSync(SRC, "utf8"));

// --- Color conversion --------------------------------------------------------

const srgbToLinear = (c) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const linearToSrgb = (c) =>
  c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055;
const cbrt = (v) => Math.cbrt(v);

function parseHex(hex) {
  const h = hex.replace("#", "");
  const has8 = h.length === 8;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const a = has8 ? parseInt(h.slice(6, 8), 16) / 255 : null;
  return { r, g, b, a };
}

/** sRGB -> linear -> Oklab -> OKLCh */
function hexToOklch(hex) {
  const { r, g, b, a } = parseHex(hex);
  const [lr, lg, lb] = [r, g, b].map(srgbToLinear);

  const l_ = cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m_ = cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s_ = cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const C = Math.hypot(A, B);
  // Hue is meaningless when there is no chroma; pin it to 0 so greys and white
  // emit `oklch(1 0 0)` rather than an arbitrary-looking angle.
  const H = C < 1e-6 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;

  return { L, C, H, a };
}

/** OKLCh -> Oklab -> linear -> sRGB, used only to verify the conversion. */
function oklchToHex({ L, C, H }) {
  const A = C * Math.cos((H * Math.PI) / 180);
  const B = C * Math.sin((H * Math.PI) / 180);

  const l_ = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m_ = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s_ = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;

  const lr = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  const lg = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  const lb = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_;

  return [lr, lg, lb].map((c) =>
    Math.round(Math.min(1, Math.max(0, linearToSrgb(c))) * 255),
  );
}

const drift = [];

function formatColor(hex) {
  const { L, C, H, a } = hexToOklch(hex);
  const round = (n, p) => Number(n.toFixed(p));

  // Verify against the rounded values we actually emit, not the raw floats —
  // otherwise the assertion tests math we aren't shipping.
  const emitted = { L: round(L, 4), C: round(C, 4), H: round(H, 2) };
  const [r2, g2, b2] = oklchToHex(emitted);
  const { r, g, b } = parseHex(hex);
  const orig = [r, g, b].map((c) => Math.round(c * 255));
  const delta = Math.max(
    Math.abs(orig[0] - r2),
    Math.abs(orig[1] - g2),
    Math.abs(orig[2] - b2),
  );
  if (delta > 1) drift.push({ hex, delta, got: [r2, g2, b2], want: orig });

  const base = `oklch(${emitted.L} ${emitted.C} ${emitted.H}`;
  return a === null ? `${base})` : `${base} / ${round(a, 3)})`;
}

// --- Naming maps -------------------------------------------------------------

const kebab = (s) =>
  s
    .trim()
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Figma color groups -> CSS custom property prefix. "Main" is the unsuffixed
 * default (Primary/Main -> --color-primary), everything else is suffixed.
 */
const COLOR_GROUPS = {
  Primary: "primary",
  Secondary: "secondary",
  Content: "content",
  Surface: "surface",
  Stroke: "stroke",
  Action: "action",
  Approved: "approved",
  Critical: "critical",
  Warning: "warning",
  Neutral: "neutral",
  misc: "misc",
};

function colorVarName(figmaName) {
  const [group, variant] = figmaName.split("/");
  const prefix = COLOR_GROUPS[group] ?? kebab(group);
  // Content/* and Stroke/* have no "Main"; their variants are all meaningful.
  if (
    variant === "Main" &&
    !["Content", "Surface", "Stroke", "Action"].includes(group)
  ) {
    return `--color-${prefix}`;
  }
  return `--color-${prefix}-${kebab(variant)}`;
}

/**
 * Radii use ROLE names, not Figma's t-shirt sizes. Tailwind v4 already ships
 * --radius-xs/-sm/-md/-lg/-xl, and redefining those silently changes what
 * rounded-xs/-sm/-md mean for every consumer of this library.
 *
 * `micro` and `tight` are provisional — confirm against real component usage.
 */
const RADIUS_ROLES = {
  "Radius/Micro": ["micro", "indicators, bars"],
  "Radius/XS": ["tight", "tags, badges"],
  "Radius/SM": ["control", "buttons, inputs"],
  "Radius/MD": ["surface", "cards, panels"],
  "Radius/Rounded": ["pill", "avatars, pills"],
};

const STROKE_ROLES = {
  "Stroke/Thin": "thin",
  "Stroke/Line": "line",
  "Stroke/Micro": "micro",
};

/**
 * Figma text-style name -> Tailwind --text-* key (role, group prefix dropped).
 *
 * Label needs both Sans and Mono in the key, because Label S Sans and
 * Label S Mono are different styles at the same size — collapsing on size alone
 * would collide. The collision guard at the call site is the backstop.
 */
function textKey(figmaName) {
  const variant = figmaName.split("/")[1];
  return kebab(
    variant
      .replace(/^Action /, "action-")
      .replace(/^Micro Data /, "data-micro-")
      .replace(/^Micro /, "micro-")
      .replace(/^Label ([LS]) (Sans|Mono)/, (_, size, fam) =>
        fam === "Mono" ? `label-${size}-mono` : `label-${size}`,
      )
      .replace(/^Data /, "data-")
      .replace(/^Body /, "body-")
      .replace(/^Help /, "help-"),
  );
}

/**
 * Figma line-height -> CSS.
 *
 * The API returns the sentinel 100 for Figma's "Auto"; the extraction records
 * that as the string "AUTO". Auto means the font's own metrics (~1.21x for
 * Inter), which is `normal` in CSS — NOT `1`. Emitting `1` makes every affected
 * style noticeably too tight, which is what an earlier version of this script
 * got wrong.
 */
const lineHeight = (lh) => (lh === "AUTO" ? "normal" : `${lh}px`);

/**
 * Figma letter-spacing -> CSS.
 *
 * Every letterSpacing value this API returns is a PERCENTAGE, not px — verified
 * against the Text Preview section, which labels them "10%" and "0.4%". em is
 * the CSS equivalent of a percentage of font size.
 */
const letterSpacing = (pct) => `${Number((pct / 100).toFixed(5))}em`;

// --- Emit --------------------------------------------------------------------

const L = [];
const p = (s = "") => L.push(s);

p("/**");
p(" * Valiify Short App Theme — REAL design tokens from Figma.");
p(" *");
p(" * GENERATED FILE — do not edit by hand.");
p(" * Source:    tokens/figma-tokens.json");
p(" * Generator: scripts/build-theme.mjs  (npm run build:theme)");
p(" *");
p(` * Figma: ${tokens.$meta.figmaFile} (${tokens.$meta.fileKey})`);
p(" *");
p(" * Declared in Tailwind's `@theme` so every token generates utilities:");
p(" *   --color-primary  -> bg-primary, text-primary, border-primary");
p(" *   --radius-control -> rounded-control");
p(
  " *   --text-body-1    -> text-body-1 (size + line-height + weight + tracking)",
);
p(" *");
p(" * Prefer those utilities over hand-written var().");
p(" *");
p(" * Colors are OKLCh; the source hex follows each line so values stay");
p(" * diffable against Figma. See scripts/build-theme.mjs for the round-trip");
p(" * assertion that guards the conversion.");
p(" *");
p(" * V1 is a single light theme, so tokens live at the root with no");
p(" * [data-theme] wrapper.");
p(" */");
p();
// `static` is load-bearing: with a plain `@theme`, Tailwind emits only the
// variables it sees referenced, so the published dist/index.css shipped just the
// ~43 tokens the three components happen to use and dropped the other 92. A
// consumer could not then reference var(--color-approved) at all. `static`
// forces every token into the output, which is the whole point of shipping a
// token library.
p("@theme static {");

// Colors, grouped in the order the design system reads
const GROUP_ORDER = [
  ["Primary", "Brand primary"],
  ["Secondary", "Brand secondary"],
  ["Content", "Content (text / ink)"],
  ["Surface", "Surface stack (back to front)"],
  ["Stroke", "Stroke colors — widths are --border-* below"],
  ["Action", "Action overlays (interaction states)"],
  ["Approved", "Status — approved"],
  ["Critical", "Status — critical"],
  ["Warning", "Status — warning"],
  ["Neutral", "Status — neutral"],
  ["misc", "UnGrouped one-offs"],
];

for (const [group, label] of GROUP_ORDER) {
  const entries = Object.entries(tokens.color).filter(
    ([n]) => n.split("/")[0] === group,
  );
  if (!entries.length) continue;
  p(`  /* ${label} */`);
  for (const [figmaName, hex] of entries) {
    p(`  ${colorVarName(figmaName)}: ${formatColor(hex)}; /* ${hex} */`);
  }
  p();
}

p("  /*");
p("   * Radii — named by ROLE, not by Figma's t-shirt size. Tailwind v4 ships");
p("   * --radius-xs/-sm/-md itself; redefining those would silently change");
p("   * rounded-xs/-sm/-md for consumers.");
p("   */");
for (const [figmaName, [role, usage]] of Object.entries(RADIUS_ROLES)) {
  const v = tokens.radius?.[figmaName];
  if (v === undefined) continue; // token not extracted yet
  p(`  --radius-${role}: ${v}px; /* ${figmaName} — ${usage} */`);
}
p();

p(
  "  /* Border widths — no Tailwind namespace, so used via border-[length:var(...)] */",
);
for (const [figmaName, role] of Object.entries(STROKE_ROLES)) {
  const v = tokens.strokeWidth?.[figmaName];
  if (v === undefined) continue; // token not extracted yet
  p(`  --border-${role}: ${v}px; /* ${figmaName} */`);
}
p();

p("  /* Font families */");
p(
  "  --font-sans: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',",
);
p("    Roboto, 'Helvetica Neue', Arial, sans-serif;");
p("  --font-mono: 'JetBrains Mono', 'SF Mono', Monaco, 'Cascadia Code',");
p("    'Roboto Mono', Consolas, 'Courier New', monospace;");
p();

p("  /*");
p("   * Text styles — composite tokens, so one utility carries size,");
p("   * line-height, weight and tracking.");
p("   *");
p("   * `line-height: normal` is Figma's \"Auto\": the font's own metrics");
p(
  "   * (~1.21x for Inter). The API reports Auto as the sentinel 100, which does",
);
p("   * NOT mean 100% — emitting `1` for it makes the style too tight.");
p("   *");
p("   * letter-spacing is in em because every letterSpacing value the API");
p("   * returns is a percentage of font size, not px.");
p("   *");
p(
  "   * IMPORTANT: the --text-* composite carries size, line-height, weight and",
);
p(
  "   * tracking but NOT font-family and NOT text-transform. Two consequences:",
);
p("   *");
p("   *   JetBrains Mono styles must be paired with font-mono, or they render");
p("   *   in Inter:  @apply text-data-m font-mono;");
p("   *");
p("   *   Label styles are uppercase in Figma, so use the generated");
p("   *   type-label-* utilities below, which bundle the casing.");
p("   */");

const seenKeys = new Map();
const labelStyles = [];
for (const [figmaName, t] of Object.entries(tokens.typography)) {
  const key = textKey(figmaName);
  if (seenKeys.has(key)) {
    throw new Error(
      `Text token name collision: "${figmaName}" and "${seenKeys.get(key)}" both map to --text-${key}`,
    );
  }
  seenKeys.set(key, figmaName);

  const isMono = t.family !== "Inter";
  const note = `${figmaName} (${t.family} ${t.style}${isMono ? " — needs font-mono" : ""})`;
  p(`  --text-${key}: ${t.size}px; /* ${note} */`);
  p(`  --text-${key}--line-height: ${lineHeight(t.lineHeight)};`);
  p(`  --text-${key}--font-weight: ${t.weight};`);
  if (t.letterSpacingPercent) {
    p(
      `  --text-${key}--letter-spacing: ${letterSpacing(t.letterSpacingPercent)}; /* ${t.letterSpacingPercent}% */`,
    );
  }
  if (t.textTransform) labelStyles.push({ key, figmaName, t });
}
p();

// Shadow mapping: Figma effect name -> CSS variable name
const SHADOW_NAMES = {
  "General Drop Shadow": "panel",
  "Switch Knob Shadow": "knob",
  "Modal Drop Shadow": "modal",
  "Toast Drop Shadow": "toast",
};

p("  /* Effects */");
for (const [figmaName, varName] of Object.entries(SHADOW_NAMES)) {
  const e = tokens.effect[figmaName];
  if (e) {
    p(
      `  --shadow-${varName}: ${e.offsetX} ${e.offsetY}px ${e.blur}px ${e.spread}px ${formatColor(e.color)}; /* ${figmaName} ${e.color} */`,
    );
  }
}
p();

const ring = tokens.focusRing;
if (ring) {
  p("  /*");
  p("   * Keyboard focus ring.");
  p("   *");
  p("   * In Figma this is a full-size overlay frame, so the ring's OUTER edge");
  p("   * aligns with the component's own outer edge instead of sitting outside");
  p("   * it. Apply with the .focus-ring utility, which reproduces that with a");
  p("   * negative outline-offset. The radius is inherited from the component.");
  p("   */");
  p(`  --ring-focus-width: ${ring.width}px;`);
  p(
    `  --ring-focus-color: ${formatColor(ring.color)}; /* ${ring.colorFigmaToken} ${ring.color} */`,
  );
  p();
}

p("  /*");
p(
  "   * NOTE: no --spacing-* tokens on purpose. Tailwind v4's spacing scale is a",
);
p(
  "   * multiplier of --spacing (0.25rem), so Figma's whole-pixel values all map",
);
p("   * to standard steps: Spacing/8 -> p-2, Spacing/7 -> p-1.75.");
p("   *");
p(
  "   * The multiplier must be a multiple of 0.25 (= 1px steps), so Tailwind can",
);
p(
  "   * express any whole pixel but no half-pixel. Figma's two fractional tokens",
);
p("   * need arbitrary values instead: Spacing/7-5 -> p-[7.5px] and");
p("   * Spacing/12-5 -> p-[12.5px]. The multiplier forms p-1.875 / p-3.125 do");
p("   * not compile.");
p("   *");
p("   * Defining --spacing-8: 8px would make p-8 mean 8px instead of 32px and");
p("   * break existing usage. See CLAUDE.md for the full mapping table.");
p("   */");
p("}");
p();

/*
 * Label utilities live in this generated file, after the @theme block, because
 * they are derived from the label tokens above and must stay in step with them.
 * @utility (not @layer utilities) is required for @apply to accept them.
 */
p("/**");
p(" * Label type utilities.");
p(" *");
p(" * Figma marks every Label style UPPER, but Tailwind's --text-* composite");
p(
  " * cannot carry text-transform or font-family. These bundle the whole style so",
);
p(
  " * the casing — and the mono family, where it applies — cannot be forgotten:",
);
p(" *");
p(' *   <span class="type-label-l">Section heading</span>');
p(" *");
p(" * Prefer these over the bare text-label-* tokens.");
p(" */");
for (const { key, figmaName, t } of labelStyles) {
  const parts = [`text-${key}`];
  if (t.family !== "Inter") parts.push("font-mono");
  parts.push("uppercase");
  p(`@utility type-${key} {`);
  p(`  @apply ${parts.join(" ")}; /* ${figmaName} */`);
  p("}");
  p();
}

if (drift.length) {
  console.error("\n  Color round-trip FAILED — conversion drifted >1/255:\n");
  for (const d of drift) {
    console.error(
      `    ${d.hex}  want rgb(${d.want})  got rgb(${d.got})  Δ${d.delta}`,
    );
  }
  console.error("\n  Refusing to write the theme.\n");
  process.exit(1);
}

writeFileSync(OUT, L.join("\n"));

const counts = {
  colors: Object.keys(tokens.color).length,
  radii: Object.keys(RADIUS_ROLES).length,
  borders: Object.keys(STROKE_ROLES).length,
  "text styles": Object.keys(tokens.typography).length,
  "label utils": labelStyles.length,
  effects: Object.keys(SHADOW_NAMES).length,
};
console.log(`\n  wrote  src/themes/valiify.css`);
for (const [k, v] of Object.entries(counts)) {
  console.log(`         ${String(v).padStart(3)}  ${k}`);
}
console.log(
  `\n  All ${counts.colors} colors round-tripped to source hex within 1/255.\n`,
);
