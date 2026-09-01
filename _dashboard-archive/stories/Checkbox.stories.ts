import type { Meta, StoryObj } from "@storybook/html-vite";

const spriteUrl = "/sprite.svg";
const loadSprite = () => {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("icon-sprite")
  ) {
    fetch(spriteUrl)
      .then((r) => r.text())
      .then((svg) => {
        const div = document.createElement("div");
        div.id = "icon-sprite";
        div.style.display = "none";
        div.innerHTML = svg;
        document.body.insertBefore(div, document.body.firstChild);
      });
  }
};
loadSprite();

const CHECK = `<svg class="checkbox-check icon icon-size-10" aria-hidden="true"><use href="#check" /></svg>`;

interface Args {
  label: string;
  checked: boolean;
  disabled: boolean;
  subtitle: string;
  icon: boolean;
}

/**
 * A wrapping <label> is what names the control. The audit's most repeated
 * defect — 20 nodes across Input/Switch/Textarea — came from using a <div>
 * here, which is styling with no programmatic association.
 */
const render = ({ label, checked, disabled, subtitle, icon }: Args) =>
  `<label class="checkbox">
    <span class="checkbox-control">
      <input type="checkbox" class="checkbox-input"${checked ? " checked" : ""}${disabled ? " disabled" : ""} />
      ${CHECK}
    </span>
    <span class="checkbox-label">${label}</span>
    ${subtitle ? `<span class="checkbox-subtitle">${subtitle}</span>` : ""}
    ${
      icon
        ? `<button type="button" class="icon-button icon-button-md" aria-label="Open ${label}">
             <svg class="icon icon-size-14" aria-hidden="true"><use href="#chevron-right" /></svg>
           </button>`
        : ""
    }
  </label>`;

const meta: Meta<Args> = {
  title: "Components/Checkbox",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    checked: {
      control: "boolean",
      description: "Figma's Active axis — native :checked, not a class",
    },
    disabled: {
      control: "boolean",
      description: "Figma's Disabled axis — native :disabled, not a class",
    },
    subtitle: {
      control: "text",
      description: "Figma's subtitle boolean — JetBrains Mono. Empty to omit.",
    },
    icon: { control: "boolean", description: "Figma's icon boolean" },
  },
  args: {
    label: "Content",
    checked: false,
    disabled: false,
    subtitle: "",
    icon: false,
  },
  render: (a) => `<div style="padding: 24px; width: 240px;">${render(a)}</div>`,
};

export default meta;
type Story = StoryObj<Args>;

export const Interactive: Story = {};

/**
 * The four variants Figma draws. Note the label goes LIGHTER when checked —
 * Content/Tertiary, the same colour as disabled. Reproduced, on the designer list.
 */
export const AllVariants: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 16px; width: 300px; }
      .demo-k { font-size: 11px; color: #9999a6; font-family: ui-monospace, monospace; }
    </style>
    <div class="demo-wrap">
      <span class="demo-k">Active=no (hover me)</span>
      ${render({ label: "Content", checked: false, disabled: false, subtitle: "", icon: false })}
      <span class="demo-k">Active=yes &mdash; label dims to Content/Tertiary</span>
      ${render({ label: "Content", checked: true, disabled: false, subtitle: "", icon: false })}
      <span class="demo-k">Disabled=yes</span>
      ${render({ label: "Content", checked: false, disabled: true, subtitle: "", icon: false })}
    </div>
    <p style="padding: 0 24px 24px; margin: 0; font-size: 11px; color: #727280; max-width: 620px;">
      Figma draws no checked+hover and no checked+disabled variant. A disabled ticked box
      therefore keeps its full Primary/Main fill and reads as enabled &mdash; flagged, not invented.
    </p>
  `,
};

/** The subtitle and trailing-icon booleans. */
export const Slots: Story = {
  render: () => `
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 16px; width: 300px;">
      ${render({ label: "Beneficial owner", checked: false, disabled: false, subtitle: "TYPE", icon: false })}
      ${render({ label: "Beneficial owner", checked: true, disabled: false, subtitle: "TYPE", icon: true })}
    </div>
  `,
};

/**
 * KEYBOARD + FOCUS — lives only here. The visual harness can park a pointer for
 * `hover:` but cannot drive `:focus-visible`, so this is not asserted in
 * visual-specs. Tab through: each box takes the 2px Primary/Main ring, and
 * Space toggles it. The wrapping <label> means clicking the text toggles too.
 */
export const KeyboardAndFocus: Story = {
  render: () => `
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 16px; width: 320px;">
      ${render({ label: "First option", checked: false, disabled: false, subtitle: "", icon: false })}
      ${render({ label: "Second option", checked: true, disabled: false, subtitle: "", icon: false })}
      ${render({ label: "Disabled — skipped by Tab", checked: false, disabled: true, subtitle: "", icon: false })}
    </div>
    <p style="padding: 0 24px 24px; margin: 0; font-size: 11px; color: #727280; max-width: 620px;">
      The accessible name comes from the wrapping <code>&lt;label&gt;</code> &mdash; no
      <code>aria-label</code> needed. A screen reader announces "First option, checkbox, not checked".
    </p>
  `,
};

/**
 * INDETERMINATE — Figma models no such state, so nothing is styled for it.
 * This story exists to show what actually happens today: `:indeterminate` can
 * only be set from JS, and with no design to draw it renders as unchecked.
 * Needs a designer decision before a "select all" pattern can ship.
 */
export const IndeterminateGap: Story = {
  render: () => {
    const host = document.createElement("div");
    host.style.cssText = "padding: 24px; width: 340px;";
    host.innerHTML = `
      ${render({ label: "Select all (indeterminate)", checked: false, disabled: false, subtitle: "", icon: false })}
      <p style="margin: 12px 0 0; font-size: 11px; color: #727280;">
        This input has <code>indeterminate = true</code> set from JavaScript. Figma draws no
        mixed state, so it is visually identical to unchecked &mdash; the box below is the gap,
        not a bug in the CSS. Assistive tech does announce it as "mixed".
      </p>`;
    const input = host.querySelector<HTMLInputElement>(".checkbox-input");
    if (input) input.indeterminate = true;
    return host;
  },
};

/** Figma's Ring boolean, hidden by default in the design file. */
export const WithRing: Story = {
  render: () =>
    `<div style="padding: 24px; width: 240px;">
      <label class="checkbox with-ring">
        <span class="checkbox-control">
          <input type="checkbox" class="checkbox-input" />
          ${CHECK}
        </span>
        <span class="checkbox-label">Content</span>
      </label>
    </div>`,
};

/** A real form — checked state round-trips through the form, no JS. */
export const InAForm: Story = {
  render: () => `
    <form style="padding: 24px; display: flex; flex-direction: column; gap: 14px; width: 320px;"
          onsubmit="event.preventDefault();
                    this.nextElementSibling.textContent =
                      'submitted: ' + ([...new FormData(this).keys()].join(', ') || '(none)');">
      ${["Documents", "Ownership", "Sanctions"]
        .map(
          (n) => `<label class="checkbox">
            <span class="checkbox-control">
              <input type="checkbox" class="checkbox-input" name="${n.toLowerCase()}" />
              ${CHECK}
            </span>
            <span class="checkbox-label">${n}</span>
          </label>`,
        )
        .join("")}
      <button type="submit" class="btn btn-primary btn-sm" style="align-self: flex-start;">Submit</button>
    </form>
    <p style="padding: 0 24px 24px; margin: 0; font-size: 12px; color: #727280;"></p>
  `,
};
