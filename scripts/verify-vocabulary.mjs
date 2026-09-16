#!/usr/bin/env node
/**
 * Vocabulary drift gate — fails when a doc or agent file names a class the
 * published bundle does not define.
 *
 * Hand-written class lists in prose go stale silently: the rename that produced
 * this file touched ~1,400 tokens across 40+ files, and a missed one renders
 * unstyled with nothing failing anywhere. class-manifest.json is generated from
 * dist/shortapp-ui.css, so this gate compares prose against what actually ships.
 *
 * Extraction is deliberately narrow. Documentation prose is full of class-shaped
 * strings (text-transform, border-box, line-height), so only three shapes count:
 *
 *   `.foo`                    a dotted token ANYWHERE inside a backticked span, so
 *                             `.va-radio / .va-checkbox-control` counts as two
 *   class="a b" / data-class  every token in a class attribute; JSX `className="a b"`
 *                             counts too, but `className={expr}` does not — a braced
 *                             value is an expression, like Vue's `:class`
 *   `foo` where foo is a shipped utility's UNPREFIXED spelling — ONLY in the
 *                             sources listed in PREFIX_REQUIRED (see below)
 *
 *   node scripts/verify-vocabulary.mjs
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const RED = "\x1b[31m", GRN = "\x1b[32m", DIM = "\x1b[2m", YEL = "\x1b[33m", OFF = "\x1b[0m";

/**
 * Every exclusion needs a reason. A path listed here is NOT checked for vocabulary
 * drift — adding one silently shrinks this gate's coverage, which is exactly how a
 * drift gate stops catching things. Keep them here, never as inline path checks.
 */
const EXCLUDED = [
  ["_dashboard-archive/", "a different library's vocabulary that shares live class names (btn, modal, toast, skeleton, switch, tabs, checkbox, avatar, tooltip) — name filtering cannot separate them"],
  ["val/fixtures/", "pinned to pre-va- vocabulary on purpose: a signed-off run is a record of what was approved, not a file to rewrite"],
  ["val/runs/", "pipeline output, gitignored"],
  ["dist/", "build output — this gate's comparison target, not an input"],
  ["storybook-static/", "build output, gitignored"],
  ["node_modules/", "dependencies"],
  [".git/", "vcs"],
  ["CHANGELOG.md", "a historical record: its entries name classes as they were at the time of each release"],
];

/**
 * Where an unprefixed utility is an ERROR rather than correct.
 *
 * The prefix belongs to the PREBUILT bundle's utility layer only. A consumer on the
 * ./source entry compiles our @theme with their own Tailwind and writes `rounded-sm`,
 * unprefixed — so Storybook docs and the README describing that path are right to use
 * the bare spelling. Only sources that drive pages loading dist/shortapp-ui.css must
 * carry `va:`.
 */
const PREFIX_REQUIRED = [
  ["design-methodology/", "drives /design-generated pages, which load the prebuilt bundle and never compile Tailwind"],
];
const prefixRequired = (rel) => PREFIX_REQUIRED.some(([p]) => rel.startsWith(p));

/** `.svelte`, `.css` in prose are file extensions, not class references. */
const FILE_EXT = /^(svelte|css|mjs|cjs|js|ts|tsx|json|md|mdx|html|svg|png|tgz|txt|yml|yaml)$/;

/**
 * Class names that are deliberately absent from the bundle and still named in prose,
 * because the prose is ABOUT their absence. Each needs the reason, and each should
 * disappear when the passage explaining it does.
 *
 * HISTORICAL NAMES ONLY. A class that is merely *not built yet* does not belong here: a
 * planned class is a real gap, and this list would excuse it permanently — it would still
 * be excused after the class shipped under a different name, with nothing to notice. Leave
 * a planned class to be REPORTED; the finding disappears on its own when the class ships.
 * (text-field-optional sat here for exactly that reason and was removed.)
 */
const KNOWN_ABSENT = new Map([
  ["list-item", "historical: the name ListItem could NOT use — it is Tailwind's own display utility. CLAUDE.md and verify-bundle cite it as why the class is .va-list-option."],
  ["text-field-label", "historical: renamed to -title after colliding with the text-field-label type token's utility. Cited in CLAUDE.md, CHANGELOG and verify-bundle as the precedent."],
]);

