import type { Meta, StoryObj } from "@storybook/html-vite";

type Size = "xs" | "sm" | "md" | "lg";
type Type = "circle" | "dots";

const SIZES: { key: Size; box: string; ring: string; dot: string }[] = [
  { key: "xs", box: "12px", ring: "2px (authored 1.5)", dot: "2px" },
  { key: "sm", box: "16px", ring: "2px", dot: "3px" },
  { key: "md", box: "24px", ring: "3px (authored 2.5)", dot: "4px" },
  { key: "lg", box: "32px", ring: "3px", dot: "5px" },
];

const cls = (type: Type, size: Size) =>
  [
    "loading-indicator",
    type === "dots" ? "loading-indicator-dots" : "",
    size === "xs" ? "" : `loading-indicator-${size}`,
  ]
    .filter(Boolean)
    .join(" ");

const render = (type: Type, size: Size) =>
  type === "dots"
    ? `<span class="${cls("dots", size)}" role="status" aria-label="Loading">
         <span class="loading-indicator-dot"></span>
         <span class="loading-indicator-dot"></span>
         <span class="loading-indicator-dot"></span>
       </span>`
    : `<span class="${cls("circle", size)}" role="status" aria-label="Loading"></span>`;

interface Args {
  type: Type;
  size: Size;
}

const meta: Meta<Args> = {
  title: "Components/LoadingIndicator",
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["circle", "dots"],
      description: "Figma's Type axis",
    },
    size: {
      control: "inline-radio",
      options: ["xs", "sm", "md", "lg"],
      description: "xs 12px (default) · sm 16 · md 24 · lg 32",
    },
  },
  args: { type: "circle", size: "xs" },
  render: ({ type, size }) =>
    `<div style="padding: 24px;">${render(type, size)}</div>`,
};

export default meta;
type Story = StoryObj<Args>;

export const Interactive: Story = {};

/** All 8 Figma variants. Both types animate — the motion is a library decision. */
export const AllVariants: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 26px; }
      .demo-label { margin: 0 0 14px; font-size: 12px; font-weight: 600; color: #16161a; }
      .demo-row { display: flex; gap: 32px; align-items: center; }
      .demo-cell { text-align: center; }
      .demo-k { margin: 12px 0 0; font-size: 11px; color: #9999a6; }
      .demo-note { margin: 12px 0 0; font-size: 11px; color: #9999a6; max-width: 620px; }
    </style>
    <div class="demo-wrap">
      <div>
        <p class="demo-label">Type = Circle</p>
        <div class="demo-row">
          ${SIZES.map(
            (s) => `<div class="demo-cell">${render("circle", s.key)}
              <p class="demo-k">${s.key} · ${s.box} · ring ${s.ring}</p></div>`,
          ).join("")}
        </div>
        <p class="demo-note">
          A Stroke/Divider track ring with a 90&deg; Primary/Main arc &mdash; built from one
          coloured side of a round border, which <em>is</em> a quarter arc. Ring widths are
          integers because Chrome floors half-pixels while Figma rounds them up; these
          reproduce Figma's rendered 2&thinsp;/&thinsp;2&thinsp;/&thinsp;3&thinsp;/&thinsp;3.
        </p>
      </div>

      <div>
        <p class="demo-label">Type = Dots</p>
        <div class="demo-row">
          ${SIZES.map(
            (s) => `<div class="demo-cell">${render("dots", s.key)}
              <p class="demo-k">${s.key} · ${s.dot} dot &amp; gap</p></div>`,
          ).join("")}
        </div>
        <p class="demo-note">
          Diameter and gap are always the same number, which is why each frame is exactly
          5&times; its height. Fill is Secondary/Main, not the circle's Primary.
        </p>
      </div>
    </div>
  `,
};

/** Side by side at a common size, to compare the two types' colour treatment. */
export const CircleVsDots: Story = {
  render: () => `
    <div style="padding: 24px; display: flex; gap: 40px; align-items: center;">
      ${render("circle", "md")}
      ${render("dots", "md")}
    </div>
    <p style="padding: 0 24px; margin: 0; font-size: 11px; color: #727280; max-width: 560px;">
      Both MD. The circle's arc is Primary/Main over a Stroke/Divider track; the dots are
      Secondary/Main throughout.
    </p>
  `,
};

/**
 * The motion is NOT in Figma — both types are static vectors there. These
 * values are a library decision and are on the designer list.
 */
export const Motion: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 18px; }
      .demo-row { display: flex; gap: 28px; align-items: center; }
      .demo-note { margin: 0; font-size: 11px; color: #727280; max-width: 620px; }
    </style>
    <div class="demo-wrap">
      <div class="demo-row">${render("circle", "lg")}${render("dots", "lg")}</div>
      <p class="demo-note">
        Spin: 0.8s linear. Dots: 1.4s ease-in-out opacity pulse, staggered 0.16s.
        Conventional defaults &mdash; Figma specifies no timing, easing or prototype.
      </p>
      <p class="demo-note">
        Under <code>prefers-reduced-motion: reduce</code> both stop entirely, which is why
        every usage needs <code>role="status"</code> and a label.
      </p>
    </div>
  `,
};
