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

const CHECK = `<svg class="icon icon-size-12" aria-hidden="true"><use href="#check" /></svg>`;

const step = (
  state: "completed" | "active" | "upcoming",
  label: string,
  num: number,
) => `
  <div class="step${state === "completed" ? "" : ` step-${state}`}"${
    state === "active" ? ' aria-current="step"' : ""
  }>
    <span class="step-marker">${state === "completed" ? CHECK : num}</span>
    <span class="step-label">${label}</span>
  </div>`;

/** Builds a stepper from a label list and the index of the active step. */
const stepper = (labels: string[], activeIndex: number, title?: string) => {
  const parts: string[] = [];
  labels.forEach((label, i) => {
    const state =
      i < activeIndex ? "completed" : i === activeIndex ? "active" : "upcoming";
    if (i > 0) {
      parts.push(
        `<span class="stepper-connector${i <= activeIndex ? " stepper-connector-complete" : ""}"></span>`,
      );
    }
    parts.push(step(state, label, i + 1));
  });
  return `
    <div class="stepper">
      ${title ? `<p class="stepper-title">${title}</p>` : ""}
      <div class="stepper-steps">${parts.join("")}</div>
    </div>`;
};

interface Args {
  activeIndex: number;
  stepperTitle: boolean;
}

const LABELS = ["Intake", "Verify", "Review", "Decision"];

const meta: Meta<Args> = {
  title: "Components/Stepper",
  tags: ["autodocs"],
  argTypes: {
    activeIndex: {
      control: { type: "range", min: 0, max: 3, step: 1 },
      description:
        "Which step is current — everything before it completes, after it upcoming",
    },
    stepperTitle: {
      control: "boolean",
      description: "Figma's Stepper Title boolean",
    },
  },
  args: { activeIndex: 2, stepperTitle: true },
  render: ({ activeIndex, stepperTitle }) =>
    `<div style="padding: 24px; max-width: 400px;">${stepper(
      LABELS,
      activeIndex,
      stepperTitle ? "Stepped progression flow" : undefined,
    )}</div>`,
};

export default meta;
type Story = StoryObj<Args>;

export const Interactive: Story = {};

/** Figma's own composition, at 400px. */
export const Default: Story = {
  render: () => `
    <div style="padding: 24px; max-width: 400px;">
      ${stepper(LABELS, 2, "Stepped progression flow")}
    </div>
    <p style="padding: 0 24px 24px; margin: 0; font-size: 11px; color: #727280; max-width: 560px;">
      Connectors are <code>flex-1</code>, so they absorb whatever the labels leave &mdash; which
      is why Figma's step instances differ in width (38 / 38 / 41 / 51) while every connector
      is the same 70.67px.
    </p>
  `,
};

/** Walking the active index through the flow. */
export const Progression: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; max-width: 400px; display: flex; flex-direction: column; gap: 26px; }
      .demo-k { margin: 0 0 8px; font-size: 11px; color: #9999a6; }
    </style>
    <div class="demo-wrap">
      ${[0, 1, 2, 3]
        .map(
          (i) =>
            `<div><p class="demo-k">active = ${i} (${LABELS[i]})</p>${stepper(LABELS, i)}</div>`,
        )
        .join("")}
    </div>
  `,
};

/** The row distributes itself, so it works at any width and step count. */
export const WidthsAndCounts: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 26px; }
      .demo-k { margin: 0 0 8px; font-size: 11px; color: #9999a6; }
    </style>
    <div class="demo-wrap">
      <div style="max-width: 280px;"><p class="demo-k">280px · 3 steps</p>${stepper(["Intake", "Review", "Done"], 1)}</div>
      <div style="max-width: 400px;"><p class="demo-k">400px · Figma's frame</p>${stepper(LABELS, 2)}</div>
      <div style="max-width: 640px;"><p class="demo-k">640px · 5 steps</p>${stepper(["Intake", "Verify", "Review", "Approve", "Decision"], 3)}</div>
    </div>
  `,
};

/** Clicking a step moves the flow, so the connector logic can be checked. */
export const Clickable: Story = {
  render: () => {
    const host = document.createElement("div");
    host.style.cssText = "padding: 24px; max-width: 400px;";
    let active = 2;
    const paint = () => {
      host.innerHTML = stepper(LABELS, active, "Stepped progression flow");
      host.querySelectorAll<HTMLElement>(".step").forEach((el, i) => {
        el.style.cursor = "pointer";
        el.addEventListener("click", () => {
          active = i;
          paint();
        });
      });
    };
    paint();
    return host;
  },
};
