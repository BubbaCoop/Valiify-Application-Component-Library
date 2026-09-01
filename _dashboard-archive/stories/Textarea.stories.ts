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

interface TextareaArgs {
  placeholder: string;
  value: string;
  disabled: boolean;
  error: boolean;
  errorMessage: string;
  label: string;
  showLabel: boolean;
  showHelp: boolean;
  showCounter: boolean;
  maxLength: number;
  rows: number;
  bgVariant: "white" | "neutral";
}

const meta: Meta<TextareaArgs> = {
  title: "Components/Textarea",
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    value: {
      control: "text",
      description: "Textarea value",
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
      description: "Error message text (shown below textarea when error is true)",
    },
    label: {
      control: "text",
      description: "Label text",
    },
    showLabel: {
      control: "boolean",
      description: "Show label above textarea",
    },
    showHelp: {
      control: "boolean",
      description: "Show help icon next to label",
    },
    showCounter: {
      control: "boolean",
      description: "Show character counter",
    },
    maxLength: {
      control: "number",
      description: "Maximum character length",
    },
    rows: {
      control: "number",
      description: "Number of visible rows",
    },
    bgVariant: {
      control: "select",
      options: ["white", "neutral"],
      description: "Background variant (white=surface-paper, neutral=surface-card)",
    },
  },
  args: {
    placeholder: "Enter your message...",
    value: "",
    disabled: false,
    error: false,
    errorMessage: "This field is required",
    label: "Message",
    showLabel: false,
    showHelp: false,
    showCounter: false,
    maxLength: 500,
    rows: 4,
    bgVariant: "white",
  },
  render: ({
    placeholder,
    value,
    disabled,
    error,
    errorMessage,
    label,
    showLabel,
    showHelp,
    showCounter,
    maxLength,
    rows,
    bgVariant,
  }) => {
    const bgClass = bgVariant === "neutral" ? "textarea-bg-neutral" : "";
    const errorClass = error ? "textarea-error" : "";
    const fieldClasses = [
      "textarea-field",
      bgClass,
      errorClass,
    ]
      .filter(Boolean)
      .join(" ");

    const labelHtml = showLabel
      ? `
        <div class="textarea-label">
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

    const counterHtml = showCounter
      ? `
        <div class="textarea-counter">
          ${value.length} / ${maxLength}
        </div>
      `
      : "";

    const errorMessageHtml =
      error && errorMessage
        ? `
        <div class="textarea-error-message">
          ${errorMessage}
        </div>
      `
        : "";

    return `
      <div class="textarea-container">
        ${labelHtml}
        <div class="${fieldClasses}">
          <textarea
            class="textarea"
            rows="${rows}"
            placeholder="${placeholder}"
            ${disabled ? "disabled" : ""}
            ${showCounter ? `maxlength="${maxLength}"` : ""}
          >${value}</textarea>
        </div>
        ${counterHtml}
        ${errorMessageHtml}
      </div>
    `;
  },
};

export default meta;
type Story = StoryObj<TextareaArgs>;

export const Interactive: Story = {};

export const WithLabel: Story = {
  args: {
    showLabel: true,
    label: "Description",
    placeholder: "Enter a detailed description...",
  },
};

export const WithLabelAndHelp: Story = {
  args: {
    showLabel: true,
    showHelp: true,
    label: "Comments",
    placeholder: "Add your comments here...",
  },
};

export const WithCharacterCounter: Story = {
  args: {
    showLabel: true,
    showCounter: true,
    label: "Bio",
    placeholder: "Tell us about yourself...",
    maxLength: 200,
    value: "I'm a software developer with 5 years of experience.",
  },
};

export const ErrorState: Story = {
  args: {
    showLabel: true,
    label: "Feedback",
    error: true,
    errorMessage: "Please provide more details (minimum 50 characters)",
    value: "Too short",
  },
};

export const Disabled: Story = {
  args: {
    showLabel: true,
    label: "Disabled Field",
    disabled: true,
    value: "This field cannot be edited",
  },
};

/**
 * Height is not a design token. Figma defines no Size property for this
 * component, so the box is sized by `rows`, by a height utility, or by the
 * user dragging the resize handle.
 */
export const Sizing: Story = {
  render: () => `
    <style>
      .demo-section { margin-bottom: 32px; }
      .demo-title { margin-bottom: 12px; font-weight: 600; font-size: 15px; }
      .demo-grid { display: flex; flex-direction: column; gap: 16px; }
      .demo-note { margin: 4px 0 0; font-size: 12px; color: #727280; }
    </style>
    <div style="padding: 20px; max-width: 600px;">
      <div class="demo-section">
        <h3 class="demo-title">Sizing is the consumer's call</h3>
        <div class="demo-grid">
          <div class="textarea-container">
            <div class="textarea-label"><span>rows="2"</span></div>
            <div class="textarea-field">
              <textarea class="textarea" rows="2" placeholder="Two lines"></textarea>
            </div>
            <p class="demo-note">Field hugs the textarea</p>
          </div>

          <div class="textarea-container">
            <div class="textarea-label"><span>rows="5"</span></div>
            <div class="textarea-field">
              <textarea class="textarea" rows="5" placeholder="Five lines"></textarea>
            </div>
            <p class="demo-note">Drag the handle to grow it</p>
          </div>

          <div class="textarea-container">
            <div class="textarea-label"><span>Fixed height, no resize</span></div>
            <div class="textarea-field">
              <textarea class="textarea" style="height: 120px; resize: none;" placeholder="Locked at 120px"></textarea>
            </div>
            <p class="demo-note">Set an explicit height and resize-none</p>
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
          <div class="textarea-container">
            <div class="textarea-label">
              <span>Standard Textarea</span>
            </div>
            <div class="textarea-field">
              <textarea class="textarea" rows="4" placeholder="bg-surface-paper"></textarea>
            </div>
          </div>
        </div>
      </div>

      <div class="demo-section bg-neutral-demo">
        <h3 class="demo-title">Neutral Background</h3>
        <div class="demo-grid">
          <div class="textarea-container">
            <div class="textarea-label">
              <span>Neutral Variant</span>
            </div>
            <div class="textarea-field textarea-bg-neutral">
              <textarea class="textarea" rows="4" placeholder="bg-surface-card"></textarea>
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
    <div style="padding: 20px; max-width: 600px;">
      <div class="demo-section">
        <h3 class="demo-title">All States</h3>
        <div class="demo-grid">
          <div class="textarea-container">
            <div class="textarea-label">
              <span>Rest</span>
            </div>
            <div class="textarea-field">
              <textarea class="textarea" rows="3" placeholder="Default state"></textarea>
            </div>
          </div>

          <div class="textarea-container">
            <div class="textarea-label">
              <span>Hover</span>
            </div>
            <div class="textarea-field">
              <textarea class="textarea" rows="3" placeholder="Hover over this textarea"></textarea>
            </div>
            <p class="demo-note">Border darkens on hover</p>
          </div>

          <div class="textarea-container">
            <div class="textarea-label">
              <span>Focus</span>
            </div>
            <div class="textarea-field">
              <textarea class="textarea" rows="3" placeholder="Click or tab to focus"></textarea>
            </div>
            <p class="demo-note">Focus ring appears when focused</p>
          </div>

          <div class="textarea-container">
            <div class="textarea-label">
              <span>Error</span>
            </div>
            <div class="textarea-field textarea-error">
              <textarea class="textarea" rows="3">Invalid content</textarea>
            </div>
            <div class="textarea-error-message">
              This field is required
            </div>
          </div>

          <div class="textarea-container">
            <div class="textarea-label">
              <span>Disabled</span>
            </div>
            <div class="textarea-field">
              <textarea class="textarea" rows="3" disabled>Cannot edit this textarea</textarea>
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
      .form-demo { max-width: 700px; padding: 32px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      .form-title { margin-bottom: 24px; font-size: 24px; font-weight: 600; }
      .form-field { margin-bottom: 20px; }
      .form-actions { margin-top: 24px; display: flex; gap: 12px; }
    </style>
    <div class="form-demo">
      <h2 class="form-title">Support Request</h2>

      <div class="form-field">
        <div class="input-container">
          <div class="input-label">
            <span>Subject</span>
          </div>
          <div class="input-field">
            <input type="text" class="input" placeholder="Brief description of your issue" />
          </div>
        </div>
      </div>

      <div class="form-field">
        <div class="textarea-container">
          <div class="textarea-label">
            <span>Description</span>
            <button class="icon-button icon-button-xs" aria-label="Help">
              <svg class="icon icon-size-12" aria-hidden="true">
                <use href="#custom-help" />
              </svg>
            </button>
          </div>
          <div class="textarea-field">
            <textarea class="textarea" rows="6" placeholder="Please provide a detailed description of your issue..."></textarea>
          </div>
          <div class="textarea-counter">
            0 / 1000
          </div>
        </div>
      </div>

      <div class="form-field">
        <div class="textarea-container">
          <div class="textarea-label">
            <span>Additional Notes</span>
          </div>
          <div class="textarea-field textarea-bg-neutral">
            <textarea class="textarea" rows="3" placeholder="Any other information that might help us..."></textarea>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn btn-outline">Cancel</button>
        <button class="btn btn-primary">
          <svg class="icon icon-size-14" aria-hidden="true">
            <use href="#send" />
          </svg>
          Submit Request
        </button>
      </div>
    </div>
  `,
};
