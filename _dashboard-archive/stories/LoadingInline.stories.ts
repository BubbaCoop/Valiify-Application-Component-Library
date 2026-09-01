import type { Meta, StoryObj } from "@storybook/html-vite";

type Size = "xs" | "sm" | "md" | "lg";

const SIZES: { key: Size; gap: string; text: string }[] = [
  { key: "xs", gap: "6px", text: "11 / 17" },
  { key: "sm", gap: "8px", text: "12 / 18" },
  { key: "md", gap: "10px", text: "14 / 21" },
  { key: "lg", gap: "12px", text: "16 / 24" },
];

const render = (size: Size, label = "Loading...") => `
  <span class="loading-inline${size === "xs" ? "" : ` loading-inline-${size}`}" role="status">
    <span class="loading-indicator"></span>
    ${label}
  </span>`;

interface Args {
  size: Size;
  label: string;
}

const meta: Meta<Args> = {
  title: "Components/LoadingInline",
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["xs", "sm", "md", "lg"],
      description:
        "Scales the gap and label only — the indicator stays 12px, as in Figma.",
    },
    label: { control: "text" },
  },
  args: { size: "xs", label: "Loading..." },
  render: ({ size, label }) =>
    `<div style="padding: 24px;">${render(size, label)}</div>`,
};

export default meta;
type Story = StoryObj<Args>;

export const Interactive: Story = {};

/**
 * All four sizes. Note the spinner is the same 12px in every row while the
 * label grows — Figma embeds a Size=XS indicator in all four variants.
 */
export const AllSizes: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 18px; }
      .demo-row { display: flex; align-items: center; gap: 24px; }
      .demo-k { width: 120px; flex: none; font-size: 11px; color: #9999a6; }
      .demo-note { margin: 12px 0 0; font-size: 11px; color: #727280; max-width: 600px; }
    </style>
    <div class="demo-wrap">
      ${SIZES.map(
        (s) => `<div class="demo-row">
          <span class="demo-k">${s.key} · gap ${s.gap} · ${s.text}</span>
          ${render(s.key)}
        </div>`,
      ).join("")}
    </div>
    <p class="demo-note" style="padding: 0 24px 24px;">
      The indicator is 12px in all four. That is Figma's own composition, not a shortcut
      here &mdash; and it is why the nested <code>.loading-indicator</code> needs no size
      class. Flagged for the designer, since at LG it reads small against 16px text.
    </p>
  `,
};

/** Swapping in the dots type, which composes just as well. */
export const WithDots: Story = {
  render: () => `
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 16px; align-items: flex-start;">
      ${["sm", "lg"]
        .map(
          (
            s,
          ) => `<span class="loading-inline loading-inline-${s}" role="status">
            <span class="loading-indicator loading-indicator-dots">
              <span class="loading-indicator-dot"></span>
              <span class="loading-indicator-dot"></span>
              <span class="loading-indicator-dot"></span>
            </span>
            Fetching records...
          </span>`,
        )
        .join("")}
    </div>
    <p style="padding: 0 24px; margin: 0; font-size: 11px; color: #727280;">
      Not a Figma variant — Loading Inline only pairs with the circle there. Shown because
      the composition is open.
    </p>
  `,
};

/** In context — what these actually sit inside. */
export const InContext: Story = {
  render: () => `
    <style>
      .demo-card { margin: 24px; max-width: 460px; padding: 16px; background: #fff;
        border: 1px solid rgba(20,20,40,0.08); border-radius: 8px; }
      .demo-hd { display: flex; justify-content: space-between; align-items: center;
        font-size: 13px; font-weight: 600; color: #16161a; margin-bottom: 12px; }
      .demo-body { display: flex; align-items: center; justify-content: center;
        min-height: 90px; border: 1px dashed rgba(20,20,40,0.10); border-radius: 6px; }
    </style>
    <div class="demo-card">
      <div class="demo-hd">
        Verification results
        ${render("xs", "Refreshing")}
      </div>
      <div class="demo-body">${render("md", "Loading records...")}</div>
    </div>
  `,
};
