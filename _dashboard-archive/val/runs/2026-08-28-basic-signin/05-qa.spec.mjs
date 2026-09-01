/**
 * Val stage 5 — behavioral QA — run 2026-08-28-basic-signin.
 *
 * Plain Node script driving the repo's `playwright` package directly
 * (NOT @playwright/test — the repo's playwright.config.js would try to
 * boot Storybook). Run from the repo root:
 *
 *   node val/runs/2026-08-28-basic-signin/05-qa.spec.mjs
 *
 * behaviors.json is a source-limited EMPTY set (screenshot input), so the
 * behavioral tests come from 03-requirements.md §2 (4 flows). Standing
 * checks per the val-qa brief follow. Sticky-header / progress-track /
 * expand-collapse checks are n/a on this page (none exist) and are
 * recorded as such rather than failed.
 */

import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

const RUN_DIR = "/Users/nicholascooper/Desktop/valiify-dashboard-ui/val/runs/2026-08-28-basic-signin";
const PAGE_PATH = path.join(RUN_DIR, "04-build", "index.html");
const PAGE_URL = pathToFileURL(PAGE_PATH).href;

const results = []; // { id, name, status: 'pass'|'fail'|'n/a', selector, expected, actual }
const consoleErrors = []; // collected across ALL tests
const requestFailures = []; // notes only
const unexpectedDialogs = [];

