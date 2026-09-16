#!/usr/bin/env node
/**
 * No-bleed assertion: shortapp-ui and Tailwind 3 + daisyUI 4 in one document.
 *
 *   npm run check
 *
 * Every other gate in the library checks class NAMES against a manifest. This one
 * renders the bundle inside the host stack it was built for and measures COMPUTED
 * styles — the only way to observe either kind of collision, because neither
 * errors: a shared name silently hands one library's node the other's declarations,
 * and a cascade layer silently hands a host element reset the win over our class.
 *
 * Two directions, and they are different bugs:
 *
 *   A  class-name collision — daisyUI's `.btn` vs our `.va-btn`. Fixed by the va-
 *      namespace (1.0.0). Asserted both ways.
 *
 *   B  host ELEMENT RESET defeating our component — Tailwind 3 preflight's
 *      `* { border-width: 0 }`, `button { background-color: transparent }`,
 *      `input, textarea { font-size: 100%; color: inherit; padding: 0 }`,
 *      `textarea { resize: vertical }`. Unlayered, and it loads after our bundle.
 *      A component rule inside `@layer components` loses to all of it regardless of
 *      specificity or order; an unlayered one wins on specificity. The rename could
 *      not fix this and did not. Asserted per control: button, input, select,
 *      textarea — the elements preflight touches.
 *
 * TWO LOAD PATHS, because the answer depends on it (measured, not assumed):
 *
 *   /            src/styles.css `@import`s the bundle INTO the host's Tailwind 3
 *                stylesheet. Tailwind 3 treats `@layer components { }` as its own
 *                directive, hoists the rules to its `@tailwind components` slot and
 *                emits them UNLAYERED — after preflight. The host's pipeline strips
 *                our layers by accident, so a layered bundle passes here.
 *   /linked.html <link> to the bundle file after the host's compiled CSS. The bundle
 *                reaches the browser exactly as shipped, layers intact. This is the
 *                path a host that "never compiles our classes" is most likely to use,
 *                and the one where a layered bundle loses.
 *
 * A third shape — the bundle as its own CSS file through the host's PostCSS with
 * no @tailwind directives — is probed and reported, not asserted.
 *
 * The fingerprint that would have caught the 1.0.0 report: preflight never touches
 * `outline`, so under a layer defeat the focus ring SURVIVES while the border,
 * background and padding do not. The check reads both on every control and names
 * the signature when it sees it.
 */
import { readFileSync } from "node:fs";
import { chromium } from "playwright";
import { createServer } from "vite";

const RED = "\x1b[31m", GRN = "\x1b[32m", YEL = "\x1b[33m", DIM = "\x1b[2m", BOLD = "\x1b[1m", OFF = "\x1b[0m";
// Vite runs every .css request through its pipeline — including the host's Tailwind 3,
// which refuses a file carrying `@layer components` without a matching `@tailwind`
// directive (measured: the linked bundle 500'd and the page had no tokens at all).
// So /bundle.css is served RAW from disk: the bundle exactly as the package ships it.
const BUNDLE = new URL("./node_modules/@valiify/shortapp-ui/dist/shortapp-ui.css", import.meta.url);
const rawBundle = {
  name: "serve-bundle-as-shipped",
  configureServer(s) {
    s.middlewares.use((req, res, next) => {
      if (req.url !== "/bundle.css") return next();
      res.setHeader("content-type", "text/css");
      res.end(readFileSync(BUNDLE));
    });
  },
};
const server = await createServer({ plugins: [rawBundle], server: { port: 5199 }, logLevel: "silent" });
await server.listen();
const browser = await chromium.launch();
const page = await browser.newPage();

const PAGES = [
  { path: "/", label: "@import through the host's Tailwind 3 pipeline (host strips our layers)" },
  { path: "/linked.html", label: "<link> to the bundle as shipped, after the host's CSS (layers intact)" },
];

