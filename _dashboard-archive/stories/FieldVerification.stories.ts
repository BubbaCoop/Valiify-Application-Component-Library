import type { Meta, StoryObj } from "@storybook/html-vite";

// Load sprite into page for icon <use> references
const spriteUrl = "/sprite.svg";

const loadSprite = () => {
  if (
    typeof document !== "undefined" &&
    !document.getElementById("icon-sprite")
  ) {
    fetch(spriteUrl)
      .then((res) => res.text())
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

type State = "verified" | "pending" | "none" | "mismatch" | "mismatchDetails";

/** Figma's five states. Four are one-line rows; the fifth is a stacked panel. */
const MARKUP: Record<State, string> = {
  // Figma composes this icon from a literal Section Marker instance.
  verified: `
    <span class="field-verification field-verification-verified">
      <span class="section-marker section-marker-approve">
        <svg class="icon icon-size-14" aria-hidden="true"><use href="#check" /></svg>
      </span>
      <span class="field-verification-label">Matches X</span>
    </span>`,

  // Also a Section Marker instance in Figma — same 16px box as verified, just
  // bound to Content/Tertiary instead of Secondary/Main.
  pending: `
    <span class="field-verification field-verification-pending">
      <span class="section-marker">
        <svg class="icon icon-size-14" aria-hidden="true"><use href="#circle" /></svg>
      </span>
      <span class="field-verification-label">Not yet verified</span>
    </span>`,

  // A #minus glyph in a Section Marker, NOT a drawn rule — see the CSS header.
  none: `
    <span class="field-verification field-verification-none" role="img" aria-label="No status">
      <span class="section-marker">
        <svg class="icon icon-size-14" aria-hidden="true"><use href="#minus" /></svg>
      </span>
    </span>`,

  mismatch: `
    <span class="field-verification field-verification-mismatch">
      <svg class="field-verification-icon icon icon-size-15" aria-hidden="true"><use href="#triangle-alert" /></svg>
      <span class="field-verification-label">1 Conflict</span>
    </span>`,

  mismatchDetails: `
    <span class="field-verification field-verification-mismatch">
      <svg class="field-verification-icon icon icon-size-15" aria-hidden="true"><use href="#triangle-alert" /></svg>
      <span class="field-verification-details">
        <span class="field-verification-label">Does not match KYC</span>
        <span class="field-verification-detail">Reported: 04/12/1988</span>
        <span class="field-verification-action">
          Review discrepancy
          <svg class="icon icon-size-15" aria-hidden="true"><use href="#arrow-right" /></svg>
        </span>
      </span>
    </span>`,
};

const NOTES: Record<State, string> = {
  verified:
    "Approved/Main icon (a Section Marker instance) + Content/Tertiary label",
  pending:
    "Content/Tertiary throughout — NOT Section Marker's Secondary/Main circle",
  none: "a Section Marker with a #minus glyph. No label.",
  mismatch: "Critical/Main throughout",
  mismatchDetails: "tops-aligned; adds a mono line and an action row",
};

interface FVArgs {
  state: State;
  withRing: boolean;
}

const meta: Meta<FVArgs> = {
  title: "Components/FieldVerification",
  tags: ["autodocs"],
  argTypes: {
    state: {
      control: "inline-radio",
      options: ["verified", "pending", "none", "mismatch", "mismatchDetails"],
      description:
        "Figma's State axis. Each draws a different mark — see AllStates.",
    },
    withRing: {
      control: "boolean",
      description: "Figma's Ring boolean — 2px inset, square",
    },
  },
  args: { state: "verified", withRing: false },
  render: ({ state, withRing }) => {
    const html = withRing
      ? MARKUP[state].replace(
          "field-verification ",
          "field-verification with-ring ",
        )
      : MARKUP[state];
    return `<div style="padding: 24px;">${html}</div>`;
  },
};

export default meta;
type Story = StoryObj<FVArgs>;

export const Interactive: Story = {};

/** All five, with what each actually draws. */
export const AllStates: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 18px; }
      .demo-row { display: flex; align-items: flex-start; gap: 20px; }
      .demo-key { width: 150px; flex: none; font-size: 12px; font-weight: 600; color: #16161a; }
      .demo-mark { width: 220px; flex: none; }
      .demo-note { font-size: 11px; color: #9999a6; padding-top: 2px; }
    </style>
    <div class="demo-wrap">
      ${(Object.keys(MARKUP) as State[])
        .map(
          (s) => `
        <div class="demo-row">
          <div class="demo-key">${s}</div>
          <div class="demo-mark">${MARKUP[s]}</div>
          <div class="demo-note">${NOTES[s]}</div>
        </div>`,
        )
        .join("")}
    </div>
  `,
};

/**
 * `none` is a 10×1px rule occupying the same 16×18 the icons do, so a column of
 * fields stays aligned whether or not a status exists.
 */
export const InAFieldList: Story = {
  render: () => `
    <style>
      .demo-table { padding: 24px; display: flex; flex-direction: column; gap: 4px; max-width: 520px; font-size: 12px; }
      .demo-line { display: flex; align-items: flex-start; gap: 16px; padding: 6px 0; border-bottom: 1px solid rgba(20,20,40,0.08); }
      .demo-field { width: 130px; flex: none; color: #727280; }
      .demo-value { width: 130px; flex: none; color: #16161a; }
    </style>
    <div class="demo-table">
      ${[
        ["Legal name", "Northwind Freight LLC", "verified"],
        ["EIN", "84-2910473", "verified"],
        ["Date of birth", "04/12/1989", "mismatchDetails"],
        ["Phone", "(512) 555-0144", "pending"],
        ["Trade name", "—", "none"],
      ]
        .map(
          ([f, v, s]) => `
        <div class="demo-line">
          <span class="demo-field">${f}</span>
          <span class="demo-value">${v}</span>
          ${MARKUP[s as State]}
        </div>`,
        )
        .join("")}
    </div>
  `,
};

/** Figma's Ring boolean. Square, because the box has no corner radius. */
export const WithRing: Story = {
  render: () => `
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 16px; align-items: flex-start;">
      ${(["verified", "pending", "none", "mismatch"] as State[])
        .map((s) =>
          MARKUP[s].replace(
            "field-verification ",
            "field-verification with-ring ",
          ),
        )
        .join("")}
    </div>
  `,
};
