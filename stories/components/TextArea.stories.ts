/**
 * TextArea — labeled multi-line text input.
 * Figma: Text Area Field (199:12523), 6 variants (Filled × Hover × Focus).
 * Figma draws no error variant; the error state is a labeled extension added
 * on the designer's 2026-09-16 decision, mirroring the sibling TextField.
 */
import type { Meta, StoryObj } from "@storybook/html";

interface TextAreaArgs {
  label: string;
  placeholder: string;
  value: string;
  hint: string;
  invalid: boolean;
}

let uid = 0;
const field = ({ label, placeholder, value, hint, invalid }: Partial<TextAreaArgs>) => {
  const id = `ta-${uid++}`;
  return `
  <div class="va-text-area">
    <div class="va-text-area-title-row">
      <label class="va-text-area-title" for="${id}">${label ?? "Notes"}</label>
    </div>
    <textarea id="${id}" class="va-text-area-input"
      ${placeholder ? `placeholder="${placeholder}"` : ""}
      ${invalid ? `aria-invalid="true"` : ""}
      ${hint ? `aria-describedby="${id}-hint"` : ""}>${value ?? ""}</textarea>
    ${hint ? `<p id="${id}-hint" class="va-text-area-hint">${hint}</p>` : ""}
  </div>`;
};

const meta: Meta<TextAreaArgs> = {
  title: "Components/TextArea",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    value: { control: "text" },
    hint: { control: "text" },
    invalid: { control: "boolean", description: "aria-invalid drives the (amber) error border and hint ink" },
  },
  args: {
    label: "Notes",
    placeholder: "Anything else we should know?",
    value: "",
    hint: "",
    invalid: false,
  },
  render: (args) => `<div style="max-width: 413px;">${field(args)}</div>`,
};

export default meta;
type Story = StoryObj<TextAreaArgs>;

export const Interactive: Story = {};

/** Empty, filled, hint and error — hover/focus are live. Multi-line value
 * wraps (the Figma node's single-line ellipsis is a documented authoring
 * defect). The error instance is APPENDED rather than slotted in at index 2
 * (where TextField carries its own): the existing non-error hint assertion
 * reads the first `.va-text-area-hint` in the DOM, so inserting an errored
 * hint ahead of it would have changed what an existing check measures. The
 * error checks select on `[aria-invalid="true"]` instead of an index, so they
 * do not care where this instance sits. */
export const AllStates: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 413px;">
      ${field({ label: "Notes", placeholder: "Field" })}
      ${field({ label: "Notes", value: "Applying jointly with my spouse; we bank with ACU already and want to move our savings over too." })}
      ${field({ label: "Notes", placeholder: "Field", hint: "Optional — anything that helps us process your application." })}
      ${field({ label: "Notes", placeholder: "Field", invalid: true, hint: "Tell us a little more before you continue." })}
    </div>
  `,
};
