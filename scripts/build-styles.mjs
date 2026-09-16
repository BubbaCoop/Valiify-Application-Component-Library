#!/usr/bin/env node
/**
 * Build dist/shortapp-ui.css — the self-contained, prefixed, preflight-free bundle.
 *
 * A consuming app should never have to compile our classes, and its Tailwind
 * version should be irrelevant. shortapp-web runs Tailwind v3 + daisyUI 4.
 *
 * TWO passes, concatenated:
 *
 *   A  src/build/components.css   tokens + base + component classes, unprefixed
 *   B  src/build/utilities.css    the `va:` utility layer + `--va-*` tokens
 *
 * Tailwind's prefix is global to a compile and renames theme variables too
 * (--color-primary -> --va-color-primary), so one prefixed pass would break the
 * public token API and force `va:` onto all 340 @apply payloads in src/components.
 * Two passes keep components and tokens exactly as authored while still giving the
 * utility layer a namespace the host cannot collide with.
 *
 * The joined file therefore defines each token twice, under both spellings: the
 * components use --color-*, the prefixed utilities use --va-color-*. That is ~4kB
 * and it is what lets pass B's utilities reference pass A's values — which is also
 * why `@utility focus-ring` needs no prefixed twin.
 *
 * PASS A IS UNWRAPPED — no `@layer components` survives into the bundle.
 *
 * Tailwind emits our component rules inside `@layer components`. In dist/index.css
 * and ./source that is the contract: a Tailwind v4 host is layered too, and layer
 * order is what lets its utilities beat our 0,2,0+ selectors. Shipped INTO a foreign
 * app it is the bug. Unlayered CSS beats layered CSS before specificity or source
 * order is consulted, so inside the layer every component rule lost to the host's
 * Tailwind 3 preflight (`* { border-width: 0 }`, `button { background-color:
 * transparent }`), to daisyUI, to a Svelte `:global()` reset — and to our own
 * reset.css, whose `button { color: inherit }` beat `.va-btn-primary`'s white ink.
 * 1.0.0 shipped that way. It was invisible on the common path because a host that
 * `@import`s the bundle into its `@tailwind` file has Tailwind 3 consume the layer
 * blocks and re-emit the rules unlayered; it broke on a raw <link>, the path we told
 * the consumer to use. scripts/verify-layer-defeat.mjs is the repro; verify-layers
 * asserts the inverse contract on this file; the unwrap is done here, at build time,
 * so src/components stays layered for the entries that want it.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "dist/shortapp-ui.css");

async function compile(entry) {
  const from = join(ROOT, entry);
  const res = await postcss([tailwindcss()]).process(readFileSync(from, "utf8"), { from });
  return res.css;
}

const layeredA = await compile("src/build/components.css");
const b = await compile("src/build/utilities.css");

// --- unwrap pass A ------------------------------------------------------------------
// Replace every `@layer components { … }` block with its children, in place. The
// `@layer theme, base, components, utilities;` ORDER statement is left alone — it is a
// no-op without blocks and pass B re-emits it anyway. `@layer properties` (Tailwind's
// @property polyfill wrapper) is not a component rule and is left alone too.
function unwrap(cssText) {
  const root = postcss.parse(cssText);
  const seen = { components: 0, base: 0, other: [] };
  root.walkAtRules("layer", (at) => {
    if (!at.nodes) return; // a statement, not a block
    if (at.params === "components") { seen.components++; at.replaceWith(at.nodes); }
    else if (at.params === "base") seen.base++;
    else if (at.params !== "properties") seen.other.push(at.params);
  });
  return { css: root.toString(), seen };
}
const { css: a, seen } = unwrap(layeredA);
if (seen.base) {
  console.error(`\n  pass A carries ${seen.base} @layer base block(s). src/build/components.css must not import ../base — the html default lives in src/reset.css now.`);
  process.exit(1);
}
if (seen.other.length) {
  console.error(`\n  pass A carries unexpected layer block(s): ${seen.other.join(", ")}. Decide whether they belong in a foreign host and extend unwrap().`);
  process.exit(1);
}
if (!seen.components) {
  console.warn("\n  note: pass A had no @layer components blocks to unwrap — Tailwind's output shape changed; verify:layers still asserts the contract.");
}

// --- concatenation sanity, asserted rather than assumed -------------------------
// Two Tailwind outputs joined into one file: both open with a `@layer` order
// statement and both may emit an `@layer properties` block for the @property
// polyfill. A duplicate layer statement is a no-op and identical @property
// declarations are idempotent, but a CONFLICTING one would silently change
// behaviour, so check rather than trust.
const props = (css) => {
  const out = new Map();
  for (const m of css.matchAll(/@property\s+(--[\w-]+)\s*\{([^}]*)\}/g)) out.set(m[1], m[2].trim());
  return out;
};
const pa = props(a), pb = props(b);
const conflicts = [...pa.keys()].filter((k) => pb.has(k) && pb.get(k) !== pa.get(k));
if (conflicts.length) {
  console.error(`\n  @property declarations conflict between the two passes: ${conflicts.join(", ")}`);
  console.error("  Concatenation would change their behaviour. Emit pass B as a separate file and @import both.");
  process.exit(1);
}

const banner = `/*! @valiify/shortapp-ui — prebuilt bundle.
 * Component classes (.va-*) + design tokens + the va: utility layer.
 * No preflight: the host app owns its reset.
 * GENERATED by scripts/build-styles.mjs — do not edit.
 */\n`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, banner + a + "\n" + b);

const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(1);
console.log(`\n  wrote  dist/shortapp-ui.css  (${kb(banner + a + b)} kB)`);
console.log(`  pass A components ${kb(a)} kB (unwrapped ${seen.components} @layer components block(s)) · pass B utilities ${kb(b)} kB`);
console.log(`  @property: ${pa.size} in A, ${pb.size} in B, ${[...pa.keys()].filter((k) => pb.has(k)).length} shared and identical`);
