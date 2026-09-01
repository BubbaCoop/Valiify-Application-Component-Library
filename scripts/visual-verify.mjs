#!/usr/bin/env node
/**
 * Visual verification harness.
 *
 * Renders Storybook stories in headless Chromium and compares COMPUTED styles
 * against values extracted from Figma (scripts/visual-specs.mjs).
 *
 * This is the only check in the repo that can catch a component that compiles
 * cleanly, uses all the right tokens, and still renders at the wrong size. It
 * was written after exactly that happened twice.
 *
 *   npm run verify:visual                 # every component with a spec
 *   npm run verify:visual -- Input        # one component
 *   npm run verify:visual -- Input Button # several
 *   npm run verify:visual -- --url http://localhost:6007
 *
 * Requires Storybook to already be running (npm run storybook).
 *
 * WHY COMPUTED STYLE, NOT PIXEL DIFFING
 * A screenshot diff tells you something moved; it does not tell you the height
 * is 26px when Figma says 25px, and it fails noisily on font rendering. Asserting
 * on the box model and resolved colours gives a specific, actionable failure.
 *
 * THINGS THIS HARNESS KNOWS THAT YOU MIGHT NOT
 * - Chrome rounds the 0.5px `--border-thin` hairline up to a full 1px, so a
 *   hairline adds 2px of height. Sizes must be pinned with `height`, not
 *   `min-height`. See CLAUDE.md.
 * - Colours resolve to oklch(), not rgb(). Compare against a token via
 *   `{ token: '--color-x' }` rather than hardcoding a colour string.
 * - Auto line heights are font-dependent, so content-driven heights can differ
 *   from Figma by ~1px. Give those checks an explicit `tol`.
 */

import { chromium } from "playwright";
import { SPECS } from "./visual-specs.mjs";

const argv = process.argv.slice(2);
const urlFlag = argv.indexOf("--url");
const BASE_URL = urlFlag !== -1 ? argv[urlFlag + 1] : "http://localhost:6006";
// Guard the -1 case: `urlFlag + 1` would otherwise be 0 and swallow the first
// positional argument, silently running every component instead of the one asked for.
const urlValueIndex = urlFlag === -1 ? -1 : urlFlag + 1;
const wanted = argv.filter(
  (a, i) => !a.startsWith("--") && i !== urlValueIndex,
);

const iframe = (id) => `${BASE_URL}/iframe.html?viewMode=story&id=${id}`;

/** Pull one measurement out of the page. */
async function measure(page, sel, nth, get) {
  return page.evaluate(
    ([s, i, g]) => {
      const el = document.querySelectorAll(s)[i];
      if (!el) return { __missing: true };
      if (g === "height" || g === "width") {
        return { value: +el.getBoundingClientRect()[g].toFixed(3) };
      }
      if (g === "visible") {
        const r = el.getBoundingClientRect();
        return {
          value: !el.hasAttribute("hidden") && r.width > 0 && r.height > 0,
        };
      }
      if (g === "text") return { value: el.textContent.trim() };
      if (g.startsWith("::")) {
        const [pseudo, prop] = g.slice(2).split(".");
        return {
          value: getComputedStyle(el, `::${pseudo}`).getPropertyValue(prop),
        };
      }
      return { value: getComputedStyle(el).getPropertyValue(g) };
    },
    [sel, nth ?? 0, get],
  );
}

/**
 * Resolve a token the way the browser will, so we compare like with like.
 *
 * `kind` picks which property the probe is measured through — a colour token
 * has to round-trip through `color` to come back as oklch(), and a font stack
 * through `font-family`. Getting this wrong is silent: the value resolves
 * against the wrong property and you compare a font stack to `1068px`.
 */
async function resolveToken(page, name, kind = "color") {
  const PROP = { color: "color", font: "fontFamily", length: "width" };
  const prop = PROP[kind];
  if (!prop) {
    throw new Error(
      `Unknown token kind "${kind}" for ${name}. Use one of: ${Object.keys(PROP).join(", ")}`,
    );
  }
  return page.evaluate(
    ([n, p]) => {
      const probe = document.createElement("div");
      probe.style[p] = `var(${n})`;
      document.body.appendChild(probe);
      const v = getComputedStyle(probe)[p];
      probe.remove();
      return v;
    },
    [name, prop],
  );
}

