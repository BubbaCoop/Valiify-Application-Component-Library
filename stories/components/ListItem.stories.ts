/**
 * ListItem — one row in a dropdown/selection list.
 * Figma: List Item (1:463), 24 variants: Size × Selected × Hover × LastItem.
 */
import type { Meta, StoryObj } from "@storybook/html";

const item = (size: string, label: string, selected = false) => `
  <button class="list-option list-option-${size}" role="option" aria-selected="${selected}">
    <span class="list-option-text">${label}</span>
    <svg class="list-option-check" aria-hidden="true"><use href="#check" /></svg>
  </button>`;

const meta: Meta = {
  title: "Components/ListItem",
  tags: ["autodocs"],
  render: () => `<div role="listbox" aria-label="Language" style="width: 154px;">${item("sm", "English", true)}</div>`,
};

export default meta;
type Story = StoryObj;

export const Interactive: Story = {};

/**
 * Rest + selected per size. The sm selected row is 34px against 30 unselected
 * — Figma's own emergent hug (the 18px check exceeds sm's 14px line box).
 */
export const AllSizes: Story = {
  render: () => `
    <div style="display: flex; gap: 32px;">
      ${["sm", "md", "lg"]
        .map(
          (s) => `
        <div role="listbox" aria-label="Language ${s}" style="width: 154px; display: flex; flex-direction: column;">
          ${item(s, "English", false)}
          ${item(s, "Spanish", true)}
        </div>`,
        )
        .join("")}
    </div>
  `,
};

/** The divider is structural — every row but the last. */
export const Dividers: Story = {
  render: () => `
    <div role="listbox" aria-label="Language" style="width: 154px; display: flex; flex-direction: column;">
      ${item("sm", "English", true)}
      ${item("sm", "Spanish")}
      ${item("sm", "German")}
    </div>
  `,
};
