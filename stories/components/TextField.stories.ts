/**
 * TextField — labeled single-line text input.
 * Figma: Plain Text Field (1:291), 9 variants (Filled × Hover × Focus × Error
 * partial matrix). Error binds the Warning ramp (Figma's authoring, verbatim).
 */
import type { Meta, StoryObj } from "@storybook/html";

interface TextFieldArgs {
  label: string;
  placeholder: string;
  value: string;
  invalid: boolean;
  hint: string;
}

let uid = 0;
const field = (
  { label, placeholder, value, invalid, hint }: Partial<TextFieldArgs>,
  extra: { leadingIcon?: string; trailingIcon?: string; help?: boolean } = {},
) => {
  const id = `tf-${uid++}`;
  const hintId = `${id}-hint`;
  return `
  <div class="text-field">
    <div class="text-field-title-row">
      <label class="text-field-title" for="${id}">${label ?? "First name"}</label>
      ${extra.help ? `<button type="button" class="text-field-help" aria-label="More information"><svg aria-hidden="true"><use href="#circle-help" /></svg></button>` : ""}
    </div>
    <div class="text-field-box">
      ${extra.leadingIcon ? `<svg class="text-field-icon" aria-hidden="true"><use href="#${extra.leadingIcon}" /></svg>` : ""}
      <input id="${id}" class="text-field-input" type="text"
        ${placeholder ? `placeholder="${placeholder}"` : ""}
        ${value ? `value="${value}"` : ""}
        ${invalid ? `aria-invalid="true"` : ""}
        ${hint ? `aria-describedby="${hintId}"` : ""} />
      ${extra.trailingIcon ? `<svg class="text-field-icon" aria-hidden="true"><use href="#${extra.trailingIcon}" /></svg>` : ""}
    </div>
    ${hint ? `<p id="${hintId}" class="text-field-hint">${hint}</p>` : ""}
  </div>`;
};

const meta: Meta<TextFieldArgs> = {
  title: "Components/TextField",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    value: { control: "text" },
    invalid: { control: "boolean", description: "aria-invalid drives the (amber) error border" },
    hint: { control: "text" },
  },
  args: {
    label: "First name",
    placeholder: "Jane",
    value: "",
    invalid: false,
    hint: "",
  },
  render: (args) => `<div style="max-width: 413px;">${field(args)}</div>`,
};

export default meta;
type Story = StoryObj<TextFieldArgs>;

export const Interactive: Story = {};

/** Rest, filled, and error — hover/focus are live (mouse in, click in). */
export const AllStates: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 413px;">
      ${field({ label: "First name", placeholder: "Field" })}
      ${field({ label: "First name", value: "John" })}
      ${field({ label: "Email", value: "not-an-email", invalid: true, hint: "Enter a valid email address." })}
    </div>
  `,
};

/** The optional slots: leading/trailing icons, helper icon-button, hint. */
export const WithSlots: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 413px;">
      ${field({ label: "Amount", placeholder: "0.00", hint: "Monthly deposit amount." }, { leadingIcon: "dollar-sign", help: true })}
      ${field({ label: "Search", placeholder: "Find a branch" }, { trailingIcon: "search" })}
    </div>
  `,
};

/** Width is the caller's — 413px is Figma's sample hug. */
export const FullWidth: Story = {
  render: () => field({ label: "Street address", placeholder: "123 Main St" }),
};
