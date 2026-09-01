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

type Status = "approve" | "mismatch" | "unverified" | "na";

/**
 * What sits inside the 16px box is NOT uniform: two glyphs, one shape, one
 * nothing. `na` is genuinely empty in Figma.
 */
const STATUSES: Record<Status, { label: string; mark: string; note: string }> =
  {
    approve: {
      label: "Approved",
      mark: `<svg class="icon icon-size-14" aria-hidden="true"><use href="#check" /></svg>`,
      note: "14px #check · Approved/Main",
    },
    mismatch: {
      label: "Mismatch",
      mark: `<span class="section-marker-dot"></span>`,
      note: "8px filled dot · Critical/Main",
    },
    unverified: {
      label: "Unverified",
      mark: `<svg class="icon icon-size-14" aria-hidden="true"><use href="#circle" /></svg>`,
      note: "14px #circle · Secondary/Main",
    },
    na: {
      label: "Not applicable",
      mark: "",
      note: "nothing at all — the box only reserves space",
    },
  };

const render = (status: Status, { withRing = false } = {}) => {
  const s = STATUSES[status];
  // `na` takes no status class — with no colour to set it would be an empty rule.
  const cls = [
    "section-marker",
    status === "na" ? "" : `section-marker-${status}`,
    withRing ? "with-ring" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return `<span class="${cls}" role="img" aria-label="${s.label}">${s.mark}</span>`;
};

interface MarkerArgs {
  status: Status;
  withRing: boolean;
}

const meta: Meta<MarkerArgs> = {
  title: "Components/SectionMarker",
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["approve", "mismatch", "unverified", "na"],
      description:
        "Figma's Status axis. Each status draws a different kind of mark — see AllStatuses.",
    },
    withRing: {
      control: "boolean",
      description: "Figma's Ring boolean — 2px inset, square here",
    },
  },
  args: { status: "approve", withRing: false },
  render: ({ status, withRing }) =>
    `<div style="padding: 24px;">${render(status, { withRing })}</div>`,
};

export default meta;
type Story = StoryObj<MarkerArgs>;

export const Interactive: Story = {};

/** All four, with what each actually draws. */
export const AllStatuses: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; gap: 32px; align-items: flex-start; }
      .demo-cell { text-align: center; }
      .demo-box { display: inline-flex; padding: 8px; border: 1px dashed rgba(20,20,40,0.13); border-radius: 4px; }
      .demo-label { margin: 10px 0 0; font-size: 12px; color: #16161a; font-weight: 600; }
      .demo-note { margin: 2px 0 0; font-size: 11px; color: #9999a6; max-width: 130px; }
    </style>
    <div class="demo-wrap">
      ${(Object.keys(STATUSES) as Status[])
        .map(
          (s) => `
        <div class="demo-cell">
          <span class="demo-box">${render(s)}</span>
          <p class="demo-label">${s}</p>
          <p class="demo-note">${STATUSES[s].note}</p>
        </div>`,
        )
        .join("")}
    </div>
    <p style="padding: 0 24px 24px; margin: 0; font-size: 11px; color: #727280; max-width: 620px;">
      The dashed box is the story's, not the component's — it shows that every status
      occupies the same 16&times;16, including <code>na</code>, which draws nothing.
    </p>
  `,
};

/** Figma's Ring boolean. Square, because the box has no corner radius. */
export const WithRing: Story = {
  render: () => `
    <div style="padding: 24px; display: flex; gap: 24px; align-items: center;">
      ${(Object.keys(STATUSES) as Status[]).map((s) => render(s, { withRing: true })).join("")}
    </div>
  `,
};

/** What it is for — a column of section statuses, where alignment matters. */
export const InAList: Story = {
  render: () => `
    <style>
      .demo-list { padding: 24px; display: flex; flex-direction: column; gap: 2px; max-width: 380px; }
      .demo-row { display: flex; align-items: center; gap: 10px; padding: 7px 8px; border-radius: 6px; }
      .demo-row:hover { background: rgba(20,20,40,0.02); }
      .demo-name { font-size: 12px; color: #16161a; }
    </style>
    <div class="demo-list">
      ${[
        ["approve", "Business details"],
        ["approve", "Ownership structure"],
        ["mismatch", "Registered address"],
        ["unverified", "Beneficial owners"],
        ["na", "Franchise agreement"],
      ]
        .map(
          ([s, name]) => `
        <div class="demo-row">
          ${render(s as Status)}
          <span class="demo-name">${name}</span>
        </div>`,
        )
        .join("")}
    </div>
  `,
};
