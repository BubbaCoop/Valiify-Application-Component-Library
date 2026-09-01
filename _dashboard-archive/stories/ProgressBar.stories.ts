import type { Meta, StoryObj } from "@storybook/html-vite";

type Scheme = "base" | "success";

interface Args {
  scheme: Scheme;
  percent: number;
  title: string;
  topContent: boolean;
  bottomContent: boolean;
}

const render = ({
  scheme,
  percent,
  title,
  topContent,
  bottomContent,
}: Args) => {
  const rest = 100 - percent;
  return `
    <div class="progress-bar${scheme === "success" ? " progress-bar-success" : ""}">
      ${
        topContent
          ? `<div class="progress-bar-header">
               <span class="progress-bar-title">${title}</span>
               <span class="progress-bar-value">${percent}%</span>
             </div>`
          : ""
      }

      <div class="progress-bar-track" role="progressbar"
           aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"
           aria-label="${title}">
        <div class="progress-bar-fill" style="width: ${percent}%"></div>
      </div>

      ${
        bottomContent
          ? `<div class="progress-bar-legend">
               <span class="progress-bar-legend-item">
                 <span class="progress-bar-legend-swatch"></span>
                 <span class="progress-bar-legend-label">${percent}% verified</span>
               </span>
               <span class="progress-bar-legend-item">
                 <span class="progress-bar-legend-swatch progress-bar-legend-swatch-neutral"></span>
                 <span class="progress-bar-legend-label">${rest}% unaccounted</span>
               </span>
             </div>`
          : ""
      }
    </div>`;
};

const meta: Meta<Args> = {
  title: "Components/ProgressBar",
  tags: ["autodocs"],
  argTypes: {
    scheme: {
      control: "inline-radio",
      options: ["base", "success"],
      description:
        "Figma calls this axis `Has Legend`, but it swaps the COLOUR — both variants show a legend. Renamed here.",
    },
    percent: { control: { type: "range", min: 0, max: 100, step: 1 } },
    title: { control: "text" },
    topContent: {
      control: "boolean",
      description: "Figma's Top Content boolean — the label row",
    },
    bottomContent: {
      control: "boolean",
      description: "Figma's Bottom Content boolean — the legend row",
    },
  },
  args: {
    scheme: "base",
    percent: 68,
    title: "Review completion",
    topContent: true,
    bottomContent: true,
  },
  render: (a) =>
    `<div style="padding: 24px; max-width: 400px;">${render(a)}</div>`,
};

export default meta;
type Story = StoryObj<Args>;

export const Interactive: Story = {};

/**
 * Both Figma variants. The axis is named `Has Legend` but only the colour
 * changes — the legend is present in each, gated by its own boolean.
 */
export const BothSchemes: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; max-width: 400px; display: flex; flex-direction: column; gap: 32px; }
      .demo-label { margin: 0 0 12px; font-size: 12px; font-weight: 600; color: #16161a; }
      .demo-note { margin: 10px 0 0; font-size: 11px; color: #9999a6; }
    </style>
    <div class="demo-wrap">
      <div>
        <p class="demo-label">base &mdash; Figma's <code>Has Legend=false</code></p>
        ${render({ scheme: "base", percent: 68, title: "Review completion", topContent: true, bottomContent: true })}
        <p class="demo-note">Primary/Main throughout.</p>
      </div>
      <div>
        <p class="demo-label">success &mdash; Figma's <code>Has Legend=true</code></p>
        ${render({ scheme: "success", percent: 92, title: "Review completion", topContent: true, bottomContent: true })}
        <p class="demo-note">
          Approved/<strong>Content</strong> for the value, Approved/<strong>Main</strong> for the
          fill and swatch &mdash; the same token split Modal's positive variant has.
        </p>
      </div>
    </div>
  `,
};

/** Figma's two content booleans. */
export const Booleans: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; max-width: 400px; display: flex; flex-direction: column; gap: 30px; }
      .demo-label { margin: 0 0 12px; font-size: 12px; font-weight: 600; color: #16161a; }
    </style>
    <div class="demo-wrap">
      <div>
        <p class="demo-label">Bottom Content = off</p>
        ${render({ scheme: "base", percent: 68, title: "Review completion", topContent: true, bottomContent: false })}
      </div>
      <div>
        <p class="demo-label">Top Content = off</p>
        ${render({ scheme: "success", percent: 92, title: "Review completion", topContent: false, bottomContent: true })}
      </div>
      <div>
        <p class="demo-label">Both off &mdash; the bar alone</p>
        ${render({ scheme: "base", percent: 40, title: "Review completion", topContent: false, bottomContent: false })}
      </div>
    </div>
  `,
};

/** The track spans its container, so the bar works at any width. */
export const Widths: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 26px; }
      .demo-note { margin: 0 0 8px; font-size: 11px; color: #9999a6; }
    </style>
    <div class="demo-wrap">
      <div style="max-width: 240px;">
        <p class="demo-note">240px</p>
        ${render({ scheme: "base", percent: 68, title: "Completion", topContent: true, bottomContent: false })}
      </div>
      <div style="max-width: 400px;">
        <p class="demo-note">400px &mdash; Figma's frame width</p>
        ${render({ scheme: "base", percent: 68, title: "Review completion", topContent: true, bottomContent: true })}
      </div>
      <div style="max-width: 640px;">
        <p class="demo-note">640px</p>
        ${render({ scheme: "success", percent: 92, title: "Review completion", topContent: true, bottomContent: true })}
      </div>
    </div>
    <p style="padding: 0 24px 24px; margin: 0; font-size: 11px; color: #727280; max-width: 620px;">
      Figma fixes the track at 360px inside a 400px frame while the label and legend rows
      are full width, so the bar stops 40px short of both. Treated as a slip and made
      full-width here.
    </p>
  `,
};

/** A range of values, including the two edges. */
export const Values: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; max-width: 400px; display: flex; flex-direction: column; gap: 20px; }
    </style>
    <div class="demo-wrap">
      ${[0, 8, 40, 68, 92, 100]
        .map((p) =>
          render({
            scheme: p >= 92 ? "success" : "base",
            percent: p,
            title: "Review completion",
            topContent: true,
            bottomContent: false,
          }),
        )
        .join("")}
    </div>
  `,
};
