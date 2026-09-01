import type { Meta, StoryObj } from "@storybook/html-vite";

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

interface InputArgs {
  type: string;
  placeholder: string;
  value: string;
  disabled: boolean;
  error: boolean;
  errorMessage: string;
  label: string;
  showLabel: boolean;
  showHelp: boolean;
  leftIcon: string;
  rightIcon: string;
  size: "sm" | "md" | "lg";
  bgVariant: "white" | "neutral";
}

const meta: Meta<InputArgs> = {
  title: "Components/Input",
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "url", "search"],
      description: "Input type",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    value: {
      control: "text",
      description: "Input value",
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
    },
    error: {
      control: "boolean",
      description: "Error state (shows red border)",
    },
    errorMessage: {
      control: "text",
      description: "Error message text (shown below input when error is true)",
    },
    label: {
      control: "text",
      description: "Label text",
    },
    showLabel: {
      control: "boolean",
      description: "Show label above input",
    },
    showHelp: {
      control: "boolean",
      description: "Show help icon next to label",
    },
    leftIcon: {
      control: "select",
      options: [
        "",
        "search",
        "mail",
        "lock",
        "user",
        "calendar",
        "dollar-sign",
        "percent",
      ],
      description: "Icon to show on left side of input (14px)",
    },
    rightIcon: {
      control: "select",
      options: [
        "",
        "x",
        "check",
        "eye",
        "eye-off",
        "chevron-down",
        "info",
      ],
      description: "Icon to show on right side of input (14px)",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Input size (sm=25px, md=29px, lg=35px)",
    },
    bgVariant: {
      control: "select",
      options: ["white", "neutral"],
      description: "Background variant (white=surface-paper, neutral=surface-card)",
    },
  },
  args: {
    type: "text",
    placeholder: "Enter text...",
    value: "",
    disabled: false,
    error: false,
    errorMessage: "This field is required",
    label: "Field Label",
    showLabel: false,
    showHelp: false,
    leftIcon: "",
    rightIcon: "",
    size: "lg",
    bgVariant: "white",
  },
  render: ({
    type,
    placeholder,
    value,
    disabled,
    error,
    errorMessage,
    label,
    showLabel,
    showHelp,
    leftIcon,
    rightIcon,
    size,
    bgVariant,
  }) => {
    const sizeClass = size === "lg" ? "" : `input-${size}`;
    const bgClass = bgVariant === "neutral" ? "input-bg-neutral" : "";
    const errorClass = error ? "input-error" : "";
    const fieldClasses = [
      "input-field",
      sizeClass,
      bgClass,
      errorClass,
    ]
      .filter(Boolean)
      .join(" ");

    const labelHtml = showLabel
      ? `
        <div class="input-label">
          <span>${label}</span>
          ${
            showHelp
              ? `
            <button class="icon-button icon-button-xs" aria-label="Help">
              <svg class="icon icon-size-12" aria-hidden="true">
                <use href="#custom-help" />
              </svg>
            </button>
          `
              : ""
          }
        </div>
      `
      : "";

    const leftIconHtml = leftIcon
      ? `
        <svg class="input-icon-left icon icon-size-14" aria-hidden="true">
          <use href="#${leftIcon}" />
        </svg>
      `
      : "";

    const rightIconHtml = rightIcon
      ? `
        <svg class="input-icon-right icon icon-size-14" aria-hidden="true">
          <use href="#${rightIcon}" />
        </svg>
      `
      : "";

    const errorMessageHtml =
      error && errorMessage
        ? `
        <div class="input-error-message">
          ${errorMessage}
        </div>
      `
        : "";

    return `
      <div class="input-container">
        ${labelHtml}
        <div class="${fieldClasses}">
          ${leftIconHtml}
          <input
            type="${type}"
            class="input"
            placeholder="${placeholder}"
            value="${value}"
            ${disabled ? "disabled" : ""}
          />
          ${rightIconHtml}
        </div>
        ${errorMessageHtml}
      </div>
    `;
  },
};

export default meta;
type Story = StoryObj<InputArgs>;

export const Interactive: Story = {};

export const WithLabel: Story = {
  args: {
    showLabel: true,
    label: "Email Address",
    placeholder: "you@example.com",
  },
};

export const WithLabelAndHelp: Story = {
  args: {
    showLabel: true,
    showHelp: true,
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
  },
};

