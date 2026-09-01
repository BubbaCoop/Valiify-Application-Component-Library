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
  process.exit(failed ? 1 : 0);
}

try {
  main();
} catch (err) {
  console.error("\n  error ", err.message, "\n");
  process.exit(1);
}
