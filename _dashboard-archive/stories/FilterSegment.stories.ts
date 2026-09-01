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

type Position = "first" | "middle" | "last";

const CLOSE = `<button class="icon-button icon-button-md" aria-label="Remove filter">
  <svg class="icon icon-size-14" aria-hidden="true"><use href="#x" /></svg>
</button>`;

interface SegArgs {
  position: Position;
  size: "sm" | "md";
  selected: boolean;
  label: string;
}

const cls = ({ position, size }: Omit<SegArgs, "label" | "selected">) =>
  [
    "filter-segment",
    position === "middle" ? "" : `filter-segment-${position}`,
    size === "md" ? "filter-segment-md" : "",
  ]
    .filter(Boolean)
    .join(" ");

const render = (a: SegArgs) =>
  `<button class="${cls(a)}" aria-pressed="${a.selected}">${a.label}</button>`;

const meta: Meta<SegArgs> = {
  title: "Components/FilterSegment",
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "inline-radio",
      options: ["first", "middle", "last"],
      description:
        "middle is Figma's default and the base class. Only first draws a left border; only first/last round.",
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md"],
      description: "sm 21px (default) · md 28px",
    },
    selected: {
      control: "boolean",
      description: "Figma's Selected axis (aria-pressed)",
    },
    label: { control: "text" },
  },
  args: { position: "middle", size: "sm", selected: false, label: "Is any of" },
  render: (a) => `<div style="padding: 24px;">${render(a)}</div>`,
};

export default meta;
type Story = StoryObj<SegArgs>;

export const Interactive: Story = {};

/**
 * All 18 Figma variants: three positions × rest / hover / selected × two sizes.
 * Hover is live — Figma draws no hover-and-selected combination.
 */
export const AllVariants: Story = {
  render: () => {
    const positions: Position[] = ["middle", "last", "first"];
    const rows: [string, string][] = [
      ["rest", ""],
      ["hover — hover it", ""],
      ["selected", 'aria-pressed="true"'],
    ];

    const grid = (size: "sm" | "md") => `
      <p class="demo-label">Size = ${size}${size === "sm" ? " (default)" : ""}</p>
      <table class="demo-table">
        <tr><th></th>${positions.map((p) => `<th>${p}</th>`).join("")}</tr>
        ${rows
          .map(
            ([name, attr]) => `
          <tr>
            <td class="demo-row-label">${name}</td>
            ${positions
              .map(
                (p) =>
                  `<td><button class="${cls({ position: p, size })}" ${attr}>Is any of</button></td>`,
              )
              .join("")}
          </tr>`,
          )
          .join("")}
      </table>`;

    return `
      <style>
        .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 26px; }
        .demo-label { margin: 0 0 10px; font-size: 12px; font-weight: 600; color: #16161a; }
        .demo-table { border-collapse: separate; border-spacing: 14px 8px; margin: -8px -14px; }
        .demo-table th { font-size: 11px; font-weight: 500; color: #9999a6; text-align: left; }
        .demo-row-label { font-size: 11px; color: #727280; white-space: nowrap; }
      </style>
      <div class="demo-wrap">
        <div>${grid("sm")}</div>
        <div>${grid("md")}</div>
      </div>
      <p style="padding: 0 24px 24px; margin: 0; font-size: 11px; color: #727280; max-width: 620px;">
        Segments are shown apart here so each position's borders are visible. In a real
        group they abut &mdash; see InAGroup.
      </p>
    `;
  },
};

/**
 * Figma's own example composition (1018:33960). Note it expresses "label vs
 * value" through text overrides, NOT the selected state: every segment keeps
 * the rest background, the operator is Content/Secondary, and the chosen value
 * steps to Micro L - Bold.
 */
export const InAGroup: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 22px; align-items: flex-start; }
      .demo-note { margin: 8px 0 0; font-size: 11px; color: #9999a6; max-width: 620px; }
    </style>
    <div class="demo-wrap">
      <div>
        <div class="filter-segments">
          <button class="filter-segment filter-segment-first filter-segment-md text-content-primary">Product</button>
          <button class="filter-segment filter-segment-md">Is any of</button>
          <button class="filter-segment filter-segment-md text-micro-l-bold text-content-primary">Deposit Account</button>
          <span class="filter-segment filter-segment-last filter-segment-md">${CLOSE}</span>
        </div>
        <p class="demo-note">
          Figma's example, reproduced. The text colour and weight are instance overrides,
          not component states &mdash; all four segments use the rest background.
          Every segment is a real control: tab through and each one takes focus in turn.
        </p>
      </div>

      <div>
        <div class="filter-segments">
          <button class="filter-segment filter-segment-first text-content-primary">Status</button>
          <button class="filter-segment">Is</button>
          <button class="filter-segment text-micro-l-bold text-content-primary">Approved</button>
          <span class="filter-segment filter-segment-last">${CLOSE}</span>
        </div>
        <p class="demo-note">The same shape at sm.</p>
      </div>
    </div>
  `,
};

/** Selection really toggles, so the state can be checked by hand. */
export const Toggles: Story = {
  render: () => {
    const host = document.createElement("div");
    host.style.padding = "24px";
    host.innerHTML = `
      <div class="filter-segments" role="group" aria-label="Match mode">
        <button class="filter-segment filter-segment-first filter-segment-md" aria-pressed="true">All</button>
        <button class="filter-segment filter-segment-md" aria-pressed="false">Any</button>
        <button class="filter-segment filter-segment-last filter-segment-md" aria-pressed="false">None</button>
      </div>
      <p style="margin-top: 12px; font-size: 12px; color: #727280;">
        Click to move the selection. Hover an unselected segment &mdash; selected is excluded
        from the hover rule, so it does not repaint underneath you.
      </p>
    `;
    const segs = host.querySelectorAll<HTMLButtonElement>(".filter-segment");
    segs.forEach((el) =>
      el.addEventListener("click", () => {
        segs.forEach((o) => o.setAttribute("aria-pressed", "false"));
        el.setAttribute("aria-pressed", "true");
      }),
    );
    return host;
  },
};

/** Not in Figma — house convention, so a disabled segment is not clickable. */
export const Disabled: Story = {
  render: () => `
    <div style="padding: 24px;">
      <div class="filter-segments">
        <button class="filter-segment filter-segment-first filter-segment-md" disabled>Product</button>
        <button class="filter-segment filter-segment-md" disabled>Is any of</button>
        <button class="filter-segment filter-segment-last filter-segment-md" disabled>Deposit Account</button>
      </div>
    </div>
  `,
};
