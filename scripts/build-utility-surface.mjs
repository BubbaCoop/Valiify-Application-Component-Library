#!/usr/bin/env node
/**
 * Generate src/utility-surface.css — the closed set of utilities the prebuilt
 * bundle ships.
 *
 * dist/shortapp-ui.css exists so a consuming app never compiles our classes. That
 * makes the utility layer a CLOSED SET: whatever is not emitted here does not
 * exist for a consumer, and a page using it renders unstyled with nothing failing.
 * So the set is derived from the surfaces that actually drive generated pages —
 * the design methodology — rather than hand-maintained.
 *
 * Output is committed and diffable on purpose: it is the reviewable record of what
 * the package publishes. Candidates that do not compile are dropped (documentation
 * prose is full of class-shaped strings), and the count is printed so a sudden
 * change is visible.
 *
 *   node scripts/build-utility-surface.mjs
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PREFIX = "va";
const SOURCES = ["design-methodology"];
const OUT = join(ROOT, "src/utility-surface.css");

const files = SOURCES.flatMap((d) => {
  const dir = join(ROOT, d);
  return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => join(dir, f)) : [];
});
if (!files.length) {
  console.error(`  No methodology files found under ${SOURCES.join(", ")} — refusing to write an empty utility surface.`);
  process.exit(1);
}

// Every `va:`-spelled token, wherever it appears: code spans, class attributes, diagrams.
const found = new Set();
for (const f of files) {
  for (const m of readFileSync(f, "utf8").matchAll(/(?<![\w:-])va:[A-Za-z0-9:[\]_.\/#%-]+/g)) {
    found.add(m[0].replace(/[.,;)]+$/, ""));
  }
}

// Compile them for real; drop what Tailwind cannot build.
const req = createRequire(join(ROOT, "package.json"));
const twDir = dirname(req.resolve("tailwindcss/package.json"));
const entry = ["dist/lib.mjs", "dist/lib.js", "index.mjs"].map((f) => join(twDir, f)).find(existsSync);
const tw = await import(pathToFileURL(entry).href);
const ds = await tw.__unstable__loadDesignSystem(
  [
    `@import "tailwindcss/theme.css" prefix(${PREFIX});`,
    `@import "${pathToFileURL(join(ROOT, "src/themes/valiify-tokens.css")).href}" prefix(${PREFIX});`,
    `@import "${pathToFileURL(join(ROOT, "src/themes/valiify-type-prefixed.css")).href}";`,
    `@import "${pathToFileURL(join(ROOT, "src/utilities/index.css")).href}";`,
  ].join("\n"),
  {
    base: ROOT,
    loadStylesheet: async (id, base) => {
      let file;
      if (id === "tailwindcss") file = join(twDir, "index.css");
      else if (id.startsWith("tailwindcss/")) file = join(twDir, id.slice("tailwindcss/".length));
      else if (id.startsWith("file://")) file = fileURLToPath(id);
      else if (id.startsWith(".") || id.startsWith("/")) file = join(base, id);
      else file = createRequire(join(base, "__r__.js")).resolve(id);
      return { path: file, base: dirname(file), content: readFileSync(file, "utf8") };
    },
  },
);

/**
 * Responsive variants of every sanctioned base.
 *
 * The methodology cites base utilities (`va:py-12`), and a page composes the
 * responsive form from them (`va:md:py-12`) — §1.1 web vs §1.2 mobile is exactly
 * that. class-audit sanctions the composed form, because it strips variants before
 * classifying; without this the bundle would not SHIP it, and the two gates would
 * disagree. The first real /design run after the rename hit precisely that:
 * class-audit PASS on va:md:py-12, va:md:w-140, va:md:gap-10 while verify:markup
 * correctly reported them as having no rule.
 *
 * `md` only. It is the single breakpoint this design system sanctions — CLAUDE.md
 * "Library Contracts" pins it to Header's 768px switch and says new responsive
 * behaviour uses Tailwind's breakpoints, never new raw values. Emitting every
 * variant class-audit allows (hover, focus-visible, aria-*, …) would multiply the
 * surface ~15x for combinations components already handle internally; if generated
 * output ever needs one, verify:markup fails and names it, which is how this rule
 * was found.
 */
const RESPONSIVE = ["md"];
for (const c of [...found]) {
  const bare = c.slice(PREFIX.length + 1);
  if (RESPONSIVE.some((v) => bare.startsWith(`${v}:`))) continue; // already responsive
  for (const v of RESPONSIVE) found.add(`${PREFIX}:${v}:${bare}`);
}

const all = [...found].sort();
const css = ds.candidatesToCss(all);
const keep = all.filter((_, i) => css[i] !== null);
const drop = all.filter((_, i) => css[i] === null);

writeFileSync(
  OUT,
  [
    "/**",
    " * The utility surface of the prebuilt bundle. GENERATED — do not edit by hand.",
    " *",
    " * Source:    design-methodology/*.md",
    " * Generator: scripts/build-utility-surface.mjs  (npm run build:utility-surface)",
    " *",
    " * dist/shortapp-ui.css ships a CLOSED set of utilities: a consuming app never",
    " * compiles our classes, so a utility missing here does not exist for a consumer and",
    " * a page using it renders unstyled with nothing failing. This file is committed so",
    " * that set is reviewable in a diff.",
    " *",
    ` * ${keep.length} utilities — each base plus its \`md:\` form (the one sanctioned`,
    " * breakpoint). Candidates that do not compile are dropped by the generator.",
    " */",
    "",
    ...keep.map((c) => `@source inline("${c}");`),
    "",
  ].join("\n"),
);

console.log(`\n  wrote  src/utility-surface.css`);
console.log(`  ${keep.length} utilities kept, ${drop.length} non-compiling candidate(s) dropped`);
if (drop.length) console.log(`  dropped: ${drop.slice(0, 12).join(" ")}${drop.length > 12 ? " …" : ""}`);
