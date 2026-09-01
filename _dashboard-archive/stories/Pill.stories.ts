import type { Meta, StoryObj } from "@storybook/html-vite";

// Load sprite into page for icon <use> references
const spriteUrl = "/sprite.svg";

const loadSprite = () => {
  if (typeof document !== "undefined" && !document.getElementById("icon-sprite")) {
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

const CHEVRON = `<svg class="pill-chevron icon icon-size-13" aria-hidden="true"><use href="#chevron-down" /></svg>`;

interface PillArgs {
  label: string;
  dropdown: boolean;
  active: boolean;
  disabled: boolean;
  withRing: boolean;
}

const meta: Meta<PillArgs> = {
  title: "Components/Pill",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text", description: "Pill label" },
    dropdown: {
      control: "boolean",
      description: "Figma's Dropdown axis — adds the 13px trailing chevron",
    },
    active: {
      control: "boolean",
      description:
        "With a chevron this means the menu is open (aria-expanded); without one it means selected (aria-pressed). Same fill either way.",
    },
    disabled: { control: "boolean", description: "Not in Figma — house convention" },
    withRing: { control: "boolean", description: "Figma's Ring boolean — 2px inset ring" },
  },
  args: {
    label: "John Smith",
    dropdown: true,
    active: false,
    disabled: false,
    withRing: false,
  },
  render: ({ label, dropdown, active, disabled, withRing }) => {
    // The attribute differs by intent: a chevron pill opens, a bare pill selects.
    const stateAttr = dropdown
      ? `aria-haspopup="listbox" aria-expanded="${active}"`
      : `aria-pressed="${active}"`;

    return `
      <div style="padding: 24px;">
        <button
          class="pill${withRing ? " with-ring" : ""}"
          ${stateAttr}
          ${disabled ? "disabled" : ""}
        >
          ${label}${dropdown ? CHEVRON : ""}
        </button>
      </div>
    `;
  },
};

export default meta;
type Story = StoryObj<PillArgs>;

export const Interactive: Story = {};

/** Both Figma axes: State (rest / hover / active) × Dropdown (Yes / No). */
export const AllVariants: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
      .demo-row { display: flex; gap: 14px; align-items: center; }
      .demo-label { margin: 0 0 8px; font-size: 12px; color: #727280; }
      .demo-note { margin: 6px 0 0; font-size: 11px; color: #9999a6; }
    </style>
    <div class="demo-wrap">
      <div>
        <p class="demo-label">Dropdown = Yes</p>
        <div class="demo-row">
          <button class="pill" aria-haspopup="listbox" aria-expanded="false">John Smith${CHEVRON}</button>
          <button class="pill" aria-haspopup="listbox" aria-expanded="false">John Smith${CHEVRON}</button>
          <button class="pill" aria-haspopup="listbox" aria-expanded="true">John Smith${CHEVRON}</button>
        </div>
        <p class="demo-note">rest · hover (hover it) · active — chevron flips when open</p>
      </div>

      <div>
        <p class="demo-label">Dropdown = No</p>
        <div class="demo-row">
          <button class="pill" aria-pressed="false">Overdue</button>
          <button class="pill" aria-pressed="false">Overdue</button>
          <button class="pill" aria-pressed="true">Overdue</button>
        </div>
        <p class="demo-note">rest · hover · active — here active means selected</p>
      </div>

      <div>
        <p class="demo-label">Ring</p>
        <div class="demo-row">
          <button class="pill with-ring" aria-haspopup="listbox" aria-expanded="false">John Smith${CHEVRON}</button>
          <button class="pill with-ring" aria-pressed="false">Overdue</button>
        </div>
      </div>
    </div>
  `,
};

/**
 * The label hugs its content — Figma's 88px and 70px are the widths of the
 * sample string, not fixed sizes.
 */
export const HugsItsLabel: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    </style>
    <div class="demo-wrap">
      <button class="pill" aria-pressed="false">All</button>
      <button class="pill" aria-pressed="true">Overdue</button>
      <button class="pill" aria-pressed="false">Needs review</button>
      <button class="pill" aria-haspopup="listbox" aria-expanded="false">John Smith${CHEVRON}</button>
      <button class="pill" aria-haspopup="listbox" aria-expanded="false">A considerably longer label${CHEVRON}</button>
    </div>
  `,
};

/** Not in Figma — house convention, so a disabled pill is not silently clickable. */
export const Disabled: Story = {
  render: () => `
    <div style="padding: 24px; display: flex; gap: 14px; align-items: center;">
      <button class="pill" aria-pressed="false" disabled>Overdue</button>
      <button class="pill" aria-haspopup="listbox" aria-expanded="false" disabled>John Smith${CHEVRON}</button>
    </div>
  `,
};

/** A filter row, which is what the Figma description describes it for. */
export const FilterRow: Story = {
  render: () => `
    <style>
      .demo-panel { padding: 24px; }
      .demo-bar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
      .demo-label { margin: 0 0 10px; font-size: 12px; color: #727280; }
    </style>
    <div class="demo-panel">
      <p class="demo-label">Filters</p>
      <div class="demo-bar">
        <button class="pill" aria-pressed="true">All</button>
        <button class="pill" aria-pressed="false">Overdue</button>
        <button class="pill" aria-pressed="false">Needs review</button>
        <button class="pill" aria-pressed="false">Approved</button>
        <button class="pill" aria-haspopup="listbox" aria-expanded="false">Assignee${CHEVRON}</button>
      </div>
    </div>
  `,
};