/**
 * Transitions make measurement non-deterministic: a colour read while one is
 * running serialises as an interpolated `oklab()` and will never equal the
 * declared `oklch()`. Nothing here asserts transition behaviour, so switch
 * them off for the duration.
 */
const FREEZE = `*, *::before, *::after {
  transition: none !important;
  animation: none !important;
}`;

/**
 * The webfonts every measurement depends on.
 *
 * `document.fonts.check()` needs a CSS font shorthand, and it is weight-aware:
 * `600 13px Inter` can be false while `400 13px Inter` is true, because Google
 * Fonts serves each weight as its own file. The library uses 400/500/600 Inter
 * and 400/500 JetBrains Mono (see src/fonts.css), so all of them are checked —
 * a component asserting a SemiBold width would otherwise measure a faux-bold
 * synthesised from Regular and be silently wrong.
 */
const REQUIRED_FONTS = [
  { family: "Inter", weight: "400" },
  { family: "Inter", weight: "500" },
  { family: "Inter", weight: "600" },
  { family: "JetBrains Mono", weight: "400" },
  { family: "JetBrains Mono", weight: "500" },
];

/**
 * Block until webfonts have actually loaded, and report any that did not.
 *
 * This replaced a fixed `waitForTimeout(300)` commented "sprite fetch + font
 * settle". It was a guess, and on a cold CI runner the guess lost: fonts are
 * fetched from fonts.googleapis.com at render time (src/fonts.css:23, pulled in
 * by .storybook/preview.css), and DNS + TLS + the CSS + the woff2 files from
 * gstatic do not finish in 300ms. Chromium then laid out with a fallback face
 * and every content-driven WIDTH measured narrow.
 *
 * It failed as one line — Pill "short label narrower", 29 against 33.6 ±4 —
 * because that is the only width check whose tolerance is tight enough to
 * notice. Its sibling "long label wider" carries ±25 and absorbed the same
 * drift silently, which is the more dangerous half: a green run that was
 * measuring the wrong font.
 *
 * Heights were unaffected, and that is not luck — the library pins them
 * explicitly (see CLAUDE.md on the 0.5px hairline), so they do not depend on
 * font metrics. Only hug-width components are exposed.
 *
 * The sprite half of the old comment was vestigial: nothing in .storybook
 * injects a sprite, and icon sizing comes from CSS on the <svg> element rather
 * than from the resolved <symbol>.
 */
