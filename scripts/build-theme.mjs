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
  // The Short App file calls its ink ramp "Text" and its surfaces "BG".
  // Mapped to the same public prefixes the dashboard used: `content` avoids
  // the double-word `text-text-secondary` utility, `surface` avoids `bg-bg-*`.
  Text: "content",
  BG: "surface",
  Surface: "surface",
  Stroke: "stroke",
  Action: "action",
  Approved: "approved",
  Critical: "critical",
  Success: "success",
  Warning: "warning",
  Error: "error",
  Info: "info",
  Neutral: "neutral",
  misc: "misc",
};

function colorVarName(figmaName) {
  const [group, variant] = figmaName.split("/");
  const prefix = COLOR_GROUPS[group] ?? kebab(group);
  // Content/* and Stroke/* have no "Main"; their variants are all meaningful.
  // The Short App file names each ramp's main shade after its group
  // (`Primary/Primary`) or calls it "Base" (`Neutral/Base`, `Warning/Base`)
  // where the dashboard file used `Main` — all three forms emit the
  // unsuffixed token.
  if (
    (variant === "Main" || variant === "Base" || variant === group) &&
    !["Content", "Surface", "Stroke", "Action", "Text", "BG"].includes(group)
  ) {
    return `--color-${prefix}`;
  }
  return `--color-${prefix}-${kebab(variant)}`;
}

/**
 * Radii pass through with Figma's own names — see the comment emitted with
 * them. (The dashboard library used role names because its Figma scale
 * diverged from Tailwind's everywhere; this file's scale IS Tailwind's naming
 * with matching xs–lg values, so verbatim is the honest emission and only
 * xl/2xl override Tailwind's defaults, deliberately.)
 */

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
/**
 * Short App text-style names -> token keys, explicit per style.
 *
 * A bare "variant after the slash" rule collides here: three styles are named
 * "Default" (Display & Title, Body & Supporting, Labels) and two are named
 * "Large" (Display & Title, Metric). The collision guard at the call site
 * would catch it, so the map below is the resolution, not a convenience —
 * every key is chosen to read naturally as a utility (`text-display`,
 * `text-body`, `text-eyebrow`).
 */
const TEXT_KEYS = {
  "Display & Title/Default": "display",
  "Display & Title/Large": "display-large",
  "Display & Title/Title": "title",
  "Display & Title/Medium": "title-medium",
  "Metric/Large": "metric-large",
  "Metric/Medium": "metric-medium",
  "Metric/Small": "metric-small",
  "Body & Supporting/Lead & Subtitle": "lead",
  "Body & Supporting/Default": "body",
  "Body & Supporting/Input": "input",
  "Body & Supporting/Content": "body-content",
  "Body & Supporting/Help & Caption": "help-caption",
  "Labels, links & UI/Default": "label",
  "Labels, links & UI/Strong": "label-strong",
  "Labels, links & UI/Field Label": "field-label",
  "Labels, links & UI/Data Key": "data-key",
  "Labels, links & UI/Time stamp": "timestamp",
  "Labels, links & UI/Lockup and wordmark": "lockup-wordmark",
  "Labels, links & UI/Lockup & Tagline": "lockup-tagline",
  "Labels, links & UI/Eyebrow": "eyebrow",
  "Labels, links & UI/Micro-Label": "micro-label",
  "Labels, links & UI/Button Label": "button-label",
  "Labels, links & UI/Link": "link",
  "Labels, links & UI/Tag & Pill": "tag-pill",
};

