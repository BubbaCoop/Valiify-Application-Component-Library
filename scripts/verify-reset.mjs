#!/usr/bin/env node
/**
 * reset.css audit — no rule in src/reset.css may override a property the bundle
 * declares on the same element.
 *
 *   npm run verify:reset
 *   node scripts/verify-reset.mjs --file <bundle.css>     # e.g. a 1.0.0 copy
 *
 * reset.css was added in 1.0.0 as the answer to "what if a consumer loads only
 * styles.css". It is five unlayered element rules — and in 1.0.0 the bundle's component
 * rules sat inside `@layer components`, where an unlayered `button { color: inherit }`
 * beats `.va-btn-primary { color: white }` before specificity is consulted. The fix for
 * one problem was a live instance of the problem, and nothing measured it. This does.
 *
 * Method — computed styles, not source reading. The corpus is every ```html block in
 * CLAUDE.md (the documented markup IS the contract) plus the generated-page fixture.
 * The page is rendered twice: bundle only, and reset.css + bundle. For every element
 * carrying a va- class, for every property reset.css declares for a selector that
 * matches it, IF the bundle declares that property on the element (read from the
 * bundle's own CSSOM rules that match), the computed value must be identical in both
 * renders. A difference means the reset won over a declaration the bundle owns.
 * Properties the bundle does NOT declare are the reset's legitimate job and are not
 * compared.
 *
 * Canary: a third render appends a synthetic reset rule that outranks the bundle on
 * purpose (`button.va-btn.va-btn-primary { color: red }`, 0,2,1). It must produce a
 * finding, or the differ is blind and the gate fails itself.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import { chromium } from "playwright";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const RED = "\x1b[31m", GRN = "\x1b[32m", DIM = "\x1b[2m", BOLD = "\x1b[1m", OFF = "\x1b[0m";
const argv = process.argv.slice(2);
const fileFlag = argv.indexOf("--file");
const BUNDLE = fileFlag !== -1 && argv[fileFlag + 1] ? resolve(argv[fileFlag + 1]) : join(ROOT, "dist/shortapp-ui.css");
const shown = (p) => (p.startsWith(ROOT) ? p.slice(ROOT.length + 1) : p);
if (!existsSync(BUNDLE)) { console.error(`\n  ${RED}${shown(BUNDLE)} is missing.${OFF}  Build it first:  npm run build\n`); process.exit(1); }

const bundle = readFileSync(BUNDLE, "utf8");
const reset = readFileSync(join(ROOT, "src/reset.css"), "utf8");

// The reset's own contract: selector → declared longhand-ish property names.
const resetRules = [];
postcss.parse(reset).walkRules((r) => {
  const props = [];
  r.walkDecls((d) => props.push(d.prop));
  resetRules.push({ selector: r.selector, props });
});

// Corpus: CLAUDE.md's ```html blocks + the generated-page fixture body.
const claude = readFileSync(join(ROOT, "CLAUDE.md"), "utf8");
const blocks = [...claude.matchAll(/```html\n([\s\S]*?)```/g)].map((m) => m[1]);
const fixture = readFileSync(join(ROOT, "tests/fixtures/generated-page.html"), "utf8").replace(/<link[^>]*>/g, "").replace(/<!--[\s\S]*?-->/g, "");
const markup = blocks.join("\n") + "\n" + fixture;

const browser = await chromium.launch();
const page = await browser.newPage();

/** Render markup under the given stylesheets; return per-element computed values for
 *  the reset's properties, plus which of them the BUNDLE declares on that element. */
