import type { Meta, StoryObj } from "@storybook/html-vite";

const spriteUrl = "/sprite.svg";
const loadSprite = () => {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("icon-sprite")
  ) {
    fetch(spriteUrl)
      .then((r) => r.text())
      .then((svg) => {
        const div = document.createElement("div");
        div.id = "icon-sprite";
        div.style.display = "none";
        div.innerHTML = svg;
        document.body.insertBefore(div, document.body.firstChild);
      });
  }
};
loadSprite();

const HOME = `<svg class="breadcrumb-home icon icon-size-14" aria-hidden="true"><use href="#home" /></svg>`;
const CHEV = `<span class="breadcrumb-separator" aria-hidden="true">&gt;</span>`;
const SLASH = `<span class="breadcrumb-separator" aria-hidden="true">/</span>`;
const DOT = `<span class="breadcrumb-separator breadcrumb-separator-dot" aria-hidden="true">&middot;</span>`;

/** Figma's chevron variant, reproduced. */
const chevronPath = () => `
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    ${HOME}
    ${CHEV}
    <a class="breadcrumb" href="#">Applications</a>
    ${CHEV}
    <a class="breadcrumb" href="#">Business deposit</a>
    ${CHEV}
    <span class="breadcrumb breadcrumb-current" aria-current="page">#BA-204417</span>
  </nav>`;

/** Figma's slash variant, reproduced — note it uses two separator glyphs. */
const slashPath = () => `
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <a class="breadcrumb" href="#">Queue</a>
    ${SLASH}
    <span class="breadcrumb breadcrumb-current">#BA-204417</span>
    ${DOT}
    <span class="breadcrumb breadcrumb-current" aria-current="page">Northwind Freight LLC</span>
  </nav>`;

interface Args {
  separator: "chevron" | "slash";
}

const meta: Meta<Args> = {
  title: "Components/Breadcrumbs",
  tags: ["autodocs"],
  argTypes: {
    separator: {
      control: "inline-radio",
      options: ["chevron", "slash"],
      description:
        "Figma's Separator axis. The two variants are different sample paths, not the same path with a swapped divider.",
    },
  },
  args: { separator: "chevron" },
  render: ({ separator }) =>
    `<div style="padding: 24px;">${separator === "slash" ? slashPath() : chevronPath()}</div>`,
};

export default meta;
type Story = StoryObj<Args>;

export const Interactive: Story = {};

