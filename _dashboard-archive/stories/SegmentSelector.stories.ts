import type { Meta, StoryObj } from "@storybook/html-vite";

interface SegmentSelectorArgs {
  options: string;
  selected: number;
  fill: boolean;
  withRing: boolean;
}

const meta: Meta<SegmentSelectorArgs> = {
  title: "Components/SegmentSelector",
  tags: ["autodocs"],
  argTypes: {
    options: {
      control: "text",
      description: "Comma-separated segment labels. Figma's description caps usage at 2–5.",
    },
    selected: {
      control: { type: "number", min: 0 },
      description: "Index of the selected segment",
    },
    fill: {
      control: "boolean",
      description:
        "Distribute segments equally. NOT from Figma — Figma's segments hug their labels.",
    },
    withRing: { control: "boolean", description: "Figma's Ring boolean — 2px inset, 4px radius" },
  },
  args: {
    options: "Overview, Detail",
    selected: 0,
    fill: false,
    withRing: false,
  },
  render: ({ options, selected, fill, withRing }) => {
    const labels = options
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);

    const classes = [
      "segment-selector",
      fill ? "segment-selector-fill" : "",
      withRing ? "with-ring" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const segments = labels
      .map(
        (label, i) =>
          `<button class="tab tab-segment" role="radio" aria-checked="${i === selected}">${label}</button>`,
      )
      .join("");

    return `
      <div style="padding: 24px; background: #ffffff;">
        <div class="${classes}" role="radiogroup" aria-label="View">${segments}</div>
      </div>
    `;
  },
};

export default meta;
type Story = StoryObj<SegmentSelectorArgs>;

export const Interactive: Story = {};

/** The exact composition from Figma (784:34686) — two segments, first selected. */
export const Default: Story = {
  args: { options: "Overview, Overview", selected: 0 },
};

/**
 * Segments hug their labels, so the container grows with each one added.
 * Figma's 160px example is content-driven — both its segments are 79px only
 * because both labels are the string "Overview".
 */
export const GrowsWithContent: Story = {
  render: () => {
    const group = (labels: string[]) => `
      <div class="segment-selector" role="radiogroup" aria-label="View">
        ${labels
          .map(
            (l, i) =>
              `<button class="tab tab-segment" role="radio" aria-checked="${i === 0}">${l}</button>`,
          )
          .join("")}
      </div>
    `;
    return `
      <style>
        .demo-wrap { padding: 24px; background: #ffffff; display: flex; flex-direction: column; gap: 16px; align-items: flex-start; }
        .demo-label { margin: 0 0 6px; font-size: 12px; color: #727280; }
        .demo-note { margin: 10px 0 0; font-size: 11px; color: #9999a6; max-width: 460px; line-height: 1.5; }
      </style>
      <div class="demo-wrap">
        <div><p class="demo-label">2 segments</p>${group(["Overview", "Detail"])}</div>
        <div><p class="demo-label">3 segments</p>${group(["Overview", "Detail", "History"])}</div>
        <div><p class="demo-label">5 segments — the upper bound Figma describes</p>${group(["All", "Open", "Review", "Approved", "Archived"])}</div>
        <p class="demo-note">
          There is no overflow handling. Past about five segments the container
          simply keeps growing, which is why the design caps it there.
        </p>
      </div>
    `;
  },
};

/**
 * Equal-width segments — an addition, not in Figma. Useful when labels differ
 * in length and the ragged widths of the hug behaviour look wrong.
 */
export const EqualWidth: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; background: #ffffff; display: flex; flex-direction: column; gap: 18px; max-width: 420px; }
      .demo-label { margin: 0 0 6px; font-size: 12px; color: #727280; }
    </style>
    <div class="demo-wrap">
      <div>
        <p class="demo-label">Hug (Figma default) — ragged</p>
        <div class="segment-selector" role="radiogroup" aria-label="View">
          <button class="tab tab-segment" role="radio" aria-checked="true">All</button>
          <button class="tab tab-segment" role="radio" aria-checked="false">Needs review</button>
          <button class="tab tab-segment" role="radio" aria-checked="false">Done</button>
        </div>
      </div>
      <div>
        <p class="demo-label">.segment-selector-fill — equal</p>
        <div class="segment-selector segment-selector-fill" role="radiogroup" aria-label="View">
          <button class="tab tab-segment" role="radio" aria-checked="true">All</button>
          <button class="tab tab-segment" role="radio" aria-checked="false">Needs review</button>
          <button class="tab tab-segment" role="radio" aria-checked="false">Done</button>
        </div>
      </div>
    </div>
  `,
};

/**
 * There is no sliding thumb. The selected state is styling on the selected
 * child — white fill, 0.5px hairline, darker text — not a floating indicator.
 */
export const SelectedState: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; background: #ffffff; display: flex; flex-direction: column; gap: 14px; align-items: flex-start; }
      .demo-note { margin: 8px 0 0; font-size: 11px; color: #727280; max-width: 420px; line-height: 1.5; }
    </style>
    <div class="demo-wrap">
      <div class="segment-selector" role="radiogroup" aria-label="View">
        <button class="tab tab-segment" role="radio" aria-checked="true">Overview</button>
        <button class="tab tab-segment" role="radio" aria-checked="false">Detail</button>
        <button class="tab tab-segment" role="radio" aria-checked="false">History</button>
      </div>
      <p class="demo-note">
        Selected differs in exactly three properties: white fill, a 0.5px
        hairline, and darker text. No shadow — most segmented controls elevate
        the active thumb; this one uses the hairline instead.
      </p>
    </div>
  `,
};