function record(id, name, status, selector, expected, actual) {
  results.push({ id, name, status, selector, expected, actual });
  const mark = status === "pass" ? "PASS" : status === "fail" ? "FAIL" : "N/A ";
  console.log(`[${mark}] ${id} ${name}${status !== "pass" ? ` — ${actual}` : ""}`);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await context.newPage();

page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message}`));
page.on("requestfailed", (req) =>
  requestFailures.push(`${req.url()} — ${req.failure()?.errorText}`),
);

// Persistent dialog handler: accepts everything, records the last dialog.
// Flow tests set `expectingDialog` before triggering; anything arriving
// outside a flow test is an unexpected dialog and a finding.
let expectingDialog = false;
let lastDialog = null;
page.on("dialog", async (dialog) => {
  lastDialog = { type: dialog.type(), message: dialog.message() };
  if (!expectingDialog) unexpectedDialogs.push(lastDialog);
  try {
    await dialog.accept();
  } catch {
    /* already handled */
  }
});

async function triggerAndCaptureDialog(selector) {
  lastDialog = null;
  expectingDialog = true;
  const urlBefore = page.url();
  await page.click(selector);
  // alert() is synchronous; poll briefly for the handler to have fired.
  const deadline = Date.now() + 3000;
  while (!lastDialog && Date.now() < deadline) {
    await page.waitForTimeout(50);
  }
  expectingDialog = false;
  await page.waitForTimeout(100);
  return { dialog: lastDialog, urlBefore, urlAfter: page.url() };
}

async function freshLoad(viewport) {
  if (viewport) await page.setViewportSize(viewport);
  await page.goto(PAGE_URL, { waitUntil: "load" });
  await page.waitForTimeout(200); // fonts + first paint settle
}

const SETTLE = 450; // ms — transition-colors settle (per CLAUDE.md: mid-transition reads blend)

// Style signature broad enough to catch any authored hover delta.
async function styleSignature(selector) {
  return page.$eval(selector, (el) => {
    const s = getComputedStyle(el);
    return [
      s.backgroundColor,
      s.borderTopColor,
      s.color,
      s.textDecorationLine,
      s.boxShadow,
      s.outlineStyle,
      s.backgroundImage,
      s.filter,
    ].join(" | ");
  });
}

// ---------------------------------------------------------------------------
// Part 1 — behavioral flows (03-requirements.md §2; behaviors.json is empty)
// ---------------------------------------------------------------------------

await freshLoad({ width: 1280, height: 800 });

// Flow 0 (state precondition, §3): default state as specified.
{
  const emailValue = await page.$eval("#email", (el) => el.value);
  const pwValue = await page.$eval("#password", (el) => el.value);
  const pwPlaceholder = await page.$eval("#password", (el) => el.placeholder);
  const remembered = await page.$eval("#remember", (el) => el.checked);
  const ok =
    emailValue === "user@valiify.com" &&
    pwValue === "" &&
    pwPlaceholder === "Enter your password" &&
    remembered === false;
  record(
    "F0",
    "Default state: email prefilled, password empty w/ placeholder, checkbox unchecked",
    ok ? "pass" : "fail",
    "#email / #password / #remember",
    'email="user@valiify.com", password="" + placeholder "Enter your password", checkbox unchecked',
    `email="${emailValue}", password="${pwValue}", placeholder="${pwPlaceholder}", checked=${remembered}`,
  );
}

// Flow 1 — Sign In → confirmation alert "Sign in clicked", no navigation.
{
  const { dialog, urlBefore, urlAfter } = await triggerAndCaptureDialog("#sign-in");
  const ok =
    dialog?.type === "alert" && dialog?.message === "Sign in clicked" && urlBefore === urlAfter;
  record(
    "F1",
    'Sign In click → alert "Sign in clicked", no navigation',
    ok ? "pass" : "fail",
    "#sign-in",
    'alert dialog with message "Sign in clicked"; URL unchanged',
    dialog
      ? `${dialog.type}: "${dialog.message}"; URL ${urlBefore === urlAfter ? "unchanged" : `changed to ${urlAfter}`}`
      : "no dialog appeared within 3s",
  );
}

// Flow 2 — Cancel → confirmation alert "Cancel clicked", no navigation.
{
  const { dialog, urlBefore, urlAfter } = await triggerAndCaptureDialog("#cancel");
  const ok =
    dialog?.type === "alert" && dialog?.message === "Cancel clicked" && urlBefore === urlAfter;
  record(
    "F2",
    'Cancel click → alert "Cancel clicked", no navigation',
    ok ? "pass" : "fail",
    "#cancel",
    'alert dialog with message "Cancel clicked"; URL unchanged',
    dialog
      ? `${dialog.type}: "${dialog.message}"; URL ${urlBefore === urlAfter ? "unchanged" : `changed to ${urlAfter}`}`
      : "no dialog appeared within 3s",
  );
}

// Flow 3 — Forgot password? is a real link with an href. Destination page is
// explicitly out of scope (§2 row 3), so only the anchor itself is asserted.
{
  const info = await page.$eval("#forgot", (el) => ({
    tag: el.tagName,
    hasHref: el.hasAttribute("href"),
    href: el.getAttribute("href"),
    text: el.textContent.trim(),
  }));
  const ok = info.tag === "A" && info.hasHref && info.text === "Forgot password?";
  record(
    "F3",
    "Forgot password? → anchor with href (destination out of scope)",
    ok ? "pass" : "fail",
    "#forgot",
    '<a> element with an href attribute, label "Forgot password?"',
    `<${info.tag.toLowerCase()} href="${info.href}"> "${info.text}"`,
  );
  // Clicking it must not throw or show a dialog (it is in-page inert).
  lastDialog = null;
  await page.click("#forgot");
  await page.waitForTimeout(200);
  record(
    "F3b",
    "Forgot password? click stays in-page (no dialog, no document change)",
    lastDialog === null && page.url().startsWith(PAGE_URL) ? "pass" : "fail",
    "#forgot",
    "no dialog; same document",
    lastDialog ? `unexpected dialog: "${lastDialog.message}"` : `URL now ${page.url()}`,
  );
}

// Flow 4 — View Demo Info → informational alert (copy unpinned by the
// requirements; requester answer 4 says "demo info" — assert an alert with a
// non-empty message and record the actual copy).
{
  const { dialog, urlBefore, urlAfter } = await triggerAndCaptureDialog("#view-demo");
  const ok = dialog?.type === "alert" && dialog?.message?.length > 0 && urlBefore === urlAfter;
  record(
    "F4",
    "View Demo Info click → informational alert, no navigation",
    ok ? "pass" : "fail",
    "#view-demo",
    "alert dialog with non-empty informational message; URL unchanged",
    dialog
      ? `${dialog.type}: "${dialog.message}"; URL ${urlBefore === urlAfter ? "unchanged" : "changed"}`
      : "no dialog appeared within 3s",
  );
}

// ---------------------------------------------------------------------------
// Part 2 — standing checks
// ---------------------------------------------------------------------------

// S1 — hover state changes on every interactive element.
// Library components (buttons, link) carry authored hover ramps → must change.
// The chrome-less inputs and the native checkbox were requester-mandated
// as-drawn (answers 2–3) and the source specifies no hover for them
// (03-requirements §3) → recorded, n/a if unchanged.
await freshLoad({ width: 1280, height: 800 });
{
  const hoverTargets = [
    { sel: "#sign-in", name: "Sign In (.btn-primary)", mustChange: true },
    { sel: "#cancel", name: "Cancel (.btn-outline)", mustChange: true },
    { sel: "#forgot", name: "Forgot password? (.link)", mustChange: true },
    { sel: "#view-demo", name: "View Demo Info (.btn-outline.btn-sm)", mustChange: true },
    { sel: "#email", name: "Email input (chrome-less .input)", mustChange: false },
    { sel: "#password", name: "Password input (chrome-less .input)", mustChange: false },
    { sel: "#remember", name: "Remember me (native checkbox)", mustChange: false },
  ];
  let i = 0;
  for (const t of hoverTargets) {
    i += 1;
    await page.mouse.move(2, 2);
    await page.waitForTimeout(250);
    const before = await styleSignature(t.sel);
    await page.hover(t.sel);
    await page.waitForTimeout(SETTLE);
    const after = await styleSignature(t.sel);
    const changed = before !== after;
    const status = changed ? "pass" : t.mustChange ? "fail" : "n/a";
    record(
      `S1.${i}`,
      `Hover changes state — ${t.name}`,
      status,
      t.sel,
      t.mustChange
        ? "computed style delta on hover (authored library hover ramp)"
        : "no authored hover in source (requester answers 2–3); recorded for completeness",
      changed ? "style changed on hover" : "no computed-style change on hover",
    );
  }
  await page.mouse.move(2, 2);
}

// S2 — expand/collapse cycles both directions: none exist on this page.
record(
  "S2",
  "Expand/collapse cycles both directions",
  "n/a",
  "—",
  "n/a — the page has no expandable/collapsible elements",
  "no expand/collapse controls present",
);

// S3 — checkbox toggles both directions (element click and label click).
{
  const seq = [];
  seq.push(await page.$eval("#remember", (el) => el.checked)); // initial: false
  await page.click("#remember");
  seq.push(await page.$eval("#remember", (el) => el.checked)); // true
  await page.click("#remember");
  seq.push(await page.$eval("#remember", (el) => el.checked)); // false
  await page.click(".signin-remember-label");
  seq.push(await page.$eval("#remember", (el) => el.checked)); // true (label assoc)
  await page.click(".signin-remember-label");
  seq.push(await page.$eval("#remember", (el) => el.checked)); // false
  const ok = JSON.stringify(seq) === JSON.stringify([false, true, false, true, false]);
  record(
    "S3",
    "Remember me toggles both directions (incl. via label)",
    ok ? "pass" : "fail",
    "#remember / .signin-remember-label",
    "unchecked → checked → unchecked via box; checked → unchecked via label",
    `sequence: [${seq.join(", ")}]`,
  );
}

// S4 — scroll: sticky header pinned / progress track updates.
// Neither exists; additionally the page has no vertical overflow at 1280x800.
{
  const geom = await page.evaluate(() => ({
    scrollH: document.documentElement.scrollHeight,
    innerH: window.innerHeight,
    sticky: !!document.querySelector("header, [class*='sticky'], [class*='progress']"),
  }));
  record(
    "S4",
    "Scroll: sticky header pinned / progress track updates",
    "n/a",
    "—",
    "n/a — no sticky header and no progress track on this page",
    `no such elements (probe: ${geom.sticky}); page scrollHeight ${geom.scrollH} vs viewport ${geom.innerH} (no overflow to scroll)`,
  );
}

// S4b — the one scroll-adjacent behavior that DOES exist: View Demo Info is
// viewport-fixed (writeup req 6). Verify position:fixed + bottom-right insets.
{
  const fixed = await page.$eval("#view-demo", (el) => getComputedStyle(el).position);
  const bb = await page.locator("#view-demo").boundingBox();
  const vp = page.viewportSize();
  const rightInset = vp.width - (bb.x + bb.width);
  const bottomInset = vp.height - (bb.y + bb.height);
  const ok = fixed === "fixed" && Math.abs(rightInset - 20) <= 1 && Math.abs(bottomInset - 20) <= 1;
  record(
    "S4b",
    "View Demo Info pinned to viewport bottom-right (position:fixed, ~20px insets)",
    ok ? "pass" : "fail",
    "#view-demo",
    "position:fixed; right/bottom insets ≈ 20px",
    `position:${fixed}; right inset ${rightInset.toFixed(1)}px, bottom inset ${bottomInset.toFixed(1)}px`,
  );
}

// S5 — resize at 1440 / 1280 / 1024: no horizontal overflow, card fully in
// viewport, actions row unbroken (Sign In + Cancel on one line), fixed button
// stays pinned.
{
  const viewports = [
    { width: 1440, height: 900 },
    { width: 1280, height: 800 },
    { width: 1024, height: 768 },
  ];
  let i = 0;
  for (const vp of viewports) {
    i += 1;
    await freshLoad(vp);
    const overflow = await page.evaluate(() => ({
      docScrollW: document.documentElement.scrollWidth,
      docClientW: document.documentElement.clientWidth,
      bodyScrollW: document.body.scrollWidth,
    }));
    const card = await page.locator(".signin-card").boundingBox();
    const signIn = await page.locator("#sign-in").boundingBox();
    const cancel = await page.locator("#cancel").boundingBox();
    const demo = await page.locator("#view-demo").boundingBox();
    const noHOverflow =
      overflow.docScrollW <= overflow.docClientW && overflow.bodyScrollW <= vp.width;
    const cardIn = card.x >= 0 && card.x + card.width <= vp.width;
    const sameRow =
      Math.abs(signIn.y + signIn.height / 2 - (cancel.y + cancel.height / 2)) <= 2;
    const demoPinned =
      Math.abs(vp.width - (demo.x + demo.width) - 20) <= 1 &&
      Math.abs(vp.height - (demo.y + demo.height) - 20) <= 1;
    const ok = noHOverflow && cardIn && sameRow && demoPinned;
    record(
      `S5.${i}`,
      `Resize ${vp.width}x${vp.height}: no horizontal overflow, layout intact`,
      ok ? "pass" : "fail",
      "html / .signin-card / .signin-actions / #view-demo",
      "scrollWidth <= clientWidth; card within viewport; Sign In & Cancel on one row; demo button pinned 20px from corner",
      `overflow doc ${overflow.docScrollW}/${overflow.docClientW}, body ${overflow.bodyScrollW}/${vp.width}; card x ${card.x.toFixed(0)}..${(card.x + card.width).toFixed(0)}; buttons Δy ${Math.abs(signIn.y - cancel.y).toFixed(1)}px; demo insets r=${(vp.width - demo.x - demo.width).toFixed(1)} b=${(vp.height - demo.y - demo.height).toFixed(1)}`,
    );
  }
}

// S6 — keyboard: Tab reaches every interactive element with a visible focus
// state. Visible = outline drawn (style not 'none' with width > 0, or the
// UA 'auto' ring) or a box-shadow delta from rest.
{
  await freshLoad({ width: 1280, height: 800 });
  const expectedOrder = ["email", "password", "remember", "sign-in", "cancel", "forgot", "view-demo"];
  // Rest box-shadows for delta comparison.
  const restShadows = {};
  for (const id of expectedOrder) {
    restShadows[id] = await page.$eval(`#${id}`, (el) => getComputedStyle(el).boxShadow);
  }
  const visited = []; // { id, visible, detail }
  await page.evaluate(() => document.body.focus());
  for (let step = 0; step < 12; step += 1) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(SETTLE); // transition-colors settle before reading
    const active = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      return {
        id: el.id || el.tagName,
        outlineStyle: s.outlineStyle,
        outlineWidth: s.outlineWidth,
        outlineColor: s.outlineColor,
        boxShadow: s.boxShadow,
      };
    });
    if (!active) continue;
    if (visited.some((v) => v.id === active.id)) break; // wrapped around
    const outlineVisible =
      (active.outlineStyle !== "none" && parseFloat(active.outlineWidth) > 0) ||
      active.outlineStyle === "auto";
    const shadowDelta =
      restShadows[active.id] !== undefined && active.boxShadow !== restShadows[active.id];
    visited.push({
      id: active.id,
      visible: outlineVisible || shadowDelta,
      detail: `outline: ${active.outlineStyle} ${active.outlineWidth} ${active.outlineColor}; box-shadow: ${active.boxShadow === "none" ? "none" : "set"}${shadowDelta ? " (delta from rest)" : ""}`,
    });
    if (visited.length >= expectedOrder.length) break;
  }
  let i = 0;
  for (const id of expectedOrder) {
    i += 1;
    const v = visited.find((x) => x.id === id);
    const reached = !!v;
    const ok = reached && v.visible;
    record(
      `S6.${i}`,
      `Tab reaches #${id} with visible focus`,
      ok ? "pass" : "fail",
      `#${id}`,
      "element receives keyboard focus AND shows a visible focus indicator",
      !reached
        ? `never focused (tab order visited: ${visited.map((x) => x.id).join(" → ") || "nothing"})`
        : v.visible
          ? `focused; ${v.detail}`
          : `focused but NO visible indicator — ${v.detail}`,
    );
  }
  record(
    "S6.8",
    "Tab order follows document order",
    JSON.stringify(visited.map((v) => v.id)) === JSON.stringify(expectedOrder) ? "pass" : "fail",
    "document",
    expectedOrder.join(" → "),
    visited.map((v) => v.id).join(" → "),
  );
}

