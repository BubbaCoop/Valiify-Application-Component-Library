/**
 * RadioField — labeled radio-group form field.
 * Figma: Radio Fields (123:6059), 6 declared variants whose state axes are
 * unwired (all render identically) — real states come from the composed .va-radio.
 * The error state is text-only by design (2026-09-16, D2): the component has
 * no box to paint, so the message alone carries it and the radios never change.
 */
import type { Meta, StoryObj } from "@storybook/html";

const field = (title = "Title", checked: number | null = null, hint = "") => `
  <fieldset class="va-radio-field" style="max-width: 413px;">
    <legend class="va-radio-field-title">${title}</legend>
    <div class="va-radio-field-options">
      ${["Yes", "No"]
        .map(
          (label, i) => `
        <label class="va-radio-field-option">
          <input type="radio" name="rf-${title.replace(/\W/g, "")}" class="va-radio" ${checked === i ? "checked" : ""} />
          ${label}
        </label>`,
        )
        .join("")}
    </div>
    ${hint ? `<p class="va-radio-field-hint">${hint}</p>` : ""}
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
    <fieldset class="va-radio-field" style="max-width: 413px;">
      <legend class="va-radio-field-title">
        Are you a U.S. citizen?
        <svg class="va-radio-field-help" role="img" aria-label="Help"><use href="#circle-help" /></svg>
      </legend>
      <div class="va-radio-field-options">
        <label class="va-radio-field-option">
          <input type="radio" name="rf-help" class="va-radio" checked />
          Yes
        </label>
        <label class="va-radio-field-option">
          <input type="radio" name="rf-help" class="va-radio" />
          No
        </label>
      </div>
      <p class="va-radio-field-hint">Required for federal reporting.</p>
    </fieldset>
  `,
};

/**
 * Error — the whole treatment is the message ink (D2). The radios are
 * deliberately identical to their rest state; that is the design, not a gap.
 * `aria-invalid` sits on the GROUP, which needs an explicit `role="radiogroup"`
 * because a native <fieldset> has no implicit one.
 */
export const Error: Story = {
  render: () => `
    <fieldset class="va-radio-field" style="max-width: 413px;"
              role="radiogroup" aria-invalid="true" aria-describedby="rf-err-hint">
      <legend class="va-radio-field-title">Do you serve international customers?</legend>
      <div class="va-radio-field-options">
        <label class="va-radio-field-option">
          <input type="radio" name="rf-err" class="va-radio" />
          Yes
        </label>
        <label class="va-radio-field-option">
          <input type="radio" name="rf-err" class="va-radio" />
          No
        </label>
      </div>
      <p id="rf-err-hint" class="va-radio-field-hint">Required</p>
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
