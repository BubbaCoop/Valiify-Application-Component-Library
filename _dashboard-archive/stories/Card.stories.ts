import type { Meta, StoryObj } from "@storybook/html-vite";

interface CardArgs {
  title: string;
  body: string;
  compact: boolean;
  bordered: boolean;
  hover: boolean;
}

const meta: Meta<CardArgs> = {
  title: "Components/Card",
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Card title",
    },
    body: {
      control: "text",
      description: "Card body content",
    },
    compact: {
      control: "boolean",
      description: "Compact padding",
    },
    bordered: {
      control: "boolean",
      description: "Stronger border",
    },
    hover: {
      control: "boolean",
      description: "Hover effect",
    },
  },
  args: {
    title: "Card Title",
    body: "This is the card body content. It can contain multiple lines of text and other elements.",
    compact: false,
    bordered: false,
    hover: false,
  },
  render: ({ title, body, compact, bordered, hover }) => {
    const compactClass = compact ? "card-compact" : "";
    const borderedClass = bordered ? "card-bordered" : "";
    const hoverClass = hover ? "card-hover" : "";

    return `
      <div class="card ${compactClass} ${borderedClass} ${hoverClass}" style="max-width: 400px;">
        <h2 class="card-title">${title}</h2>
        <p class="card-body">${body}</p>
      </div>
    `;
  },
};

export default meta;
type Story = StoryObj<CardArgs>;

export const Default: Story = {};

export const Compact: Story = {
  args: {
    compact: true,
  },
};

export const Bordered: Story = {
  args: {
    bordered: true,
  },
};

export const Hoverable: Story = {
  args: {
    hover: true,
    title: "Hoverable Card",
    body: "Hover over this card to see the shadow effect.",
  },
};

export const WithButtons: Story = {
  render: () => `
    <div class="card" style="max-width: 400px;">
      <h2 class="card-title">Action Card</h2>
      <p class="card-body">This card includes action buttons at the bottom.</p>
      <div style="display: flex; gap: 8px; margin-top: 16px;">
        <button class="btn btn-primary">Primary</button>
        <button class="btn btn-outline">Secondary</button>
      </div>
    </div>
  `,
};

export const WithForm: Story = {
  render: () => `
    <div class="card" style="max-width: 400px;">
      <h2 class="card-title">Sign In</h2>
      <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 12px;">
        <input type="email" class="input" placeholder="Email" />
        <input type="password" class="input" placeholder="Password" />
        <button class="btn btn-primary" style="width: 100%;">Sign In</button>
      </div>
    </div>
  `,
};

export const CardGrid: Story = {
  render: () => `
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px;">
      <div class="card card-hover">
        <h2 class="card-title">Card 1</h2>
        <p class="card-body">First card in the grid.</p>
      </div>
      <div class="card card-hover">
        <h2 class="card-title">Card 2</h2>
        <p class="card-body">Second card in the grid.</p>
      </div>
      <div class="card card-hover">
        <h2 class="card-title">Card 3</h2>
        <p class="card-body">Third card in the grid.</p>
      </div>
    </div>
  `,
};