export const WithLeftIcon: Story = {
  args: {
    leftIcon: "search",
    placeholder: "Search...",
  },
};

export const WithRightIcon: Story = {
  args: {
    rightIcon: "check",
    value: "Valid input",
  },
};

export const WithBothIcons: Story = {
  args: {
    showLabel: true,
    label: "Amount",
    leftIcon: "dollar-sign",
    rightIcon: "info",
    placeholder: "0.00",
    type: "number",
  },
};

export const ErrorState: Story = {
  args: {
    showLabel: true,
    label: "Email",
    error: true,
    errorMessage: "Please enter a valid email address",
    value: "invalid-email",
  },
};

export const Disabled: Story = {
  args: {
    showLabel: true,
    label: "Disabled Field",
    disabled: true,
    value: "Cannot edit this field",
  },
};

export const AllSizes: Story = {
  render: () => `
    <style>
      .demo-section { margin-bottom: 32px; }
      .demo-title { margin-bottom: 12px; font-weight: 600; font-size: 15px; }
      .demo-grid { display: flex; flex-direction: column; gap: 16px; }
    </style>
    <div style="padding: 20px; max-width: 400px;">
      <div class="demo-section">
        <h3 class="demo-title">All Sizes</h3>
        <div class="demo-grid">
          <div class="input-container">
            <div class="input-label">
              <span>Small (25px) &mdash; 11px text</span>
            </div>
            <div class="input-field input-sm">
              <input type="text" class="input" placeholder="Small input" />
            </div>
          </div>

          <div class="input-container">
            <div class="input-label">
              <span>Medium (29px) &mdash; 13px text</span>
            </div>
            <div class="input-field input-md">
              <input type="text" class="input" placeholder="Medium input" />
            </div>
          </div>

          <div class="input-container">
            <div class="input-label">
              <span>Large (35px) &mdash; 13px text, default</span>
            </div>
            <div class="input-field input-lg">
              <input type="text" class="input" placeholder="Large input" />
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};

export const WithIcons: Story = {
  render: () => `
    <style>
      .demo-section { margin-bottom: 32px; }
      .demo-title { margin-bottom: 12px; font-weight: 600; font-size: 15px; }
      .demo-grid { display: flex; flex-direction: column; gap: 16px; }
    </style>
    <div style="padding: 20px; max-width: 400px;">
      <div class="demo-section">
        <h3 class="demo-title">Common Icon Patterns</h3>
        <div class="demo-grid">
          <div class="input-container">
            <div class="input-label">
              <span>Search</span>
            </div>
            <div class="input-field">
              <svg class="input-icon-left icon icon-size-14" aria-hidden="true">
                <use href="#search" />
              </svg>
              <input type="text" class="input" placeholder="Search..." />
            </div>
          </div>

          <div class="input-container">
            <div class="input-label">
              <span>Email</span>
            </div>
            <div class="input-field">
              <svg class="input-icon-left icon icon-size-14" aria-hidden="true">
                <use href="#mail" />
              </svg>
              <input type="email" class="input" placeholder="you@example.com" />
            </div>
          </div>

          <div class="input-container">
            <div class="input-label">
              <span>Password</span>
            </div>
            <div class="input-field">
              <svg class="input-icon-left icon icon-size-14" aria-hidden="true">
                <use href="#lock" />
              </svg>
              <input type="password" class="input" placeholder="Enter password" />
              <svg class="input-icon-right icon icon-size-14" aria-hidden="true">
                <use href="#eye" />
              </svg>
            </div>
          </div>

          <div class="input-container">
            <div class="input-label">
              <span>Amount</span>
            </div>
            <div class="input-field">
              <svg class="input-icon-left icon icon-size-14" aria-hidden="true">
                <use href="#dollar-sign" />
              </svg>
              <input type="number" class="input" placeholder="0.00" />
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};