async function render(styles, { collectDeclared }) {
  await page.setContent(`<!doctype html><html><head>${styles.map((s) => `<style>${s}</style>`).join("")}</head><body>${markup}</body></html>`);
  await page.waitForTimeout(50);
  return page.evaluate(({ resetRules, bundleSheetIndex, collectDeclared }) => {
    const els = [...document.querySelectorAll('[class*="va-"]')];
    // Every property the reset could set on this element.
    const resetProps = (el) => {
      const out = new Set();
      for (const { selector, props } of resetRules) { try { if (el.matches(selector)) props.forEach((p) => out.add(p)); } catch {} }
      return out;
    };
    // Every property the bundle declares on this element, via its matching CSSOM rules.
    const declared = (el) => {
      const out = new Set();
      const walk = (rules) => {
        for (const r of rules) {
          if (r.cssRules && r.type !== 1) { walk(r.cssRules); continue; }
          if (!r.selectorText) continue;
          let hit = false; try { hit = el.matches(r.selectorText); } catch {}
          if (hit) for (const p of r.style) out.add(p);
        }
      };
      walk(document.styleSheets[bundleSheetIndex].cssRules);
      return out;
    };
    // Compare on the longhands the browser enumerates for both sides.
    const longhandsOf = (prop) => {
      const probe = document.createElement("i"); probe.style.setProperty(prop, prop === "color" ? "red" : "initial");
      return [...probe.style].length ? [...probe.style] : [prop];
    };
    return els.map((el, i) => {
      const cs = getComputedStyle(el);
      const props = [...resetProps(el)].flatMap(longhandsOf);
      const values = {}; for (const p of props) values[p] = cs.getPropertyValue(p);
      const d = collectDeclared ? declared(el) : null;
      return { i, tag: el.tagName.toLowerCase(), classes: el.className, values, declared: d ? [...d].filter((p) => props.includes(p)) : null };
    });
  }, { resetRules, bundleSheetIndex: styles.length - 1, collectDeclared });
}

const CANARY = `\nbutton.va-btn.va-btn-primary { color: red; }\n`;
const bundleOnly = await render([bundle], { collectDeclared: true });
const withReset = await render([reset, bundle], { collectDeclared: false });
const withCanary = await render([reset + CANARY, bundle], { collectDeclared: false });
await browser.close();

function diff(base, other) {
  const out = [];
  base.forEach((b, i) => {
    const o = other[i];
    for (const p of b.declared) if (b.values[p] !== o.values[p]) out.push({ tag: b.tag, classes: b.classes, prop: p, bundle: b.values[p], reset: o.values[p] });
  });
  return out;
}
const findings = diff(bundleOnly, withReset);
const canary = diff(bundleOnly, withCanary);

console.log(`\n${BOLD}reset.css audit${OFF}  ${DIM}${shown(BUNDLE)} · ${bundleOnly.length} element(s) from CLAUDE.md examples + fixture · ${resetRules.length} reset rule(s)${OFF}\n`);
let failed = false;
if (!canary.some((f) => f.classes.includes("va-btn-primary") && f.prop === "color")) {
  failed = true;
  console.log(`  ${RED}FAIL${OFF}  canary self-test: a synthetic 0,2,1 reset rule on .va-btn-primary produced no colour difference — the differ is blind.`);
} else console.log(`  ${GRN}PASS${OFF}  canary self-test  ${DIM}synthetic outranking reset rule detected on .va-btn-primary color${OFF}`);

// One line per (element class set, property) — the same component appears many times.
const seen = new Map();
for (const f of findings) { const k = `${f.classes}|${f.prop}`; if (!seen.has(k)) seen.set(k, { ...f, n: 0 }); seen.get(k).n++; }
if (seen.size) {
  failed = true;
  console.log(`\n  ${RED}${seen.size} property/element pair(s) where reset.css overrides a declaration the bundle owns:${OFF}`);
  for (const f of seen.values())
    console.log(`  ${RED}DEFEAT${OFF}  <${f.tag} class="${f.classes}">  ${f.prop}  ${DIM}bundle ${f.bundle} → with reset ${f.reset}${f.n > 1 ? ` (×${f.n})` : ""}${OFF}`);
} else console.log(`  ${GRN}PASS${OFF}  reset.css overrides nothing the bundle declares on any documented element`);

console.log(failed ? `\n  ${RED}FAIL${OFF}\n` : `\n  ${GRN}PASS${OFF}\n`);
process.exit(failed ? 1 : 0);
