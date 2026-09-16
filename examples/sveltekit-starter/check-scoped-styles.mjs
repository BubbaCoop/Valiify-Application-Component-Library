#!/usr/bin/env node
/**
 * Scoped-style assertion: shortapp-ui inside SvelteKit + Svelte 5.
 *
 *   npm run check
 *
 * A Svelte component's <style> compiles to UNLAYERED CSS that Vite injects after
 * the app's stylesheet. That is a second source of the cascade-layer defeat the
 * daisyui-starter measures — one a plain Vite page never reproduces, and one the
 * dev's environment has. Three cases, each a real component in src/lib, each
 * measured against the compiled output rather than the source:
 *
 *   1  :global(button) { border: 0 }   → bare `button`, 0,0,1.   Bundle MUST win.
 *   2  button { border: 0 }            → `button.svelte-h`, 0,1,1. Bundle CANNOT win.
 *                                        Asserted as a loss on purpose — see below.
 *   3  button:not([class*="va-"])      → never matches ours.      Bundle MUST win,
 *                                        and the dev's plain button MUST still reset.
 *
 * Case 2 is asserted in the direction that is TRUE: our border is lost. Unlayering
 * the bundle fixes preflight, daisyUI and case 1; it does not and cannot fix a host
 * rule at higher specificity. Pinning that to a measurement keeps the HANDOFF's
 * second clause honest — if this assertion ever flips, the contract text is stale.
 *
 * The scoping shape itself is read from the served CSS, not assumed.
 */
import { chromium } from "playwright";
import { createServer } from "vite";

const RED = "\x1b[31m", GRN = "\x1b[32m", DIM = "\x1b[2m", BOLD = "\x1b[1m", OFF = "\x1b[0m";
const server = await createServer({ server: { port: 5198 }, logLevel: "silent" });
await server.listen();
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:5198/", { waitUntil: "networkidle" });

const style = (sel, prop) =>
  page.evaluate(([s, p]) => {
    const el = document.querySelector(s);
    return el ? getComputedStyle(el).getPropertyValue(p) : null;
  }, [sel, prop]);
const token = (name) =>
  page.evaluate((n) => {
    const probe = document.createElement("span");
    probe.style.color = `var(${n})`;
    document.body.append(probe);
    const v = getComputedStyle(probe).color;
    probe.remove();
    return v;
  }, name);

// Evidence, not assumption: how did Svelte actually scope the element selector?
const scoped = await page.evaluate(() => {
  const out = [];
  for (const sheet of document.styleSheets) {
    let rules; try { rules = sheet.cssRules; } catch { continue; }
    for (const r of rules) if (r.selectorText && /^button\.svelte-|^button:not|^button$/.test(r.selectorText)) out.push(r.selectorText);
  }
  return out;
});

const results = [];
const check = async (label, sel, prop, want, why) => {
  const got = await style(sel, prop);
  results.push({ label, prop, got, want, ok: got === want, why });
};

await check("case 1 · :global(button) reset — our border survives",
  "#global-reset-trigger", "border-top-width", "1px",
  "a bare unlayered `button { border: 0 }` beat our class. The bundle's rule is inside a cascade layer; unlayered, 0,1,0 beats 0,0,1.");
await check("case 2 · scoped button { } — our border is LOST (documented limit)",
  "#scoped-trigger", "border-top-width", "0px",
  "our border SURVIVED a 0,1,1 scoped element rule. That is not possible under CSS specificity — either Svelte changed its scoping (check the selectors printed below) or the bundle grew specificity. Update the HANDOFF contract's second clause; do not just flip this assertion.");
await check("case 3 · button:not([class*=\"va-\"]) — our border survives",
  "#remedy-trigger", "border-top-width", "1px",
  "the excluded selector matched our control, or the bundle's rule lost anyway (layered).");
// Measured on padding, which only the remedy rule sets (case 1's :global reset touches
// border on every button on the page, so border alone could not tell the two apart).
await check("case 3 · the component's own plain button is still reset (padding, UA default 6px)",
  "#remedy-plain", "padding-left", "0px",
  "the remedy stopped resetting the dev's own controls — it must not be a no-op.");
await check("case 3 · our trigger keeps its 12px padding under the same rule",
  "#remedy-trigger", "padding-left", "12px",
  "the excluded selector matched our control.");
const contrast = await token("--color-content-contrast");
await check("reset.css · .va-btn-primary ink survives the library's OWN `button { color: inherit }`",
  "#remedy-primary", "color", contrast,
  "reset.css is an unlayered element rule too. Inside a layer, .va-btn-primary's white ink loses to the library's own reset and the label inherits the page ink onto the crimson fill.");

await browser.close();
await server.close();

console.log(`\n${BOLD}shortapp-ui inside SvelteKit + Svelte 5${OFF}\n`);
console.log(`  ${DIM}compiled element selectors served to the page:${OFF}`);
for (const s of scoped) console.log(`  ${DIM}  ${s}${OFF}`);
console.log();
for (const r of results) {
  console.log(`  ${r.ok ? GRN + "PASS" : RED + "FAIL"}${OFF}  ${r.label}  ${DIM}${r.prop}=${r.got} (want ${r.want})${OFF}`);
  if (!r.ok && r.why) for (const l of r.why.split("\n")) console.log(`${DIM}        ${l}${OFF}`);
}
const failed = results.filter((r) => !r.ok);
console.log(`\n  ${failed.length ? RED : GRN}${results.length - failed.length}/${results.length} passed${OFF}\n`);
process.exit(failed.length ? 1 : 0);
