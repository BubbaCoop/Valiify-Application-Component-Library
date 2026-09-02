/**
 * BoxAction — a boxed row composing a Checkbox or Switch with a label.
 * Figma: Box action (199:12990), 8 variants: Type × {rest, hover, active, disabled}.
 */
import type { Meta, StoryObj } from "@storybook/html";

const checkboxRow = (label: string, checked = false, disabled = false) => `
  <label class="box-action box-action-checkbox" style="max-width: 423px;">
    <span class="checkbox-control">
      <input type="checkbox" class="checkbox-input" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""} />
      <svg class="checkbox-check" aria-hidden="true"><use href="#check" /></svg>
    </span>
    <span class="box-action-label">${label}</span>
  </label>`;

const switchRow = (label: string, checked = false, disabled = false) => `
  <label class="box-action box-action-switch" style="max-width: 423px;">
    <input type="checkbox" role="switch" class="switch" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""} />
    <span class="box-action-label">${label}</span>
  </label>`;

const meta: Meta = {
  title: "Components/BoxAction",
  tags: ["autodocs"],
  render: () => checkboxRow("Paperless statements"),
};

export default meta;
type Story = StoryObj;

export const Interactive: Story = {};

/** All four drawn states per type — active and disabled from real input state. */
export const AllStates: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 12px;">
      ${checkboxRow("Paperless statements")}
      ${checkboxRow("Paperless statements", true)}
      ${checkboxRow("Paperless statements", false, true)}
      ${switchRow("Email notifications")}
      ${switchRow("Email notifications", true)}
      ${switchRow("Email notifications", false, true)}
    </div>
  `,
};

/** The whole row is the hit target — clicking anywhere toggles the input. */
export const AsAGroup: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 12px; max-width: 423px;">
      ${checkboxRow("Online banking", true)}
      ${checkboxRow("Debit card")}
      ${checkboxRow("Overdraft protection")}
    </div>
  `,
};
