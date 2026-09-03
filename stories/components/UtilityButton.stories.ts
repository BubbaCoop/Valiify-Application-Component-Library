/**
 * UtilityButton — the non-inline / special-use button family.
 * Figma: Button / Utility (24:4382), partial Size × Type × Hover × Pressed
 * matrix. Sibling of Button / Standard with its own label convention
 * (Field Label 13/500 natural case, never uppercase Button Label).
 */
import type { Meta, StoryObj } from "@storybook/html";

interface UtilityButtonArgs {
  type: "empty" | "filled" | "rounded" | "text";
  label: string;
  md: boolean;
  leadingIcon: boolean;
}

const btn = ({ type, label, md, leadingIcon }: Partial<UtilityButtonArgs>) => `
  <button class="utility-button utility-button-${type}${md ? " utility-button-md" : ""}" type="button">
    ${leadingIcon && type !== "text" ? `<svg aria-hidden="true"><use href="#dollar-sign" /></svg>` : ""}
    ${label ?? "Add Funds"}
    ${type === "text" ? `<svg aria-hidden="true"><use href="#chevron-right" /></svg>` : ""}
  </button>`;

const meta: Meta<UtilityButtonArgs> = {
  title: "Components/UtilityButton",
  tags: ["autodocs"],
  argTypes: {
    type: { control: "select", options: ["empty", "filled", "rounded", "text"] },
    label: { control: "text" },
    md: { control: "boolean", description: "54px — Figma draws MD for Empty only (documented, not enforced)" },
    leadingIcon: { control: "boolean" },
  },
  args: { type: "empty", label: "Add Funds", md: false, leadingIcon: true },
  render: (args) => btn(args),
};

export default meta;
type Story = StoryObj<UtilityButtonArgs>;

export const Interactive: Story = {};

/** All four types at SM — hover/press live to see the ramps. */
export const AllTypes: Story = {
  render: () => `
    <div style="display: flex; gap: 24px; align-items: center;">
      ${btn({ type: "empty", label: "Add Funds", leadingIcon: true })}
      ${btn({ type: "filled", label: "Add Funds", leadingIcon: true })}
      ${btn({ type: "rounded", label: "Add Funds", leadingIcon: true })}
      ${btn({ type: "text", label: "Add Funds" })}
    </div>
  `,
};

/** MD (54px) — drawn for the Empty type; Text's Size axis is unwired. */
export const MediumEmpty: Story = {
  render: () => btn({ type: "empty", label: "Add Funds", md: true, leadingIcon: true }),
};
