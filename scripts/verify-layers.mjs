#!/usr/bin/env node
/**
 * Cascade-layer contract — build-output guard.
 *
 *   npm run verify:layers
 *
 * Asserts that dist/index.css emits
 *
 *     @layer theme, base, components, utilities;
 *
 * That one line is what lets a consumer's utilities override our component
 * classes. `@layer components` holds 233 selectors at specificity 0,2,0 or
 * higher — the worst being
 * `.link:not(.link-quiet):not(.link-monospace):not(.link-critical):hover` at
 * 0,11,1 — and layer order is the only reason they are harmless. Measured in a
 * real consumer bundle, the consumer's `.mt-8` lands ~25kB EARLIER in the file
 * than our `.checkbox`: source order favours us, and only the layer statement
 * flips the result. Drop the line and every consumer override silently stops
 * working, with no error anywhere.
 *
 * THIS CANNOT BE CHECKED FROM SOURCE. `grep '@layer theme' src/` finds nothing
 * — Tailwind emits the statement during compilation, so build output is the
 * only place it is observable. That is why this is a separate gate rather than
 * a rule inside verify-component.
 *
 * `npm run verify:visual` would not catch a regression either: it renders
 * inside Storybook, where the same layer order happens to hold.
 *
 * Run it after `npm run build`, since it reads dist.
 *
 * Point it at a different file with --file, which the negative test uses:
 *   node scripts/verify-layers.mjs --file /tmp/stripped.css
 *
 * THE INVERSE CONTRACT — dist/shortapp-ui.css (the prebuilt `./styles.css` entry).
 *
 * That bundle is shipped INTO a foreign app that never compiles our classes, and
 * there the layer is the bug, not the contract. Unlayered CSS beats layered CSS
 * before specificity or source order is consulted, so a component rule inside
 * `@layer components` loses to the host's Tailwind 3 preflight (`* { border-width:
 * 0 }`, `button { background-color: transparent }`), to daisyUI, to a Svelte
 * `:global()` reset — and to the library's OWN reset.css. 1.0.0 shipped that way;
 * scripts/verify-layer-defeat.mjs is the repro. So for shortapp-ui.css this gate
 * asserts the opposite of what it asserts for index.css: ZERO `@layer components`
 * blocks and ZERO `@layer base` blocks. The `html` ink/ground default that used to
 * ship as `@layer base` moved to src/reset.css in 1.0.1: a Tailwind 3 host's PostCSS
 * refuses any file carrying `@layer base {` without a matching `@tailwind base`,
 * so keeping it would have rejected a working configuration to ship a rule the
 * methodology overrides anyway. Only `@layer properties` (Tailwind's @property
 * polyfill wrapper) may remain.
 *
 * The two files are checked with the SAME detector, and index.css — which keeps its
 * layers for Tailwind v4 hosts — must read as layered every run. That is the canary:
 * a detector that reads both files as unlayered has stopped seeing layers.
 */

import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const BOLD = "\x1b[1m",
  DIM = "\x1b[2m";
const RED = "\x1b[31m",
  GRN = "\x1b[32m",
  OFF = "\x1b[0m";

/** The order the library is built around. */
const EXPECTED = ["theme", "base", "components", "utilities"];

const argv = process.argv.slice(2);
const fileFlag = argv.indexOf("--file");
const TARGET =
  fileFlag !== -1 && argv[fileFlag + 1]
    ? resolve(argv[fileFlag + 1])
    : join(ROOT, "dist/index.css");

const pass = (msg, note = "") =>
  console.log(
    `  ${GRN}PASS${OFF}  ${msg}${note ? `  ${DIM}${note}${OFF}` : ""}`,
  );

const fail = (msg, why) => {
  console.log(`  ${RED}FAIL${OFF}  ${msg}`);
  for (const l of why.split("\n")) console.log(`${DIM}        ${l}${OFF}`);
  return true;
};

