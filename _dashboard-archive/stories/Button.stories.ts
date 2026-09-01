import type { Meta, StoryObj } from "@storybook/html";

interface ButtonArgs {
  label: string;
  variant: "default" | "primary" | "outline" | "empty" | "critical";
  size: "sm" | "md" | "lg";
  disabled: boolean;
  selected: boolean;
  leftIcon: boolean;
  rightIcon: boolean;
  iconName: string;
}

const meta: Meta<ButtonArgs> = {
  title: "Components/Button",
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Button content",
    },
    variant: {
      control: "select",
      options: ["default", "primary", "outline", "empty", "critical"],
      description:
        'Figma\'s Display axis is primary / outline / empty. "default" is not a fourth value — ' +
        'it renders a bare .btn, which IS outline. "critical" is a library extension from Modal.',
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Button size (sm=24px, md=28px, lg=32px)",
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
    },
    selected: {
      control: "boolean",
      description: "Selected state (sets aria-selected)",
    },
    leftIcon: {
      control: "boolean",
      description: "Show icon before label",
    },
    rightIcon: {
      control: "boolean",
      description: "Show icon after label",
    },
    iconName: {
      control: "select",
      options: [
        "save",
        "download",
        "upload",
        "search",
        "filter",
        "edit-3",
        "settings",
        "plus",
        "x",
        "check",
        "arrow-left",
        "arrow-right",
        "chevron-down",
        "chevron-up",
        "more-horizontal",
        "trash-2",
        "copy",
      ],
      description: "Icon to display (from Lucide icon library)",
    },
  },
  args: {
    label: "Button",
    variant: "default",
    size: "md",
    disabled: false,
    selected: false,
    leftIcon: false,
    rightIcon: false,
    iconName: "save",
  },
  render: ({
    label,
    variant,
    size,
    disabled,
    selected,
    leftIcon,
    rightIcon,
    iconName,
  }) => {
    const variantClass =
      variant === "default" ? "" : variant ? `btn-${variant}` : "";
    const sizeClass = size === "md" ? "" : `btn-${size}`;
    const classes = ["btn", variantClass, sizeClass].filter(Boolean).join(" ");
    const ariaSelected = selected ? 'aria-selected="true"' : "";
    const disabledAttr = disabled ? "disabled" : "";

    // Determine icon size based on button size (from Figma specs)
    const iconSize = size === "sm" ? "13" : size === "lg" ? "15" : "14";

    // Build icon HTML
    const leftIconHtml = leftIcon
      ? `<svg class="icon icon-size-${iconSize}" aria-hidden="true"><use href="#${iconName}" /></svg>`
      : "";
    const rightIconHtml = rightIcon
      ? `<svg class="icon icon-size-${iconSize}" aria-hidden="true"><use href="#${iconName}" /></svg>`
      : "";

    return `<button class="${classes}" ${ariaSelected} ${disabledAttr}>${leftIconHtml}${label}${rightIconHtml}</button>`;
  },
};

export default meta;
type Story = StoryObj<ButtonArgs>;

export const Default: Story = {};

export const Primary: Story = {
  args: {
    variant: "primary",
    label: "Primary Button",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    label: "Outline Button",
  },
};

export const Empty: Story = {
  args: {
    variant: "empty",
    label: "Empty Button",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    variant: "primary",
    label: "Small Button",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    variant: "primary",
    label: "Large Button",
  },
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    disabled: true,
    label: "Disabled Button",
  },
};

export const Selected: Story = {
  args: {
    variant: "outline",
    selected: true,
    label: "Selected Button",
  },
};

