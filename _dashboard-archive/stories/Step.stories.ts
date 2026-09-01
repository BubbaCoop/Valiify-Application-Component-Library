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

type State = "completed" | "active" | "upcoming";

const CHECK = `<svg class="icon icon-size-12" aria-hidden="true"><use href="#check" /></svg>`;

const NOTES: Record<State, string> = {
  completed:
    "Primary/Main fill, no border, 12px check · label Content/Tertiary, Medium",
  active: "Surface/Paper, 2px Primary/Main ring · label Primary/Main, Medium",
  upcoming:
    "Surface/Paper, 1px Content/Faint ring · label Neutral/Strong, Regular",
};

const render = (
  state: State,
  label: string,
  num: string | number = 1,
  showLabel = true,
) => `
  <div class="step${state === "completed" ? "" : ` step-${state}`}"${
    state === "active" ? ' aria-current="step"' : ""
  }>
    <span class="step-marker">${state === "completed" ? CHECK : num}</span>
    ${showLabel ? `<span class="step-label">${label}</span>` : ""}
  </div>`;

interface Args {
  state: State;
  label: string;
  stepNumber: string;
  stepTitle: boolean;
}

const meta: Meta<Args> = {
  title: "Components/Step",
  tags: ["autodocs"],
  argTypes: {
    state: {
      control: "inline-radio",
      options: ["completed", "active", "upcoming"],
      description: "completed is Figma's default and the base class",
    },
    label: { control: "text" },
    stepNumber: {
      control: "text",
      description:
        "Figma's Stepper Number text property (Step 1032:2012). Drawn on active " +
        "and upcoming only — completed shows the check instead.",
    },
    stepTitle: {
      control: "boolean",
      description: "Figma's Step Title boolean",
    },
  },
  args: { state: "active", label: "Review", stepNumber: "3", stepTitle: true },
  render: ({ state, label, stepNumber, stepTitle }) =>
    `<div style="padding: 24px;">${render(state, label, stepNumber, stepTitle)}</div>`,
};

export default meta;
type Story = StoryObj<Args>;

export const Interactive: Story = {};

/**
 * All three states. Note the label ramp is inverted — a completed step's label
 * is LIGHTER than an upcoming one's.
 */
export const AllStates: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 22px; }
      .demo-row { display: flex; align-items: flex-start; gap: 24px; }
      .demo-k { width: 96px; flex: none; font-size: 12px; font-weight: 600; color: #16161a; padding-top: 4px; }
      .demo-n { font-size: 11px; color: #9999a6; padding-top: 6px; }
    </style>
    <div class="demo-wrap">
      ${(["completed", "active", "upcoming"] as State[])
        .map(
          (s, i) => `<div class="demo-row">
            <span class="demo-k">${s}</span>
            ${render(s, s, i + 1)}
            <span class="demo-n">${NOTES[s]}</span>
          </div>`,
        )
        .join("")}
    </div>
    <p style="padding: 0 24px 24px; margin: 0; font-size: 11px; color: #727280; max-width: 640px;">
      The completed label (<code>Content/Tertiary</code> #727280) is lighter than the
      upcoming one (<code>Neutral/Strong</code> #4e4e59), while the weights run the other
      way. Reproduced from Figma; flagged for the designer.
    </p>
  `,
};

/** Figma's Step Title boolean — markers alone still align. */
export const WithoutLabels: Story = {
  render: () => `
    <div style="padding: 24px; display: flex; gap: 20px; align-items: center;">
      ${render("completed", "", 1, false)}
      ${render("active", "", 2, false)}
      ${render("upcoming", "", 3, false)}
    </div>
  `,
};

/** All three markers are 24px, so a row of mixed states sits on one baseline. */
export const Alignment: Story = {
  render: () => `
    <div style="padding: 24px; display: flex; gap: 28px; align-items: flex-start;
                outline: 1px dashed rgba(20,20,40,0.13); margin: 24px; width: fit-content;">
      ${render("completed", "Intake", 1)}
      ${render("active", "Review", 2)}
      ${render("upcoming", "Decision", 3)}
    </div>
    <p style="padding: 0 24px; margin: 0; font-size: 11px; color: #727280; max-width: 560px;">
      Completed draws no border in Figma; here it carries a transparent 2px one so all
      three boxes measure 24px under border-box and line up.
    </p>
  `,
};
