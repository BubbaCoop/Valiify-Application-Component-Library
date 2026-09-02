/**
 * Tabs — chip-style tab item, two types.
 * Figma: Tabs (23:825), 7 variants: Type {Portal, Application} × Hover × Active.
 */
import type { Meta, StoryObj } from "@storybook/html";

const tab = (type: string, label: string, selected = false, icon = "layout-grid") => `
  <button class="tab tab-${type}" role="tab" aria-selected="${selected}">
    <svg aria-hidden="true"><use href="#${icon}" /></svg>
    ${label}
  </button>`;

const meta: Meta = {
  title: "Components/Tabs",
  tags: ["autodocs"],
  render: () => `
    <div class="tabs" role="tablist" aria-label="Portal sections">
      ${tab("portal", "Overview", true)}
      ${tab("portal", "Documents", false, "file-text")}
      ${tab("portal", "Settings", false, "settings")}
    </div>
  `,
};

export default meta;
type Story = StoryObj;

export const Interactive: Story = {};

/** Both types, rest and active. Portal is ghost; Application is always boxed. */
export const BothTypes: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div class="tabs" role="tablist" aria-label="Portal">
        ${tab("portal", "Overview", true)}
        ${tab("portal", "Documents", false, "file-text")}
      </div>
      <div class="tabs" role="tablist" aria-label="Application">
        ${tab("application", "Overview", true)}
        ${tab("application", "Documents", false, "file-text")}
      </div>
    </div>
  `,
};

/** An application-step row, as the Short App uses it. */
export const ApplicationRow: Story = {
  render: () => `
    <div class="tabs" role="tablist" aria-label="Application steps">
      ${tab("application", "Your details", true, "user")}
      ${tab("application", "Funding", false, "banknote")}
      ${tab("application", "Review", false, "check")}
    </div>
  `,
};
