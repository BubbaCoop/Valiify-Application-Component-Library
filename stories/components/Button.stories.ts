/**
 * Button — the four Short App button types.
 *
 * Figma: Button (1:218), 16 variants across Type × {rest, hover, pressed,
 * inactive}. A type class is required — bare .btn is layout-only.
 */
import type { Meta, StoryObj } from "@storybook/html";

interface ButtonArgs {
  type: "primary" | "secondary" | "micro" | "bubble";
  label: string;
  disabled: boolean;
  trailingIcon: boolean;
}

const btn = ({
  type = "primary",
  label = "Button",
  disabled = false,
  leading = "",
  trailing = "",
}: {
  type?: string;
  label?: string;
  disabled?: boolean;
  leading?: string;
  trailing?: string;
}) => `
  <button class="btn btn-${type}" ${disabled ? "disabled" : ""}>
    ${leading ? `<svg aria-hidden="true"><use href="#${leading}" /></svg>` : ""}
    ${label}
    ${trailing ? `<svg aria-hidden="true"><use href="#${trailing}" /></svg>` : ""}
  </button>`;

const meta: Meta<ButtonArgs> = {
  title: "Components/Button",
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "radio",
      options: ["primary", "secondary", "micro", "bubble"],
      description: "Required — Figma names no default Type",
    },
    label: { control: "text" },
    disabled: { control: "boolean", description: "Figma's Inactive axis" },
    trailingIcon: { control: "boolean" },
  },
  args: { type: "primary", label: "Button", disabled: false, trailingIcon: true },
  render: ({ type, label, disabled, trailingIcon }) =>
    btn({ type, label, disabled, trailing: trailingIcon ? "arrow-right" : "" }),
};

export default meta;
type Story = StoryObj<ButtonArgs>;

export const Interactive: Story = {};

/** All four Types at rest and disabled. */
export const AllTypes: Story = {
  render: () => `
    <div style="display: grid; grid-template-columns: auto auto; gap: 20px 40px; align-items: center; justify-content: start;">
      ${btn({ type: "primary", trailing: "arrow-right" })}
      ${btn({ type: "primary", trailing: "arrow-right", disabled: true })}
      ${btn({ type: "secondary", trailing: "arrow-right" })}
      ${btn({ type: "secondary", trailing: "arrow-right", disabled: true })}
      ${btn({ type: "micro", trailing: "arrow-right" })}
      ${btn({ type: "micro", trailing: "arrow-right", disabled: true })}
      ${btn({ type: "bubble" })}
      ${btn({ type: "bubble", disabled: true })}
    </div>
  `,
};

/**
 * Casing is styled, not typed: the label is written "Button" in every story;
 * Primary/Secondary/Micro render it UPPERCASE via the type-button-label /
 * type-micro-label utilities, Bubble renders it as written.
 */
export const CasingIsStyled: Story = {
  render: () => `
    <div style="display: flex; gap: 24px; align-items: center;">
      ${btn({ type: "secondary", label: "Continue application" })}
      ${btn({ type: "bubble", label: "Skip" })}
    </div>
  `,
};

/** Icon slots per Figma: Primary trailing, Secondary/Micro both, Bubble leading. */
export const IconSlots: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 16px; align-items: start;">
      ${btn({ type: "primary", label: "Continue", trailing: "arrow-right" })}
      ${btn({ type: "secondary", label: "Back", leading: "arrow-left" })}
      ${btn({ type: "micro", label: "View all", trailing: "arrow-right" })}
      ${btn({ type: "bubble", label: "Add", leading: "plus" })}
    </div>
  `,
};

/** Full-width is the caller's: add w-full where the form needs it. */
export const FullWidth: Story = {
  render: () => `
    <div style="width: 360px; display: flex; flex-direction: column; gap: 12px;">
      <button class="btn btn-primary" style="width: 100%;">
        Submit application
        <svg aria-hidden="true"><use href="#arrow-right" /></svg>
      </button>
      <button class="btn btn-secondary" style="width: 100%;">Save for later</button>
    </div>
  `,
};

/**
 * Micro's hover and pressed are pixel-identical in Figma (0/696 diff) —
 * reproduced as one rule, on the designer list. Hover a micro button:
 * pressing adds no further feedback.
 */
export const MicroNoOpPair: Story = {
  render: () => `
    <div style="display: flex; gap: 16px; align-items: center;">
      ${btn({ type: "micro", label: "View details", trailing: "arrow-right" })}
      <span style="font-size: 12px; color: #6f7276;">hover = pressed, per the design file</span>
    </div>
  `,
};
