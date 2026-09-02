/**
 * RadioField — labeled radio-group form field.
 * Figma: Radio Fields (123:6059), 6 declared variants whose state axes are
 * unwired (all render identically) — real states come from the composed .radio.
 */
import type { Meta, StoryObj } from "@storybook/html";

const field = (title = "Title", checked: number | null = null, hint = "") => `
  <fieldset class="radio-field" style="max-width: 413px;">
    <legend class="radio-field-title">${title}</legend>
    <div class="radio-field-options">
      ${["Yes", "No"]
        .map(
          (label, i) => `
        <label class="radio-field-option">
          <input type="radio" name="rf-${title.replace(/\W/g, "")}" class="radio" ${checked === i ? "checked" : ""} />
          ${label}
        </label>`,
        )
        .join("")}
    </div>
    ${hint ? `<p class="radio-field-hint">${hint}</p>` : ""}
  </fieldset>`;

const meta: Meta = {
  title: "Components/RadioField",
  tags: ["autodocs"],
  render: () => field("Do you have an existing account?"),
};

export default meta;
type Story = StoryObj;

export const Interactive: Story = {};

/** Filled = a real checked radio (Figma's Filled axis renders nothing). */
export const Filled: Story = {
  render: () => field("Do you have an existing account?", 0),
};

/** With the optional helper icon slot and a hint line. */
export const WithHelperAndHint: Story = {
  render: () => `
    <fieldset class="radio-field" style="max-width: 413px;">
      <legend class="radio-field-title">
        Are you a U.S. citizen?
        <svg class="radio-field-help" role="img" aria-label="Help"><use href="#circle-help" /></svg>
      </legend>
      <div class="radio-field-options">
        <label class="radio-field-option">
          <input type="radio" name="rf-help" class="radio" checked />
          Yes
        </label>
        <label class="radio-field-option">
          <input type="radio" name="rf-help" class="radio" />
          No
        </label>
      </div>
      <p class="radio-field-hint">Required for federal reporting.</p>
    </fieldset>
  `,
};

/** In a form column, as the Short App composes them. */
export const InAForm: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 413px;">
      ${field("Do you have an existing account?", 1)}
      ${field("Are you applying jointly?")}
    </div>
  `,
};
