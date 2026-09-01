import type { Meta, StoryObj } from "@storybook/html-vite";

// Load sprite into page for icon <use> references
const spriteUrl = "/sprite.svg";

const loadSprite = () => {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("icon-sprite")
  ) {
    fetch(spriteUrl)
      .then((res) => res.text())
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

type TextButtonType = "cell" | "text" | "primary";

const TYPES: { key: TextButtonType; label: string; note: string }[] = [
  {
    key: "cell",
    label: "cell",
    note: "11px · 7/1px padding · pill background on hover",
  },
  {
    key: "text",
    label: "text",
    note: "12px · no padding · colour-only states",
  },
  {
    key: "primary",
    label: "Primary",
    note: "12px · no padding · Primary ramp",
  },
];

const ICON = `<svg class="icon icon-size-12" aria-hidden="true"><use href="#plus" /></svg>`;

interface TextButtonArgs {
  label: string;
  type: TextButtonType;
  icon: boolean;
  active: boolean;
  disabled: boolean;
  withRing: boolean;
}

const render = ({
  label,
  type,
  icon,
  active,
  disabled,
  withRing,
}: TextButtonArgs) => `
  <button
    class="text-button text-button-${type}${withRing ? " with-ring" : ""}"
    aria-pressed="${active}"
    ${disabled ? "disabled" : ""}
  >${icon ? ICON : ""}${label}</button>
`;

const meta: Meta<TextButtonArgs> = {
  title: "Components/TextButton",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text", description: "Button label" },
    type: {
      control: "inline-radio",
      options: ["cell", "text", "primary"],
      description:
        "cell is Figma's default and the only type with padding or a background",
    },
    icon: {
      control: "boolean",
      description: "Figma's Icon boolean — a 12px leading icon",
    },
    active: {
      control: "boolean",
      description: "Selected. Steps the weight 400 → 500.",
    },
    disabled: {
      control: "boolean",
      description: "Not in Figma — house convention",
    },
    withRing: {
      control: "boolean",
      description: "Figma's Ring boolean — 2px inset ring",
    },
  },
  args: {
    label: "Select all",
    type: "cell",
    icon: false,
    active: false,
    disabled: false,
    withRing: false,
  },
  render: (args) => `<div style="padding: 24px;">${render(args)}</div>`,
};

export default meta;
type Story = StoryObj<TextButtonArgs>;

export const Interactive: Story = {};

/**
 * The full Figma matrix. Hover and press are live — the static columns are
 * rest and active, because those are the only two that can be shown at rest.
 */
export const AllTypes: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 22px; }
      .demo-label { margin: 0 0 2px; font-size: 12px; color: #16161a; font-weight: 600; }
      .demo-note { margin: 0 0 10px; font-size: 11px; color: #9999a6; }
      .demo-row { display: flex; gap: 20px; align-items: center; }
      .demo-cellbg { background: #fff; padding: 6px 8px; border-radius: 6px; }
    </style>
    <div class="demo-wrap">
      ${TYPES.map(
        (t) => `
        <div>
          <p class="demo-label">Type = ${t.label}</p>
          <p class="demo-note">${t.note}</p>
          <div class="demo-row">
            <span class="demo-cellbg"><button class="text-button text-button-${t.key}" aria-pressed="false">Select all</button></span>
            <span class="demo-cellbg"><button class="text-button text-button-${t.key}" aria-pressed="false">Hover me</button></span>
            ${
              t.key === "primary"
                ? `<span class="demo-note">no Active variant in Figma</span>`
                : `<span class="demo-cellbg"><button class="text-button text-button-${t.key}" aria-pressed="true">Select all</button></span>`
            }
          </div>
        </div>`,
      ).join("")}
    </div>
  `,
};

/** Figma's Icon boolean — a 12px leading icon, 4px gap. */
export const WithIcon: Story = {
  render: () => `
    <div style="padding: 24px; display: flex; gap: 20px; align-items: center;">
      ${TYPES.map(
        (t) =>
          `<button class="text-button text-button-${t.key}" aria-pressed="false">${ICON}Add row</button>`,
      ).join("")}
    </div>
  `,
};

/**
 * Clicking really toggles, so the weight step and the active fill can be
 * checked by hand rather than trusted from a hardcoded attribute.
 */
export const Toggles: Story = {
  render: () => {
    const host = document.createElement("div");
    host.style.padding = "24px";
    host.innerHTML = `
      <div style="display: flex; gap: 20px; align-items: center;">
        <button class="text-button text-button-cell" aria-pressed="false">Select all</button>
        <button class="text-button text-button-text" aria-pressed="false">Select all</button>
      </div>
      <p style="margin-top: 12px; font-size: 12px; color: #727280;">
        Click either one. Active steps the weight 400 &rarr; 500; only <code>cell</code> also fills.
      </p>
    `;
    host
      .querySelectorAll<HTMLButtonElement>(".text-button")
      .forEach((el) =>
        el.addEventListener("click", () =>
          el.setAttribute(
            "aria-pressed",
            String(el.getAttribute("aria-pressed") !== "true"),
          ),
        ),
      );
    return host;
  },
};

/** What `cell` is actually for — an inline action inside a table cell. */
export const InACell: Story = {
  render: () => `
    <style>
      .demo-table { border-collapse: collapse; font-size: 12px; margin: 24px; }
      .demo-table th, .demo-table td {
        padding: 8px 12px; text-align: left;
        border-bottom: 1px solid rgba(20,20,40,0.08);
      }
      .demo-table th { font-size: 10px; text-transform: uppercase; color: #727280; font-weight: 600; }
    </style>
    <table class="demo-table">
      <thead>
        <tr><th>Case</th><th>Reviewer</th><th></th></tr>
      </thead>
      <tbody>
        <tr>
          <td>#BA-204417</td><td>Nicholas Cooper</td>
          <td><button class="text-button text-button-cell" aria-pressed="false">Reassign</button></td>
        </tr>
        <tr>
          <td>#BA-204418</td><td>Unassigned</td>
          <td><button class="text-button text-button-primary" aria-pressed="false">Assign</button></td>
        </tr>
      </tbody>
    </table>
  `,
};

/** Not in Figma — house convention, so a disabled control is not clickable. */
export const Disabled: Story = {
  render: () => `
    <div style="padding: 24px; display: flex; gap: 20px; align-items: center;">
      ${TYPES.map(
        (t) =>
          `<button class="text-button text-button-${t.key}" disabled>Select all</button>`,
      ).join("")}
    </div>
  `,
};
