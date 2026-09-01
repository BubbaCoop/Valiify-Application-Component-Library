import type { Meta, StoryObj } from "@storybook/html";

// Load sprite into page for icon <use> references
const spriteUrl = '/sprite.svg';

const loadSprite = () => {
  if (typeof document !== 'undefined' && !document.getElementById('icon-sprite')) {
    fetch(spriteUrl)
      .then(res => res.text())
      .then(svg => {
        const div = document.createElement('div');
        div.id = 'icon-sprite';
        div.style.display = 'none';
        div.innerHTML = svg;
        document.body.insertBefore(div, document.body.firstChild);
      });
  }
};

loadSprite();

interface IconButtonArgs {
  icon: string;
  size: "xs" | "md" | "lg";
  disabled: boolean;
  ariaLabel: string;
}

const meta: Meta<IconButtonArgs> = {
  title: "Components/IconButton",
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: "select",
      options: [
        "x",
        "plus",
        "minus",
        "settings",
        "custom-help",
        "info",
        "chevron-down",
        "chevron-up",
        "chevron-left",
        "chevron-right",
        "more-horizontal",
        "more-vertical",
      ],
      description: "Icon to display",
    },
    size: {
      control: "select",
      options: ["xs", "md", "lg"],
      description: "Button size (xs=12px, md=18px, lg=28px)",
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for screen readers",
    },
  },
  args: {
    icon: "settings",
    size: "lg",
    disabled: false,
    ariaLabel: "Settings",
  },
  render: ({ icon, size, disabled, ariaLabel }) => {
    const sizeClass = size === "lg" ? "" : `icon-button-${size}`;
    const classes = ["icon-button", sizeClass].filter(Boolean).join(" ");

    const iconSize = size === "xs" ? "12" : size === "md" ? "14" : "16";

    return `
      <button class="${classes}" aria-label="${ariaLabel}" ${disabled ? "disabled" : ""}>
        <svg class="icon icon-size-${iconSize}" aria-hidden="true">
          <use href="#${icon}" />
        </svg>
      </button>
    `;
  },
};

export default meta;
type Story = StoryObj<IconButtonArgs>;

export const Interactive: Story = {};

export const ExtraSmall: Story = {
  args: {
    size: "xs",
    icon: "custom-help",
    ariaLabel: "Help",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
    icon: "x",
    ariaLabel: "Close",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    icon: "settings",
    ariaLabel: "Settings",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const AllSizes: Story = {
  render: () => `
    <style>
      .demo-section { margin-bottom: 32px; }
      .demo-title { margin-bottom: 12px; font-weight: 600; font-size: 15px; }
      .demo-grid { display: flex; gap: 16px; align-items: center; }
      .demo-label { font-size: 13px; color: #666; }
    </style>
    <div style="padding: 20px;">
      <div class="demo-section">
        <h3 class="demo-title">All Sizes</h3>
        <div class="demo-grid">
          <div style="text-align: center;">
            <button class="icon-button icon-button-xs" aria-label="Help">
              <svg class="icon icon-size-12" aria-hidden="true">
                <use href="#custom-help" />
              </svg>
            </button>
            <p class="demo-label">XS (12px)</p>
          </div>

          <div style="text-align: center;">
            <button class="icon-button icon-button-md" aria-label="Close">
              <svg class="icon icon-size-14" aria-hidden="true">
                <use href="#x" />
              </svg>
            </button>
            <p class="demo-label">MD (18px)</p>
          </div>

          <div style="text-align: center;">
            <button class="icon-button icon-button-lg" aria-label="Settings">
              <svg class="icon icon-size-16" aria-hidden="true">
                <use href="#settings" />
              </svg>
            </button>
            <p class="demo-label">LG (28px)</p>
          </div>
        </div>
      </div>
    </div>
  `,
};

export const CommonIcons: Story = {
  render: () => `
    <style>
      .demo-section { margin-bottom: 32px; }
      .demo-title { margin-bottom: 12px; font-weight: 600; font-size: 15px; }
      .demo-grid { display: flex; gap: 12px; flex-wrap: wrap; }
    </style>
    <div style="padding: 20px;">
      <div class="demo-section">
        <h3 class="demo-title">Common Icon Buttons (MD)</h3>
        <div class="demo-grid">
          <button class="icon-button icon-button-md" aria-label="Close">
            <svg class="icon icon-size-14" aria-hidden="true">
              <use href="#x" />
            </svg>
          </button>

          <button class="icon-button icon-button-md" aria-label="Add">
            <svg class="icon icon-size-14" aria-hidden="true">
              <use href="#plus" />
            </svg>
          </button>

          <button class="icon-button icon-button-md" aria-label="Remove">
            <svg class="icon icon-size-14" aria-hidden="true">
              <use href="#minus" />
            </svg>
          </button>

          <button class="icon-button icon-button-md" aria-label="Settings">
            <svg class="icon icon-size-14" aria-hidden="true">
              <use href="#settings" />
            </svg>
          </button>

          <button class="icon-button icon-button-md" aria-label="Info">
            <svg class="icon icon-size-14" aria-hidden="true">
              <use href="#info" />
            </svg>
          </button>

          <button class="icon-button icon-button-md" aria-label="Expand">
            <svg class="icon icon-size-14" aria-hidden="true">
              <use href="#chevron-down" />
            </svg>
          </button>

          <button class="icon-button icon-button-md" aria-label="More">
            <svg class="icon icon-size-14" aria-hidden="true">
              <use href="#more-horizontal" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
};

export const AllStates: Story = {
  render: () => `
    <style>
      .demo-section { margin-bottom: 32px; }
      .demo-title { margin-bottom: 12px; font-weight: 600; font-size: 15px; }
      .demo-grid { display: flex; gap: 16px; align-items: center; }
      .demo-label { font-size: 13px; color: #666; margin-top: 8px; }
    </style>
    <div style="padding: 20px;">
      <div class="demo-section">
        <h3 class="demo-title">All States</h3>
        <div class="demo-grid">
          <div style="text-align: center;">
            <button class="icon-button icon-button-md" aria-label="Settings">
              <svg class="icon icon-size-14" aria-hidden="true">
                <use href="#settings" />
              </svg>
            </button>
            <p class="demo-label">Rest</p>
          </div>

          <div style="text-align: center;">
            <button class="icon-button icon-button-md" aria-label="Settings">
              <svg class="icon icon-size-14" aria-hidden="true">
                <use href="#settings" />
              </svg>
            </button>
            <p class="demo-label">Hover (hover me)</p>
          </div>

          <div style="text-align: center;">
            <button class="icon-button icon-button-md" disabled aria-label="Settings">
              <svg class="icon icon-size-14" aria-hidden="true">
                <use href="#settings" />
              </svg>
            </button>
            <p class="demo-label">Disabled</p>
          </div>
        </div>
      </div>
    </div>
  `,
};