function main() {
  const shown = TARGET.startsWith(ROOT)
    ? TARGET.slice(ROOT.length + 1)
    : TARGET;
  console.log(`\n${BOLD}Cascade layers${OFF}  ${DIM}${shown}${OFF}\n`);

  if (!existsSync(TARGET)) {
    console.error(
      `\n  ${RED}${shown} is missing.${OFF}\n\n  Build it first:  npm run build\n`,
    );
    process.exit(1);
  }

  const css = readFileSync(TARGET, "utf8");
  let failed = false;

  // A layer STATEMENT (`@layer a, b;`), not a block (`@layer a { … }`). Only
  // the statement establishes order; a block just assigns rules to a layer.
  const stmt = css.match(/@layer\s+([a-z0-9_-]+(?:\s*,\s*[a-z0-9_-]+)+)\s*;/i);

  if (!stmt) {
    fail(
      "layer statement present",
      "No `@layer a, b, …;` statement found.\n" +
        "Without it, component rules compete with consumer utilities on\n" +
        "specificity and source order — and our CSS loads later, so the\n" +
        "consumer loses. Every `mt-8` or `md:hidden` a consumer adds to one\n" +
        "of our components would silently do nothing.",
    );
    console.log(
      `\n  ${RED}Layer contract broken.${OFF} Consumer utilities will not override component classes.\n`,
    );
    process.exit(1);
  }

  const order = stmt[1].split(",").map((s) => s.trim());
  const line = css.slice(0, stmt.index).split("\n").length;
  pass("layer statement present", `${shown}:${line}`);

  // Assertion: the list still matches what the library was built around.
  // A change here is not automatically wrong — it is a prompt to re-check the
  // one thing that actually matters, which the next assertion covers.
  if (order.join(", ") === EXPECTED.join(", ")) {
    pass(`layer list unchanged`, EXPECTED.join(", "));
  } else {
    failed = fail(
      "layer list unchanged",
      "The layer list changed; confirm the new order still puts components\n" +
        "before utilities, then update EXPECTED in this file to match.\n" +
        `  was:  ${EXPECTED.join(", ")}\n` +
        `  now:  ${order.join(", ")}\n` +
        "Do not update EXPECTED without checking the order — that is the\n" +
        "whole point of the next assertion.",
    );
  }

  // The real contract. Kept separate so it stays meaningful when the list above
  // is legitimately revised — e.g. the day someone adds a fifth layer.
  const c = order.indexOf("components");
  const u = order.indexOf("utilities");
  let contractHolds = false;

  if (c !== -1 && u !== -1 && c < u) {
    contractHolds = true;
    pass("components precedes utilities", "consumer overrides win");
  } else {
    const detail =
      c === -1
        ? "There is no `components` layer in the statement."
        : u === -1
          ? "There is no `utilities` layer in the statement."
          : `utilities (${u}) comes before components (${c}).`;
    failed = fail(
      "components precedes utilities",
      `${detail}\n` +
        "This is the consumer-override contract. With utilities ordered before\n" +
        "components — or either layer missing — a consumer adding `mt-8` or\n" +
        "`md:hidden` to one of our components gets nothing.",
    );
  }

  // Distinguish "the contract is broken" from "the list moved but the contract
  // still holds" — conflating them would train someone to bump EXPECTED without
  // reading, which is the failure this gate exists to prevent.
  if (!failed) {
    console.log(
      `\n  ${DIM}Consumer utilities override component classes as designed.${OFF}\n`,
    );
  } else if (contractHolds) {
    console.log(
      `\n  ${BOLD}Layer list moved, but the contract still holds${OFF} — components` +
        ` is still before utilities.\n  ${DIM}Confirm the new order is intended, then update EXPECTED in` +
        ` scripts/verify-layers.mjs.${OFF}\n`,
    );
  } else {
    console.log(
      `\n  ${RED}Layer contract broken.${OFF} Consumer utilities will not override component classes.\n`,
    );
  }
  if (failed) process.exit(1);

  // Only when running against the default target — a --file run is a single-file check.
  if (fileFlag === -1) prebuilt();
  process.exit(0);
}

