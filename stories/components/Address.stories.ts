/**
 * Address — the grouped address entry ("Address Super entry", Figma
 * 281:4634). One group box, five bespoke cells in three rows; every state
 * lives on the GROUP (focus additionally marks the focused row with a 2px
 * Primary/Track inset). Not a composition of TextField.
 */
import type { Meta, StoryObj } from "@storybook/html";

interface AddressArgs {
  label: string;
  invalid: boolean;
  disabled: boolean;
  hint: string;
}

let uid = 0;
const address = ({ label, invalid, disabled, hint }: Partial<AddressArgs>) => {
  const id = `addr-${uid++}`;
  const inv = invalid ? ' aria-invalid="true"' : "";
  const dis = disabled ? " disabled" : "";
  return `
  <div class="va-address">
    <div class="va-address-title-row">
      <span class="va-address-title">${label ?? "Address"}</span>
    </div>
    <div class="va-address-group">
      <div class="va-address-row">
        <input id="${id}-street" class="va-address-input" placeholder="Address..." aria-label="Street address"${inv}${dis} />
      </div>
      <div class="va-address-row">
        <input class="va-address-input" placeholder="Apt, suite, unit" aria-label="Apartment, suite, or unit"${inv}${dis} />
        <span class="va-address-optional">Optional</span>
      </div>
      <div class="va-address-row">
        <input class="va-address-input va-address-input-city" placeholder="City" aria-label="City"${inv}${dis} />
        <input class="va-address-input va-address-input-state" placeholder="State" aria-label="State"${inv}${dis} />
        <input class="va-address-input" placeholder="00000" inputmode="numeric" aria-label="ZIP code"${inv}${dis} />
      </div>
    </div>
    ${hint ? `<p class="va-address-hint">${hint}</p>` : ""}
  </div>`;
};

const meta: Meta<AddressArgs> = {
  title: "Components/Address",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    invalid: {
      control: "boolean",
      description: "aria-invalid on the inputs — amber group border (D4)",
    },
    disabled: {
      control: "boolean",
      description: "App Page fill + Tertiary inks (the family recipe)",
    },
    hint: {
      control: "text",
      description: "Labeled family extension — Figma draws no hint row",
    },
  },
  args: { label: "Address", invalid: false, disabled: false, hint: "" },
  render: (args) => `<div style="max-width: 518px;">${address(args)}</div>`,
};

export default meta;
type Story = StoryObj<AddressArgs>;

export const Interactive: Story = {};

/** Rest · error (amber group border + hint) · disabled — focus is live
 *  (click into a cell: Primary group border + ring + row marker). */
export const AllStates: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 518px;">
      ${address({})}
      ${address({ invalid: true, hint: "Enter a complete address." })}
      ${address({ disabled: true })}
    </div>
  `,
};
