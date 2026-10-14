/**
 * OtpField — the labeled six-digit OTP entry, composing OtpCell.
 * Figma: OTP field (815:9211), State {Empty, Focused, Filled, Error},
 * all 376×100 (title 25 + cells 56 + hint 19). Error = aria-invalid on
 * every cell (Figma draws all six amber); the hint ink follows via :has().
 * Auto-advance / paste handling is consumer JS — the library ships none.
 */
import type { Meta, StoryObj } from "@storybook/html";

interface OtpFieldArgs {
  label: string;
  hint: string;
  digits: string;
  invalid: boolean;
}

const field = ({ label, hint, digits, invalid }: OtpFieldArgs, id = "otp") => `
  <fieldset class="va-otp-field" aria-describedby="${id}-hint">
    <legend class="va-otp-field-title">${label}</legend>
    <div class="va-otp-field-cells">
      ${Array.from(
        { length: 6 },
        (_, i) => `
        <input class="va-otp-cell" type="text" inputmode="numeric" pattern="[0-9]"
               maxlength="1" autocomplete="one-time-code"
               aria-label="Digit ${i + 1} of 6" value="${digits[i] ?? ""}"${invalid ? ' aria-invalid="true"' : ""} />`,
      ).join("")}
    </div>
    <p id="${id}-hint" class="va-otp-field-hint">${hint}</p>
  </fieldset>`;

const meta: Meta<OtpFieldArgs> = {
  title: "Components/OtpField",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    hint: { control: "text" },
    digits: { control: "text", description: "Entered digits, left to right" },
    invalid: {
      control: "boolean",
      description: "Error — amber borders on all six cells + amber hint",
    },
  },
  args: {
    label: "Verification code",
    hint: "Enter the 6-digit code sent to you.",
    digits: "",
    invalid: false,
  },
  render: (args) => field(args),
};

export default meta;
type Story = StoryObj<OtpFieldArgs>;

export const Interactive: Story = {};

export const Empty: Story = {};

/** Two digits in — click cell 3 to see Figma's Focused composition
 *  (ring on the next-empty cell). */
export const PartiallyFilled: Story = {
  args: { digits: "48" },
};

export const Filled: Story = {
  args: { digits: "482916" },
};

export const Error: Story = {
  args: {
    digits: "482916",
    invalid: true,
    hint: "Invalid code. Check the digits and try again.",
  },
  render: (args) => field(args, "otp-err"),
};
