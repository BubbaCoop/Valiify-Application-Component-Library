#!/usr/bin/env node
/**
 * Build-output integrity — two gates the other harnesses cannot see.
 *
 *   npm run verify:bundle        (after `npm run build` — reads dist)
 *
 * GATE 1 — undefined var() references in dist/index.css.
 * A `var(--x)` whose custom property is defined nowhere in the bundle and
 * that carries no fallback resolves to the *initial* value (usually nothing)
 * with no error anywhere. This shipped for real: base/index.css referenced
 * the dashboard-era `--color-surface-frame`, which this theme never defines —
 * every consumer page's html background silently vanished. The rule: every
 * fallback-less var() in dist must name a property defined in dist (a
 * `--x: …` declaration or an `@property --x` registration). Tailwind's
 * `--tw-*` internals always ship fallbacks or @property rules, so they pass
 * on merit, not via an exemption.
 *
 * GATE 2 — component class names that collide with Tailwind utilities.
 * Component classes share the consumer's global namespace with (a) Tailwind
 * core utilities and (b) utilities GENERATED FROM OUR OWN THEME TOKENS. Both
 * have bitten live:
 *   `.list-item`        IS Tailwind's `display: list-item` utility — rows
 *                       stacked; renamed to `.list-option`.
 *   `.text-field-label` IS the `--text-field-label` token's type utility —
 *                       utilities out-cascade components, the 13px token beat
 *                       the 14px label; renamed to `.text-field-title`.
 * The check compiles a probe through the real Tailwind + theme: every class
 * name found in src/components/*.css is offered as a candidate; any name
 * Tailwind turns into a utility rule is a collision. A built-in canary
 * (`flex`) must be flagged on every run — if it is not, the probe itself is
 * broken and the gate fails loudly rather than passing vacuously.
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist/index.css");

const BOLD = "\x1b[1m", DIM = "\x1b[2m", RED = "\x1b[31m", GRN = "\x1b[32m", OFF = "\x1b[0m";
const pass = (msg, note = "") =>
  console.log(`  ${GRN}PASS${OFF}  ${msg}${note ? `  ${DIM}${note}${OFF}` : ""}`);
const fail = (msg, why = "") => {
  console.log(`  ${RED}FAIL${OFF}  ${msg}`);
  for (const l of why.split("\n").filter(Boolean)) console.log(`${DIM}        ${l}${OFF}`);
  return true;
};

let failed = false;

// ---------------------------------------------------------------- Gate 1
console.log(`\n${BOLD}Bundle integrity${OFF}  ${DIM}dist/index.css${OFF}\n`);

if (!existsSync(DIST)) {
  console.error(`\n  ${RED}dist/index.css is missing.${OFF} Build first: npm run build\n`);
  process.exit(1);
}
const css = readFileSync(DIST, "utf8");

// Defined properties: `--x:` declarations and `@property --x` registrations.
const defined = new Set();
for (const m of css.matchAll(/(?:^|[{;\s])(--[\w-]+)\s*:/g)) defined.add(m[1]);
for (const m of css.matchAll(/@property\s+(--[\w-]+)/g)) defined.add(m[1]);

// References: fallback-less var() only — `var(--x)` with no comma. A var()
// with a fallback is legitimate even when the property is never defined.
const undefinedRefs = new Map();
for (const m of css.matchAll(/var\(\s*(--[\w-]+)\s*\)/g)) {
  if (!defined.has(m[1])) {
    undefinedRefs.set(m[1], (undefinedRefs.get(m[1]) ?? 0) + 1);
  }
}

if (undefinedRefs.size === 0) {
  pass("no undefined var() references", `${defined.size} properties defined`);
} else {
  failed = fail(
    "no undefined var() references",
    [...undefinedRefs]
      .map(([name, n]) => `${name} — referenced ${n}× with no fallback, defined nowhere in the bundle`)
      .join("\n") +
      "\nEach resolves to nothing at runtime with no error. Fix the reference\n" +
      "or define the token; do not add a fallback to silence the gate.",
  );
}

// ---------------------------------------------------------------- Gate 2

// Collect component class names from source (selectors only — @apply lines
// hold utilities, not class definitions, and comments hold prose).
const classNames = new Set();
const compDir = join(ROOT, "src/components");
for (const f of readdirSync(compDir)) {
  if (!f.endsWith(".css") || f === "index.css" || f.startsWith("_")) continue;
  const src = readFileSync(join(compDir, f), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "") // strip comments
    .replace(/@apply[^;]+;/g, ""); // strip @apply payloads
  // Selector text = whatever precedes each `{`.
  for (const m of src.matchAll(/([^{}]+)\{/g)) {
    for (const c of m[1].matchAll(/\.([a-z][a-z0-9-]*)/g)) classNames.add(c[1]);
  }
}

const CANARY = "flex"; // must always be flagged, or the probe is broken
const probeDir = join(ROOT, ".verify-tmp");
rmSync(probeDir, { recursive: true, force: true });
mkdirSync(probeDir, { recursive: true });

const candidates = [...classNames, CANARY];
writeFileSync(
  join(probeDir, "probe.html"),
  `<div class="${candidates.join(" ")}"></div>\n`,
);
// The probe compiles OUR theme + Tailwind core against the candidate list.
// source(none) keeps Tailwind from scanning the repo; only probe.html feeds it.
const probeCss = `@import "tailwindcss" source(none);\n@source "./probe.html";\n@import "../src/themes/valiify.css";\n`;
const probePath = join(probeDir, "probe.css");
writeFileSync(probePath, probeCss);

let collisions = [];
let canarySeen = false;
try {
  const result = await postcss([tailwindcss()]).process(probeCss, {
    from: probePath,
  });
  const out = result.css;
  for (const name of candidates) {
    // Exact bare-class rule (allow whitespace/newline before `{`).
    const re = new RegExp(`(^|[}\\s,])\\.${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{`, "m");
    if (re.test(out)) {
      if (name === CANARY) canarySeen = true;
      else collisions.push(name);
    }
  }
} finally {
  rmSync(probeDir, { recursive: true, force: true });
}

if (!canarySeen) {
  failed = fail(
    "collision probe self-test (canary)",
    `The canary utility "${CANARY}" was not flagged — the probe compiled\n` +
      "nothing, so a clean result would be vacuous. Fix the probe before\n" +
      "trusting this gate.",
  );
} else {
  pass("collision probe self-test (canary)", `"${CANARY}" flagged as expected`);
}

if (collisions.length === 0) {
  pass("no class/utility collisions", `${classNames.size} component classes checked`);
} else {
  failed = fail(
    "no class/utility collisions",
    collisions.map((n) => `.${n} — Tailwind (core or theme token) generates a utility with this exact name`).join("\n") +
      "\nUtilities out-cascade components, so the utility silently wins on\n" +
      "consumer pages and in Storybook. Rename the component class (the\n" +
      ".list-item → .list-option / .text-field-label → .text-field-title\n" +
      "precedent), never the token.",
  );
}

console.log(
  failed
    ? `\n  ${RED}Bundle integrity broken.${OFF}\n`
    : `\n  ${DIM}Bundle is internally consistent: every var() resolves, no class shadows a utility.${OFF}\n`,
);
process.exit(failed ? 1 : 0);
