#!/usr/bin/env node
/**
 * Packaging smoke test — verifies the PUBLISHED ARTIFACT, not the workspace.
 *
 *   npm run verify:package        (needs network: installs vite + tailwind)
 *
 * Every other gate verifies source or Storybook output; none of them can see
 * a broken exports map, a file missing from the `files` whitelist, or an
 * import-order defect that only bites a real consumer build. This one can:
 *
 *   1. `npm pack` the real tarball (prepack runs the full build).
 *   2. Install it into a scratch copy of examples/vite-starter
 *      (`file:` dep swapped to the tarball).
 *   3. `vite build` twice — once per entry point — and assert:
 *        /source  → component classes AND token-generated utilities compile
 *        prebuilt → component classes compile, token utilities DON'T
 *      (the load-bearing difference documented in CLAUDE.md's entry table),
 *      plus tokens resolve (oklch) and the sprite asset ships.
 *
 * Scratch lives in .verify-tmp/ (gitignored), recreated per run.
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TMP = join(ROOT, ".verify-tmp", "package");
const APP = join(TMP, "app");

const BOLD = "\x1b[1m", DIM = "\x1b[2m", RED = "\x1b[31m", GRN = "\x1b[32m", OFF = "\x1b[0m";
let failed = false;
const pass = (msg, note = "") =>
  console.log(`  ${GRN}PASS${OFF}  ${msg}${note ? `  ${DIM}${note}${OFF}` : ""}`);
const fail = (msg, why = "") => {
  console.log(`  ${RED}FAIL${OFF}  ${msg}${why ? `\n        ${DIM}${why}${OFF}` : ""}`);
  failed = true;
};
const sh = (cmd, cwd = ROOT) => execSync(cmd, { cwd, stdio: "pipe", encoding: "utf8" });

console.log(`\n${BOLD}Packaging smoke test${OFF}  ${DIM}real tarball → real Vite consumer build${OFF}\n`);

// 1. Pack ------------------------------------------------------------------
rmSync(join(ROOT, ".verify-tmp"), { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });
const packOut = sh(`npm pack --pack-destination "${TMP}"`);
const tarball = packOut.trim().split("\n").pop().trim();
if (!tarball.endsWith(".tgz")) {
  fail("npm pack produced a tarball", packOut.slice(-200));
  process.exit(1);
}
pass("tarball packed", tarball);
// prepack's fix-examples mutated the example manifests — restore immediately.
sh("npm run restore-examples");

// 2. Scratch consumer app ---------------------------------------------------
cpSync(join(ROOT, "examples/vite-starter"), APP, { recursive: true });
const manifest = JSON.parse(readFileSync(join(APP, "package.json"), "utf8"));
manifest.dependencies["@valiify/shortapp-ui"] = `file:../${tarball}`;
writeFileSync(join(APP, "package.json"), JSON.stringify(manifest, null, 2));
sh("npm install --no-audit --no-fund", APP);
pass("installed into a scratch Vite app", "tarball + tailwindcss + @tailwindcss/vite");

const builtCss = () => {
  const assets = join(APP, "dist", "assets");
  const cssFile = readdirSync(assets).find((f) => f.endsWith(".css"));
  return readFileSync(join(assets, cssFile), "utf8");
};

// 3a. /source entry ---------------------------------------------------------
sh("npx vite build", APP);
let css = builtCss();
if (css.includes(".btn-primary")) pass("/source: component classes compiled");
else fail("/source: component classes compiled", ".btn-primary missing from the consumer bundle");
if (/\.text-display\{/.test(css) || /\.text-display\s*\{/.test(css))
  pass("/source: token-generated utilities compiled", "text-display present");
else fail("/source: token-generated utilities compiled", "text-display utility missing — the @theme did not reach the consumer's Tailwind");
if (css.includes("oklch(")) pass("/source: tokens emit oklch");
else fail("/source: tokens emit oklch");
if (existsSync(join(APP, "dist")) && readdirSync(join(APP, "dist", "assets")).some((f) => f.endsWith(".svg")))
  pass("sprite asset shipped through the exports map");
else fail("sprite asset shipped through the exports map");

// 3b. prebuilt entry --------------------------------------------------------
const stylesPath = join(APP, "src", "styles.css");
const styles = readFileSync(stylesPath, "utf8");
writeFileSync(stylesPath, styles.replace('@import "@valiify/shortapp-ui/source";', '@import "@valiify/shortapp-ui";'));
rmSync(join(APP, "dist"), { recursive: true, force: true });
sh("npx vite build", APP);
css = builtCss();
if (css.includes(".btn-primary")) pass("prebuilt: component classes compiled");
else fail("prebuilt: component classes compiled", ".btn-primary missing");
if (!/\.text-display\s*\{/.test(css))
  pass("prebuilt: token utilities correctly ABSENT", "the two-entry contract holds");
else fail("prebuilt: token utilities correctly ABSENT", "text-display utility leaked into the prebuilt entry");

rmSync(join(ROOT, ".verify-tmp"), { recursive: true, force: true });
console.log(
  failed
    ? `\n  ${RED}Packaging broken — a consumer install would fail.${OFF}\n`
    : `\n  ${DIM}The published artifact builds correctly in a real consumer app, both entry points.${OFF}\n`,
);
process.exit(failed ? 1 : 0);
