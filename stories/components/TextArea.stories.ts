/**
 * TextArea — labeled multi-line text input.
 * Figma: Text Area Field (199:12523), 6 variants (Filled × Hover × Focus).
 * No Error axis exists — none is invented.
 */
import type { Meta, StoryObj } from "@storybook/html";

interface TextAreaArgs {
  label: string;
  placeholder: string;
  value: string;
  hint: string;
}

let uid = 0;
const field = ({ label, placeholder, value, hint }: Partial<TextAreaArgs>) => {
  const id = `ta-${uid++}`;
  return `
  <div class="text-area">
    <div class="text-area-title-row">
      <label class="text-area-title" for="${id}">${label ?? "Notes"}</label>
    </div>
    <textarea id="${id}" class="text-area-input"
      ${placeholder ? `placeholder="${placeholder}"` : ""}
      ${hint ? `aria-describedby="${id}-hint"` : ""}>${value ?? ""}</textarea>
    ${hint ? `<p id="${id}-hint" class="text-area-hint">${hint}</p>` : ""}
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
  },
  args: {
    label: "Notes",
    placeholder: "Anything else we should know?",
    value: "",
    hint: "",
  },
  render: (args) => `<div style="max-width: 413px;">${field(args)}</div>`,
};

export default meta;
type Story = StoryObj<TextAreaArgs>;

export const Interactive: Story = {};

/** Empty and filled — hover/focus are live. Multi-line value wraps (the
 * Figma node's single-line ellipsis is a documented authoring defect). */
export const AllStates: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 413px;">
      ${field({ label: "Notes", placeholder: "Field" })}
      ${field({ label: "Notes", value: "Applying jointly with my spouse; we bank with ACU already and want to move our savings over too." })}
      ${field({ label: "Notes", placeholder: "Field", hint: "Optional — anything that helps us process your application." })}
    </div>
  `,
};
