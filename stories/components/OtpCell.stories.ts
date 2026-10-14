/**
 * OtpCell — one digit box of the OTP entry, applied directly to a native
 * <input>. Figma: OTP / Digit cell (824:4856), State {Empty, Filled,
 * Focused, Error}, all 56×56. Error is aria-invalid; focus is the real
 * :focus (caret-color Primary — Figma's "|" glyph is a fake caret).
 */
import type { Meta, StoryObj } from "@storybook/html";

interface OtpCellArgs {
  digit: string;
  invalid: boolean;
  disabled: boolean;
}

const cell = (
  { digit, invalid, disabled }: Partial<OtpCellArgs>,
  label = "Digit 1 of 6",
) => `
  <input class="va-otp-cell" type="text" inputmode="numeric" pattern="[0-9]"
         maxlength="1" autocomplete="one-time-code" aria-label="${label}"
         value="${digit ?? ""}"${invalid ? ' aria-invalid="true"' : ""}${disabled ? " disabled" : ""} />`;

const meta: Meta<OtpCellArgs> = {
  title: "Components/OtpCell",
  tags: ["autodocs"],
  argTypes: {
    digit: {
      control: "text",
      description: "The entered digit (empty = Empty state)",
    },
    invalid: {
      control: "boolean",
      description: "aria-invalid — the amber Warning border (decision D4)",
    },
    disabled: {
      control: "boolean",
      description: "Not modelled in Figma — cursor only",
    },
  },
  args: { digit: "4", invalid: false, disabled: false },
  render: (args) => cell(args),
};

export default meta;
type Story = StoryObj<OtpCellArgs>;

export const Interactive: Story = {};

/** Empty · Filled · Error · Disabled — click any cell for the Focused
 *  treatment (Primary border + 3px Primary Ring + crimson caret). */
export const AllStates: Story = {
  render: () => `
    <div style="display: flex; gap: 24px; align-items: center;">
      ${cell({ digit: "" }, "Empty")}
      ${cell({ digit: "4" }, "Filled")}
      ${cell({ digit: "4", invalid: true }, "Error")}
      ${cell({ digit: "4", disabled: true }, "Disabled")}
    </div>
  `,
};
