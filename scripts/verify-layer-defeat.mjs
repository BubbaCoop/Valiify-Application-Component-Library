#!/usr/bin/env node
/**
 * Layer-defeat repro and gate — computed styles inside a host, not class names.
 *
 *   npm run verify:layer-defeat
 *   node scripts/verify-layer-defeat.mjs --file dist/shortapp-ui.css
 *
 * THE BUG (1.0.0). dist/shortapp-ui.css puts every component rule inside
 * `@layer components`. Unlayered CSS beats layered CSS before specificity or
 * source order is consulted, so a bare `button { }` from the host's Tailwind v3
 * preflight, from daisyUI, or from any Svelte component's scoped <style> (which
 * compiles unlayered) silently overrides our component rule. The `va-` rename
 * could never have fixed this — it is not a name collision, and every other gate
 * in this repo checks class NAMES against a manifest. None of them measures a
 * computed style inside a host. This one does.
 *
 * TWO PARTS.
 *
 *   1  Mechanism — tests/fixtures/layer-defeat.html. One host rule, one library
 *      rule written twice; the only difference is the `@layer components` wrapper.
 *      Both branches are asserted (bare → box on, layered → box off) so the test
 *      proves the mechanism exists rather than assuming it. Always green; it is
 *      the demonstration and the documentation.
 *
 *   2  Artifact — the REAL dist/shortapp-ui.css, loaded after an unlayered host
 *      `button { border: 0 }`, with a `.va-dropdown-field-trigger` on the page.
 *      Source order and specificity both favour the bundle; only a layer can make
 *      it lose. This is RED on 1.0.0 and is the assertion that guards the fix —
 *      revert the fix and it fails again.
 *
 * The host rule sits BEFORE the bundle and at lower specificity on purpose. In the
 * dev's real environment it sits after; either way it wins, but putting it first
 * here removes source order as an explanation, so a failure can only be the layer.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const RED = "\x1b[31m", GRN = "\x1b[32m", DIM = "\x1b[2m", BOLD = "\x1b[1m", OFF = "\x1b[0m";

const argv = process.argv.slice(2);
const fileFlag = argv.indexOf("--file");
const BUNDLE = fileFlag !== -1 && argv[fileFlag + 1]
  ? resolve(argv[fileFlag + 1])
  : join(ROOT, "dist/shortapp-ui.css");
const FIXTURE = join(ROOT, "tests/fixtures/layer-defeat.html");

const shown = (p) => (p.startsWith(ROOT) ? p.slice(ROOT.length + 1) : p);

if (!existsSync(BUNDLE)) {
  console.error(`\n  ${RED}${shown(BUNDLE)} is missing.${OFF}  Build it first:  npm run build\n`);
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage();

const style = (sel, prop) =>
  page.evaluate(([s, p]) => {
    const el = document.querySelector(s);
    return el ? getComputedStyle(el).getPropertyValue(p) : null;
  }, [sel, prop]);

const results = [];
const check = async (part, label, sel, prop, expect, why) => {
  const got = await style(sel, prop);
  const ok = got === expect;
  results.push({ part, label, prop, got, expect, ok, why });
};

// ── 1  mechanism ─────────────────────────────────────────────────────────────
await page.goto(pathToFileURL(FIXTURE).href);
await check("mechanism", "bare rule survives the host reset (box on)",
  "#bare", "border-top-width", "1px",
  "class > element and later > earlier: with no layer in play the library rule must win.");
await check("mechanism", "layered rule loses to the host reset (box off)",
  "#layered", "border-top-width", "0px",
  "identical rule, identical page — only the @layer wrapper differs. If this reads 1px the browser is not applying cascade layers and the repro is meaningless.");

// ── 2  artifact ──────────────────────────────────────────────────────────────
// The unlayered host reset sits BEFORE the bundle. Nothing but a layer can make
// the bundle's 0,1,0 class lose to a 0,0,1 element rule that precedes it.
const bundle = readFileSync(BUNDLE, "utf8");
await page.setContent(`<!doctype html>
<html><head>
  <style>button { border: 0; }</style>
  <style>${bundle}</style>
</head><body>
  <button id="trigger" class="va-dropdown-field-trigger" type="button" aria-haspopup="listbox" aria-expanded="false">
    <span class="va-dropdown-field-value">Checking</span>
  </button>
</body></html>`);
await check("artifact", ".va-dropdown-field-trigger keeps its 1px border under an unlayered host `button { border: 0 }`",
  "#trigger", "border-top-width", "1px",
  `${shown(BUNDLE)} wraps the rule in @layer components, so the host's element reset wins although it is earlier in source and lower in specificity. This is the 1.0.0 bug.`);

await browser.close();

console.log(`\n${BOLD}Layer defeat${OFF}  ${DIM}${shown(FIXTURE)} · ${shown(BUNDLE)}${OFF}\n`);
let part = "";
for (const r of results) {
  if (r.part !== part) { part = r.part; console.log(`  ${DIM}${part}${OFF}`); }
  console.log(`  ${r.ok ? GRN + "PASS" : RED + "FAIL"}${OFF}  ${r.label}  ${DIM}${r.prop}=${r.got} (want ${r.expect})${OFF}`);
  if (!r.ok) for (const l of r.why.split("\n")) console.log(`${DIM}        ${l}${OFF}`);
}
const failed = results.filter((r) => !r.ok);
console.log(`\n  ${failed.length ? RED : GRN}${results.length - failed.length}/${results.length} passed${OFF}\n`);
process.exit(failed.length ? 1 : 0);