async function missingFonts(page) {
  return page.evaluate(async (required) => {
    // 1. `load()` first, and that order is load-bearing. `document.fonts.ready`
    //    only awaits loads the page has already STARTED, and a face is fetched
    //    lazily — only when text actually renders in it. The probe story draws
    //    no SemiBold and no mono text, so without this those faces sit at
    //    status "unloaded" on a perfectly healthy machine. `load()` forces the
    //    fetch, turning this into "can the face be fetched from here" rather
    //    than "did this one story happen to need it".
    await Promise.all(
      required.map((f) =>
        document.fonts.load(`${f.weight} 13px "${f.family}"`).catch(() => {}),
      ),
    );
    await document.fonts.ready;

    // 2. Assert on LOADED FACES, not `document.fonts.check()`.
    //
    //    check() is the obvious API here and it is actively wrong for this job:
    //    it answers "can this be rendered", and an unmatched family falls back
    //    to a system face, which always can. Measured both ways — with Google
    //    Fonts fully blocked and ZERO Inter faces loaded,
    //    `check("500 13px Inter")` still returns TRUE. It cannot detect the
    //    total-egress case, which is precisely the case worth detecting.
    //
    //    Counting real FontFace entries does distinguish it: 5 loaded when
    //    fonts resolve, 0 when they are blocked.
    const loaded = [...document.fonts].filter((f) => f.status === "loaded");
    return required
      .filter(
        (want) =>
          !loaded.some(
            (f) =>
              f.family.replace(/["']/g, "") === want.family &&
              f.weight === want.weight,
          ),
      )
      .map((f) => `${f.family} ${f.weight}`);
  }, REQUIRED_FONTS);
}

async function runStory(page, storyId, checks, results, component) {
  await page.goto(iframe(storyId), { waitUntil: "networkidle" });
  await page.addStyleTag({ content: FREEZE });
  // Wait for the fonts themselves, not a guessed interval. Fonts are per
  // document, so this runs on every navigation; after the first story they are
  // HTTP-cached and it resolves immediately.
  await page.evaluate(() => document.fonts.ready);

  for (const check of checks) {
    // `hover: true` parks the pointer on the element, for checks that assert a
    // :hover style — without it a hover rule is unverifiable, which is how the
    // Tabs underline no-op went unnoticed.
    //
    // Every other check explicitly moves the pointer AWAY first. The pointer
    // persists between checks, so a rest-state measurement taken after a hover
    // check silently reports the hovered value.
    if (check.hover) {
      // `hoverSel` hovers a DIFFERENT element from the one measured, for
      // parent-hover-reveals-child patterns. Without it such a rule is
      // unverifiable: NavGroup's chevron is display:none until the group is
      // hovered, so hovering the chevron itself times out waiting for a box
      // that only exists once something else is hovered.
      await page
        .locator(check.hoverSel ?? check.sel)
        .nth(check.hoverNth ?? check.nth ?? 0)
        .hover();
    } else {
      await page.mouse.move(0, 0);
    }

    // optional interactions before measuring (click a trigger, press a key)
    for (const act of check.before ?? []) {
      if (act.click)
        await page
          .locator(act.click)
          .nth(act.nth ?? 0)
          .click();
      if (act.key) await page.keyboard.press(act.key);
      await page.waitForTimeout(act.wait ?? 200);
    }

    // `absent: true` asserts the selector matches NOTHING — for "this variant
    // must not render that part". Checked before measuring, because an absent
    // check carries no `get` for measure() to read.
    if (check.absent) {
      const count = await page.evaluate(
        (sel) => document.querySelectorAll(sel).length,
        check.sel,
      );
      results.push({
        component,
        storyId,
        label: check.label,
        actual: count === 0 ? "absent" : `present (${count})`,
        expected: "absent",
        ok: count === 0,
      });
      continue;
    }

    const raw = await measure(page, check.sel, check.nth, check.get);

    if (raw.__missing) {
      results.push({
        component,
        storyId,
        label: check.label,
        actual: `NO ELEMENT (${check.sel})`,
        expected: check.expect,
        ok: false,
      });
      continue;
    }

    let expected = check.expect;
    if (expected && typeof expected === "object" && expected.token) {
      expected = await resolveToken(
        page,
        expected.token,
        expected.kind ?? "color",
      );
    }

    const actual = raw.value;
    let ok;
    if (typeof expected === "number") {
      ok = Math.abs(actual - expected) <= (check.tol ?? 0.01);
    } else if (check.contains) {
      // `contains: true` — for properties that embed a token inside a larger
      // serialisation, where exact match is impossible: a gradient's colour
      // stops, a shadow's colour, a font stack. Still resolves the token, so
      // the "never compare a literal" rule holds.
      ok = String(actual).includes(String(expected).trim());
    } else {
      ok = String(actual).trim() === String(expected).trim();
    }

    // `not: true` inverts the comparison — for asserting a property is
    // anything BUT a value, e.g. "has a shadow" is `box-shadow` not `none`.
    if (check.not) ok = !ok;

    results.push({
      component,
      storyId,
      label: check.label,
      actual,
      expected: check.not ? `NOT ${expected}` : expected,
      ok,
      tol: check.tol,
    });
  }
}

// ------------------------------------------------------------------ main

const names = Object.keys(SPECS).filter((n) =>
  wanted.length
    ? wanted.some((w) => w.toLowerCase() === n.toLowerCase())
    : true,
);

if (!names.length) {
  // An empty SPECS object is the expected state before the first component is
  // extracted — pass. A filter that matches nothing against a populated set is
  // a caller error — fail.
  if (!Object.keys(SPECS).length) {
    console.log(
      "No visual specs defined yet (scripts/visual-specs.mjs is empty) — nothing to verify.",
    );
    process.exit(0);
  }
  console.error(
    `No specs matched ${JSON.stringify(wanted)}.\nAvailable: ${Object.keys(SPECS).join(", ")}`,
  );
  process.exit(1);
}

// Fail fast and clearly if Storybook is not up.
try {
  const res = await fetch(`${BASE_URL}/index.json`);
  if (!res.ok) throw new Error(String(res.status));
} catch {
  console.error(
    `\nCannot reach Storybook at ${BASE_URL}\n\n  Start it first:  npm run storybook\n  Or point elsewhere:  npm run verify:visual -- --url http://localhost:PORT\n`,
  );
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1100, height: 900 },
  deviceScaleFactor: 2,
});
// Fonts are a precondition, not a check. If Inter did not load, every
// content-driven width in the run is measuring a fallback face — so fail here
// with the actual cause instead of emitting width errors that look like CSS
// regressions and send someone hunting through component files.
//
// Checked once rather than per story: the failure is environmental, so 38
// identical errors would be noise. Storybook is already confirmed reachable
// above, so a failure here is genuinely about fonts.
const probeStory = Object.keys(SPECS[names[0]].stories)[0];
await page.goto(iframe(probeStory), { waitUntil: "networkidle" });
const absent = await missingFonts(page);

