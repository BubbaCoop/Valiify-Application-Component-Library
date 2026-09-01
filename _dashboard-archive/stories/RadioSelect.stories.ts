import type { Meta, StoryObj } from "@storybook/html-vite";

interface RadioSelectArgs {
  label: string;
  name: string;
  checked: boolean;
  disabled: boolean;
}

const meta: Meta<RadioSelectArgs> = {
  title: "Components/RadioSelect",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
Radio button input for single-selection from a group with label support. Token-exact implementation from Figma.

**Specifications:**
- Circle: 15px × 15px
- Inner dot (when selected): 8px × 8px
- Gap between radio and label: 9px (Spacing/9)
- Typography: Caption (12px/18px/400)

**States:**
- Default: Stroke/Border border, Surface/Paper background
- Hover: Secondary/Main border
- Selected: Primary/Main border with 8px Primary/Main inner dot
- Focus: 2px Primary/Main focus ring (keyboard navigation)
- Disabled: Stroke/Divider border and text

**Usage:**
Wrap an \`<input type="radio">\` with a \`<label class="radio-select">\` and add a \`<span class="radio-select-label">\` for the label text.
All radios in a group must share the same \`name\` attribute to be mutually exclusive.
        `.trim(),
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "Label text displayed next to the radio button",
    },
    name: {
      control: "text",
      description: "Radio group name (radios with same name are mutually exclusive)",
    },
    checked: {
      control: "boolean",
      description: "Selected state",
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
    },
  },
  args: {
    label: "Radio Option",
    name: "radio-group",
    checked: false,
    disabled: false,
  },
  render: ({ label, name, checked, disabled }) => {
    return `
      <label class="radio-select">
        <input
          type="radio"
          name="${name}"
          class="radio-select-input"
          ${checked ? "checked" : ""}
          ${disabled ? "disabled" : ""}
        />
        <span class="radio-select-label">${label}</span>
      </label>
    `;
  },
};

export default meta;
type Story = StoryObj<RadioSelectArgs>;

/**
 * Default unselected radio button.
 */
export const Default: Story = {};

/**
 * Selected radio button showing the inner dot.
 */
export const Selected: Story = {
  args: {
    label: "Selected Option",
    checked: true,
  },
};

/**
 * Disabled unselected radio button.
 */
export const Disabled: Story = {
  args: {
    label: "Disabled Option",
    disabled: true,
  },
};

/**
 * Disabled and selected radio button.
 */
export const DisabledSelected: Story = {
  args: {
    label: "Disabled Selected",
    checked: true,
    disabled: true,
  },
};

/**
 * Demonstrates all radio button states:
 * - Default (unselected)
 * - Hover (hover over default to see border change)
 * - Selected (checked, shows inner dot)
 * - Focused (use keyboard Tab to focus, shows focus ring)
 * - Disabled (unselected)
 * - Disabled Selected
 */
export const AllStates: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <label class="radio-select">
        <input type="radio" name="all-states" class="radio-select-input" />
        <span class="radio-select-label">Default (Unselected)</span>
      </label>

      <label class="radio-select">
        <input type="radio" name="all-states" class="radio-select-input" />
        <span class="radio-select-label">Hover (hover to see border change to Secondary)</span>
      </label>

      <label class="radio-select">
        <input type="radio" name="all-states" class="radio-select-input" checked />
        <span class="radio-select-label">Selected (shows inner dot, Primary border)</span>
      </label>

      <label class="radio-select">
        <input type="radio" name="all-states-focus" class="radio-select-input" />
        <span class="radio-select-label">Focused (use Tab to focus, shows 2px Primary ring)</span>
      </label>

      <label class="radio-select">
        <input type="radio" name="all-states-disabled" class="radio-select-input" disabled />
        <span class="radio-select-label">Disabled (Unselected)</span>
      </label>

      <label class="radio-select">
        <input type="radio" name="all-states-disabled-selected" class="radio-select-input" checked disabled />
        <span class="radio-select-label">Disabled Selected</span>
      </label>
    </div>
  `,
};

/**
 * Example of a radio button group where only one option can be selected.
 * Click different options to see the selection change.
 */
export const RadioGroup: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <fieldset style="border: none; padding: 0; margin: 0;">
        <legend style="margin-bottom: 12px; font-weight: 500;">Select a plan:</legend>

        <label class="radio-select">
          <input type="radio" name="plan" class="radio-select-input" checked />
          <span class="radio-select-label">Free Plan - $0/month</span>
        </label>

        <label class="radio-select" style="margin-top: 8px; display: inline-flex;">
          <input type="radio" name="plan" class="radio-select-input" />
          <span class="radio-select-label">Pro Plan - $29/month</span>
        </label>

        <label class="radio-select" style="margin-top: 8px; display: inline-flex;">
          <input type="radio" name="plan" class="radio-select-input" />
          <span class="radio-select-label">Enterprise Plan - Contact us</span>
        </label>
      </fieldset>
    </div>
  `,
};

/**
 * Shows radio buttons in different layout configurations.
 */
export const Layouts: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div>
        <h3 style="margin-bottom: 8px; font-size: 14px; font-weight: 500;">Vertical Stack:</h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label class="radio-select">
            <input type="radio" name="layout-vertical" class="radio-select-input" checked />
            <span class="radio-select-label">Option 1</span>
          </label>
          <label class="radio-select">
            <input type="radio" name="layout-vertical" class="radio-select-input" />
            <span class="radio-select-label">Option 2</span>
          </label>
          <label class="radio-select">
            <input type="radio" name="layout-vertical" class="radio-select-input" />
            <span class="radio-select-label">Option 3</span>
          </label>
        </div>
      </div>

      <div>
        <h3 style="margin-bottom: 8px; font-size: 14px; font-weight: 500;">Horizontal Row:</h3>
        <div style="display: flex; gap: 24px;">
          <label class="radio-select">
            <input type="radio" name="layout-horizontal" class="radio-select-input" checked />
            <span class="radio-select-label">Yes</span>
          </label>
          <label class="radio-select">
            <input type="radio" name="layout-horizontal" class="radio-select-input" />
            <span class="radio-select-label">No</span>
          </label>
          <label class="radio-select">
            <input type="radio" name="layout-horizontal" class="radio-select-input" />
            <span class="radio-select-label">Maybe</span>
          </label>
        </div>
      </div>
    </div>
  `,
};
