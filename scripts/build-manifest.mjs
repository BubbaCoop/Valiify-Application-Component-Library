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

/** Bodies of the top-level `@layer <name> { … }` blocks. */
function layerBodies(name) {
  const out = [];
  const re = new RegExp(`@layer\\s+${name}\\s*\\{`, "g");
  let m;
  while ((m = re.exec(css))) {
    let depth = 1, i = m.index + m[0].length;
    const start = i;
    while (i < css.length && depth) {
      if (css[i] === "{") depth++;
      else if (css[i] === "}") depth--;
      i++;
    }
    out.push(css.slice(start, i - 1));
  }
  return out;
}

/** Selector text at depth 0 of a block. */
function* heads(body) {
  let depth = 0, buf = [];
  for (const ch of body) {
    if (ch === "{") {
      if (depth === 0) { yield buf.join(""); buf = []; }
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0) buf = [];
    } else if (depth === 0) buf.push(ch);
  }
}

const components = new Set();
for (const body of layerBodies("components")) {
  for (const head of heads(body)) {
    if (head.trim().startsWith("@")) continue;
    for (const m of head.matchAll(/\.(va-[a-z0-9-]+)/g)) components.add(m[1]);
  }
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
