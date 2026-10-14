/**
 * UtilityButton — the non-inline / special-use button family.
 * Figma: the Appearance=Utility half of the unified Button set (1:218)
 * since the 2026-10 merge (formerly Button / Utility 24:4382). Styles
 * renamed in Figma (Secondary/Primary/Rounded/Text + new Link); classes
 * keep their original names. Sibling of Button / Standard with its own
 * label convention (Field Label 13/500 natural case; Link 16/400/24).
 */
import type { Meta, StoryObj } from "@storybook/html";

interface UtilityButtonArgs {
  type: "empty" | "filled" | "rounded" | "text" | "link";
  label: string;
  md: boolean;
  leadingIcon: boolean;
}

const btn = ({ type, label, md, leadingIcon }: Partial<UtilityButtonArgs>) => `
  <button class="va-utility-button va-utility-button-${type}${md ? " va-utility-button-md" : ""}" type="button">
    ${leadingIcon && type !== "text" && type !== "link" ? `<svg aria-hidden="true"><use href="#dollar-sign" /></svg>` : ""}
    ${label ?? "Add Funds"}
    ${type === "text" ? `<svg aria-hidden="true"><use href="#chevron-right" /></svg>` : ""}
  </button>`;

const meta: Meta<UtilityButtonArgs> = {
  title: "Components/UtilityButton",
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["empty", "filled", "rounded", "text", "link"],
    },
    label: { control: "text" },
    md: {
      control: "boolean",
      description:
        "54px — Figma draws MD for Empty only (documented, not enforced)",
    },
    leadingIcon: { control: "boolean" },
  },
  args: { type: "empty", label: "Add Funds", md: false, leadingIcon: true },
  render: (args) => btn(args),
};

export default meta;
type Story = StoryObj<UtilityButtonArgs>;

export const Interactive: Story = {};

/** All five types — hover/press live to see the ramps. */
export const AllTypes: Story = {
  render: () => `
    <div style="display: flex; gap: 24px; align-items: center;">
      ${btn({ type: "empty", label: "Add Funds", leadingIcon: true })}
      ${btn({ type: "filled", label: "Add Funds", leadingIcon: true })}
      ${btn({ type: "rounded", label: "Add Funds", leadingIcon: true })}
      ${btn({ type: "text", label: "Add Funds" })}
      ${btn({ type: "link", label: "Resend code" })}
    </div>
  `,
};

/**
 * Link — inline underlined text button (new in the 2026-10 merge). Ink is a
 * constant Text/Primary in all four drawn variants (byte-identical — no
 * hover/pressed/disabled treatment exists; disabled is cursor-only).
 */
export const Link: Story = {
  render: () => `
    <div style="display: flex; gap: 24px; align-items: center;">
      ${btn({ type: "link", label: "Resend code" })}
      <button class="va-utility-button va-utility-button-link" type="button" disabled>Resend code</button>
    </div>
  `,
};

/** Loading (aria-busy) — drawn for Primary/Secondary SM. */
export const Loading: Story = {
  render: () =>
    `
    <div style="display: flex; gap: 24px;">
      ${btn({ type: "filled", label: "Add Funds" })}
      ${btn({ type: "empty", label: "Add Funds" })}
    </div>
  `.replace(/<button /g, '<button aria-busy="true" '),
};

/** Disabled — a drawn axis for every Utility style since 2026-10; the
 *  recipes deliberately differ per style (see the CSS header). */
export const Disabled: Story = {
  render: () =>
    `
    <div style="display: flex; gap: 24px; align-items: center;">
      ${btn({ type: "empty", label: "Add Funds" })}
      ${btn({ type: "filled", label: "Add Funds" })}
      ${btn({ type: "rounded", label: "Add Funds" })}
      ${btn({ type: "text", label: "View statements" })}
      ${btn({ type: "link", label: "Resend code" })}
    </div>
  `.replace(/<button /g, "<button disabled "),
};

/** MD (54px) — drawn for the Empty type; Text's Size axis is unwired. */
export const MediumEmpty: Story = {
  render: () =>
    btn({ type: "empty", label: "Add Funds", md: true, leadingIcon: true }),
};
