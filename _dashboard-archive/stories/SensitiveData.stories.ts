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

const glyph = (name: string) =>
  `<svg class="icon icon-size-14" aria-hidden="true"><use href="#${name}" /></svg>`;

/**
 * `obscured` is the state Figma calls `Checked=yes` — the value is HIDDEN.
 * The class list never says "checked", because that reads backwards.
 */
const render = (
  obscured: boolean,
  masked: string,
  plain: string,
  ring = false,
) =>
  `<span class="sensitive-data${ring ? " with-ring" : ""}">
    <span class="sensitive-data-value">${obscured ? masked : plain}</span>
    <button class="icon-button icon-button-md" aria-pressed="${obscured}"
            aria-label="${obscured ? "Show full value" : "Hide value"}">
      ${glyph(obscured ? "eye-off" : "eye")}
    </button>
  </span>`;

interface Args {
  obscured: boolean;
  masked: string;
  plain: string;
}

const meta: Meta<Args> = {
  title: "Components/SensitiveData",
  tags: ["autodocs"],
  argTypes: {
    obscured: {
      control: "boolean",
      description:
        "Figma's Checked axis. true = value hidden (#eye-off). Driven by aria-pressed, not a class.",
    },
    masked: { control: "text", description: "Figma's obscuredData property" },
    plain: { control: "text", description: "Figma's unobscuredData property" },
  },
  args: { obscured: true, masked: "***-**-1234", plain: "123-12-1234" },
  render: ({ obscured, masked, plain }) =>
    `<div style="padding: 24px;">${render(obscured, masked, plain)}</div>`,
};

export default meta;
type Story = StoryObj<Args>;

export const Interactive: Story = {};

/** Both Figma variants. They differ only in the string and the glyph. */
export const BothVariants: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 18px; }
      .demo-row { display: flex; align-items: center; gap: 20px; }
      .demo-k { width: 130px; flex: none; font-size: 11px; color: #727280;
                font-family: ui-monospace, monospace; }
      .demo-n { font-size: 11px; color: #9999a6; }
    </style>
    <div class="demo-wrap">
      <div class="demo-row">
        <span class="demo-k">Checked=yes</span>
        ${render(true, "***-**-1234", "123-12-1234")}
        <span class="demo-n">value hidden &middot; <code>#eye-off</code> &middot; aria-pressed="true"</span>
      </div>
      <div class="demo-row">
        <span class="demo-k">Checked=no</span>
        ${render(false, "***-**-1234", "123-12-1234")}
        <span class="demo-n">value shown &middot; <code>#eye</code> &middot; aria-pressed="false"</span>
      </div>
    </div>
    <p style="padding: 0 24px 24px; margin: 0; font-size: 11px; color: #727280; max-width: 620px;">
      The two variants are visually identical &mdash; same box, same colours, same type.
      Only the string and the glyph change, so the CSS carries no state rule.
    </p>
  `,
};

/** Toggling really works, so the aria-pressed contract can be checked by hand. */
export const Toggles: Story = {
  render: () => {
    const host = document.createElement("div");
    host.style.padding = "24px";
    let obscured = true;
    const paint = () => {
      host.innerHTML = `${render(obscured, "***-**-1234", "123-12-1234")}
        <p style="margin: 12px 0 0; font-size: 12px; color: #727280;">
          aria-pressed = <code>${obscured}</code> &mdash; tab to the button and press
          Enter or Space; the focus ring is Icon Button's.
        </p>`;
      host.querySelector("button")?.addEventListener("click", () => {
        obscured = !obscured;
        paint();
      });
    };
    paint();
    return host;
  },
};

/**
 * Icon Button gained `:focus-visible` alongside this component, so the toggle
 * is keyboard-reachable. Tab into the row to see the 2px Primary/Main ring.
 */
export const Focus: Story = {
  render: () => `
    <div style="padding: 24px;">
      ${render(true, "***-**-1234", "123-12-1234")}
      <p style="margin: 12px 0 0; font-size: 11px; color: #727280; max-width: 560px;">
        Figma models no focus state for Sensitive Data or for Icon Button; the ring is
        the library-wide <code>focus-ring</code> convention.
      </p>
    </div>
  `,
};

/** Figma's Ring boolean, hidden by default in the design file. */
export const WithRing: Story = {
  render: () =>
    `<div style="padding: 24px;">${render(true, "***-**-1234", "123-12-1234", true)}</div>`,
};

/** Realistic review-panel usage — the case the component exists for. */
export const InContext: Story = {
  render: () => `
    <style>
      .demo-card { margin: 24px; max-width: 420px; padding: 16px 20px; background: #fff;
        border: 1px solid rgba(20,20,40,0.08); border-radius: 8px;
        display: grid; grid-template-columns: auto 1fr; gap: 10px 24px; align-items: center; }
      .demo-lbl { font-size: 10px; font-weight: 600; letter-spacing: 1px;
        text-transform: uppercase; color: #727280; }
    </style>
    <div class="demo-card">
      <span class="demo-lbl">SSN</span>${render(true, "***-**-1234", "123-12-1234")}
      <span class="demo-lbl">Account</span>${render(true, "****-****-8891", "4417-2093-8891")}
      <span class="demo-lbl">DOB</span>${render(false, "**/**/1988", "04/12/1988")}
    </div>
  `,
};
