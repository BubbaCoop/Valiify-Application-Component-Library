/**
 * Skeleton — loading placeholders mirroring real components.
 * Figma: Skeleton (525:4650, 16 shapes) + the written spec (550:7998), which
 * authors the SM/MD/LG matrix, radii, and the pulse animation.
 */
import type { Meta, StoryObj } from "@storybook/html";

const sk = (shape: string, size = "md") =>
  `<span class="skeleton skeleton-${shape} skeleton-${size}" aria-hidden="true"></span>`;

const SHAPES = [
  "text", "heading", "circle", "rectangle", "button", "input", "textarea",
  "card", "switch", "checkbox", "badge", "listitem", "tab", "avatar",
  "dropdown", "radio",
];

const meta: Meta = {
  title: "Components/Skeleton",
  tags: ["autodocs"],
  render: () => `
    <div role="status" aria-busy="true" aria-label="Loading" style="display: flex; flex-direction: column; gap: 12px;">
      ${sk("heading")}${sk("text")}${sk("text", "sm")}
    </div>
  `,
};

export default meta;
type Story = StoryObj;

export const Interactive: Story = {};

/** All 16 shapes at MD. */
export const AllShapes: Story = {
  render: () => `
    <div role="status" aria-busy="true" aria-label="Loading" style="display: grid; grid-template-columns: repeat(4, auto); gap: 24px; align-items: start; justify-content: start;">
      ${SHAPES.map((s) => `<div style="display:flex;flex-direction:column;gap:6px;"><span style="font-size:10px;color:#54565b;">${s}</span>${sk(s)}</div>`).join("")}
    </div>
  `,
};

/** The full 16-shape × 3-size matrix — dimensions are a matrix, not a
 * scale, and the visual spec sweeps every cell of it. */
export const AllSizes: Story = {
  render: () => `
    <div role="status" aria-busy="true" aria-label="Loading" style="display: flex; flex-direction: column; gap: 16px;">
      ${SHAPES.map(
        (s) => `<div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: end;">
        <span style="width: 80px; font-size: 10px; color: #54565b;">${s}</span>
        ${sk(s, "sm")}${sk(s, "md")}${sk(s, "lg")}
      </div>`,
      ).join("")}
    </div>
  `,
};

/** Card composition pattern from the written spec. */
export const CardPattern: Story = {
  render: () => `
    <div role="status" aria-busy="true" aria-label="Loading card" style="display: flex; flex-direction: column; gap: 12px; width: 200px;">
      ${sk("rectangle")}
      ${sk("heading", "sm")}
      <span class="skeleton skeleton-text skeleton-md w-full" aria-hidden="true"></span>
      <span class="skeleton skeleton-text skeleton-md w-full" aria-hidden="true"></span>
      ${sk("text", "sm")}
    </div>
  `,
};

/** Form skeleton pattern from the written spec. */
export const FormPattern: Story = {
  render: () => `
    <div role="status" aria-busy="true" aria-label="Loading form" style="display: flex; flex-direction: column; gap: 16px;">
      ${sk("input")}${sk("input")}${sk("dropdown")}
      <div style="display: flex; gap: 10px; align-items: center;">${sk("checkbox")}${sk("text", "sm")}</div>
      ${sk("button")}
    </div>
  `,
};

/** Widths stretch freely; heights stay near defaults (per the spec). */
export const Resizing: Story = {
  render: () => `
    <div role="status" aria-busy="true" aria-label="Loading" style="display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 480px;">
      <span class="skeleton skeleton-heading skeleton-md w-full" aria-hidden="true"></span>
      <span class="skeleton skeleton-text skeleton-md w-full" aria-hidden="true"></span>
      <span class="skeleton skeleton-text skeleton-md" aria-hidden="true" style="width: 60%;"></span>
    </div>
  `,
};