const manifestPath = join(ROOT, "class-manifest.json");
if (!existsSync(manifestPath)) {
  console.error(`${RED}  class-manifest.json not found — run \`npm run build\` first.${OFF}`);
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const COMPONENTS = new Set(manifest.components);
const UTILITIES = new Set(manifest.utilities);
const UNPREFIXED = new Map([...UTILITIES].map((u) => [u.slice(manifest.utilityPrefix.length), u]));

const excluded = (rel) => EXCLUDED.some(([p]) => rel === p || rel.startsWith(p));

const EXTS = [".md", ".mdx", ".html", ".json"];
function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    const rel = relative(ROOT, abs);
    if (excluded(rel + (statSync(abs).isDirectory() ? "/" : ""))) continue;
    if (statSync(abs).isDirectory()) walk(abs, acc);
    else if (EXTS.some((e) => name.endsWith(e))) acc.push(abs);
  }
  return acc;
}

const findings = [];
function scan(rel, text, { requirePrefix = prefixRequired(rel) } = {}) {
  const lineOf = (i) => text.slice(0, i).split("\n").length;

  // A dotted class counts wherever it sits inside a code span, not only when it IS the whole
  // span. Prose writes them in lists — `.va-radio / .va-checkbox-control`, `.va-btn
  // va-btn-primary` — and the anchored match that used to be here saw NONE of those: ~70
  // references across the methodologies were never checked.
  //
  // Splitting on WHITESPACE ONLY is what keeps paths out. `.claude/agents/x.md` stays a
  // single token and fails the class shape below, so directory names never register; adding
  // `/` to the split would report `.claude` and `.github` as missing classes.
  for (const span of text.matchAll(/`([^`\n]+)`/g)) {
    for (const tok of span[1].split(/\s+/)) {
      const m = /^\.([A-Za-z][\w-]*)$/.exec(tok);
      if (!m) continue;
      const name = m[1];
      if (COMPONENTS.has(name) || FILE_EXT.test(name) || KNOWN_ABSENT.has(name)) continue;
      findings.push({ rel, line: lineOf(span.index), token: "." + name, why: "no such component class in the published bundle" });
    }
  }
  // Plain `class="…"`, `data-class="…"` and JSX `className="…"` — the React examples in
  // GETTING_STARTED.md and src/icons/README.md were invisible until `className` was added,
  // because `class` is followed by `Name` there, not `=`.
  //
  // QUOTED forms only, which is the same line the binding rule draws: `className={…}` holds
  // an expression, not a class list, exactly like Vue's `:class`. A framework BINDING — Vue's
  // `:class="['icon', x]"`, Angular's `[class]`/`[ngClass]`, `v-bind:class` — holds an
  // expression, not a class list, and splitting it on whitespace invents tokens like
  // `['icon',` and `className]`. The lookbehind rejects a `class` preceded by `:`, `[`,
  // a word character or `-`; `data-` is matched explicitly so `data-class` still counts.
  for (const m of text.matchAll(/(?<![:\[\w-])(?:data-)?class(?:Name)?\s*=\s*"([^"]*)"/g)) {
    for (const tok of m[1].split(/\s+/).filter(Boolean)) {
      const t = tok.replace(/^\./, "");
      if (t.includes("${") || t.startsWith("__")) continue;
      // Quotes and commas never appear in a class token. Arbitrary values legitimately
      // carry brackets (`w-[343px]`), so brackets alone are NOT a rejection.
      if (/["',]/.test(t)) continue;
      if (COMPONENTS.has(t) || UTILITIES.has(t) || KNOWN_ABSENT.has(t)) continue;
      if (UNPREFIXED.has(t)) findings.push({ rel, line: lineOf(m.index), token: t, why: `needs the prefix — write ${UNPREFIXED.get(t)}` });
      else findings.push({ rel, line: lineOf(m.index), token: t, why: "not in the published bundle" });
    }
  }
  if (requirePrefix) {
    for (const m of text.matchAll(/`([^`\n]+)`/g)) {
      for (const tok of m[1].split(/\s+/)) {
        if (UNPREFIXED.has(tok)) findings.push({ rel, line: lineOf(m.index), token: tok, why: `needs the prefix — write ${UNPREFIXED.get(tok)}` });
      }
    }
  }
}

