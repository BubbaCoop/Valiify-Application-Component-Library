/**
 * DropdownField — labeled listbox-trigger form field.
 * Figma: Dropdown Field (1:358), 9 variants (Filled × Hover × Focus × Error
 * partial matrix). Composes the shipped .dropdown-list panel; the chevron
 * flips 180° on [aria-expanded="true"] only.
 */
import type { Meta, StoryObj } from "@storybook/html";

interface DropdownFieldArgs {
  label: string;
  value: string;
  placeholder: string;
  expanded: boolean;
  invalid: boolean;
  hint: string;
}

let uid = 0;
const field = ({ label, value, placeholder, expanded, invalid, hint }: Partial<DropdownFieldArgs>) => {
  const id = `df-${uid++}`;
  const isPlaceholder = !value;
  return `
  <div class="dropdown-field">
    <div class="dropdown-field-title-row">
      <span id="${id}-label" class="dropdown-field-title">${label ?? "Account type"}</span>
    </div>
    <button id="${id}" class="dropdown-field-trigger" type="button"
      aria-haspopup="listbox" aria-expanded="${expanded ? "true" : "false"}"
      aria-labelledby="${isPlaceholder ? `${id}-label` : `${id}-label ${id}-value`}"
      ${invalid ? `aria-invalid="true"` : ""}
      ${hint ? `aria-describedby="${id}-hint"` : ""}>
      <span id="${id}-value" class="dropdown-field-value${isPlaceholder ? " dropdown-field-value-placeholder" : ""}"${isPlaceholder ? ` aria-hidden="true"` : ""}>${value || placeholder || "Select"}</span>
      <svg class="dropdown-field-chevron" aria-hidden="true"><use href="#chevron-down" /></svg>
    </button>
    ${hint ? `<p id="${id}-hint" class="dropdown-field-hint">${hint}</p>` : ""}
  </div>`;
};

const meta: Meta<DropdownFieldArgs> = {
  title: "Components/DropdownField",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    value: { control: "text", description: "Selected option — empty renders the placeholder ink" },
    placeholder: { control: "text" },
    expanded: { control: "boolean", description: "aria-expanded — Figma's Focus axis (open state)" },
    invalid: { control: "boolean", description: "aria-invalid — the (amber) error border" },
    hint: { control: "text" },
  },
  args: {
    label: "Account type",
    value: "",
    placeholder: "Select an account type",
    expanded: false,
    invalid: false,
    hint: "",
  },
  render: (args) => `<div style="max-width: 413px;">${field(args)}</div>`,
};

export default meta;
type Story = StoryObj<DropdownFieldArgs>;

/** Clicking the trigger toggles aria-expanded — the consumer JS contract
 * (the library ships no JS; border, ring and chevron flip are pure CSS). */
export const Interactive: Story = {
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector<HTMLButtonElement>(".dropdown-field-trigger");
    trigger?.addEventListener("click", () => {
      const open = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!open));
    });
  },
};

/** Placeholder, filled, open, and error rows. */
export const AllStates: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 413px;">
      ${field({ label: "Account type", placeholder: "Select an account type" })}
      ${field({ label: "Account type", value: "Personal checking" })}
      ${field({ label: "Account type", value: "Personal checking", expanded: true })}
      ${field({ label: "Account type", value: "Business savings", invalid: true, hint: "This account type is unavailable." })}
      ${field({ label: "Account type", value: "Business savings", invalid: true, expanded: true })}
    </div>
  `,
};

/** Open, composed with the shipped DropdownList panel. */
export const WithPanel: Story = {
  render: () => `
    <div style="max-width: 413px; position: relative;">
      ${field({ label: "Account type", value: "Personal checking", expanded: true })}
      <div class="dropdown-list" role="listbox" aria-label="Account type" style="position: absolute; left: 0; right: 0; margin-top: 4px;">
        <button class="list-option list-option-md" role="option" aria-selected="true">
          <span class="list-option-text">Personal checking</span>
          <svg class="list-option-check" aria-hidden="true"><use href="#check" /></svg>
        </button>
        <button class="list-option list-option-md" role="option" aria-selected="false">
          <span class="list-option-text">Personal savings</span>
          <svg class="list-option-check" aria-hidden="true"><use href="#check" /></svg>
        </button>
        <button class="list-option list-option-md" role="option" aria-selected="false">
          <span class="list-option-text">Business checking</span>
          <svg class="list-option-check" aria-hidden="true"><use href="#check" /></svg>
        </button>
      </div>
    </div>
  `,
};
