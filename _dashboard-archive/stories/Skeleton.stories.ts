import type { Meta, StoryObj } from "@storybook/html-vite";

type Shape = "line" | "heading" | "circle" | "rectangle" | "button";
type Size = "sm" | "md" | "lg";

/** A skeleton is decorative — it is always aria-hidden. See the Loading story. */
const sk = (shape: Shape, size: Size, extra = "") =>
  `<span class="skeleton skeleton-${shape} skeleton-${size}${extra ? " " + extra : ""}" aria-hidden="true"></span>`;

interface Args {
  shape: Shape;
  size: Size;
}

const meta: Meta<Args> = {
  title: "Components/Skeleton",
  tags: ["autodocs"],
  argTypes: {
    shape: {
      control: "inline-radio",
      options: ["line", "heading", "circle", "rectangle", "button"],
      description: "Figma's Shape axis — carries the radius. Required.",
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
      description: "Figma's Size axis — carries the dimensions. Required.",
    },
  },
  args: { shape: "line", size: "md" },
  render: ({ shape, size }) =>
    `<div style="padding: 24px;">${sk(shape, size)}</div>`,
};

export default meta;
type Story = StoryObj<Args>;

export const Interactive: Story = {};

/** All 15 Figma variants, at their default dimensions. */
export const AllVariants: Story = {
  render: () => {
    const shapes: Shape[] = [
      "line",
      "heading",
      "circle",
      "rectangle",
      "button",
    ];
    const sizes: Size[] = ["sm", "md", "lg"];
    const dims: Record<Shape, string[]> = {
      line: ["120×12", "200×16", "320×20"],
      heading: ["160×20", "240×24", "360×32"],
      circle: ["32×32", "40×40", "56×56"],
      rectangle: ["120×80", "200×120", "320×180"],
      button: ["64×32", "96×36", "128×40"],
    };
    const radius: Record<Shape, string> = {
      line: "rounded-tight 4px",
      heading: "rounded-tight 4px",
      circle: "rounded-pill",
      rectangle: "rounded-surface 8px",
      button: "rounded-control 6px",
    };
    return `
      <style>
        .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 28px; }
        .demo-h { margin: 0 0 4px; font-size: 12px; font-weight: 600; color: #16161a; }
        .demo-r { margin: 0 0 12px; font-size: 11px; color: #9999a6; font-family: ui-monospace, monospace; }
        .demo-row { display: flex; align-items: flex-end; gap: 28px; }
        .demo-cell { display: flex; flex-direction: column; gap: 6px; }
        .demo-d { font-size: 10px; color: #727280; font-family: ui-monospace, monospace; }
      </style>
      <div class="demo-wrap">
        ${shapes
          .map(
            (shape) => `<div>
            <p class="demo-h">${shape}</p>
            <p class="demo-r">${radius[shape]}</p>
            <div class="demo-row">
              ${sizes
                .map(
                  (size, i) => `<div class="demo-cell">
                    ${sk(shape, size)}
                    <span class="demo-d">${size.toUpperCase()} · ${dims[shape][i]}</span>
                  </div>`,
                )
                .join("")}
            </div>
          </div>`,
          )
          .join("")}
      </div>
      <p style="padding: 0 24px 24px; margin: 0; font-size: 11px; color: #727280; max-width: 640px;">
        All 15 pulse in sync — identical animations on elements rendered together share a start
        time, which is what Figma asks for. Do <em>not</em> add per-element
        <code>animation-delay</code>; staggering is the effect the spec rules out.
      </p>
    `;
  },
};

/**
 * ACCESSIBILITY — the pattern to copy. The skeletons are decorative and each
 * carries aria-hidden; the CONTAINER announces the loading state once with
 * role="status" + aria-busy. A screen reader says "Loading profile", not
 * "five grey boxes".
 */
export const Loading: Story = {
  render: () => `
    <div style="padding: 24px;">
      <div role="status" aria-busy="true" aria-label="Loading profile"
           style="display: flex; align-items: center; gap: 16px;">
        ${sk("circle", "lg")}
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${sk("heading", "lg")}
          ${sk("line", "md")}
        </div>
      </div>
    </div>
    <p style="padding: 0 24px 24px; margin: 0; font-size: 11px; color: #727280; max-width: 640px;">
      Figma specifies nothing about assistive tech, so this is a library decision:
      <code>aria-hidden</code> on every skeleton, <code>role="status"</code> +
      <code>aria-busy="true"</code> + a label on the container. It differs from Loading
      Indicator, where the spinner <em>is</em> the announcement and carries
      <code>role="status"</code> itself.
    </p>
  `,
};

