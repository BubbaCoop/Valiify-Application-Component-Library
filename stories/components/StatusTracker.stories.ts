/**
 * StatusTracker — one step marker in the application-status track.
 * Figma: Application Status (64:4623), Active {no, yes}, 93×16.
 */
import type { Meta, StoryObj } from "@storybook/html";

interface StatusTrackerArgs {
  label: string;
  active: boolean;
}

const step = ({ label, active }: Partial<StatusTrackerArgs>) => `
  <span class="status-tracker${active ? " status-tracker-active" : ""}">
    <svg aria-hidden="true"><use href="#check" /></svg>
    ${label}
  </span>`;

const meta: Meta<StatusTrackerArgs> = {
  title: "Components/StatusTracker",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    active: { control: "boolean", description: "Ink swap Tertiary → Primary" },
  },
  args: { label: "Application", active: true },
  render: (args) => step(args),
};

export default meta;
type Story = StoryObj<StatusTrackerArgs>;

export const Interactive: Story = {};

/** Both Figma variants. */
export const AllStates: Story = {
  render: () => `
    <div style="display: flex; gap: 32px;">
      ${step({ label: "Application", active: true })}
      ${step({ label: "Documents", active: false })}
    </div>
  `,
};

/** A track composed at the call site (no connector is modelled in Figma). */
export const Track: Story = {
  render: () => `
    <div style="display: flex; gap: 24px; align-items: center;">
      ${step({ label: "Application", active: true })}
      ${step({ label: "Documents", active: true })}
      ${step({ label: "Verification", active: false })}
      ${step({ label: "Funding", active: false })}
    </div>
  `,
};
