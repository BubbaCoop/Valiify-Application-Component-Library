/**
 * Badge — small uppercase qualifier pill.
 * Figma: Badge (28:507), a single symbol with no variant axes.
 */
import type { Meta, StoryObj } from "@storybook/html";

interface BadgeArgs {
  label: string;
}

const meta: Meta<BadgeArgs> = {
  title: "Components/Badge",
  tags: ["autodocs"],
  argTypes: { label: { control: "text" } },
  args: { label: "Optional" },
  render: ({ label }) => `<span class="badge">${label}</span>`,
};

export default meta;
type Story = StoryObj<BadgeArgs>;

export const Interactive: Story = {};

/** In context: qualifying a field label, per the Figma usage. */
export const InContext: Story = {
  render: () => `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 13px; font-weight: 500; color: #1a1a1a;">Middle name</span>
      <span class="badge">Optional</span>
    </div>
  `,
};
