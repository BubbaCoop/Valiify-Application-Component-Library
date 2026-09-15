/**
 * SelectCard — selectable/navigational option card.
 * Figma: Card (9:367), 6 variants: Hover × Radio × Pressed.
 */
import type { Meta, StoryObj } from "@storybook/html";

const radioCard = (checked = false, name = "sc", title = "Family Connection", desc = "A relative is already a member") => `
  <label class="va-select-card" style="max-width: 415px;">
    <input type="radio" name="${name}" class="va-radio" ${checked ? "checked" : ""} />
    <span class="va-select-card-text">
      <span class="va-select-card-title">${title}</span>
      <span class="va-select-card-description">${desc}</span>
    </span>
  </label>`;

const chevronCard = (title = "Family Connection", desc = "A relative is already a member") => `
  <button class="va-select-card" style="max-width: 415px;">
    <span class="va-select-card-text" style="text-align: left;">
      <span class="va-select-card-title">${title}</span>
      <span class="va-select-card-description">${desc}</span>
    </span>
    <svg class="va-select-card-chevron" aria-hidden="true"><use href="#chevron-right" /></svg>
  </button>`;

const meta: Meta = {
  title: "Components/SelectCard",
  tags: ["autodocs"],
  render: () => radioCard(),
};

export default meta;
type Story = StoryObj;

export const Interactive: Story = {};

/** The chevron (navigation) variant — a button, transient pressed wash. */
export const ChevronVariant: Story = {
  render: () => chevronCard(),
};

/** Radio variants: unselected and selected (the persistent crimson state). */
export const RadioVariants: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 12px;">
      ${radioCard(false, "rv")}
      ${radioCard(true, "rv", "Direct Application", "Apply without an existing member")}
    </div>
  `,
};

/** A working radio group — selection drives the treatment via :has(:checked). */
export const AsAGroup: Story = {
  render: () => `
    <fieldset style="border: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px;">
      <legend style="font-size: 14px; font-weight: 500; margin-bottom: 12px;">
        How are you joining?
      </legend>
      ${radioCard(true, "join", "Family Connection", "A relative is already a member")}
      ${radioCard(false, "join", "Employer Group", "Your employer partners with us")}
      ${radioCard(false, "join", "Community Member", "You live in an eligible county")}
    </fieldset>
  `,
};

/** Description is optional (Figma's subtitle boolean). */
export const TitleOnly: Story = {
  render: () => `
    <label class="va-select-card" style="max-width: 415px;">
      <input type="radio" name="to" class="va-radio" />
      <span class="va-select-card-text">
        <span class="va-select-card-title">Family Connection</span>
      </span>
    </label>
  `,
};
