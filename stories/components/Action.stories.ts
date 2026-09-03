/**
 * Action — one row in the portal's action list.
 * Figma: Action (71:848), Pending / rest / Done, 720×84 samples.
 * The Done chip binds Success/Text (status-ramp adoption, with Toast).
 */
import type { Meta, StoryObj } from "@storybook/html";

interface ActionArgs {
  title: string;
  description: string;
  state: "rest" | "pending" | "done";
  badge: string;
}

const row = ({ title, description, state, badge }: Partial<ActionArgs>) => {
  const stateClass = state === "pending" ? " action-pending" : state === "done" ? " action-done" : "";
  const trailing =
    state === "pending"
      ? `<span class="action-status"><svg aria-hidden="true"><use href="#lock" /></svg>Upcoming</span>`
      : state === "done"
        ? `<span class="action-status"><svg aria-hidden="true"><use href="#check" /></svg>Done</span>`
        : `<button class="action-cta" type="button">Verify <svg aria-hidden="true"><use href="#arrow-right" /></svg></button>`;
  return `
  <div class="action${stateClass}">
    <svg class="action-icon" aria-hidden="true"><use href="#shield-check" /></svg>
    <div class="action-content">
      <span class="action-title">${title}</span>
      <span class="action-description">${description}</span>
    </div>
    ${badge ? `<span class="badge">${badge}</span>` : ""}
    ${trailing}
  </div>`;
};

const meta: Meta<ActionArgs> = {
  title: "Components/Action",
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    state: { control: "select", options: ["rest", "pending", "done"] },
    badge: { control: "text", description: "Figma's badge boolean — the shipped Badge, empty = off" },
  },
  args: { title: "Identity", description: "Verify who you are", state: "rest", badge: "" },
  render: (args) => `<div style="max-width: 720px;">${row(args)}</div>`,
};

export default meta;
type Story = StoryObj<ActionArgs>;

export const Interactive: Story = {};

/** All three Figma states — an action list with hairline dividers. */
export const AllStates: Story = {
  render: () => `
    <div style="max-width: 720px;">
      ${row({ title: "Application", description: "Personal and contact details", state: "done" })}
      ${row({ title: "Identity", description: "Verify who you are", state: "rest" })}
      ${row({ title: "Funding", description: "Set up your first deposit", state: "pending" })}
    </div>
  `,
};

/** The badge boolean on — the shipped Badge, composed. */
export const WithBadge: Story = {
  render: () => `<div style="max-width: 720px;">${row({ title: "Identity", description: "Verify who you are", state: "rest", badge: "Joint" })}</div>`,
};
