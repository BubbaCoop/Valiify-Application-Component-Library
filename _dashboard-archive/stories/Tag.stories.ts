import type { Meta, StoryObj } from "@storybook/html-vite";

// Tag needs no icons of its own, but the VersusPill story borrows a Pill,
// which has a chevron.
const spriteUrl = "/sprite.svg";

const loadSprite = () => {
  if (typeof document !== "undefined" && !document.getElementById("icon-sprite")) {
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

interface TagArgs {
  label: string;
  size: "sm" | "md";
  avatar: string;
  count: string;
  statusDot: boolean;
  active: boolean;
  disabled: boolean;
  withRing: boolean;
}

const meta: Meta<TagArgs> = {
  title: "Components/Tag",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text", description: "Tag label" },
    size: {
      control: "inline-radio",
      options: ["sm", "md"],
      description: "sm 21px (default) · md 24px",
    },
    avatar: {
      control: "text",
      description:
        "Initials for the leading Avatar. md ONLY — Figma draws no avatar layer at sm. Empty to hide.",
      if: { arg: "size", eq: "md" },
    },
    count: {
      control: "text",
      description:
        "Trailing count. md ONLY. Despite Figma calling it a badge it is bare mono text.",
      if: { arg: "size", eq: "md" },
    },
    statusDot: { control: "boolean", description: "Trailing 5px warning dot. Both sizes." },
    active: { control: "boolean", description: "Selected — solid primary fill (aria-pressed)" },
    disabled: { control: "boolean", description: "Dims the label only, nothing else" },
    withRing: { control: "boolean", description: "Figma's Ring boolean — 2px inset ring" },
  },
  args: {
    label: "Design",
    size: "sm",
    avatar: "",
    count: "",
    statusDot: false,
    active: false,
    disabled: false,
    withRing: false,
  },
  render: ({ label, size, avatar, count, statusDot, active, disabled, withRing }) => {
    const isMd = size === "md";
    const classes = ["tag", `tag-${size}`, withRing ? "with-ring" : ""].filter(Boolean).join(" ");

    return `
      <div style="padding: 24px;">
        <button
          class="${classes}"
          aria-pressed="${active}"
          ${disabled ? "disabled" : ""}
        >
          ${isMd && avatar ? `<span class="avatar avatar-xs">${avatar}</span>` : ""}
          ${label}
          ${isMd && count ? `<span class="tag-count">${count}</span>` : ""}
          ${statusDot ? `<span class="dot dot-warning"></span>` : ""}
        </button>
      </div>
    `;
  },
};

export default meta;
type Story = StoryObj<TagArgs>;

export const Interactive: Story = {};

/** The four combinations Figma actually draws, at both sizes. */
export const AllStates: Story = {
  render: () => {
    const row = (size: "sm" | "md") => `
      <div>
        <p class="demo-label">${size} — ${size === "sm" ? 21 : 24}px</p>
        <div class="demo-row">
          <button class="tag tag-${size}" aria-pressed="false">Design</button>
          <button class="tag tag-${size}" aria-pressed="false">Design</button>
          <button class="tag tag-${size}" aria-pressed="true">Design</button>
          <button class="tag tag-${size}" aria-pressed="false" disabled>Design</button>
        </div>
        <p class="demo-note">rest · hover (hover it) · active · disabled</p>
      </div>
    `;
    return `
      <style>
        .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 22px; }
        .demo-row { display: flex; gap: 12px; align-items: center; }
        .demo-label { margin: 0 0 8px; font-size: 12px; color: #727280; }
        .demo-note { margin: 6px 0 0; font-size: 11px; color: #9999a6; }
      </style>
      <div class="demo-wrap">
        ${row("sm")}
        ${row("md")}
        <p class="demo-note">
          Figma draws no active-without-hover variant. Active here is the
          hover+active treatment; a non-hovered active is unconfirmed.
        </p>
      </div>
    `;
  },
};

/**
 * The slots are existing components. The avatar is a literal Avatar xs
 * instance and the status dot is the Dot primitive — neither was redrawn.
 * Both are md-only in Figma except the dot, which exists at both sizes.
 */
export const Slots: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 18px; }
      .demo-row { display: flex; gap: 12px; align-items: center; }
      .demo-label { margin: 0 0 8px; font-size: 12px; color: #727280; }
    </style>
    <div class="demo-wrap">
      <div>
        <p class="demo-label">Avatar (md only) — reuses .avatar avatar-xs</p>
        <div class="demo-row">
          <button class="tag tag-md" aria-pressed="false">
            <span class="avatar avatar-xs">JS</span>Design
          </button>
          <button class="tag tag-md" aria-pressed="true">
            <span class="avatar avatar-xs">JS</span>Design
          </button>
        </div>
      </div>

      <div>
        <p class="demo-label">Count (md only) — bare mono text, not a badge</p>
        <div class="demo-row">
          <button class="tag tag-md" aria-pressed="false">Design<span class="tag-count">1</span></button>
          <button class="tag tag-md" aria-pressed="true">Design<span class="tag-count">1</span></button>
        </div>
      </div>

      <div>
        <p class="demo-label">Status dot (both sizes) — reuses .dot dot-warning</p>
        <div class="demo-row">
          <button class="tag" aria-pressed="false">Design<span class="dot dot-warning"></span></button>
          <button class="tag tag-md" aria-pressed="false">Design<span class="dot dot-warning"></span></button>
        </div>
      </div>

      <div>
        <p class="demo-label">All three together (md)</p>
        <div class="demo-row">
          <button class="tag tag-md" aria-pressed="false">
            <span class="avatar avatar-xs">JS</span>Design<span class="tag-count">1</span><span class="dot dot-warning"></span>
          </button>
        </div>
      </div>
    </div>
  `,
};

/**
 * Disabled dims the label and nothing else — border, background and slots are
 * untouched. A disabled Tag keeps a fully enabled Avatar, which is what Figma
 * draws.
 */
export const Disabled: Story = {
  render: () => `
    <div style="padding: 24px; display: flex; gap: 12px; align-items: center;">
      <button class="tag" aria-pressed="false" disabled>Design</button>
      <button class="tag tag-md" aria-pressed="false" disabled>
        <span class="avatar avatar-xs">JS</span>Design<span class="tag-count">1</span>
      </button>
    </div>
  `,
};

/** Side by side with Pill, which is the distinction this component exists to make. */
export const VersusPill: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 22px; max-width: 560px; }
      .demo-row { display: flex; gap: 12px; align-items: center; }
      .demo-label { margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #16161a; }
      .demo-note { margin: 8px 0 0; font-size: 11px; line-height: 1.5; color: #727280; }
    </style>
    <div class="demo-wrap">
      <div>
        <p class="demo-label">Tag — a label that happens to be clickable</p>
        <div class="demo-row">
          <button class="tag tag-md" aria-pressed="false">
            <span class="avatar avatar-xs">JS</span>Design<span class="tag-count">1</span>
          </button>
          <button class="tag tag-md" aria-pressed="true">Approved</button>
          <button class="tag tag-md" aria-pressed="false" disabled>Archived</button>
        </div>
        <p class="demo-note">
          Transparent with a hairline at rest, so it reads as content. Carries
          metadata. Solid high-contrast active — a hard on/off applied filter.
          Use it to label a record inline.
        </p>
      </div>

      <div>
        <p class="demo-label">Pill — chrome</p>
        <div class="demo-row">
          <button class="pill" aria-pressed="true">All</button>
          <button class="pill" aria-pressed="false">Overdue</button>
          <button class="pill" aria-haspopup="listbox" aria-expanded="false">
            Assignee<svg class="pill-chevron icon icon-size-13" aria-hidden="true"><use href="#chevron-down" /></svg>
          </button>
        </div>
        <p class="demo-note">
          Always filled, borderless, no slots, optional chevron. Soft-tint
          active — a selected item in a set. Use it in a filter or segmented bar.
        </p>
      </div>
    </div>
  `,
};
