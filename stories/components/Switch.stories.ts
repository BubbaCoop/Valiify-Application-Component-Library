/**
 * Switch — binary on/off toggle.
 *
 * Figma: Switch (1:446), 4 variants across Active × Hover, all 36×20.
 * A native checkbox with role="switch"; the input is the track, the knob
 * is ::before.
 */
import type { Meta, StoryObj } from "@storybook/html";

interface SwitchArgs {
  checked: boolean;
  disabled: boolean;
}

const sw = (checked = false, disabled = false, label = "Toggle") =>
  `<input type="checkbox" role="switch" class="switch" aria-label="${label}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""} />`;

const meta: Meta<SwitchArgs> = {
  title: "Components/Switch",
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean", description: "Active=yes in Figma" },
    disabled: {
      control: "boolean",
      description: "Not modelled in Figma — cursor only",
    },
  },
  args: { checked: false, disabled: false },
  render: ({ checked, disabled }) => sw(checked, disabled),
};

export default meta;
type Story = StoryObj<SwitchArgs>;

export const Interactive: Story = {};

export const On: Story = { args: { checked: true } };

/**
 * Both rest states. Hover is drawn in Figma for BOTH branches (off: track
 * steps Stroke/Border → Stroke/Hover; on: Primary → Primary/Hover) — put a
 * pointer on either to see it; the harness asserts both with a real hover.
 */
export const BothStates: Story = {
  render: () => `
    <div style="display: flex; gap: 24px; align-items: center;">
      ${sw(false, false, "Off")}
      ${sw(true, false, "On")}
    </div>
  `,
};

/** Usage: label composed at the call site. */
export const WithLabels: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 12px;">
      ${[
        ["Email notifications", true],
        ["SMS alerts", false],
        ["Paperless statements", true],
      ]
        .map(
          ([label, on]) => `
        <label style="display: inline-flex; align-items: center; justify-content: space-between; gap: 16px; width: 260px; font-size: 14px; cursor: pointer;">
          ${label}
          ${sw(on as boolean)}
        </label>`,
        )
        .join("")}
    </div>
  `,
};

/** Keyboard focus uses the library-wide focus-ring. Tab to see it. */
export const Focus: Story = {
  render: () => `<div style="display:flex;gap:24px;">${sw()}${sw(true)}</div>`,
};

/** Figma models no disabled variant — cursor only, gap kept visible. */
export const DisabledGap: Story = {
  render: () => `
    <div style="display: flex; gap: 24px; align-items: center;">
      ${sw(false, true, "Disabled off")}
      ${sw(true, true, "Disabled on")}
      <span style="font-size: 12px; color: #6f7276;">renders identically to enabled — no Figma variant to reproduce</span>
    </div>
  `,
};