function textKey(figmaName) {
  // Fallback for a style added to Figma after this map was written: kebab the
  // whole name so it cannot collide, and rely on the caller's guard to flag
  // any duplicate. Add new styles to TEXT_KEYS deliberately, not here.
  return TEXT_KEYS[figmaName] ?? kebab(figmaName);
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
  ["Primary", "Brand primary (crimson ramp + tints)"],
  ["Secondary", "Brand secondary"],
  ["Neutral", "Neutral ramp"],
  ["Text", "Content (text / ink) — Figma group: Text"],
  ["Content", "Content (text / ink)"],
  ["BG", "Surfaces — Figma group: BG"],
  ["Surface", "Surface stack (back to front)"],
  ["Stroke", "Stroke colors"],
  ["Action", "Action overlays (interaction states)"],
  ["Success", "Status — success"],
  ["Approved", "Status — approved"],
  ["Warning", "Status — warning"],
  ["Error", "Status — error"],
  ["Critical", "Status — critical"],
  ["Info", "Status — info"],
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

const radiusEntries = Object.entries(tokens.radius ?? {});
if (radiusEntries.length) {
  p("  /*");
  p("   * Radii — this file's Figma scale IS Tailwind's t-shirt naming, and its");
  p("   * xs/sm/md/lg values are byte-identical to Tailwind v4's defaults");
  p("   * (2/4/6/8px), so emitting them verbatim is a no-op there. xl and 2xl");
  p("   * DELIBERATELY override Tailwind (10px vs 12, 12px vs 16) so rounded-xl");
  p("   * and rounded-2xl mean this design system's corners — the opposite call");
  p("   * from the dashboard library, where the Figma scale diverged everywhere");
  p("   * and role names were safer. Radius/none and Radius/full are skipped:");
  p("   * rounded-none and rounded-full already mean exactly 0 and fully-round.");
  p("   */");
  for (const [figmaName, v] of radiusEntries) {
    const variant = figmaName.split("/")[1];
    if (variant === "none" || variant === "full") continue; // native utilities
    p(`  --radius-${kebab(variant)}: ${v}px; /* ${figmaName} */`);
  }
  p();
}

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
  // Short App: the focus ring is authored as a spread-only drop shadow
  // (offset 0/0, blur 0, spread 3, Primary/Ring at 22% alpha).
  "Primary Ring": "focus-ring",
  // Overlay elevation (Modal, DropdownList) — added 2026-09-02 with the
  // Modal. The −4 spread means filter: drop-shadow() CANNOT express it;
  // consume via box-shadow (the shadow-basic utility). Its color is raw
  // in Figma (bound to no color variable) — tokenized here.
  "Basic Drop Shadow": "basic",
  // Dashboard-era names, kept harmlessly for reference; absent from the
  // Short App tokens so they emit nothing.
  "General Drop Shadow": "panel",
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
  p("   * Keyboard focus ring — Figma's \"Primary Ring\" effect: a spread-only");
  p("   * drop shadow (offset 0/0, blur 0) sitting OUTSIDE the element. Apply");
  p("   * with the .focus-ring utility (an outline at offset 0, which occupies");
  p("   * the same geometry). The radius is inherited from the component.");
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
if (labelStyles.length) {
  p("/**");
  p(" * Uppercase type utilities.");
  p(" *");
  p(" * Emitted only for styles whose extraction records textTransform, because");
  p(" * Tailwind's --text-* composite cannot carry text-transform or");
  p(" * font-family. These bundle the whole style so the casing — and the mono");
  p(" * family, where it applies — cannot be forgotten. Prefer them over the");
  p(" * bare text-* token for those styles.");
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
  radii: Object.keys(tokens.radius ?? {}).length,
  borders: Object.keys(tokens.strokeWidth ?? {}).length,
  spacing: Object.keys(tokens.spacing ?? {}).length,
  "text styles": Object.keys(tokens.typography).length,
  "label utils": labelStyles.length,
  effects: Object.keys(tokens.effect ?? {}).length,
};
console.log(`\n  wrote  src/themes/valiify.css`);
for (const [k, v] of Object.entries(counts)) {
  console.log(`         ${String(v).padStart(3)}  ${k}`);
}
console.log(
  `\n  All ${counts.colors} colors round-tripped to source hex within 1/255.\n`,
);