for (const abs of walk(ROOT)) scan(relative(ROOT, abs), readFileSync(abs, "utf8"));

// Canary: the matcher itself must flag a class that is deliberately not shipped.
// Without it a broken extractor would report a clean run and look like a pass.
const canary = [];
{
  const before = findings.length;
  // Five shapes, one per extraction path. The last two are the paths that were BROKEN:
  // a dotted class sharing its span with anything else, and a JSX className.
  scan(
    "<canary>",
    '`.va-not-a-real-class` and <div class="va-also-not-real"></div>' +
      ' and `.va-nope-one / .va-nope-two` and <b className="va-nope-three">x</b>',
    { requirePrefix: false },
  );
  canary.push(...findings.splice(before));
}
if (canary.length < 5) {
  console.error(`${RED}  FAIL  canary self-test: the matcher flagged ${canary.length}/5 deliberately-unshipped classes.${OFF}`);
  console.error(`        This gate cannot report a pass it did not earn — fix the extractor.`);
  process.exit(1);
}

// Second canary, the other direction: the extractor must NOT invent findings out of a
// framework binding. Over-reporting is as corrosive as under-reporting — noise is how a
// gate gets ignored, and this one shipped reporting `['icon',` and `className]` as
// missing classes.
{
  const before = findings.length;
  scan(
    "<canary>",
    `<svg :class="['icon', className]" /><i [ngClass]="{'x': y}" /><b v-bind:class="z" /><em className={cx('a', 'b')} />`,
    { requirePrefix: false },
  );
  const invented = findings.splice(before);
  if (invented.length) {
    console.error(`${RED}  FAIL  canary self-test: the matcher invented ${invented.length} finding(s) from a framework binding.${OFF}`);
    for (const f of invented) console.error(`        ${f.token}`);
    console.error(`        A binding holds an expression, not a class list — fix the extractor.`);
    process.exit(1);
  }
}

console.log(`\n  ${DIM}vocabulary: ${COMPONENTS.size} component classes, ${UTILITIES.size} utilities (class-manifest.json)${OFF}`);
console.log(`  ${DIM}excluded:${OFF}`);
for (const [p, why] of EXCLUDED) console.log(`    ${DIM}${p.padEnd(22)} ${why}${OFF}`);
if (KNOWN_ABSENT.size) {
  console.log(`  ${YEL}names absent from the bundle by design (printed, never silent):${OFF}`);
  for (const [n, why] of KNOWN_ABSENT) console.log(`    ${DIM}.${n.padEnd(21)} ${why.slice(0, 96)}…${OFF}`);
}
console.log(`  ${DIM}prefix required in:${OFF}`);
for (const [p, why] of PREFIX_REQUIRED) console.log(`    ${DIM}${p.padEnd(22)} ${why}${OFF}`);
console.log(`  ${GRN}PASS${OFF}  canary self-test  ${DIM}5 unshipped classes flagged across every extraction path; 0 invented from framework bindings or JSX expressions${OFF}`);

if (!findings.length) {
  console.log(`\n  ${GRN}No vocabulary drift${OFF} across the scanned docs and agent files.\n`);
  process.exit(0);
}
const byFile = new Map();
for (const f of findings) (byFile.get(f.rel) ?? byFile.set(f.rel, []).get(f.rel)).push(f);
console.log(`\n  ${RED}${findings.length} vocabulary drift finding(s):${OFF}`);
for (const [rel, list] of [...byFile].sort()) {
  console.log(`\n  ${YEL}${rel}${OFF}`);
  for (const f of list.slice(0, 12)) console.log(`    ${String(f.line).padStart(5)}  ${f.token.padEnd(38)} ${f.why}`);
  if (list.length > 12) console.log(`    ${DIM}… ${list.length - 12} more${OFF}`);
}
console.log();
process.exit(1);