/** Both Figma variants, exactly as drawn. */
export const BothVariants: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 30px; }
      .demo-label { margin: 0 0 10px; font-size: 12px; font-weight: 600; color: #16161a; }
      .demo-note { margin: 10px 0 0; font-size: 11px; color: #9999a6; max-width: 640px; }
    </style>
    <div class="demo-wrap">
      <div>
        <p class="demo-label">Separator = chevron</p>
        ${chevronPath()}
        <p class="demo-note">
          The "chevron" is a literal <code>&gt;</code> text character, not an icon &mdash; and it
          is drawn 12px where the other separators are 13px.
        </p>
      </div>
      <div>
        <p class="demo-label">Separator = slash</p>
        ${slashPath()}
        <p class="demo-note">
          A different path entirely, using two glyphs: <code>/</code> between levels and a
          <strong>bold</strong> <code>&middot;</code> joining the ID to the business name.
          Both trailing items are Content/Primary &mdash; they are one location.
        </p>
      </div>
    </div>
  `,
};

/** Both separators, and the loose middot that is not one of them. */
export const Separators: Story = {
  render: () => `
    <style>
      .demo-grid { padding: 24px; display: grid; grid-template-columns: auto auto 1fr;
        gap: 12px 20px; align-items: center; }
      .demo-k { font-size: 11px; color: #727280; font-family: ui-monospace, monospace; }
      .demo-n { font-size: 11px; color: #9999a6; }
      .demo-s { font-size: 20px; }
    </style>
    <div class="demo-grid">
      <span class="demo-k">.breadcrumb-separator</span>
      <span class="demo-s">${CHEV}</span>
      <span class="demo-n">12px Regular &mdash; the chevron, a literal <code>&gt;</code></span>

      <span class="demo-k">.breadcrumb-separator</span>
      <span class="demo-s">${SLASH}</span>
      <span class="demo-n">12px Regular &mdash; identical to the chevron now</span>

      <span class="demo-k">+ -dot</span>
      <span class="demo-s">${DOT}</span>
      <span class="demo-n">13px Regular &mdash; a loose text node, not a Separator</span>
    </div>
    <p style="padding: 0 24px 24px; margin: 0; font-size: 11px; color: #727280; max-width: 620px;">
      All are Content/Tertiary and all carry <code>aria-hidden</code>. The two separator types
      are now the same size and weight &mdash; the earlier 13&nbsp;/&nbsp;12&nbsp;/&nbsp;13-bold
      split was regularised in the 2026-08-25 restructure. <code>.breadcrumb-separator-chevron</code>
      still exists but no longer changes anything.
    </p>
  `,
};

/**
 * Figma's Item states (1046:22649). Hover draws a 0.5px rule in the label's own
 * colour; focus takes the shared 2px Primary/Main ring. Hover the crumbs, and
 * tab through them, to see both.
 */
export const States: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 18px; }
      .demo-n { font-size: 11px; color: #9999a6; }
      .demo-row { display: flex; align-items: center; gap: 16px; }
      .demo-k { width: 120px; flex: none; font-size: 11px; color: #727280;
                font-family: ui-monospace, monospace; }
    </style>
    <div class="demo-wrap">
      <div class="demo-row">
        <span class="demo-k">ancestor</span>
        <a class="breadcrumb" href="#">Applications</a>
        <span class="demo-n">Content/Secondary, 400 &mdash; hover for a #5b5b68 rule</span>
      </div>
      <div class="demo-row">
        <span class="demo-k">current</span>
        <span class="breadcrumb breadcrumb-current" aria-current="page">#BA-204417</span>
        <span class="demo-n">Content/Primary, 500 &mdash; hover for a #16161a rule</span>
      </div>
      <div class="demo-row">
        <span class="demo-k">focus</span>
        <a class="breadcrumb" href="#">Tab to me</a>
        <span class="demo-n">2px Primary/Main ring, drawn inside the 4px radius</span>
      </div>
    </div>
    <p style="padding: 0 24px 24px; margin: 0; font-size: 11px; color: #727280; max-width: 620px;">
      The hover rule is a 0.5px gradient band rather than <code>text-decoration</code>, because
      Chrome renders <code>text-decoration-thickness: 0.5px</code> as a full 1px.
    </p>
  `,
};

/** Colour marks depth, not position in the list. */
export const DepthNotPosition: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
      .demo-n { margin: 8px 0 0; font-size: 11px; color: #9999a6; }
    </style>
    <div class="demo-wrap">
      <div>
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <a class="breadcrumb" href="#">Queue</a>
          ${SLASH}
          <a class="breadcrumb" href="#">Applications</a>
          ${SLASH}
          <span class="breadcrumb breadcrumb-current" aria-current="page">Business deposit</span>
        </nav>
        <p class="demo-n">One current item at the end &mdash; the usual case.</p>
      </div>
      <div>
        ${slashPath()}
        <p class="demo-n">
          Two adjacent current items. <code>-current</code> is a depth marker, so it is not
          simply "the last child".
        </p>
      </div>
    </div>
  `,
};

/** In a page header, which is where it lives. */
export const InContext: Story = {
  render: () => `
    <style>
      .demo-page { margin: 24px; max-width: 620px; padding: 16px 20px; background: #fff;
        border: 1px solid rgba(20,20,40,0.08); border-radius: 8px; }
      .demo-h1 { margin: 12px 0 0; font-size: 19px; font-weight: 600; color: #16161a; }
    </style>
    <div class="demo-page">
      ${chevronPath()}
      <h1 class="demo-h1">Northwind Freight LLC</h1>
    </div>
  `,
};
