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

const glyph = (name: string) =>
  `<svg class="icon icon-size-14" aria-hidden="true"><use href="#${name}" /></svg>`;

/** Field Verification, stretched to fill the row's slack column. */
const status = (label = "Matches Plaid KYC") =>
  `<span class="field-verification field-verification-verified data-row-status">
    <span class="section-marker section-marker-approve" role="img" aria-label="Verified">
      ${glyph("check")}
    </span>
    <span class="field-verification-label">${label}</span>
  </span>`;

/**
 * Every action is icon-only, so each carries an aria-label — without one they
 * would be announced as "button" and nothing else. axe covers this across all
 * stories; see docs/accessibility-audit.md.
 */
const action = (icon: string, label: string) =>
  `<button class="icon-button icon-button-md data-row-action" aria-label="${label}">
    ${glyph(icon)}
  </button>`;

/** Figma's Icon=yes value cell is a Sensitive Data instance, type-overridden. */
const sensitiveValue = (masked: string) =>
  `<span class="sensitive-data data-row-value">
    <span class="sensitive-data-value">${masked}</span>
    <button class="icon-button icon-button-md" aria-pressed="true" aria-label="Show full value">
      ${glyph("eye-off")}
    </button>
  </span>`;

interface Args {
  dataField: string;
  data: string;
  icon: boolean;
  help: boolean;
  comment: boolean;
}

const render = ({ dataField, data, icon, help, comment }: Args) =>
  `<div class="data-row">
    <span class="data-row-field">${dataField}</span>
    ${icon ? sensitiveValue("***-**-1234") : `<span class="data-row-value">${data}</span>`}
    ${status()}
    ${comment ? action("message-circle", "Add a comment") : ""}
    ${help ? action("circle-question-mark", "Field help") : ""}
  </div>`;

const meta: Meta<Args> = {
  title: "Components/DataRow",
  tags: ["autodocs"],
  argTypes: {
    dataField: { control: "text", description: "Figma's dataField property" },
    data: { control: "text", description: "Figma's data property" },
    icon: {
      control: "boolean",
      description:
        "Figma's Icon axis. Swaps the value for a Sensitive Data cell with a trailing eye toggle — despite the Figma description calling it a leading icon.",
    },
    help: { control: "boolean", description: "Figma's help boolean" },
    comment: { control: "boolean", description: "Figma's comment boolean" },
  },
  args: {
    dataField: "First Name",
    data: "John",
    icon: false,
    help: true,
    comment: false,
  },
  render: (a) =>
    `<div style="padding: 24px; max-width: 932px;">${render(a)}</div>`,
};

export default meta;
type Story = StoryObj<Args>;

export const Interactive: Story = {};

/**
 * All four Figma variants. Hover a row to see the Action/Subtle fill and the
 * actions fade in — at rest they are laid out but invisible, as Figma draws.
 */
export const AllVariants: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; max-width: 932px; display: flex; flex-direction: column; gap: 8px; }
      .demo-k { font-size: 11px; color: #9999a6; font-family: ui-monospace, monospace; }
    </style>
    <div class="demo-wrap">
      <p class="demo-k">Icon=no &mdash; hover for the fill and the actions</p>
      ${render({ dataField: "First Name", data: "John", icon: false, help: true, comment: false })}
      <p class="demo-k">Icon=yes &mdash; the value is a Sensitive Data cell</p>
      ${render({ dataField: "SSN", data: "", icon: true, help: true, comment: false })}
      <p class="demo-k">both actions (comment + help)</p>
      ${render({ dataField: "Date of Birth", data: "04/12/1988", icon: false, help: true, comment: true })}
    </div>
    <p style="padding: 0 24px 24px; margin: 0; font-size: 11px; color: #727280; max-width: 640px;">
      The status column is a <code>.field-verification</code> instance and the masked value a
      <code>.sensitive-data</code> one &mdash; Data Row rebuilds neither.
    </p>
  `,
};

/**
 * The actions reveal on focus as well as hover, so tabbing through the row
 * shows what you reached. Figma draws hover only; an invisible focusable
 * button would otherwise be unreachable in practice.
 */
export const KeyboardReveal: Story = {
  render: () => `
    <div style="padding: 24px; max-width: 932px;">
      ${render({ dataField: "First Name", data: "John", icon: false, help: true, comment: true })}
      <p style="margin: 12px 0 0; font-size: 11px; color: #727280; max-width: 620px;">
        Tab into the row without touching the mouse. <code>:focus-within</code> reveals the
        actions, and each one has an <code>aria-label</code> &mdash; they are icon-only, so
        without one a screen reader would announce only "button".
      </p>
    </div>
  `,
};

/** A realistic review panel — the case the component exists for. */
export const InContext: Story = {
  render: () => `
    <div style="padding: 24px; max-width: 932px; display: flex; flex-direction: column;">
      ${render({ dataField: "First Name", data: "John", icon: false, help: true, comment: false })}
      ${render({ dataField: "Last Name", data: "Northwind", icon: false, help: true, comment: false })}
      ${render({ dataField: "SSN", data: "", icon: true, help: true, comment: true })}
      ${render({ dataField: "Date of Birth", data: "04/12/1988", icon: false, help: true, comment: false })}
    </div>
  `,
};

/** Figma's Ring boolean, hidden by default in the design file. */
export const WithRing: Story = {
  render: () => `
    <div style="padding: 24px; max-width: 932px;">
      <div class="data-row with-ring">
        <span class="data-row-field">First Name</span>
        <span class="data-row-value">John</span>
        ${status()}
        ${action("circle-question-mark", "Field help")}
      </div>
    </div>
  `,
};
