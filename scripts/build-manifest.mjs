#!/usr/bin/env node
/**
 * Generate class-manifest.json — the published class vocabulary, derived from
 * dist/shortapp-ui.css rather than hand-written.
 *
 * Hand-maintained class lists in prose drift on the next rename; this repo had
 * several, and .claude/skills/valiify-shortapp-ui/SKILL.md's "compact class map"
 * was the only real duplication of the class API. The manifest is the single
 * generated source both that skill and the drift check read, so a future rename
 * is a rebuild plus one manifest diff.
 *
 * Shipped in `files` and exported as "./manifest" — the public surface is useful
 * to consumers too.
 *
 *   node scripts/build-manifest.mjs      (after build:styles)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "dist/shortapp-ui.css");
const OUT = join(ROOT, "class-manifest.json");

let css;
try {
  css = readFileSync(SRC, "utf8");
} catch {
  console.error("  dist/shortapp-ui.css not found — run `npm run build:styles` first.");
  process.exit(1);
}

// Component classes are UNLAYERED since 1.0.1 (scripts/build-styles.mjs unwraps pass
// A — inside `@layer components` they lost to every unlayered host rule), so they are
// collected from every rule in the file, at any nesting depth (@media, @supports), by
// selector — never from declaration values. Utilities (`.va\:…`) are excluded by the
// backslash that Tailwind writes into their selectors.
import postcss from "postcss";
const root = postcss.parse(css);
const components = new Set();
root.walkRules((rule) => {
  if (rule.parent?.type === "atrule" && /keyframes/.test(rule.parent.name)) return;
  for (const sel of rule.selectors) {
    if (/^\.va\\:/.test(sel)) continue;
    for (const m of sel.matchAll(/\.(va-[a-z0-9-]+)/g)) components.add(m[1]);
  }
});
if (components.size === 0) {
  console.error("  no component classes found in dist/shortapp-ui.css — the selector walk is broken, not the bundle empty.");
  process.exit(1);
}

// Utilities are emitted UNLAYERED (see src/build/utilities.css for why), so they are
// collected from the whole file rather than from an @layer utilities block.
// `.va\:gap-4` in the output is the candidate `va:gap-4` in markup.
const utilities = new Set();
for (const m of css.matchAll(/\.va\\:((?:[A-Za-z0-9_.%#\[\]/-]|\\.)+)/g)) {
  utilities.add("va:" + m[1].replace(/\\(.)/g, "$1"));
}

const manifest = {
  $comment:
    "GENERATED from dist/shortapp-ui.css by scripts/build-manifest.mjs. Do not edit. " +
    "Component classes are namespaced va- so they cannot collide with the host app's " +
    "component library (daisyUI 4 defines .btn/.badge/.modal/.avatar/.radio/.skeleton/" +
    ".tab/.toast/.tooltip); utilities carry the Tailwind v4 prefix va: so they cannot " +
    "collide with the host's own utilities, which differ between Tailwind majors.",
  package: JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).name,
  classPrefix: "va",
  componentNamespace: "va-",
  utilityPrefix: "va:",
  counts: { components: components.size, utilities: utilities.size },
  components: [...components].sort(),
  utilities: [...utilities].sort(),
};

writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n  wrote  class-manifest.json`);
console.log(`  ${components.size} component classes · ${utilities.size} utilities`);