/** The four composition patterns the usage node (1081:1986) documents. */
export const CompositionPatterns: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 32px; max-width: 760px; }
      .demo-h { margin: 0 0 10px; font-size: 12px; font-weight: 600; color: #16161a; }
      .demo-n { margin: 8px 0 0; font-size: 11px; color: #9999a6; }
      .col { display: flex; flex-direction: column; }
    </style>
    <div class="demo-wrap">
      <div>
        <p class="demo-h">Card skeleton</p>
        <div role="status" aria-busy="true" aria-label="Loading card" class="col" style="gap: 12px; width: 200px;">
          ${sk("rectangle", "md")}
          ${sk("heading", "md")}
          ${sk("line", "md")}
          ${sk("line", "md")}
          ${sk("line", "sm")}
        </div>
        <p class="demo-n">1× Rectangle MD · 1× Heading MD · 2× Line MD · 1× Line SM</p>
      </div>

      <div>
        <p class="demo-h">List item skeleton</p>
        <div role="status" aria-busy="true" aria-label="Loading list" class="col" style="gap: 14px;">
          ${[0, 1, 2]
            .map(
              () => `<div style="display: flex; align-items: center; gap: 12px;">
                ${sk("circle", "sm")}
                <div class="col" style="gap: 8px;">${sk("heading", "sm")}${sk("line", "md")}</div>
              </div>`,
            )
            .join("")}
        </div>
        <p class="demo-n">1× Circle SM · 1× Heading SM · 1× Line MD, per row</p>
      </div>

      <div>
        <p class="demo-h">Table row skeleton</p>
        <div role="status" aria-busy="true" aria-label="Loading table" class="col" style="gap: 14px;">
          ${[0, 1, 2, 3]
            .map(
              () =>
                `<div style="display: flex; gap: 24px;">${[0, 1, 2, 3].map(() => sk("line", "sm")).join("")}</div>`,
            )
            .join("")}
        </div>
        <p class="demo-n">Multiple Line SM — one per column</p>
      </div>

      <div>
        <p class="demo-h">Profile header skeleton</p>
        <div role="status" aria-busy="true" aria-label="Loading profile"
             style="display: flex; align-items: center; gap: 16px;">
          ${sk("circle", "lg")}
          <div class="col" style="gap: 10px;">${sk("heading", "lg")}${sk("line", "md")}</div>
        </div>
        <p class="demo-n">1× Circle LG · 1× Heading LG · 1× Line MD</p>
      </div>
    </div>
  `,
};

/**
 * The defaults are starting points. A consumer utility beats a component class
 * under the library's layer order, so widths stretch freely — heights should
 * stay close to the defaults, since they match the element being replaced.
 */
export const Resizing: Story = {
  render: () => `
    <div style="padding: 24px; max-width: 620px; display: flex; flex-direction: column; gap: 14px;">
      <div role="status" aria-busy="true" aria-label="Loading" style="display: flex; flex-direction: column; gap: 10px;">
        ${sk("line", "md")}
        ${sk("line", "md", "w-full")}
        ${sk("line", "md", "w-1/2")}
      </div>
    </div>
    <p style="padding: 0 24px 24px; margin: 0; font-size: 11px; color: #727280; max-width: 640px;">
      Default 200px, then <code>w-full</code>, then <code>w-1/2</code> — same class, overridden by
      a utility. Note these utilities exist in Storybook and on the <code>/source</code> entry;
      on the prebuilt entry a consumer generates their own.
    </p>
  `,
};

/**
 * MOTION — lives only here. The visual harness injects `animation: none` so
 * mid-animation opacity cannot corrupt colour checks, so the pulse is not
 * asserted in visual-specs. Figma's spec: 2s, ease-in-out, opacity 1 → 0.4 → 1.
 * Set "Reduce motion" in your OS to confirm the guard stops it.
 */
export const Motion: Story = {
  render: () => `
    <div style="padding: 24px; display: flex; gap: 20px; align-items: center;">
      ${sk("circle", "md")}${sk("heading", "md")}${sk("button", "md")}
    </div>
    <p style="padding: 0 24px 24px; margin: 0; font-size: 11px; color: #727280; max-width: 640px;">
      2s per cycle, ease-in-out, opacity 1.0 → 0.4 → 1.0 — and guarded by
      <code>prefers-reduced-motion: reduce</code> from the start, with the guard inside
      <code>@layer components</code>. Deliberately <em>not</em> Tailwind's
      <code>animate-pulse</code>, whose keyframe is <code>opacity: 0.5</code> on a
      cubic-bezier curve — neither value Figma specifies.
    </p>
  `,
};
