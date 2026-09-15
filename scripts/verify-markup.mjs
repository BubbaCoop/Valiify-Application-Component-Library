#!/usr/bin/env node
/**
 * Generated-page gate — every class in real generated markup must have a rule in
 * dist/shortapp-ui.css.
 *
 * This is the check that a hand-written smoke page cannot substitute for. A smoke
 * page uses classes its author chose, so it passes while the real path stays
 * broken: /design emits a page, the page loads ONLY the prebuilt bundle and
 * compiles no Tailwind, and any class the bundle does not ship renders unstyled —
 * with nothing failing anywhere. That silence is the whole risk.
 *
 * Inputs, both checked when present, neither optional:
 *   tests/fixtures/generated-page.html   committed, so CI always has one
 *   val/runs/<newest>/05-package/        the real thing, when a run exists locally
 *                                        (runs are gitignored, so absent in CI)
 *
 *   node scripts/verify-markup.mjs
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const RED = "\x1b[31m", GRN = "\x1b[32m", DIM = "\x1b[2m", YEL = "\x1b[33m", OFF = "\x1b[0m";

const bundlePath = join(ROOT, "dist/shortapp-ui.css");
if (!existsSync(bundlePath)) {
  console.error(`${RED}  dist/shortapp-ui.css not found — run \`npm run build\` first.${OFF}`);
  process.exit(1);
}
const css = readFileSync(bundlePath, "utf8");

/**
 * Does the bundle carry a rule for this class?
 *
 * Two escapings, and conflating them is a silent false negative: Tailwind writes
 * `va:flex` into CSS as the LITERAL text `.va\:flex`, so the selector we look for
 * already contains a backslash — which then has to be escaped again for the regex.
 */
const toSelector = (cls) => "." + cls.replace(/[:.\/[\]%#()]/g, (c) => "\\" + c);
const reEscape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const has = (cls) => new RegExp(`${reEscape(toSelector(cls))}(?![\\w-])`).test(css);

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
  const runs = readdirSync(runsDir)
    .map((n) => join(runsDir, n, "05-package"))
    .filter((p) => existsSync(p))
    .sort();
  const newest = runs[runs.length - 1];
  if (newest) sources.push({ label: `newest /design run (${relative(ROOT, newest)})`, files: markupFiles(newest) });
}

// Never skip. A missing fixture AND no run directory is itself the failure — this gate
// reporting "nothing to check" would be indistinguishable from a pass.
if (!sources.length) {
  console.error(`${RED}  FAIL  no generated markup to check.${OFF}`);
  console.error(`        Expected tests/fixtures/generated-page.html or a val/runs/*/05-package/.`);
  process.exit(1);
}

// Canary: a class the bundle deliberately does not ship must be reported missing.
if (has("va-not-a-real-class") || !has("va-btn")) {
  console.error(`${RED}  FAIL  canary self-test: the matcher cannot tell shipped from unshipped classes.${OFF}`);
  process.exit(1);
}
console.log(`\n  ${GRN}PASS${OFF}  canary self-test  ${DIM}.va-btn found, .va-not-a-real-class absent${OFF}`);

let missing = 0, checked = 0;
for (const { label, files } of sources) {
  const found = new Map();
  for (const f of files) {
    const text = readFileSync(f, "utf8");
    for (const m of text.matchAll(/\bclass\s*=\s*["']([^"']*)["']/g)) {
      for (const tok of m[1].split(/\s+/).filter(Boolean)) {
        if (tok.includes("${") || tok.includes("{")) continue; // interpolated at runtime
        if (!found.has(tok)) found.set(tok, relative(ROOT, f));
      }
    }
  }
  const gone = [...found].filter(([cls]) => !has(cls));
  checked += found.size;
  console.log(`  ${DIM}${label}: ${files.length} file(s), ${found.size} distinct class(es)${OFF}`);
  if (gone.length) {
    missing += gone.length;
    console.log(`  ${RED}${gone.length} class(es) with NO rule in the bundle:${OFF}`);
    for (const [cls, where] of gone) console.log(`      ${YEL}${cls.padEnd(40)}${OFF} ${DIM}${where}${OFF}`);
  }
}

if (missing) {
  console.log(`\n  ${RED}FAIL${OFF}  ${missing} class(es) would render unstyled in a consuming app.`);
  console.log(`  ${DIM}Either the markup is stale (pre-rename spelling) or the utility surface needs regenerating:${OFF}`);
  console.log(`  ${DIM}  npm run build:utility-surface && npm run build${OFF}\n`);
  process.exit(1);
}
console.log(`\n  ${GRN}All ${checked} class(es) in generated markup resolve${OFF} against dist/shortapp-ui.css.\n`);
