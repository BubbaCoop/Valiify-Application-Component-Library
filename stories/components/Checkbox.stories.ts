/**
 * Checkbox — binary selection control.
 *
 * Figma: Checkbox (1:424), 8 variants across Active × Hover × Pressed ×
 * Disabled. The component is the bare 18×18 control; labels are composed at
 * the call site.
 */
import type { Meta, StoryObj } from "@storybook/html";

interface CheckboxArgs {
  checked: boolean;
  disabled: boolean;
}

const box = (checked = false, disabled = false, label = "Option") => `
  <span class="checkbox-control">
    <input type="checkbox" class="checkbox-input" aria-label="${label}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""} />
    <svg class="checkbox-check" aria-hidden="true"><use href="#check" /></svg>
  </span>`;

const meta: Meta<CheckboxArgs> = {
  title: "Components/Checkbox",
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean", description: "Active=Yes in Figma" },
    disabled: { control: "boolean" },
  },
  args: { checked: false, disabled: false },
  render: ({ checked, disabled }) => box(checked, disabled),
};

export default meta;
type Story = StoryObj<CheckboxArgs>;

export const Interactive: Story = {};

export const Checked: Story = { args: { checked: true } };

/**
 * The four rest-drawn variants. Hover and pressed are transient (Action tints
 * unchecked; Primary/Hover and Primary/Focus checked) — the harness asserts
 * hover with a real pointer; pressed is unreachable by automation.
 */
export const AllStates: Story = {
  render: () => `
    <div style="display: flex; gap: 24px; align-items: center;">
      ${box()}
      ${box(true)}
      ${box(false, true, "Disabled unchecked")}
      ${box(true, true, "Disabled checked")}
    </div>
  `,
};

/** Usage: labels composed at the call site. */
export const InAForm: Story = {
  render: () => `
    <fieldset style="border: none; margin: 0; padding: 0;">
      <legend style="font-size: 13px; font-weight: 500; margin-bottom: 12px;">
        Account services
      </legend>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${["Online banking", "Debit card", "Paper statements"]
          .map(
            (label, i) => `
          <label style="display: inline-flex; align-items: center; gap: 10px; font-size: 14px; cursor: pointer;">
            <span class="checkbox-control">
              <input type="checkbox" class="checkbox-input" ${i < 2 ? "checked" : ""} />
              <svg class="checkbox-check" aria-hidden="true"><use href="#check" /></svg>
            </span>
            ${label}
          </label>`,
          )
          .join("")}
      </div>
    </fieldset>
  `,
};

/** Keyboard focus uses the library-wide focus-ring. Tab to see it. */
export const Focus: Story = {
  render: () => `<div style="display:flex;gap:24px;">${box()}${box(true)}</div>`,
};

/**
 * Figma models no indeterminate/mixed state — :indeterminate is deliberately
 * unstyled and renders as unchecked. A "select all" header has nothing to
 * draw until the designer decides. This story makes the gap visible.
 */
export const IndeterminateGap: Story = {
  render: () => {
    const wrap = document.createElement("div");
    wrap.style.cssText = "display:flex;gap:16px;align-items:center;";
    wrap.innerHTML = `${box()}<span style="font-size:12px;color:#6f7276;">input.indeterminate = true renders as unchecked — no Figma variant to reproduce</span>`;
    const input = wrap.querySelector("input");
    if (input) (input as HTMLInputElement).indeterminate = true;
    return wrap;
  },
};
