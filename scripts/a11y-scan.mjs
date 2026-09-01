#!/usr/bin/env node
/**
 * axe-core accessibility scan over Storybook stories.
 *
 *   npm run verify:a11y                    # every story
 *   npm run verify:a11y -- NavigationRail  # one component
 *   npm run verify:a11y -- --url http://localhost:6007
 *
 * Complements the other two checks rather than replacing them:
 *
 *   verify:component  reads the source        — hardcoded values, house patterns
 *   verify:visual     measures computed CSS   — geometry and colour against Figma
 *   verify:a11y       inspects the a11y tree  — names, roles, contrast, ARIA
 *
 * None of the three sees what the others do. This one found two real defects in
 * NavigationRail that the visual harness passed clean: every collapsed nav item
 * was an unnamed link in the tab order (`display:none` on the only text of each
 * link removes it from the accessibility tree), and the group label left a
 * <button> with no accessible name at all.
 *
 * WHY `textContent` IS NOT A SUBSTITUTE. `el.textContent` reads through
 * `display:none`, so a hidden label still looks present. The accessible-name
 * computation ignores it. A probe built on textContent reported names for all 21
 * controls in the collapsed rail while axe reported 16 with none — axe was
 * right. Use this, or Playwright's `ariaSnapshot()`, never textContent.
 *
 * Rules disabled below fault the Storybook iframe rather than the component —
 * same set docs/accessibility-audit.md used, kept identical so runs compare.
 */

import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const argv = process.argv.slice(2);
const urlIdx = argv.indexOf("--url");
const BASE_URL = urlIdx >= 0 ? argv[urlIdx + 1] : "http://localhost:6006";
// Guard the -1 case: with no `--url`, `urlIdx + 1` is 0 and would silently eat
// the first component name, scanning the whole library instead of the one asked
// for. That happened on the first run of this script.
const urlValueIndex = urlIdx >= 0 ? urlIdx + 1 : -1;
const only = argv.filter((a, i) => !a.startsWith("--") && i !== urlValueIndex);

/** Faults of the harness, not the components. */
const DISABLED = [
  "region",
  "page-has-heading-one",
  "landmark-one-main",
  "html-has-lang",
  "document-title",
];

const axeSrc = readFileSync("node_modules/axe-core/axe.min.js", "utf8");

const index = await fetch(`${BASE_URL}/index.json`)
  .then((r) => r.json())
  .catch(() => {
    console.error(
      `\n  Could not reach Storybook at ${BASE_URL}.\n  Start it with \`npm run storybook\` first.\n`,
    );
    process.exit(1);
  });

const stories = Object.values(index.entries)
  .filter((e) => e.type === "story")
  .filter((e) => !only.length || only.some((c) => e.title.endsWith(`/${c}`)));

if (!stories.length) {
  console.error(`\n  No stories matched ${only.join(", ") || "(all)"}.\n`);
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const byComponent = new Map();
let scanned = 0;

for (const story of stories) {
  await page.goto(`${BASE_URL}/iframe.html?viewMode=story&id=${story.id}`, {
    waitUntil: "networkidle",
  });
  // Fonts affect contrast measurement via rendered size, and axe reads
  // computed styles — so wait for them the same way visual-verify does.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.addScriptTag({ content: axeSrc });

  const violations = await page.evaluate(async (disabled) => {
    const res = await window.axe.run(document, {
      rules: Object.fromEntries(disabled.map((d) => [d, { enabled: false }])),
    });
    return res.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.length,
      help: v.help,
      target: v.nodes[0]?.target?.join(" ") ?? "",
      detail: (v.nodes[0]?.failureSummary ?? "").split("\n").pop().trim(),
    }));
  }, DISABLED);

  scanned++;
  const comp = story.title.split("/").pop();
  if (violations.length) {
    if (!byComponent.has(comp)) byComponent.set(comp, []);
    byComponent.get(comp).push({ story: story.name, violations });
  }
}

await browser.close();

const RED = "\x1b[31m";
const YEL = "\x1b[33m";
const GRN = "\x1b[32m";
const DIM = "\x1b[2m";
const OFF = "\x1b[0m";
const colour = (i) => (i === "critical" || i === "serious" ? RED : YEL);

let groups = 0;
let nodes = 0;
for (const [comp, entries] of [...byComponent].sort()) {
  console.log(`\n\x1b[1m${comp}${OFF}`);
  for (const { story, violations } of entries) {
    console.log(`  ${DIM}${story}${OFF}`);
    for (const v of violations) {
      groups++;
      nodes += v.nodes;
      console.log(
        `    ${colour(v.impact)}${v.impact.padEnd(8)}${OFF} ${v.id.padEnd(24)} ×${v.nodes}  ${v.help}`,
      );
      console.log(`      ${DIM}${v.target.slice(0, 90)}${OFF}`);
      if (v.detail) console.log(`      ${DIM}${v.detail.slice(0, 110)}${OFF}`);
    }
  }
}

console.log(`\n${"─".repeat(60)}`);
if (groups === 0) {
  console.log(
    `${GRN}No violations${OFF} across ${scanned} stor${scanned === 1 ? "y" : "ies"}`,
  );
} else {
  console.log(
    `${RED}${groups} violation group(s), ${nodes} node(s)${OFF} across ${scanned} stories, ${byComponent.size} component(s)`,
  );
}
process.exit(groups > 0 ? 1 : 0);
