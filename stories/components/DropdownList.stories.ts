/**
 * DropdownList — the panel holding ListItem rows.
 * Figma: Dropdown List (1:480), 2 variants (which toggle row-1 selection,
 * not size — both samples are sm rows).
 */
import type { Meta, StoryObj } from "@storybook/html";

const item = (label: string, selected = false, size = "sm") => `
  <button class="list-option list-option-${size}" role="option" aria-selected="${selected}">
    <span class="list-option-text">${label}</span>
    <svg class="list-option-check" aria-hidden="true"><use href="#check" /></svg>
  </button>`;

const meta: Meta = {
  title: "Components/DropdownList",
  tags: ["autodocs"],
  render: () => `
    <div class="dropdown-list" role="listbox" aria-label="Language" style="width: 154px;">
      ${item("English", true)}
      ${item("Spanish")}
      ${item("German")}
    </div>
  `,
};

export default meta;
type Story = StoryObj;

export const Interactive: Story = {};

/** The Figma samples: selected first row, and none selected. */
export const BothSamples: Story = {
  render: () => `
    <div style="display: flex; gap: 32px;">
      <div class="dropdown-list" role="listbox" aria-label="Language" style="width: 154px;">
        ${item("English", true)}${item("Spanish")}${item("German")}
      </div>
      <div class="dropdown-list" role="listbox" aria-label="Language" style="width: 154px;">
        ${item("English")}${item("Spanish")}${item("German")}
      </div>
    </div>
  `,
};

/** Width is the consumer's — the panel spans its trigger. */
export const WiderPanel: Story = {
  render: () => `
    <div class="dropdown-list" role="listbox" aria-label="Language" style="width: 280px;">
      ${item("English (United States)", true, "md")}
      ${item("Español (Latinoamérica)", false, "md")}
      ${item("Deutsch", false, "md")}
    </div>
  `,
};

/** Under the TextSelector, as assembled in Figma. */
export const WithTrigger: Story = {
  render: () => `
    <div style="position: relative; display: inline-block;">
      <button class="text-selector" aria-haspopup="listbox" aria-expanded="true">
        <svg class="text-selector-icon" aria-hidden="true"><use href="#globe" /></svg>
        <span class="text-selector-label">English</span>
        <svg class="text-selector-chevron" aria-hidden="true"><use href="#chevron-down" /></svg>
      </button>
      <div class="dropdown-list" role="listbox" aria-label="Language" style="position: absolute; top: calc(100% + 6px); left: 0; width: 154px;">
        ${item("English", true)}${item("Spanish")}${item("German")}
      </div>
    </div>
  `,
};
