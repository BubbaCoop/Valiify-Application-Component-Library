#!/usr/bin/env node
/**
 * Component health audit — the mechanical half.
 *
 *   npm run audit
 *
 * Emits coverage, interaction wiring and divergence markers straight from the
 * repo, so re-running the audit costs nothing. The judgement half — whether a
 * component still matches Figma — lives in docs/component-audit.md and needs a
 * drift sweep to refresh (see docs/process-cost.md for why that is cheap).
 *
 * Coverage is checks-per-Figma-variant. It is a proxy, not a score: a high
 * ratio on a simple component is easy, and a low one on a complex component is
 * where the risk actually is. Read it as "how much of this did we bother to
 * pin down", not "how correct is it".
 */

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SPECS } from './visual-specs.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CSS = join(ROOT, 'src/components');
const STORIES = join(ROOT, 'stories/components');

const BOLD = '\x1b[1m', DIM = '\x1b[2m', RED = '\x1b[31m';
const YEL = '\x1b[33m', GRN = '\x1b[32m', OFF = '\x1b[0m';

/** Badge -> badge, IconButton -> icon-button. Matches new-component.mjs:52. */
const kebab = (p) => p.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const read = (p) => {
  try { return readFileSync(p, 'utf8'); } catch { return ''; }
};

const rows = [];
for (const [name, spec] of Object.entries(SPECS)) {
  const checks = Object.values(spec.stories).reduce((a, c) => a + c.length, 0);
  const storyFile = read(join(STORIES, `${name}.stories.ts`));
  const css = read(join(CSS, `${kebab(name)}.css`));

  rows.push({
    name,
    variants: spec.variants ?? null,
    checks,
    ratio: spec.variants ? checks / spec.variants : null,
    stories: (storyFile.match(/^export const/gm) ?? []).length,
    interactive: storyFile.includes('addEventListener'),
    // Divergences we deliberately recorded in the CSS header.
    invented: /not (in|from) figma|invented|library extension|an addition, not/i.test(css),
    kept: /reproduced rather than|rather than corrected|not a mistake to fix|faithful here/i.test(css),
    openQ: /raised with the designer|needs a designer|confirm with the designer|designer decision/i.test(css),
  });
}

// Components with CSS but no spec entry are the real blind spot.
const specced = new Set(Object.keys(SPECS).map((n) => kebab(n)));
const unspecced = readdirSync(CSS)
  .filter((f) => f.endsWith('.css') && !['index.css', '_template.css'].includes(f))
  .map((f) => f.replace(/\.css$/, ''))
  .filter((b) => !specced.has(b));

rows.sort((a, b) => (a.ratio ?? 99) - (b.ratio ?? 99));

console.log(`\n${BOLD}Coverage${OFF}  ${DIM}checks per Figma variant — lowest first${OFF}\n`);
console.log(`  ${'component'.padEnd(17)} ${'variants'.padStart(8)} ${'checks'.padStart(6)} ${'ratio'.padStart(6)}  stories  flags`);
console.log(`  ${'─'.repeat(66)}`);

for (const r of rows) {
  const ratio = r.ratio === null ? '  —  ' : r.ratio.toFixed(2).padStart(5);
  const colour = r.ratio === null ? DIM : r.ratio < 0.6 ? RED : r.ratio < 1.2 ? YEL : GRN;
  const flags = [
    r.interactive ? `${GRN}interactive${OFF}` : `${DIM}static${OFF}`,
    r.invented ? `${YEL}invented-api${OFF}` : '',
    r.kept ? `${YEL}kept-oddity${OFF}` : '',
    r.openQ ? `${RED}open-question${OFF}` : '',
  ].filter(Boolean).join(' ');
  console.log(
    `  ${r.name.padEnd(17)} ${String(r.variants ?? '?').padStart(8)} ${String(r.checks).padStart(6)} ${colour}${ratio}${OFF}  ${String(r.stories).padStart(7)}  ${flags}`,
  );
}

const totalChecks = rows.reduce((a, r) => a + r.checks, 0);
const interactive = rows.filter((r) => r.interactive).length;

console.log(`\n  ${totalChecks} checks across ${rows.length} components`);
console.log(`  ${interactive}/${rows.length} have any interaction wiring in Storybook`);

if (unspecced.length) {
  console.log(`\n${RED}  Unverified — CSS ships with no visual spec:${OFF}`);
  for (const b of unspecced) console.log(`    src/components/${b}.css`);
}

console.log(
  `\n${DIM}  Ratio is a proxy for effort spent, not correctness. Drift against Figma
  needs a metadata sweep — see docs/component-audit.md.${OFF}\n`,
);