if (absent.length) {
  await browser.close();
  console.error(
    `\n  \x1b[31mWebfonts failed to load.\x1b[0m Measurements would be wrong, so nothing ran.\n\n` +
      absent.map((f) => `    missing:  ${f}`).join("\n") +
      `\n\n  These come from fonts.googleapis.com via src/fonts.css, imported by\n` +
      `  .storybook/preview.css. Check egress to fonts.googleapis.com and\n` +
      `  fonts.gstatic.com from this environment, then re-run.\n\n` +
      `  Widths are the visible symptom — heights are pinned in CSS and would\n` +
      `  still pass, so a fallback face fails quietly rather than obviously.\n`,
  );
  // Short message on stderr, and nothing buffered on stdout, so exiting here
  // cannot truncate a report — matching the two preconditions above.
  process.exit(1);
}

const results = [];

for (const name of names) {
  const spec = SPECS[name];
  for (const [storyId, checks] of Object.entries(spec.stories)) {
    // A throw inside runStory used to abort the whole process. Because the
    // report is built in memory and printed only at the end, that meant NO
    // report at all — the first CI failure was a `locator.hover` timeout on
    // `.btn-outline`, and the log carried a stack trace and nothing else.
    //
    // Note `measure()` already degrades gracefully for an absent element (see
    // the __missing branch), but the `hover` step runs before it and throws
    // instead — which is the gap this closes.
    //
    // Record the throw as a failed check and carry on, so one bad story costs
    // that story's remaining checks rather than the other 37 components.
    const before = results.length;
    try {
      await runStory(page, storyId, checks, results, name);
    } catch (err) {
      const message = String(err?.message ?? err)
        .split("\n")[0]
        .trim()
        .slice(0, 120);
      const skipped = checks.length - (results.length - before);
      results.push({
        component: name,
        storyId,
        label: `story threw, ${skipped} check(s) skipped`,
        actual: message,
        expected: `${storyId} to run without throwing`,
        ok: false,
      });
    }
  }
}

await browser.close();

// ---------------------------------------------------------------- report

const pad = (s, n) => String(s).padEnd(n);
let currentComponent = null;
let failed = 0;

for (const r of results) {
  if (r.component !== currentComponent) {
    currentComponent = r.component;
    console.log(
      `\n\x1b[1m${r.component}\x1b[0m  \x1b[2m${SPECS[r.component].figma}\x1b[0m`,
    );
  }
  if (!r.ok) failed++;
  const mark = r.ok ? "\x1b[32mPASS\x1b[0m" : "\x1b[31mFAIL\x1b[0m";
  const tol = r.tol ? ` ±${r.tol}` : "";
  console.log(
    `  ${mark}  ${pad(r.label, 34)} ${pad(r.actual, 30)} expected ${r.expected}${tol}`,
  );
}

const passed = results.length - failed;
console.log(
  `\n${"─".repeat(60)}\n${passed}/${results.length} passed` +
    (failed ? `, \x1b[31m${failed} failed\x1b[0m` : "") +
    `  across ${names.length} component(s)\n`,
);

// Set the code and let Node exit on its own once stdout has drained.
// `process.exit()` here discarded buffered output: Node's stdout is synchronous
// to a TTY or a file but ASYNCHRONOUS to a pipe, and CI is a pipe — so the tail
// of the report, including the FAIL lines and this summary, never reached the
// log. The first CI run stopped at ~670 of ~1015 lines with no summary and no
// searchable "FAIL", which made the failure undiagnosable.
process.exitCode = failed ? 1 : 0;