// S7 — zero console errors across all tests (incl. unexpected dialogs).
{
  const ok = consoleErrors.length === 0 && unexpectedDialogs.length === 0;
  record(
    "S7",
    "Zero console errors across all tests",
    ok ? "pass" : "fail",
    "page console",
    "0 console errors, 0 page errors, 0 unexpected dialogs",
    ok
      ? "0 errors"
      : `${consoleErrors.length} console error(s): ${consoleErrors.join(" ;; ")}${unexpectedDialogs.length ? `; unexpected dialogs: ${unexpectedDialogs.map((d) => d.message).join(", ")}` : ""}`,
  );
}

await browser.close();

// ---------------------------------------------------------------------------
// Emit machine-readable results for the report writer.
// ---------------------------------------------------------------------------
const summary = {
  total: results.length,
  pass: results.filter((r) => r.status === "pass").length,
  fail: results.filter((r) => r.status === "fail").length,
  na: results.filter((r) => r.status === "n/a").length,
  requestFailures,
};
fs.writeFileSync(
  path.join(RUN_DIR, "05-qa-results.json"),
  JSON.stringify({ summary, results }, null, 2),
);
console.log(
  `\nDONE — ${summary.total} checks: ${summary.pass} pass, ${summary.fail} fail, ${summary.na} n/a`,
);
if (requestFailures.length) console.log(`request failures (notes): ${requestFailures.join(" ;; ")}`);
process.exit(summary.fail > 0 ? 1 : 0);
