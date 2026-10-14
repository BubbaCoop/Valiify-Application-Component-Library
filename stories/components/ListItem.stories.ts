/**
 * ListItem — one row in a dropdown/selection list.
 * Figma: the REBUILT List Item set (786:6869), 36 variants:
 * Size {32/40/48, Height-token pinned} × Selected × Hover × LastItem ×
 * Critical. Rows never change height between states.
 */
import type { Meta, StoryObj } from "@storybook/html";

const item = (size: string, label: string, selected = false) => `
  <button class="va-list-option va-list-option-${size}" role="option" aria-selected="${selected}">
    <span class="va-list-option-text">${label}</span>
    <svg class="va-list-option-check" aria-hidden="true"><use href="#check" /></svg>
  </button>`;

const meta: Meta = {
  title: "Components/ListItem",
  tags: ["autodocs"],
  render: () =>
    `<div role="listbox" aria-label="Language" style="width: 154px;">${item("sm", "English", true)}</div>`,
};

export default meta;
type Story = StoryObj;

export const Interactive: Story = {};

/**
 * Rest + selected per size — heights are PINNED (32/40/48); the old
 * sm-selected growth is gone.
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

/**
 * Critical (destructive rows) — ink swaps to Error/Base, the Error ramp's
 * first consumer. Hover still washes; never combined with selection.
 */
export const Critical: Story = {
  render: () => `
    <div role="listbox" aria-label="Account actions" style="width: 154px; display: flex; flex-direction: column;">
      ${item("sm", "Rename")}
      <button class="va-list-option va-list-option-sm va-list-option-critical" role="option" aria-selected="false">
        <span class="va-list-option-text">Delete account</span>
        <svg class="va-list-option-check" aria-hidden="true"><use href="#check" /></svg>
      </button>
    </div>
  `,
};

/**
 * The aria-activedescendant keyboard highlight — data-active paints the
 * hover wash while DOM focus stays on the trigger (no focus ring on rows).
 */
export const KeyboardHighlight: Story = {
  render: () => `
    <div role="listbox" aria-label="Language" style="width: 154px; display: flex; flex-direction: column;">
      ${item("sm", "English")}
      <button class="va-list-option va-list-option-sm" role="option" aria-selected="false" data-active="true">
        <span class="va-list-option-text">Spanish</span>
        <svg class="va-list-option-check" aria-hidden="true"><use href="#check" /></svg>
      </button>
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
