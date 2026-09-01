#!/usr/bin/env node
/**
 * Component scaffold generator.
 *
 *   npm run new:component Badge
 *
 * Creates the CSS file from _template.css, registers its @import, creates a
 * Storybook story, and adds class-name types. Populating the CSS from Figma is
 * the only step left by hand.
 *
 * Takes EXACTLY ONE name. Extra arguments are rejected rather than ignored —
 * they used to be silently dropped, so `new:component Badge Tooltip` scaffolded
 * only Badge and still reported success.
 *
 * Deliberately not batched: the scaffold is the cheap part, and the new
 * component is @import-ed into index.css immediately, so an unpopulated one
 * ships template styles in dist/index.css. Absent beats half-built.
 *
 * Idempotent: refuses to overwrite an existing component.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const TEMPLATE = join(ROOT, "src/components/_template.css");
const COMPONENT_INDEX = join(ROOT, "src/components/index.css");
const TYPES = join(ROOT, "types/components.d.ts");

/** Marker in types/components.d.ts that generated types are inserted above. */
const TYPES_ANCHOR = "// Union of all component classes";

const die = (msg) => {
  console.error(`\n  error  ${msg}\n`);
  process.exit(1);
};

// --- Parse and validate the name --------------------------------------------

// npm consumes a literal `--`, but filter it defensively so a valid
// `npm run new:component -- Badge` is never mistaken for two arguments.
const args = process.argv.slice(2).filter((a) => a !== "--");

if (args.length === 0) {
  die(
    "Usage: npm run new:component <Name>    (e.g. npm run new:component Badge)",
  );
}

// Rejected before anything is written, so a bad invocation cannot leave a
// partially scaffolded component behind.
if (args.length > 1) {
  die(
    `This command scaffolds one component at a time — got ${args.length} names.\n` +
      `         Run it once per component:\n` +
      args.map((a) => `           npm run new:component ${a}`).join("\n"),
  );
}

const input = args[0];

if (!/^[A-Za-z][A-Za-z0-9]*$/.test(input)) {
  die(
    `"${input}" is not a valid component name.\n` +
      "         Use a single alphanumeric word, e.g. Badge, IconButton, DataRow.",
  );
}

/** Badge -> Badge, iconButton -> IconButton */
const pascal = input[0].toUpperCase() + input.slice(1);
/** IconButton -> icon-button */
const kebab = pascal.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const cssPath = join(ROOT, `src/components/${kebab}.css`);
const storyPath = join(ROOT, `stories/components/${pascal}.stories.ts`);

// --- Guard against clobbering ------------------------------------------------

if (existsSync(cssPath)) {
  die(
    `src/components/${kebab}.css already exists. Delete it first to regenerate.`,
  );
}
if (existsSync(storyPath)) {
  die(`stories/components/${pascal}.stories.ts already exists.`);
}
if (!existsSync(TEMPLATE)) {
  die("src/components/_template.css is missing — cannot scaffold.");
}

const changes = [];

// --- 1. Component CSS from the template -------------------------------------

const css = readFileSync(TEMPLATE, "utf8")
  .replaceAll("__NAME__", pascal)
  .replaceAll("__CLASS__", kebab);

writeFileSync(cssPath, css);
changes.push(["created", `src/components/${kebab}.css`, "from _template.css"]);

// --- 2. Register the @import, keeping the list alphabetical ------------------

const indexSrc = readFileSync(COMPONENT_INDEX, "utf8");
// Double quotes to match Prettier's CSS output, so `npm run format` is a no-op
// here. Matching stays quote-agnostic since the file may not be formatted yet.
const importLine = `@import "./${kebab}.css";`;
const importRe = /^@import\s+['"]\.\/(.+)\.css['"];/;

if (
  importRe.test(indexSrc) &&
  new RegExp(`['"]\\./${kebab}\\.css['"]`).test(indexSrc)
) {
  changes.push(["skipped", "src/components/index.css", "already imported"]);
} else {
  const lines = indexSrc.split("\n");
  // Existing component imports, so the new one can slot in alphabetically.
  const imports = lines
    .map((line, i) => ({ name: line.trim().match(importRe)?.[1], i }))
    .filter(({ name }) => name);

  let insertAt;
  if (imports.length === 0) {
    insertAt = lines.length;
  } else {
    // Compare component names, not whole lines — quote characters would skew it.
    const after = imports.find(({ name }) => name > kebab);
    insertAt = after ? after.i : imports[imports.length - 1].i + 1;
  }

  lines.splice(insertAt, 0, importLine);
  writeFileSync(COMPONENT_INDEX, lines.join("\n"));
  changes.push(["updated", "src/components/index.css", "added @import"]);
}

// --- 3. Storybook story ------------------------------------------------------

const story = `import type { Meta, StoryObj } from "@storybook/html";

interface ${pascal}Args {
  label: string;
}

const meta: Meta<${pascal}Args> = {
  title: "Components/${pascal}",
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "${pascal} content",
    },
  },
  args: {
    label: "${pascal}",
  },
  render: ({ label }) => \`<div class="${kebab}">\${label}</div>\`,
};

export default meta;
type Story = StoryObj<${pascal}Args>;

export const Default: Story = {};

// TODO: add a named export per variant and size once the Figma design is in,
// then an AllVariants / AllSizes overview story. See Button.stories.ts.
`;

mkdirSync(dirname(storyPath), { recursive: true });
writeFileSync(storyPath, story);
changes.push(["created", `stories/components/${pascal}.stories.ts`, ""]);

// --- 4. Class-name types -----------------------------------------------------

const typesSrc = readFileSync(TYPES, "utf8");
const typeName = `${pascal}Class`;

if (typesSrc.includes(`export type ${typeName}`)) {
  changes.push([
    "skipped",
    "types/components.d.ts",
    `${typeName} already defined`,
  ]);
} else if (!typesSrc.includes(TYPES_ANCHOR)) {
  changes.push([
    "WARN",
    "types/components.d.ts",
    `anchor comment missing — add ${typeName} by hand`,
  ]);
} else {
  const block = `// ${pascal} component classes\nexport type ${typeName} = "${kebab}";\n\n`;
  let next = typesSrc.replace(TYPES_ANCHOR, block + TYPES_ANCHOR);

  // Extend the union so the new type is actually reachable. Matches the whole
  // statement up to its semicolon, so this works whether Prettier has collapsed
  // the union onto one line or split it across several.
  const unionRe = /(export type ValiifyComponentClass\s*=)([^;]*);/;
  if (unionRe.test(next)) {
    next = next.replace(
      unionRe,
      (_, head, body) => `${head}${body} | ${typeName};`,
    );
  } else {
    changes.push([
      "WARN",
      "types/components.d.ts",
      `could not extend union — add ${typeName} by hand`,
    ]);
  }

  writeFileSync(TYPES, next);
  changes.push(["updated", "types/components.d.ts", `added ${typeName}`]);
}

// --- Report ------------------------------------------------------------------

console.log("");
for (const [verb, file, note] of changes) {
  console.log(`  ${verb.padStart(7)}  ${file}${note ? `  (${note})` : ""}`);
}
console.log(`
  Next:
    1. Populate src/components/${kebab}.css from the Figma design
       (delete the house-style comment block once done)
    2. Add variants to stories/components/${pascal}.stories.ts and
       types/components.d.ts
    3. Document .${kebab} in CLAUDE.md under Quick Reference
    4. npm run build && npm run storybook
`);