// Showcase all variants and sizes
export const AllVariants: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 24px; padding: 20px;">
      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">Primary Variant</h3>
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <button class="btn btn-primary btn-sm">Small</button>
          <button class="btn btn-primary">Medium</button>
          <button class="btn btn-primary btn-lg">Large</button>
          <button class="btn btn-primary" disabled>Disabled</button>
        </div>
      </div>

      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">Outline Variant</h3>
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <button class="btn btn-outline btn-sm">Small</button>
          <button class="btn btn-outline">Medium</button>
          <button class="btn btn-outline btn-lg">Large</button>
          <button class="btn btn-outline" aria-selected="true">Selected</button>
          <button class="btn btn-outline" disabled>Disabled</button>
        </div>
      </div>

      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">Empty Variant</h3>
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <button class="btn btn-empty btn-sm">Small</button>
          <button class="btn btn-empty">Medium</button>
          <button class="btn btn-empty btn-lg">Large</button>
          <button class="btn btn-empty" aria-selected="true">Selected</button>
          <button class="btn btn-empty" disabled>Disabled</button>
        </div>
        <p style="margin-top: 8px; font-size: 12px; color: #666;">
          Hover and selected were missing until 2026-08-24 &mdash; empty shares
          outline's ramp in Figma, and it now comes from the base.
        </p>
      </div>

      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">Base &mdash; no Display class</h3>
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <button class="btn" id="bare-rest">Bare .btn</button>
          <button class="btn" id="bare-selected" aria-selected="true">Selected</button>
        </div>
        <p style="margin-top: 8px; font-size: 12px; color: #666;">
          Figma has no "default" Display &mdash; a bare <code>.btn</code> is outline,
          and is now identical to <code>.btn-outline</code> in every state.
        </p>
      </div>

      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">Critical Variant</h3>
        <p style="margin: -6px 0 12px; font-size: 12px; color: #727280;">
          Not in Figma's Button set (73:180) &mdash; it comes from Modal's
          destructive confirm button. Figma specifies the rest state only.
        </p>
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <button class="btn btn-critical btn-sm">Small</button>
          <button class="btn btn-critical">Medium</button>
          <button class="btn btn-critical btn-lg">Large</button>
          <button class="btn btn-critical" disabled>Disabled</button>
        </div>
      </div>

      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">Interactive States</h3>
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <button class="btn btn-primary">Hover me</button>
          <button class="btn btn-outline">Click me (active)</button>
          <button class="btn btn-empty">Tab to me (focus)</button>
        </div>
        <p style="margin-top: 8px; font-size: 13px; color: #666;">
          Hover, click, and keyboard navigate to see state changes
        </p>
      </div>
    </div>
  `,
};

// Buttons with icons - demonstrates Icon component integration
export const WithIcons: Story = {
  render: () => `
    <style>
      .demo-section { margin-bottom: 32px; }
      .demo-title { margin-bottom: 12px; font-weight: 600; font-size: 15px; }
      .demo-grid { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
      .demo-note { margin-top: 8px; font-size: 13px; color: #666; }
    </style>
    <div style="padding: 20px;">
      <div class="demo-section">
        <h3 class="demo-title">Icon Sizing by Button Size</h3>
        <div class="demo-grid">
          <button class="btn btn-primary btn-sm">
            <svg class="icon icon-size-13" aria-hidden="true">
              <use href="#save" />
            </svg>
            Small (13px icon)
          </button>
          <button class="btn btn-primary">
            <svg class="icon icon-size-14" aria-hidden="true">
              <use href="#save" />
            </svg>
            Medium (14px icon)
          </button>
          <button class="btn btn-primary btn-lg">
            <svg class="icon icon-size-15" aria-hidden="true">
              <use href="#save" />
            </svg>
            Large (15px icon)
          </button>
        </div>
        <p class="demo-note">Icon sizes match button sizes: sm=13px, md=14px, lg=15px</p>
      </div>

      <div class="demo-section">
        <h3 class="demo-title">Common Actions with Icons</h3>
        <div class="demo-grid">
          <button class="btn btn-primary">
            <svg class="icon icon-size-14" aria-hidden="true">
              <use href="#save" />
            </svg>
            Save
          </button>
          <button class="btn btn-primary">
            <svg class="icon icon-size-14" aria-hidden="true">
              <use href="#download" />
            </svg>
            Download
          </button>
          <button class="btn btn-outline">
            <svg class="icon icon-size-14" aria-hidden="true">
              <use href="#upload" />
            </svg>
            Upload
          </button>
          <button class="btn btn-outline">
            <svg class="icon icon-size-14" aria-hidden="true">
              <use href="#search" />
            </svg>
            Search
          </button>
          <button class="btn btn-empty">
            <svg class="icon icon-size-14" aria-hidden="true">
              <use href="#edit-3" />
            </svg>
            Edit
          </button>
        </div>
      </div>

      <div class="demo-section">
        <h3 class="demo-title">Icon-Only Buttons</h3>
        <div class="demo-grid">
          <button class="btn btn-outline btn-sm" aria-label="Settings">
            <svg class="icon icon-size-13" aria-hidden="true">
              <use href="#settings" />
            </svg>
          </button>
          <button class="btn btn-outline" aria-label="Filter">
            <svg class="icon icon-size-14" aria-hidden="true">
              <use href="#filter" />
            </svg>
          </button>
          <button class="btn btn-outline" aria-label="More options">
            <svg class="icon icon-size-14" aria-hidden="true">
              <use href="#more-horizontal" />
            </svg>
          </button>
          <button class="btn btn-primary" aria-label="Add new">
            <svg class="icon icon-size-14" aria-hidden="true">
              <use href="#plus" />
            </svg>
          </button>
          <button class="btn btn-empty" aria-label="Close">
            <svg class="icon icon-size-14" aria-hidden="true">
              <use href="#x" />
            </svg>
          </button>
        </div>
        <p class="demo-note">Icon-only buttons require aria-label for accessibility</p>
      </div>

      <div class="demo-section">
        <h3 class="demo-title">Navigation Buttons</h3>
        <div class="demo-grid">
          <button class="btn btn-outline">
            <svg class="icon icon-size-14" aria-hidden="true">
              <use href="#arrow-left" />
            </svg>
            Back
          </button>
          <button class="btn btn-primary">
            Next
            <svg class="icon icon-size-14" aria-hidden="true">
              <use href="#arrow-right" />
            </svg>
          </button>
          <button class="btn btn-outline btn-sm">
            <svg class="icon icon-size-13" aria-hidden="true">
              <use href="#chevron-down" />
            </svg>
            Expand
          </button>
        </div>
      </div>

      <div class="demo-section">
        <h3 class="demo-title">Toolbar with Icon Buttons</h3>
        <div style="display: flex; gap: 4px; padding: 8px; background: #f9f9f9; border-radius: 6px; width: fit-content;">
          <button class="btn btn-empty btn-sm" aria-label="Copy">
            <svg class="icon icon-size-13" aria-hidden="true">
              <use href="#copy" />
            </svg>
          </button>
          <button class="btn btn-empty btn-sm" aria-label="Edit">
            <svg class="icon icon-size-13" aria-hidden="true">
              <use href="#edit-3" />
            </svg>
          </button>
          <button class="btn btn-empty btn-sm" aria-label="Delete">
            <svg class="icon icon-size-13" aria-hidden="true">
              <use href="#trash-2" />
            </svg>
          </button>
          <div style="width: 1px; height: 20px; background: #ddd; margin: 0 4px;"></div>
          <button class="btn btn-empty btn-sm" aria-label="More options">
            <svg class="icon icon-size-13" aria-hidden="true">
              <use href="#more-horizontal" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
};

// Real-world usage examples
export const UsageExamples: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 32px; padding: 20px;">
      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">Form Actions</h3>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-primary">
            <svg class="icon icon-size-14" aria-hidden="true">
              <use href="#check" />
            </svg>
            Submit
          </button>
          <button class="btn btn-outline">Cancel</button>
        </div>
      </div>

      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">Card Actions</h3>
        <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; max-width: 400px;">
          <div style="margin-bottom: 12px;">
            <h4 style="font-weight: 600; margin-bottom: 4px;">Card Title</h4>
            <p style="font-size: 14px; color: #666;">Some content in a card component</p>
          </div>
          <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button class="btn btn-empty btn-sm">Dismiss</button>
            <button class="btn btn-primary btn-sm">
              <svg class="icon icon-size-13" aria-hidden="true">
                <use href="#arrow-right" />
              </svg>
              View Details
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">Dialog Actions</h3>
        <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 400px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
            <h4 style="font-weight: 600; margin: 0;">Confirm Action</h4>
            <button class="btn btn-empty btn-sm" aria-label="Close dialog">
              <svg class="icon icon-size-13" aria-hidden="true">
                <use href="#x" />
              </svg>
            </button>
          </div>
          <p style="font-size: 14px; color: #666; margin-bottom: 16px;">
            Are you sure you want to proceed with this action?
          </p>
          <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button class="btn btn-outline">
              <svg class="icon icon-size-14" aria-hidden="true">
                <use href="#x" />
              </svg>
              Cancel
            </button>
            <button class="btn btn-primary">
              <svg class="icon icon-size-14" aria-hidden="true">
                <use href="#check" />
              </svg>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
};
