/**
 * Owner — icon-in-a-box marker for an application owner.
 * Figma: Owner (261:13225), Type {individual, Add, company}, all 34×34.
 * One class; the three "variants" are glyph swaps in a caller slot.
 */
import type { Meta, StoryObj } from "@storybook/html";

interface OwnerArgs {
  icon: string;
}

const owner = (icon: string) =>
  `<span class="owner"><svg aria-hidden="true"><use href="#${icon}" /></svg></span>`;

const meta: Meta<OwnerArgs> = {
  title: "Components/Owner",
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: "select",
      options: ["user", "plus", "building"],
      description: "Sprite glyph — Figma's Type axis is a glyph swap",
    },
  },
  args: { icon: "user" },
  render: ({ icon }) => owner(icon),
};

export default meta;
type Story = StoryObj<OwnerArgs>;

export const Interactive: Story = {};

/** Figma's three Type variants: individual / Add / company. */
export const AllTypes: Story = {
  render: () => `
    <div style="display: flex; gap: 16px; align-items: center;">
      ${owner("user")}
      ${owner("plus")}
      ${owner("building")}
    </div>
  `,
};
