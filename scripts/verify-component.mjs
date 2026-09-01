/**
 * Component Verification — static checks.
 *
 *   npm run verify:component Avatar
 *
 * Reads the source: token usage, house-style conventions, and whether the
 * component is wired into the package. Complements `npm run verify:visual`,
 * which renders the component and compares computed styles against Figma.
 * Neither replaces the other — this one cannot see a 1px height error, and the
 * visual harness cannot see a hardcoded hex that happens to match its token.
 *
 * See docs/component-process.md.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

/**
 * Badge -> badge, IconButton -> icon-button.
 *
 * MUST match scripts/new-component.mjs:52 exactly, including the [a-z0-9]
 * class. Split the camelCase boundary BEFORE lowercasing — an earlier version
 * lowercased first, so the regex never matched and every multi-word component
 * resolved to a path that was never written (IconButton -> "iconbutton").
 * The same bug existed in the retired build-component workflow.
 *
 * @param {string} pascal
 * @returns {string}
 */
function kebab(pascal) {
  return pascal.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Blank out comment bodies while preserving line count and column positions,
 * so line numbers in violations stay accurate.
 *
 * Without this, a trailing comment is scanned as code and every component that
 * cites a hex for provenance gets flagged:
 *
 *   @apply bg-surface-card;  /* Surface/Card #fafafb *\/     <- false positive
 *
 * That false positive is why this script went unused: it reported phantom
 * violations on real, correct components.
 *
 * @param {string} css
 * @returns {string} same length and line structure, comments replaced by spaces
 */
function stripComments(css) {
  // Block comments, including multi-line — keep newlines so line numbers hold.
  let out = css.replace(/\/\*[\s\S]*?\*\//g, (m) =>
    m.replace(/[^\n]/g, ' '),
  );
  // Line comments (not valid CSS, but the template and authors use them).
  out = out.replace(/\/\/[^\n]*/g, (m) => ' '.repeat(m.length));
  return out;
}

/**
 * Verify token usage in component CSS
 * @param {string} componentPath - Path to component CSS file
 * @returns {Promise<{violations: number, compliant: boolean, details: Array}>}
 */
export async function verifyTokenUsage(componentPath) {
  const css = await fs.readFile(componentPath, 'utf-8');
  const violations = [];

  // Comments are blanked out first, so a trailing `/* #fafafb */` cannot be
  // mistaken for a hardcoded value.
  const lines = stripComments(css).split('\n');

  // Check for hardcoded colors (hex values, rgb, rgba)
  const hardcodedColorRegex = /(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/g;

  lines.forEach((line, index) => {
    const matches = line.match(hardcodedColorRegex);
    if (matches) {
      violations.push({
        line: index + 1,
        type: 'hardcoded-color',
        value: matches[0],
        message: `Hardcoded color value found. Use token utilities (bg-*, text-*, border-*) or var(--color-*)`
      });
    }
  });

  // Check for hardcoded border radius (px values in border-radius, not in var())
  const hardcodedRadiusRegex = /border-radius:\s*(\d+px)/g;
  lines.forEach((line, index) => {
    const matches = line.match(hardcodedRadiusRegex);
    if (matches && !line.includes('var(')) {
      violations.push({
        line: index + 1,
        type: 'hardcoded-radius',
        value: matches[0],
        message: `Hardcoded border radius. Use rounded-* utilities or var(--radius-*)`
      });
    }
  });

  // Check for magic numbers in font-size (not using text-* utilities)
  const hardcodedFontSizeRegex = /font-size:\s*(\d+px)/g;
  lines.forEach((line, index) => {
    const matches = line.match(hardcodedFontSizeRegex);
    if (matches && !line.includes('var(--text-')) {
      violations.push({
        line: index + 1,
        type: 'hardcoded-typography',
        value: matches[0],
        message: `Hardcoded font size. Use text-* utilities or var(--text-*)`
      });
    }
  });

  return {
    violations: violations.length,
    compliant: violations.length === 0,
    details: violations
  };
}

/**
 * Verify design standards compliance
 * @param {string} componentPath - Path to component CSS file
 * @param {string} componentName - Name of the component
 * @returns {Promise<{compliant: boolean, checks: Array}>}
 */
export async function verifyStandards(componentPath, componentName) {
  const css = await fs.readFile(componentPath, 'utf-8');
  const checks = [];

  // Check 1: CSS is inside @layer components
  const hasLayerComponents = css.includes('@layer components');
  checks.push({
    check: '@layer components wrapper',
    passed: hasLayerComponents,
    message: hasLayerComponents ? '✅ CSS is properly layered' : '❌ CSS should be wrapped in @layer components'
  });

  // Check 2: IF the component is interactive, its state selectors follow the
  // house pattern. Plenty of components are purely presentational — Chip, Icon
  // and Avatar have no states at all — and warning at them trains people to
  // ignore the tool, so absence of states is a pass, not a finding.
  const body = stripComments(css);
  const isInteractive = /:hover|:active|:focus|:disabled/.test(body);

  if (!isInteractive) {
    checks.push({
      check: 'State selector patterns',
      passed: true,
      message: '✅ Presentational component — no state selectors to check'
    });
  } else {
    // A :hover that can fire on a disabled element is the actual mistake. The
    // guard is not always `:not(:disabled)` — Input and Textarea correctly use
    // `:not(:has(:disabled))` because the attribute sits on a child input, and
    // MenuItem adds `:not([aria-disabled="true"])`. Require *an* exclusion on
    // the same selector, not one specific spelling. Components with no disabled
    // concept at all have nothing to guard against.
    const hasDisabledConcept = /:disabled|-disabled|aria-disabled/.test(body);
    const unguarded = body
      .split('\n')
      .filter((l) => l.includes(':hover') && !l.includes(':not('));

    const ok = !hasDisabledConcept || unguarded.length === 0;
    checks.push({
      check: 'State selector patterns',
      passed: ok,
      message: ok
        ? '✅ State selectors follow pattern'
        : `⚠️ :hover can fire on a disabled element — add an exclusion:\n        ${unguarded.map((l) => l.trim()).join('\n        ')}`
    });
  }

  // Check 3: Component is imported in components/index.css
  const indexPath = path.join(rootDir, 'src/components/index.css');
  const indexCss = await fs.readFile(indexPath, 'utf-8');
  const importLine = `@import "./${path.basename(componentPath)}";`;
  const isImported = indexCss.includes(importLine);

  checks.push({
    check: 'Import in components/index.css',
    passed: isImported,
    message: isImported
      ? '✅ Component is imported in index.css'
      : `❌ Component should be imported in src/components/index.css: ${importLine}`
  });

  // Check 4: Import is alphabetically ordered
  if (isImported) {
    const imports = indexCss.match(/@import\s+"\.\/[^"]+";/g) || [];
    const componentImport = importLine;
    const importIndex = imports.indexOf(componentImport);

    // Compare bare component names, NOT whole import strings. `-` (0x2D) sorts
    // before `.` (0x2E), so full-path comparison would demand
    // "./icon-button.css" before "./icon.css" while the scaffolder — which is
    // what actually writes this file — orders by name and puts icon first.
    // Matching new-component.mjs:107 keeps the two from fighting each other.
    const nameOf = (imp) => imp.match(/\.\/(.+)\.css/)?.[1] ?? imp;
    let isAlphabetical = true;
    if (importIndex > 0) {
      isAlphabetical = nameOf(imports[importIndex - 1]) < nameOf(componentImport);
    }
    if (importIndex > -1 && importIndex < imports.length - 1) {
      isAlphabetical =
        isAlphabetical && nameOf(componentImport) < nameOf(imports[importIndex + 1]);
    }

    checks.push({
      check: 'Alphabetical import order',
      passed: isAlphabetical,
      message: isAlphabetical
        ? '✅ Import is alphabetically ordered'
        : '⚠️ Import should be alphabetically ordered in index.css'
    });
  }

  const allPassed = checks.every(c => c.passed);

  return {
    compliant: allPassed,
    checks
  };
}

/**
 * Verify package integration
 * @param {string} componentName - Name of the component (e.g., "Badge")
 * @returns {Promise<{integrated: boolean, checks: Array}>}
 */
export async function verifyPackage(componentName) {
  const checks = [];
  const componentBasename = kebab(componentName);
  const componentPath = path.join(rootDir, 'src/components', `${componentBasename}.css`);

  // Check 1: Component CSS file exists
  try {
    await fs.access(componentPath);
    checks.push({
      check: 'Component CSS exists',
      passed: true,
      message: `✅ ${componentPath} exists`
    });
  } catch {
    checks.push({
      check: 'Component CSS exists',
      passed: false,
      message: `❌ ${componentPath} does not exist`
    });

    // Early return if component doesn't exist
    return {
      integrated: false,
      checks
    };
  }

  // Check 2: Component imported in src/components/index.css
  const indexPath = path.join(rootDir, 'src/components/index.css');
  try {
    const indexCss = await fs.readFile(indexPath, 'utf-8');
    const isImported = indexCss.includes(`@import "./${componentBasename}.css";`);
    checks.push({
      check: 'Imported in components/index.css',
      passed: isImported,
      message: isImported
        ? '✅ Component is imported'
        : '❌ Component not imported in index.css'
    });
  } catch (error) {
    checks.push({
      check: 'Imported in components/index.css',
      passed: false,
      message: `❌ Could not read index.css: ${error.message}`
    });
  }

  // Check 3: TypeScript type definition exists
  const typesPath = path.join(rootDir, 'types/components.d.ts');
  try {
    const typesDef = await fs.readFile(typesPath, 'utf-8');
    const hasTypeDef = typesDef.includes(`${componentName}Class`);
    checks.push({
      check: 'TypeScript type definition exists',
      passed: hasTypeDef,
      message: hasTypeDef
        ? `✅ ${componentName}Class type defined`
        : `❌ ${componentName}Class type not found in types/components.d.ts`
    });
  } catch (error) {
    checks.push({
      check: 'TypeScript type definition exists',
      passed: false,
      message: `❌ Could not read types/components.d.ts: ${error.message}`
    });
  }

  // Check 4: Storybook story exists
  const storyPath = path.join(rootDir, 'stories/components', `${componentName}.stories.ts`);
  try {
    await fs.access(storyPath);
    checks.push({
      check: 'Storybook story exists',
      passed: true,
      message: `✅ ${storyPath} exists`
    });
  } catch {
    checks.push({
      check: 'Storybook story exists',
      passed: false,
      message: `❌ ${storyPath} does not exist`
    });
  }

  // Check 5: Component appears in dist/index.css (requires build)
  const distPath = path.join(rootDir, 'dist/index.css');
  try {
    const distCss = await fs.readFile(distPath, 'utf-8');

    // Read the class names the component actually defines rather than guessing
    // them from its name — the two are often different (Button defines .btn,
    // not .button). Any one of them appearing in dist proves it compiled.
    const ownCss = await fs.readFile(componentPath, 'utf-8');
    const declared = [
      ...new Set(
        [...stripComments(ownCss).matchAll(/^\s*\.([a-z][a-z0-9-]*)/gm)].map(
          (m) => m[1],
        ),
      ),
    ];
    const found = declared.filter((cls) =>
      new RegExp(`\\.${cls}[^a-z0-9-]`).test(distCss),
    );
    const isInDist = found.length > 0;

    checks.push({
      check: 'Component in dist/index.css',
      passed: isInDist,
      message: isInDist
        ? `✅ Compiled to dist (${found.length}/${declared.length} classes)`
        : `⚠️ None of its classes are in dist (run npm run build). Declared: ${declared.join(', ') || 'none found'}`
    });
  } catch {
    checks.push({
      check: 'Component in dist/index.css',
      passed: false,
      message: '⚠️ dist/index.css not found (run npm run build)'
    });
  }

  const allPassed = checks.every(c => c.passed);

  return {
    integrated: allPassed,
    checks
  };
}


// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const OFF = '\x1b[0m';

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== '--');

  if (args.length === 0) {
    console.error(
      `\n  Usage: npm run verify:component <Name>    (e.g. npm run verify:component Avatar)\n`,
    );
    process.exit(1);
  }
  if (args.length > 1) {
    console.error(
      `\n  error  Checks one component at a time — got ${args.length} names.\n` +
        args.map((a) => `           npm run verify:component ${a}`).join('\n') +
        '\n',
    );
    process.exit(1);
  }

  const name = args[0][0].toUpperCase() + args[0].slice(1);
  const basename = kebab(name);
  const cssPath = path.join(rootDir, `src/components/${basename}.css`);

  try {
    await fs.access(cssPath);
  } catch {
    console.error(
      `\n  error  src/components/${basename}.css does not exist.\n` +
        `         Scaffold it first: npm run new:component ${name}\n`,
    );
    process.exit(1);
  }

  const [tokens, standards, pkg] = await Promise.all([
    verifyTokenUsage(cssPath),
    verifyStandards(cssPath, name),
    verifyPackage(name),
  ]);

  console.log(`\n${BOLD}${name}${OFF}  ${DIM}src/components/${basename}.css${OFF}`);

  // Token usage
  const tokMark = tokens.compliant ? `${GREEN}PASS${OFF}` : `${RED}FAIL${OFF}`;
  console.log(`\n  ${tokMark}  Token usage${tokens.compliant ? '' : ` — ${tokens.violations} violation(s)`}`);
  for (const v of tokens.details) {
    console.log(`        ${DIM}${basename}.css:${v.line}${OFF}  ${v.type}  ${v.value}`);
    console.log(`        ${DIM}${v.message}${OFF}`);
  }

  // Standards + package share a { checks: [{check, passed, message}] } shape
  for (const [label, result] of [
    ['Standards', standards],
    ['Package integration', pkg],
  ]) {
    const ok = result.compliant ?? result.integrated;
    console.log(`\n  ${ok ? `${GREEN}PASS${OFF}` : `${RED}FAIL${OFF}`}  ${label}`);
    for (const c of result.checks) {
      if (!c.passed) console.log(`        ${c.message}`);
    }
  }

  const failed =
    !tokens.compliant || !(standards.compliant ?? true) || !(pkg.integrated ?? true);

  console.log(`\n${'─'.repeat(60)}`);
  if (failed) {
    console.log(`${RED}Static checks failed${OFF}\n`);
  } else {
    console.log(`All static checks passed. ${DIM}Now run: npm run verify:visual -- ${name}${OFF}\n`);
  }
  process.exit(failed ? 1 : 0);
}

// Only run the CLI when invoked directly, so the exports stay importable.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error('\n  error ', err.message, '\n');
    process.exit(1);
  });
}

export default {
  verifyTokenUsage,
  verifyStandards,
  verifyPackage
};
