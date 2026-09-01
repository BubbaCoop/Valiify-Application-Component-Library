import type { Meta, StoryObj } from "@storybook/html";

interface SwitchArgs {
  checked: boolean;
  disabled: boolean;
}

const meta: Meta<SwitchArgs> = {
  title: "Components/Switch",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
Toggle switch for binary on/off settings with hover, disabled, and focus states. Token-exact implementation from Figma.

**Specifications:**
- Track: 32px × 18px, pill-shaped
- Knob: 14px diameter with shadow
- Padding: 2px
- Smooth slide animation on state change

**States:**
- Off (default): Action/Focused background
- Off hover: Content/Faint background
- Off disabled: Secondary/Soft background
- On (checked): Primary/Main background
- On hover: Primary/Dark background
- On disabled: Primary/Disabled background
- Focus: 2px Primary/Main focus ring (keyboard navigation)

**Usage:**
Wrap a checkbox input with \`<label class="switch">\` and add \`<input type="checkbox" class="switch-input">\` inside.
The visual switch track is the label, and the knob is a ::before pseudo-element that slides on toggle.
        `.trim(),
      },
    },
  },
  argTypes: {
    checked: {
      control: "boolean",
      description: "Checked (on) state",
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
    },
  },
  args: {
    checked: false,
    disabled: false,
  },
  render: ({ checked, disabled }) => {
    return `
      <label class="switch">
        <input
          type="checkbox"
          class="switch-input"
          ${checked ? "checked" : ""}
          ${disabled ? "disabled" : ""}
        />
      </label>
    `;
  },
};

export default meta;
type Story = StoryObj<SwitchArgs>;

/**
 * Default unchecked (off) switch.
 */
export const Default: Story = {};

/**
 * Checked (on) switch showing the knob in the right position.
 */
export const Checked: Story = {
  args: {
    checked: true,
  },
};

/**
 * Disabled unchecked switch.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/**
 * Disabled and checked switch.
 */
export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

/**
 * Demonstrates all switch states:
 * - Off (unchecked)
 * - Off hover (hover over unchecked to see background change)
 * - Off disabled
 * - On (checked, knob slides right)
 * - On hover (hover over checked to see darker blue)
 * - On disabled
 * - Focus (use keyboard Tab to focus, shows focus ring)
 */
export const AllStates: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 20px; padding: 20px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <label class="switch">
          <input type="checkbox" class="switch-input" />
        </label>
        <span style="font-size: 14px;">Off (Default)</span>
      </div>

      <div style="display: flex; align-items: center; gap: 12px;">
        <label class="switch">
          <input type="checkbox" class="switch-input" />
        </label>
        <span style="font-size: 14px;">Off hover (hover to see Content/Faint background)</span>
      </div>

      <div style="display: flex; align-items: center; gap: 12px;">
        <label class="switch">
          <input type="checkbox" class="switch-input" disabled />
        </label>
        <span style="font-size: 14px;">Off disabled (Secondary/Soft background)</span>
      </div>

      <div style="display: flex; align-items: center; gap: 12px;">
        <label class="switch">
          <input type="checkbox" class="switch-input" checked />
        </label>
        <span style="font-size: 14px;">On (Checked, knob slides right, Primary background)</span>
      </div>

      <div style="display: flex; align-items: center; gap: 12px;">
        <label class="switch">
          <input type="checkbox" class="switch-input" checked />
        </label>
        <span style="font-size: 14px;">On hover (hover to see Primary/Dark background)</span>
      </div>

      <div style="display: flex; align-items: center; gap: 12px;">
        <label class="switch">
          <input type="checkbox" class="switch-input" checked disabled />
        </label>
        <span style="font-size: 14px;">On disabled (Primary/Disabled background)</span>
      </div>

      <div style="display: flex; align-items: center; gap: 12px;">
        <label class="switch">
          <input type="checkbox" class="switch-input" />
        </label>
        <span style="font-size: 14px;">Focused (Tab to focus, shows 2px Primary ring)</span>
      </div>
    </div>
  `,
};

/**
 * Example of switches with labels in a settings form.
 * Click the switches to toggle them on/off.
 */
export const WithLabels: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #f9f9f9; border-radius: 8px;">
        <div>
          <div style="font-weight: 500; font-size: 14px; margin-bottom: 2px;">Email Notifications</div>
          <div style="font-size: 12px; color: #666;">Receive updates via email</div>
        </div>
        <label class="switch">
          <input type="checkbox" class="switch-input" checked />
        </label>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #f9f9f9; border-radius: 8px;">
        <div>
          <div style="font-weight: 500; font-size: 14px; margin-bottom: 2px;">Dark Mode</div>
          <div style="font-size: 12px; color: #666;">Use dark theme</div>
        </div>
        <label class="switch">
          <input type="checkbox" class="switch-input" />
        </label>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #f9f9f9; border-radius: 8px;">
        <div>
          <div style="font-weight: 500; font-size: 14px; margin-bottom: 2px;">Auto-save</div>
          <div style="font-size: 12px; color: #666;">Automatically save changes</div>
        </div>
        <label class="switch">
          <input type="checkbox" class="switch-input" checked />
        </label>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #f9f9f9; border-radius: 8px; opacity: 0.6;">
        <div>
          <div style="font-weight: 500; font-size: 14px; margin-bottom: 2px;">Beta Features</div>
          <div style="font-size: 12px; color: #666;">Access experimental features (Pro only)</div>
        </div>
        <label class="switch">
          <input type="checkbox" class="switch-input" disabled />
        </label>
      </div>
    </div>
  `,
};

/**
 * Shows switches in compact inline layouts.
 */
export const Layouts: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div>
        <h3 style="margin-bottom: 12px; font-size: 14px; font-weight: 500;">Inline with label:</h3>
        <label style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
          <span style="font-size: 14px;">Enable feature</span>
          <div class="switch">
            <input type="checkbox" class="switch-input" checked />
          </div>
        </label>
      </div>

      <div>
        <h3 style="margin-bottom: 12px; font-size: 14px; font-weight: 500;">List of settings:</h3>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 14px;">Notifications</span>
            <label class="switch">
              <input type="checkbox" class="switch-input" checked />
            </label>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 14px;">Auto-update</span>
            <label class="switch">
              <input type="checkbox" class="switch-input" />
            </label>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 14px;">Analytics</span>
            <label class="switch">
              <input type="checkbox" class="switch-input" checked />
            </label>
          </div>
        </div>
      </div>
    </div>
  `,
};
