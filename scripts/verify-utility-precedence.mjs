#!/usr/bin/env node
/**
 * Utility-precedence gate — a `va:` utility in generated markup must still beat every
 * component rule that can reach the same element.
 *
 *   npm run verify:utility-precedence
 *
 * WHY THIS EXISTS. dist/shortapp-ui.css ships its component classes UNLAYERED (the
 * cascade-layer defeat, fixed after 1.0.0) and its `va:` utilities unlayered too. With
 * nothing layered, a utility and a component rule that set the same property are
 * settled by specificity, then source order. Pass B (utilities) follows pass A
 * (components), so a utility beats every SINGLE-CLASS component rule (0,1,0 vs 0,1,0,
 * later wins). It LOSES to any compound component selector — `.va-a .va-b`,
 * `.va-x:hover`, `.va-y:has(:checked)` — that outranks it. That loss is silent: nothing
 * errors, the element just does not move. The same failure class as a class outside
 * the closed utility set, and this is its gate.
 *
 * WHAT IT DOES. Reads the bundle (postcss), splits it into utility rules (`.va\:…`) and
 * component rules (`.va-…`), and for every element in the generated markup that
 * carries both a utility and a component class, looks for a component rule that
 *   (a) could match the element — every class in the selector's subject compound is on
 *       the element, no `:not(.x)` in the subject names a class the element has, and
 *       every class in each ANCESTOR compound appears somewhere in the same source
 *       (we have no DOM for .svelte files, so ancestors are assumed reachable —
 *       conservative: a false positive is visible, a false negative would be silent);
 *   (b) sets a longhand the utility also sets;
 *   (c) outranks the utility on specificity.
 * Each hit is a finding. Findings whose selector is UNCONDITIONAL (classes only) FAIL
 * the gate: the utility never applies. Findings gated by a pseudo-class or attribute
 * (`:hover`, `[aria-selected="true"]`, `:has(:checked)`) are STATE-CONDITIONAL — the
 * component owns that state on purpose — and are printed, never silent, never fatal.
 *
 * Inputs are verify-markup's: tests/fixtures/generated-page.html (committed) and the
 * newest val/runs/<run>/05-package/ when one exists locally. A built-in canary — a
 * synthetic element under `.va-action-pending .va-action-title` — must produce a
 * finding every run, or the gate fails itself rather than passing vacuously.
 *
 * Source order is asserted too: if a component rule ever lands AFTER the first utility
 * rule in the bundle, equal-specificity ties flip and the gate says so.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const RED = "\x1b[31m", GRN = "\x1b[32m", YEL = "\x1b[33m", DIM = "\x1b[2m", BOLD = "\x1b[1m", OFF = "\x1b[0m";

const bundlePath = join(ROOT, "dist/shortapp-ui.css");
if (!existsSync(bundlePath)) {
  console.error(`${RED}  dist/shortapp-ui.css not found — run \`npm run build\` first.${OFF}`);
  process.exit(1);
}
const css = readFileSync(bundlePath, "utf8");
const root = postcss.parse(css);

// ── selector tooling ───────────────────────────────────────────────────────────
const unescape = (s) => s.replace(/\\(.)/g, "$1");

/** Split a selector on top-level combinators; returns compounds in order (subject last). */
function compounds(sel) {
  const out = []; let cur = ""; let depth = 0; let inAttr = false;
  for (let i = 0; i < sel.length; i++) {
    const ch = sel[i];
    if (ch === "\\") { cur += ch + sel[++i]; continue; }
    if (ch === "[") inAttr = true; else if (ch === "]") inAttr = false;
    if (ch === "(") depth++; else if (ch === ")") depth--;
    if (!inAttr && depth === 0 && /[\s>+~]/.test(ch)) { if (cur.trim()) out.push(cur.trim()); cur = ""; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** Top-level comma split (for :is()/:not() args). */
function splitTop(s) {
  const out = []; let cur = ""; let depth = 0; let inAttr = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "\\") { cur += ch + s[++i]; continue; }
    if (ch === "[") inAttr = true; else if (ch === "]") inAttr = false;
    if (ch === "(") depth++; else if (ch === ")") depth--;
    if (ch === "," && depth === 0 && !inAttr) { out.push(cur); cur = ""; continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
}

/** Specificity [a,b,c] per the Selectors 4 rules this bundle exercises. */
function specificity(sel) {
  let a = 0, b = 0, c = 0;
  let s = sel;
  // functional pseudo-classes: :not/:is/:has take the max of their arguments, :where 0
  const fn = /:(not|is|has|where)\(/g; let m;
  while ((m = fn.exec(s))) {
    let depth = 1, j = m.index + m[0].length;
    for (; j < s.length && depth; j++) { if (s[j] === "(") depth++; else if (s[j] === ")") depth--; }
    const inner = s.slice(m.index + m[0].length, j - 1);
    if (m[1] !== "where") {
      const best = splitTop(inner).map(specificity).sort((x, y) => cmp(y, x))[0] ?? [0, 0, 0];
      a += best[0]; b += best[1]; c += best[2];
    }
    s = s.slice(0, m.index) + s.slice(j);
    fn.lastIndex = m.index;
  }
  b += (s.match(/\.(?:[\w-]|\\.)+/g) || []).length;
  b += (s.match(/\[[^\]]*\]/g) || []).length;
  s = s.replace(/\[[^\]]*\]/g, "").replace(/\.(?:[\w-]|\\.)+/g, "");
  c += (s.match(/::[\w-]+/g) || []).length;
  s = s.replace(/::[\w-]+/g, "");
  b += (s.match(/:[\w-]+/g) || []).length;
  s = s.replace(/:[\w-]+/g, "");
  a += (s.match(/#[\w-]+/g) || []).length;
  c += (s.match(/(^|[\s>+~])[a-zA-Z][\w-]*/g) || []).length;
  return [a, b, c];
}
const cmp = (x, y) => x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
const fmt = (sp) => sp.join(",");

const classesIn = (compound) => (compound.match(/\.(?:[\w-]|\\.)+/g) || []).map((t) => unescape(t.slice(1)));
/** Classes named inside a top-level :not() of this compound. */
function notClasses(compound) {
  const out = []; const re = /:not\(/g; let m;
  while ((m = re.exec(compound))) {
    let depth = 1, j = m.index + m[0].length;
    for (; j < compound.length && depth; j++) { if (compound[j] === "(") depth++; else if (compound[j] === ")") depth--; }
    out.push(...classesIn(compound.slice(m.index + m[0].length, j - 1)));
  }
  return out;
}
/** Strip :not(...) blocks so their classes are not counted as required. */
function withoutNot(compound) {
  let s = compound; const re = /:not\(/g; let m;
  while ((m = re.exec(s))) {
    let depth = 1, j = m.index + m[0].length;
    for (; j < s.length && depth; j++) { if (s[j] === "(") depth++; else if (s[j] === ")") depth--; }
    s = s.slice(0, m.index) + s.slice(j); re.lastIndex = m.index;
  }
  return s;
}
const isConditional = (sel) => /:(?!not\()[\w-]+|\[/.test(sel.replace(/\.(?:[\w-]|\\.)+/g, ""));

// ── longhand expansion, so `padding` meets `padding-top` ───────────────────────
const SIDES = ["top", "right", "bottom", "left"];
const LONGHANDS = {
  margin: SIDES.map((s) => `margin-${s}`), "margin-inline": ["margin-left", "margin-right"], "margin-block": ["margin-top", "margin-bottom"],
  padding: SIDES.map((s) => `padding-${s}`), "padding-inline": ["padding-left", "padding-right"], "padding-block": ["padding-top", "padding-bottom"],
  inset: SIDES, "inset-inline": ["left", "right"], "inset-block": ["top", "bottom"],
  border: SIDES.flatMap((s) => [`border-${s}-width`, `border-${s}-style`, `border-${s}-color`]),
  "border-width": SIDES.map((s) => `border-${s}-width`), "border-style": SIDES.map((s) => `border-${s}-style`), "border-color": SIDES.map((s) => `border-${s}-color`),
  "border-radius": ["border-top-left-radius", "border-top-right-radius", "border-bottom-right-radius", "border-bottom-left-radius"],
  gap: ["row-gap", "column-gap"], flex: ["flex-grow", "flex-shrink", "flex-basis"], overflow: ["overflow-x", "overflow-y"],
  outline: ["outline-width", "outline-style", "outline-color"], background: ["background-color", "background-image"],
  font: ["font-size", "font-weight", "line-height", "font-family"], transition: ["transition-property", "transition-duration"],
  "text-decoration": ["text-decoration-line", "text-decoration-color", "text-decoration-style"],
};
for (const side of ["top", "right", "bottom", "left"]) LONGHANDS[`border-${side}`] = [`border-${side}-width`, `border-${side}-style`, `border-${side}-color`];
const expand = (prop) => LONGHANDS[prop] ?? [prop];

// ── split the bundle ───────────────────────────────────────────────────────────
const utilities = new Map(); // class → [{ selector, spec, props:Set, index, media }]
const components = [];       // { selector, spec, props:Set, index, compounds }
let firstUtilityIndex = Infinity, lastComponentIndex = -1;
let index = 0;
root.walkRules((rule) => {
  index++;
  if (rule.parent?.type === "atrule" && /keyframes/.test(rule.parent.name)) return;
  const props = new Set();
  rule.walkDecls((d) => { if (!d.prop.startsWith("--")) for (const p of expand(d.prop)) props.add(p); });
  if (!props.size) return;
  for (const sel of rule.selectors) {
    if (sel.includes("::")) continue; // pseudo-elements: a utility on the element cannot conflict
    const spec = specificity(sel);
    if (/^\.va\\:/.test(sel)) {
      const cls = unescape(sel.match(/^\.((?:[\w-]|\\.)+)/)[1]);
      if (!utilities.has(cls)) utilities.set(cls, []);
      utilities.get(cls).push({ selector: sel, spec, props, index });
      firstUtilityIndex = Math.min(firstUtilityIndex, index);
    } else if (/\.va-/.test(sel)) {
      components.push({ selector: sel, spec, props, index, compounds: compounds(sel) });
      lastComponentIndex = Math.max(lastComponentIndex, index);
    }
  }
});

// ── markup sources (verify-markup's) ───────────────────────────────────────────
function markupFiles(dir) {
  const out = [];
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (name === "node_modules" || name.startsWith(".")) continue;
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(html|svelte)$/.test(name)) out.push(p);
    }
  };
  walk(dir);
  return out;
}
const sources = [];
const fixture = join(ROOT, "tests/fixtures/generated-page.html");
if (existsSync(fixture)) sources.push({ label: "committed fixture", files: [fixture] });
const runsDir = join(ROOT, "val/runs");
if (existsSync(runsDir)) {
  const runs = readdirSync(runsDir).map((n) => join(runsDir, n, "05-package")).filter((p) => existsSync(p)).sort();
  const newest = runs[runs.length - 1];
  if (newest) sources.push({ label: `newest /design run (${relative(ROOT, newest)})`, files: markupFiles(newest) });
}
// The canary: a descendant rule the bundle is known to carry, on an element carrying a
// utility for the same property. Must fire every run.
sources.push({
  label: "canary (synthetic)",
  canary: true,
  files: [],
  text: `<span class="va-action va-action-pending"><span class="va-action-title va:text-content-primary">x</span></span>` +
        // and a type-selector subject that must NOT fire: the svg rule cannot reach the button
        `<button class="va-btn va-btn-primary va:flex-1">x</button>`,
});

/** Elements = opening tags with a class attribute; the tag is kept so a subject compound
 *  with a TYPE selector (`.va-btn svg`) is only matched against an element of that type. */
function elementsOf(text, file) {
  const els = [];
  for (const m of text.matchAll(/<([a-zA-Z][\w-]*)\b[^>]*?\bclass\s*=\s*["']([^"']*)["']/g)) {
    const classes = m[2].split(/\s+/).filter((t) => t && !t.includes("{") && !t.includes("$"));
    if (classes.some((c) => c.startsWith("va:")) && classes.some((c) => c.startsWith("va-")))
      els.push({ tag: m[1].toLowerCase(), classes, file, line: text.slice(0, m.index).split("\n").length });
  }
  return els;
}
const typeOf = (compound) => (withoutNot(compound).match(/^[a-zA-Z][\w-]*/) || [null])[0];

// ── the check ──────────────────────────────────────────────────────────────────
const findings = [];
let elementsChecked = 0;
for (const src of sources) {
  const texts = src.canary ? [{ text: src.text, file: "canary" }] : src.files.map((f) => ({ text: readFileSync(f, "utf8"), file: relative(ROOT, f) }));
  const union = new Set();
  for (const { text } of texts) for (const m of text.matchAll(/\bclass\s*=\s*["']([^"']*)["']/g)) for (const t of m[1].split(/\s+/)) if (t) union.add(t);
  for (const { text, file } of texts) {
    for (const el of elementsOf(text, file)) {
      elementsChecked++;
      const have = new Set(el.classes);
      for (const util of el.classes.filter((c) => c.startsWith("va:"))) {
        const rules = utilities.get(util);
        if (!rules) continue; // verify:markup owns "no rule at all"
        for (const u of rules) for (const comp of components) {
          const shared = [...u.props].filter((p) => comp.props.has(p));
          if (!shared.length) continue;
          if (cmp(comp.spec, u.spec) <= 0) continue; // equal or lower: the utility wins (source order)
          const subject = comp.compounds[comp.compounds.length - 1];
          const type = typeOf(subject);
          if (type && type.toLowerCase() !== el.tag) continue;
          if (!classesIn(withoutNot(subject)).every((c) => have.has(c))) continue;
          if (notClasses(subject).some((c) => have.has(c))) continue;
          const ancestors = comp.compounds.slice(0, -1);
          if (!ancestors.every((a) => classesIn(withoutNot(a)).every((c) => union.has(c)))) continue;
          findings.push({
            src: src.label, canary: !!src.canary, file: el.file, line: el.line, element: el.classes.join(" "),
            utility: util, props: shared, selector: comp.selector, compSpec: fmt(comp.spec), utilSpec: fmt(u.spec),
            conditional: isConditional(comp.selector), assumedAncestors: ancestors.length > 0,
          });
        }
      }
    }
  }
}

// ── report ─────────────────────────────────────────────────────────────────────
console.log(`\n${BOLD}Utility precedence${OFF}  ${DIM}dist/shortapp-ui.css · ${utilities.size} utilities · ${components.length} component selectors · ${elementsChecked} element(s) carrying both${OFF}\n`);

let failed = false;
if (!(lastComponentIndex < firstUtilityIndex)) {
  failed = true;
  console.log(`  ${RED}FAIL${OFF}  source order: a component rule (#${lastComponentIndex}) follows the first utility rule (#${firstUtilityIndex}) — equal-specificity ties now go to the component.`);
} else console.log(`  ${GRN}PASS${OFF}  source order  ${DIM}every component rule precedes every utility rule — equal specificity resolves to the utility${OFF}`);

const canaryHits = findings.filter((f) => f.canary);
if (!canaryHits.length) {
  failed = true;
  console.log(`  ${RED}FAIL${OFF}  canary self-test: the synthetic \`.va-action-pending .va-action-title\` + \`va:text-content-primary\` element produced no finding — the matcher is broken, not the markup clean.`);
} else if (canaryHits.some((f) => f.element.includes("va-btn-primary"))) {
  failed = true;
  console.log(`  ${RED}FAIL${OFF}  canary self-test: \`.va-btn svg\` was matched against a <button> — type selectors are not being honoured, so every finding is suspect.`);
} else console.log(`  ${GRN}PASS${OFF}  canary self-test  ${DIM}${canaryHits[0].selector} (${canaryHits[0].compSpec}) outranks ${canaryHits[0].utility} (${canaryHits[0].utilSpec}) on ${canaryHits[0].props.join(", ")}${OFF}`);

const real = findings.filter((f) => !f.canary);
const fatal = real.filter((f) => !f.conditional);
const state = real.filter((f) => f.conditional);

const show = (f, colour) => {
  console.log(`  ${colour}${f.conditional ? "state" : "LOSES"}${OFF}  ${f.utility}  ${DIM}on${OFF} <${f.element}>  ${DIM}${f.file}:${f.line}${OFF}`);
  console.log(`${DIM}         ${f.props.join(", ")}  ←  ${f.selector}  (${f.compSpec} vs ${f.utilSpec})${f.assumedAncestors ? "  [ancestor assumed present]" : ""}${OFF}`);
};
if (fatal.length) {
  failed = true;
  console.log(`\n  ${RED}${fatal.length} utility use(s) that never apply — an unconditional component selector outranks them:${OFF}`);
  for (const f of fatal) show(f, RED);
}
if (state.length) {
  console.log(`\n  ${YEL}${state.length} state-conditional override(s)${OFF} ${DIM}— the component owns this state; the utility applies at rest and yields in the state named. Printed so the list is never silent.${OFF}`);
  for (const f of state) show(f, YEL);
}
if (!real.length) console.log(`\n  ${GRN}No utility in generated markup loses to a component selector.${OFF}`);

console.log(failed ? `\n  ${RED}FAIL${OFF}\n` : `\n  ${GRN}PASS${OFF}  ${DIM}${fatal.length} fatal · ${state.length} state-conditional${OFF}\n`);
process.exit(failed ? 1 : 0);
