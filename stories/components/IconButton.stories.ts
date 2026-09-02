/**
 * IconButton — compact icon-only button.
 *
 * Figma: "icon button" (1:429), 16 variants across Size × Type × Hover ×
 * Subtle. The glyph is a caller slot — any sprite symbol; the button sizes
 * and paints its child svg directly (no icon class system needed).
 */
import type { Meta, StoryObj } from "@storybook/html";

interface IconButtonArgs {
  icon: string;
  size: "md" | "sm";
  type: "icon-only" | "state";
  subtle: boolean;
  disabled: boolean;
}

const btn = ({
  icon = "x",
  size = "md",
  type = "icon-only",
  subtle = false,
  disabled = false,
  label = "Action",
}) => `
  <button
    class="icon-button${size === "sm" ? " icon-button-sm" : ""}${type === "state" ? " icon-button-state" : ""}${subtle ? " icon-button-subtle" : ""}"
    aria-label="${label}"
    ${disabled ? "disabled" : ""}
  >
    <svg aria-hidden="true"><use href="#${icon}" /></svg>
  </button>`;

const meta: Meta<IconButtonArgs> = {
  title: "Components/IconButton",
  tags: ["autodocs"],
  argTypes: {
    icon: { control: "text", description: "Sprite symbol id" },
    size: { control: "radio", options: ["md", "sm"] },
    type: {
      control: "radio",
      options: ["icon-only", "state"],
      description:
        "Icon Only: the glyph is the box, hover recolours only. State: padded hit target with a circular hover halo.",
    },
    subtle: {
      control: "boolean",
      description: "Muted ramp: rest at 60% ink, hover restores Base",
    },
    disabled: { control: "boolean" },
  },
  args: {
    icon: "x",
    size: "md",
    type: "icon-only",
    subtle: false,
    disabled: false,
  },
  render: (args) => btn(args),
};

export default meta;
type Story = StoryObj<IconButtonArgs>;

export const Interactive: Story = {};

/** All 8 rest combinations (hover states need a pointer). */
export const AllVariants: Story = {
  render: () => `
    <div style="display: grid; grid-template-columns: repeat(4, auto); gap: 20px; justify-items: center; align-items: center;">
      ${btn({ label: "md" })}
      ${btn({ subtle: true, label: "md subtle" })}
      ${btn({ type: "state", label: "md state" })}
      ${btn({ type: "state", subtle: true, label: "md state subtle" })}
      ${btn({ size: "sm", label: "sm" })}
      ${btn({ size: "sm", subtle: true, label: "sm subtle" })}
      ${btn({ size: "sm", type: "state", label: "sm state" })}
      ${btn({ size: "sm", type: "state", subtle: true, label: "sm state subtle" })}
    </div>
  `,
};

/**
 * The two Types side by side. Hover an Icon Only button: the glyph darkens
 * and NOTHING else changes. Hover a State button: a circular Action/Hover
 * halo appears around the same-size glyph.
 */
export const IconOnlyVsState: Story = {
  render: () => `
    <div style="display: flex; gap: 32px; align-items: center;">
      ${btn({ icon: "settings", label: "Icon only" })}
      ${btn({ icon: "settings", type: "state", label: "State" })}
    </div>
  `,
};

/** Common glyphs from the sprite — the slot takes any symbol id. */
export const CommonIcons: Story = {
  render: () => `
    <div style="display: flex; gap: 16px; align-items: center;">
      ${["x", "settings", "search", "chevron-left", "chevron-right", "eye", "trash-2", "pencil"]
        .map((icon) => btn({ icon, type: "state", label: icon }))
        .join("")}
    </div>
  `,
};

/**
 * Figma models no disabled variant — cursor only, no visual change. This
 * story keeps the gap visible rather than hiding it.
 */
export const DisabledGap: Story = {
  render: () => `
    <div style="display: flex; gap: 16px; align-items: center;">
      ${btn({ disabled: true, label: "Disabled" })}
      ${btn({ type: "state", disabled: true, label: "Disabled state" })}
      <span style="font-size: 12px; color: #6f7276;">renders identically to enabled — no Figma variant to reproduce</span>
    </div>
  `,
};
