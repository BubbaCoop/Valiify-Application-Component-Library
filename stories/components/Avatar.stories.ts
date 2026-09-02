/**
 * Avatar — circular initials marker.
 * Figma: Avatar (23:670), 4 variants: {MD 24, SM 20} × Feint.
 */
import type { Meta, StoryObj } from "@storybook/html";

interface AvatarArgs {
  initials: string;
  size: "md" | "sm";
  feint: boolean;
}

const av = ({ initials = "NC", size = "md", feint = false }) =>
  `<span class="avatar${size === "sm" ? " avatar-sm" : ""}${feint ? " avatar-feint" : ""}">${initials}</span>`;

const meta: Meta<AvatarArgs> = {
  title: "Components/Avatar",
  tags: ["autodocs"],
  argTypes: {
    initials: { control: "text" },
    size: { control: "radio", options: ["md", "sm"] },
    feint: { control: "boolean", description: "8% tint fill, secondary ink" },
  },
  args: { initials: "NC", size: "md", feint: false },
  render: (args) => av(args),
};

export default meta;
type Story = StoryObj<AvatarArgs>;

export const Interactive: Story = {};

export const AllVariants: Story = {
  render: () => `
    <div style="display: flex; gap: 16px; align-items: center;">
      ${av({})}
      ${av({ size: "sm" })}
      ${av({ feint: true })}
      ${av({ size: "sm", feint: true })}
    </div>
  `,
};

/** The uppercase is the Eyebrow/Micro-Label styles' own transform. */
export const CasingIsStyled: Story = {
  render: () => `
    <div style="display: flex; gap: 16px; align-items: center;">
      ${av({ initials: "nc" })}
      <span style="font-size: 12px; color: #6f7276;">typed "nc", rendered caps by the type style</span>
    </div>
  `,
};