export const BackgroundVariants: Story = {
  render: () => `
    <style>
      .demo-section { margin-bottom: 32px; padding: 24px; border-radius: 8px; }
      .demo-title { margin-bottom: 12px; font-weight: 600; font-size: 15px; }
      .demo-grid { display: flex; flex-direction: column; gap: 16px; }
      .bg-white-demo { background: white; }
      .bg-neutral-demo { background: #fafafb; }
    </style>
    <div style="padding: 20px;">
      <div class="demo-section bg-white-demo">
        <h3 class="demo-title">White Background (default)</h3>
        <div class="demo-grid">
          <div class="input-container">
            <div class="input-label">
              <span>Standard Input</span>
            </div>
            <div class="input-field">
              <input type="text" class="input" placeholder="bg-surface-paper" />
            </div>
          </div>
        </div>
      </div>

      <div class="demo-section bg-neutral-demo">
        <h3 class="demo-title">Neutral Background</h3>
        <div class="demo-grid">
          <div class="input-container">
            <div class="input-label">
              <span>Neutral Variant</span>
            </div>
            <div class="input-field input-bg-neutral">
              <input type="text" class="input" placeholder="bg-surface-card" />
            </div>
          </div>
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
      .demo-grid { display: flex; flex-direction: column; gap: 16px; }
      .demo-note { margin-top: 8px; font-size: 13px; color: #666; }
    </style>
    <div style="padding: 20px; max-width: 400px;">
      <div class="demo-section">
        <h3 class="demo-title">All States</h3>
        <div class="demo-grid">
          <div class="input-container">
            <div class="input-label">
              <span>Rest</span>
            </div>
            <div class="input-field">
              <input type="text" class="input" placeholder="Default state" />
            </div>
          </div>

          <div class="input-container">
            <div class="input-label">
              <span>Hover</span>
            </div>
            <div class="input-field">
              <input type="text" class="input" placeholder="Hover over this input" />
            </div>
            <p class="demo-note">Border darkens on hover</p>
          </div>

          <div class="input-container">
            <div class="input-label">
              <span>Focus</span>
            </div>
            <div class="input-field">
              <input type="text" class="input" placeholder="Click or tab to focus" />
            </div>
            <p class="demo-note">Focus ring appears when focused</p>
          </div>

          <div class="input-container">
            <div class="input-label">
              <span>Error</span>
            </div>
            <div class="input-field input-error">
              <input type="text" class="input" value="Invalid input" />
            </div>
            <div class="input-error-message">
              This field is required
            </div>
          </div>

          <div class="input-container">
            <div class="input-label">
              <span>Disabled</span>
            </div>
            <div class="input-field">
              <input type="text" class="input" disabled value="Cannot edit" />
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};

export const FormExample: Story = {
  render: () => `
    <style>
      .form-demo { max-width: 500px; padding: 32px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      .form-title { margin-bottom: 24px; font-size: 24px; font-weight: 600; }
      .form-field { margin-bottom: 20px; }
      .form-actions { margin-top: 24px; display: flex; gap: 12px; }
    </style>
    <div class="form-demo">
      <h2 class="form-title">Contact Form</h2>

      <div class="form-field">
        <div class="input-container">
          <div class="input-label">
            <span>Full Name</span>
            <button class="icon-button icon-button-xs" aria-label="Help">
              <svg class="icon icon-size-12" aria-hidden="true">
                <use href="#custom-help" />
              </svg>
            </button>
          </div>
          <div class="input-field">
            <svg class="input-icon-left icon icon-size-14" aria-hidden="true">
              <use href="#user" />
            </svg>
            <input type="text" class="input" placeholder="John Doe" />
          </div>
        </div>
      </div>

      <div class="form-field">
        <div class="input-container">
          <div class="input-label">
            <span>Email Address</span>
          </div>
          <div class="input-field input-error">
            <svg class="input-icon-left icon icon-size-14" aria-hidden="true">
              <use href="#mail" />
            </svg>
            <input type="email" class="input" value="invalid-email" />
          </div>
          <div class="input-error-message">
            Please enter a valid email address
          </div>
        </div>
      </div>

      <div class="form-field">
        <div class="input-container">
          <div class="input-label">
            <span>Phone Number</span>
          </div>
          <div class="input-field input-md">
            <input type="tel" class="input" placeholder="+1 (555) 000-0000" />
          </div>
        </div>
      </div>

      <div class="form-field">
        <div class="input-container">
          <div class="input-label">
            <span>Message</span>
          </div>
          <div class="input-field" style="height: auto; padding: 12px;">
            <textarea class="input" rows="4" placeholder="Tell us how we can help..."></textarea>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn btn-outline">Cancel</button>
        <button class="btn btn-primary">
          <svg class="icon icon-size-14" aria-hidden="true">
            <use href="#send" />
          </svg>
          Send Message
        </button>
      </div>
    </div>
  `,
};
