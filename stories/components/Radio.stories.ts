/**
 * Radio — single-selection control.
 *
 * Figma: Radio (1:419), 4 variants across Active × Hover × Pressed.
 * The component is the bare 20×20 control; labels are composed at the call
 * site, so the label markup in these stories is usage, not component API.
 */
import type { Meta, StoryObj } from "@storybook/html";

interface RadioArgs {
  checked: boolean;
  disabled: boolean;
}

const meta: Meta<RadioArgs> = {
  title: "Components/Radio",
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean", description: "Active=Yes in Figma" },
    disabled: {
      control: "boolean",
      description: "Not modelled in Figma — cursor only, no visual change",
    },
  },
  args: {
    checked: false,
    disabled: false,
  },
  render: ({ checked, disabled }) =>
    `<input type="radio" class="radio" aria-label="Option" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""} />`,
};

export default meta;
type Story = StoryObj<RadioArgs>;

export const Interactive: Story = {};

export const Checked: Story = {
  args: { checked: true },
};

/**
 * The two variants Figma draws at rest. Hover and pressed are transient fills
 * (Action/Hover, Action/Pressed) — put a pointer on the unchecked control to
 * see them; the visual harness asserts them with a real hover.
 */
export const BothRestStates: Story = {
  render: () => `
    <div style="display: flex; gap: 24px; align-items: center;">
      <input type="radio" class="radio" aria-label="Unchecked" />
      <input type="radio" class="radio" aria-label="Checked" checked />
    </div>
  `,
};

/** Usage: a real group with labels composed at the call site. */
export const InAGroup: Story = {
  render: () => `
    <fieldset style="border: none; margin: 0; padding: 0;">
      <legend style="font-size: 13px; font-weight: 500; margin-bottom: 12px;">
        Account type
      </legend>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${["Personal", "Business", "Joint"]
          .map(
            (label, i) => `
          <label style="display: inline-flex; align-items: center; gap: 10px; font-size: 14px; cursor: pointer;">
            <input type="radio" name="account-type" class="radio" ${i === 1 ? "checked" : ""} />
            ${label}
          </label>`,
          )
          .join("")}
      </div>
    </fieldset>
  `,
};

/** Keyboard focus uses the library-wide focus-ring convention. Tab to see it. */
export const Focus: Story = {
  render: () => `
    <div style="display: flex; gap: 24px;">
      <input type="radio" name="focus-demo" class="radio" aria-label="First" />
      <input type="radio" name="focus-demo" class="radio" aria-label="Second" checked />
    </div>
  `,
};

/**
 * Figma models no disabled variant, so the library deliberately invents no
 * visual treatment — a disabled radio only swaps the cursor. Flagged for the
 * designer; this story exists to make the gap visible rather than hide it.
 */
export const DisabledGap: Story = {
  render: () => `
    <div style="display: flex; gap: 24px; align-items: center;">
      <input type="radio" class="radio" aria-label="Disabled unchecked" disabled />
      <input type="radio" class="radio" aria-label="Disabled checked" checked disabled />
      <span style="font-size: 12px; color: #666;">
        renders identically to enabled — no Figma variant to reproduce
      </span>
    </div>
  `,
};