/** How many `@layer <name> {` BLOCKS (not statements) a stylesheet carries. */
function layerBlocks(css, name) {
  return (css.match(new RegExp(`@layer\\s+${name}\\s*\\{`, "g")) || []).length;
}

function prebuilt() {
  const file = join(ROOT, "dist/shortapp-ui.css");
  console.log(`\n${BOLD}Prebuilt bundle — inverse contract${OFF}  ${DIM}dist/shortapp-ui.css${OFF}\n`);
  if (!existsSync(file)) {
    console.error(`\n  ${RED}dist/shortapp-ui.css is missing.${OFF}  Build it first:  npm run build\n`);
    process.exit(1);
  }
  const css = readFileSync(file, "utf8");
  const indexCss = readFileSync(TARGET, "utf8");
  let failed = false;

  // Canary: the detector must see index.css's layered components, or it sees nothing.
  const canary = layerBlocks(indexCss, "components");
  if (canary === 0 || layerBlocks("@layer components {\n.x{}\n}", "components") !== 1) {
    console.log(`  ${RED}FAIL${OFF}  canary self-test: the block detector reads dist/index.css as having ${canary} \`@layer components\` block(s); it keeps its layers by design, so the detector is blind.`);
    process.exit(1);
  }
  pass("canary self-test", `dist/index.css carries ${canary} layered component block(s), as designed`);

  const comps = layerBlocks(css, "components");
  if (comps === 0) pass("no @layer components blocks", "component rules are unlayered — a host element reset cannot beat them on layer alone");
  else
    failed = fail(
      "no @layer components blocks",
      `${comps} \`@layer components {\` block(s) found.\n` +
        "Inside a layer, every component rule loses to any UNLAYERED host rule —\n" +
        "Tailwind 3 preflight, daisyUI, a Svelte :global() reset, our own reset.css —\n" +
        "regardless of specificity or source order. This is the 1.0.0 bug\n" +
        "(scripts/verify-layer-defeat.mjs). build-styles.mjs unwraps pass A; check it.",
    );

  const base = layerBlocks(css, "base");
  if (base === 0) pass("no @layer base blocks", "the html default lives in reset.css — a Tailwind 3 PostCSS host can take this file as its own entry");
  else
    failed = fail(
      "no @layer base blocks",
      `${base} \`@layer base {\` block(s) found.\n` +
        "A Tailwind 3 host's PostCSS refuses a file carrying `@layer base {` without a\n" +
        "matching `@tailwind base` (measured in examples/daisyui-starter). The html\n" +
        "ink/ground default belongs in src/reset.css; src/build/components.css must not\n" +
        "import ../base or ../library.css.",
    );

  const stray = (css.match(/@layer\s+(?!properties\b)([a-z-]+)\s*\{/g) || []).map((m) => m.replace(/@layer\s+|\s*\{/g, ""));
  if (!stray.length) pass("no other layer blocks", "only @layer properties (Tailwind's @property polyfill) remains");
  else failed = fail("no other layer blocks", `unexpected layer block(s): ${[...new Set(stray)].join(", ")}`);

  const utilLayered = layerBlocks(css, "utilities");
  if (utilLayered === 0) pass("no @layer utilities blocks", "the va: layer stays unlayered (pass B contract)");
  else failed = fail("no @layer utilities blocks", `${utilLayered} block(s) — pass B utilities must not be layered.`);

  if (failed) {
    console.log(`\n  ${RED}Inverse contract broken.${OFF} The prebuilt bundle would lose to unlayered host rules.\n`);
    process.exit(1);
  }
  console.log(`\n  ${DIM}Prebuilt bundle is unlayered: a host element reset cannot beat it on layer alone.${OFF}\n`);
}

try {
  main();
} catch (err) {
  console.error("\n  error ", err.message, "\n");
  process.exit(1);
}