// Probe the third shape and record what the host pipeline does to a lone import.
const probe = async (url) => {
  const css = await (await fetch(`http://localhost:5199${url}`, { headers: { accept: "text/css" } })).text();
  const err = css.match(/"message"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  return { layers: (css.match(/@layer (components|base)\s*\{/g) || []).length, bytes: css.length, error: err ? JSON.parse(`"${err[1]}"`).split("\n")[0] : null };
};

const style = (sel, prop) =>
  page.evaluate(([s, p]) => {
    const el = document.querySelector(s);
    return el ? getComputedStyle(el).getPropertyValue(p) : null;
  }, [sel, prop]);

/** The computed colour a token resolves to on this page — never a literal. */
const token = (name) =>
  page.evaluate((n) => {
    const probe = document.createElement("span");
    probe.style.color = `var(${n})`;
    document.body.append(probe);
    const v = getComputedStyle(probe).color;
    probe.remove();
    return v;
  }, name);

const results = [];
const check = async (dir, label, sel, prop, assert, want, why) => {
  const got = await style(sel, prop);
  results.push({ dir, label, prop, got, want, ok: got !== null && assert(got), why });
};
const eq = (want) => (v) => v === want;
const px = (want) => (v) => Math.abs(parseFloat(v) - want) < 0.5;

// Let a transition settle before reading a colour or an outline (CLAUDE.md).
const settle = () => page.waitForTimeout(400);

for (const pg of PAGES) {
  pg.tag = pg.path === "/" ? "import" : "link";
  await page.goto(`http://localhost:5199${pg.path}`, { waitUntil: "networkidle" });
  results.push({ dir: "", label: `── ${pg.label}`, heading: true, ok: true });
  // ── B  host element reset vs our controls ────────────────────────────────────
  const primary = await token("--color-primary");
  const inkPrimary = await token("--color-content-primary");

  // button — .va-dropdown-field-trigger and .va-btn-primary
  await check(`${pg.tag} B/button`, ".va-dropdown-field-trigger keeps its 1px border", "#va-trigger", "border-top-width", px(1), "1px",
    "preflight `* { border-width: 0 }` won — the bundle's rule is inside a cascade layer");
  await check(`${pg.tag} B/button`, ".va-btn-primary keeps its crimson fill", "#va-btn-primary", "background-color", eq(primary), primary,
    "preflight `button { background-color: transparent }` won — layer defeat");
  await check(`${pg.tag} B/button`, ".va-btn-primary keeps its 14px x-padding", "#va-btn-primary", "padding-left", px(14), "14px",
    "preflight `button { padding: 0 }` won — layer defeat");

  // input — .va-text-field-input inside its box. The host body is 13px / 2 / purple.
  await check(`${pg.tag} B/input`, ".va-text-field-input is 16px, not the host body's 13px", "#va-input", "font-size", px(16), "16px",
    "preflight `input { font-size: 100% }` won — layer defeat");
  await check(`${pg.tag} B/input`, ".va-text-field-input line-height is 24px, not the host's 26px", "#va-input", "line-height", px(24), "24px",
    "preflight `input { line-height: inherit }` won — layer defeat");
  await check(`${pg.tag} B/input`, ".va-text-field-input ink is Text/Primary, not the host's purple", "#va-input", "color", eq(inkPrimary), inkPrimary,
    "preflight `input { color: inherit }` won — layer defeat");
  await check(`${pg.tag} B/input`, ".va-text-field-box keeps its 1px border", "#va-input-box", "border-top-width", px(1), "1px",
    "preflight `* { border-width: 0 }` won — layer defeat");

  // textarea — .va-text-area-input
  await check(`${pg.tag} B/textarea`, ".va-text-area-input keeps its 1px border", "#va-textarea", "border-top-width", px(1), "1px",
    "preflight `* { border-width: 0 }` won — layer defeat");
  await check(`${pg.tag} B/textarea`, ".va-text-area-input keeps its authored 10px y-padding", "#va-textarea", "padding-top", px(10), "10px",
    "preflight `textarea { padding: 0 }` won — layer defeat");
  await check(`${pg.tag} B/textarea`, ".va-text-area-input keeps resize: none (a library decision)", "#va-textarea", "resize", eq("none"), "none",
    "preflight `textarea { resize: vertical }` won — layer defeat");

  // select — the library ships no select component, so there is nothing preflight can
  // defeat. Assert THAT from the manifest, so this line fails the day one lands and
  // demands a real assertion here instead of silently leaving select uncovered.
  {
    const manifest = JSON.parse(readFileSync(new URL("./node_modules/@valiify/shortapp-ui/class-manifest.json", import.meta.url), "utf8"));
    const names = Object.values(manifest).flatMap((v) => (Array.isArray(v) ? v : Object.keys(v ?? {}))).filter((s) => typeof s === "string");
    const KNOWN_NOT_SELECTS = /^va-(select-card|text-selector)(-|$)/; // a <label>/<button> card and a <button> trigger
    const selectish = names.filter((n) => /select/.test(n) && !KNOWN_NOT_SELECTS.test(n));
    if (pg.tag === "import") results.push({ dir: "B/select", label: "no shipped component targets a native <select> (manifest scan)", prop: "manifest",
      got: selectish.length ? selectish.join(" ") : "none", want: "none", ok: selectish.length === 0,
      why: "a select component now exists — add its border/padding/font assertions to this check before shipping it" });
  }

  // The fingerprint — Tab through the three controls and read the ring where each
  // component paints it. Preflight never touches outline, so the ring survives even
  // when the border does not; seeing both on one control is the layer-defeat signature.
  await page.click("body", { position: { x: 1, y: 1 } });
  const rings = [
    ["button", "#va-trigger", ".va-dropdown-field-trigger:focus-visible ring"],
    ["input", "#va-input-box", ".va-text-field-box:has(:focus) ring"],
    ["textarea", "#va-textarea", ".va-text-area-input:focus ring"],
  ];
  for (const [ctrl, sel, label] of rings) {
    await page.keyboard.press("Tab");
    await settle();
    await check(`${pg.tag} B/${ctrl}`, `${label} is 3px`, sel, "outline-width", px(3), "3px",
      "the focus ring itself is missing — a different bug from the layer defeat");
  }

  // ── A  class-name collisions, both ways ──────────────────────────────────────
  await check(`${pg.tag} A`, "daisyUI .btn keeps its own fill", "#daisy-btn", "background-color", (v) => v !== "rgba(0, 0, 0, 0)", "not transparent",
    "a transparent daisyUI button means our .va-btn reset reached it");
  await check(`${pg.tag} A`, "daisyUI .badge is not our 16px pill", "#daisy-badge", "height", (v) => !px(16)(v), "≠16px",
    "16px is .va-badge's height — ours bled into daisyUI's badge");
  await check(`${pg.tag} A`, "daisyUI .input is not zero-padded like .va-text-field-input", "#daisy-input", "padding-left", (v) => parseFloat(v) > 0, ">0",
    "");
  await check(`${pg.tag} A`, "our .va-btn-micro is 12px, not daisyUI's 48px .btn", "#va-btn-micro", "height", px(12), "12px", "");
  await check(`${pg.tag} A`, "our .va-badge is 16px", "#va-badge", "height", px(16), "16px", "");
  await check(`${pg.tag} A`, "our open .va-modal is visible (the 0.x .modal collision)", "#va-modal", "opacity", eq("1"), "1",
    "daisyUI's .modal is opacity 0 / pointer-events none until its own open modifier");
  await check(`${pg.tag} A`, "our open .va-modal takes pointer events", "#va-modal", "pointer-events", eq("auto"), "auto", "");

  // ── the prefixed utility layer resolves, and the host's does too ─────────────
  await check(`${pg.tag} utils`, "va:type-eyebrow applies uppercase", "#va-util", "text-transform", eq("uppercase"), "uppercase",
    "the methodology uses type-* precisely so nobody writes a bare va:uppercase");
  await check(`${pg.tag} utils`, "host's bare `text-center` still works", "#host-util", "text-align", eq("center"), "center",
    "our prefix must not disturb the host's own utilities");


}

const probes = { styles: await probe("/src/styles.css"), linked: await probe("/bundle.css"), onlyImport: await probe("/src/only-import.css") };

await browser.close();
await server.close();

console.log(`\n${BOLD}shortapp-ui inside Tailwind 3 + daisyUI 4${OFF}\n`);
let dir = "";
for (const r of results) {
  if (r.heading) { console.log(`\n  ${BOLD}${r.label}${OFF}`); dir = ""; continue; }
  if (r.dir !== dir) { dir = r.dir; console.log(`  ${DIM}${dir}${OFF}`); }
  console.log(`  ${r.ok ? GRN + "PASS" : RED + "FAIL"}${OFF}  ${r.label}  ${DIM}${r.prop}=${r.got} (want ${r.want})${OFF}`);
  if (!r.ok && r.why) console.log(`${DIM}        ${r.why}${OFF}`);
}

console.log(`\n  ${DIM}what reached the browser:${OFF}`);
console.log(`  ${DIM}  /src/styles.css      import inside the @tailwind file   → ${probes.styles.layers} native @layer block(s), ${probes.styles.bytes} B${OFF}`);
console.log(`  ${DIM}  /bundle.css          <link>, served raw                 → ${probes.linked.layers} native @layer block(s), ${probes.linked.bytes} B${OFF}`);
console.log(`  ${DIM}  /src/only-import.css lone import through the pipeline  → ${probes.onlyImport.error ? "REFUSED — " + probes.onlyImport.error : probes.onlyImport.layers + " native @layer block(s), " + probes.onlyImport.bytes + " B"}${OFF}`);

// Name the signature when it is present: ring intact, border gone, same control.
for (const pg of PAGES) for (const ctrl of ["button", "input", "textarea"]) {
  const mine = results.filter((r) => r.dir === `${pg.tag} B/${ctrl}`);
  const ring = mine.find((r) => r.prop === "outline-width");
  const border = mine.find((r) => r.prop === "border-top-width");
  if (ring?.ok && border && !border.ok)
    console.log(`\n  ${YEL}layer-defeat signature on ${ctrl} (${pg.tag}):${OFF} focus ring survives (${ring.got}) while the border is gone (${border.got}). Preflight never touches outline; it zeroes border-width on \`*\`. The component rule is inside a cascade layer.`);
}

const real = results.filter((r) => !r.heading);
const failed = real.filter((r) => !r.ok);
console.log(`\n  ${failed.length ? RED : GRN}${real.length - failed.length}/${real.length} passed${OFF}\n`);
process.exit(failed.length ? 1 : 0);
