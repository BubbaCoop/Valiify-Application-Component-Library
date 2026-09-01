import type { Meta, StoryObj } from "@storybook/html-vite";

// Load sprite into page for icon <use> references
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

/** Icon size per menu size, per Figma: sm = 12px, md / lg = 15px. */
const iconSizeFor = (size: "sm" | "md" | "lg") => (size === "sm" ? 12 : 15);

interface MenuItemArgs {
  title: string;
  subtitle: string;
  showSubtitle: boolean;
  leftIcon: string;
  rightIcon: string;
  rightText: string;
  avatar: string;
  badgeIcon: string;
  size: "sm" | "md" | "lg";
  combined: boolean;
  selected: boolean;
  disabled: boolean;
}

const meta: Meta<MenuItemArgs> = {
  title: "Components/MenuItem",
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text", description: "Primary row label" },
    subtitle: { control: "text", description: "Secondary line (11px, all sizes)" },
    showSubtitle: { control: "boolean", description: "Show the subtitle line" },
    leftIcon: {
      control: "select",
      options: ["", "check", "user", "settings", "file-text", "folder", "star", "trash-2"],
      description: "Leading icon (sm=12px, md/lg=15px)",
    },
    rightIcon: {
      control: "select",
      options: ["", "check", "chevron-right", "external-link", "arrow-up-right"],
      description: "Trailing icon (sm=12px, md/lg=15px)",
    },
    rightText: {
      control: "text",
      description: "Trailing text — shortcut hints, counts, or a status word",
    },
    avatar: { control: "text", description: "Avatar initials (20px bubble). Empty to hide." },
    badgeIcon: {
      control: "select",
      options: ["", "users", "user", "building-2", "briefcase"],
      description: "Leading 20px tinted icon tile (the Combined variant's badge)",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Row size — sm (11px), md (12.5px, default), lg (13px)",
    },
    combined: {
      control: "boolean",
      description: "Combined variant — medium-weight primary title. Designed for lg.",
    },
    selected: { control: "boolean", description: "Selected row (aria-selected)" },
    disabled: { control: "boolean", description: "Disabled row" },
  },
  args: {
    title: "Combined",
    subtitle: "Both Applicants",
    showSubtitle: false,
    leftIcon: "",
    rightIcon: "check",
    rightText: "",
    avatar: "",
    badgeIcon: "",
    size: "md",
    combined: false,
    selected: false,
    disabled: false,
  },
  render: ({
    title,
    subtitle,
    showSubtitle,
    leftIcon,
    rightIcon,
    rightText,
    avatar,
    badgeIcon,
    size,
    combined,
    selected,
    disabled,
  }) => {
    const iconSize = iconSizeFor(size);
    const classes = ["menu-item", `menu-item-${size}`, combined ? "menu-item-combined" : ""]
      .filter(Boolean)
      .join(" ");

    return `
      <div style="width: 220px;">
        <button
          class="${classes}"
          role="menuitem"
          ${selected ? 'aria-selected="true"' : ""}
          ${disabled ? "disabled" : ""}
        >
          ${
            leftIcon
              ? `<svg class="icon icon-size-${iconSize}" aria-hidden="true"><use href="#${leftIcon}" /></svg>`
              : ""
          }
          ${avatar ? `<span class="avatar avatar-md">${avatar}</span>` : ""}
          ${
            badgeIcon
              ? `<span class="menu-item-badge"><svg class="icon icon-size-12" aria-hidden="true"><use href="#${badgeIcon}" /></svg></span>`
              : ""
          }
          <span class="menu-item-text">
            <span class="menu-item-title">${title}</span>
            ${showSubtitle ? `<span class="menu-item-subtitle">${subtitle}</span>` : ""}
          </span>
          ${rightText ? `<span class="menu-item-right-text">${rightText}</span>` : ""}
          ${
            rightIcon
              ? `<svg class="icon icon-size-${iconSize}" aria-hidden="true"><use href="#${rightIcon}" /></svg>`
              : ""
          }
        </button>
      </div>
    `;
  },
};

export default meta;
type Story = StoryObj<MenuItemArgs>;

export const Interactive: Story = {};

export const Simple: Story = {
  args: { title: "Daily", rightIcon: "" },
};

export const WithLeftIcon: Story = {
  args: { title: "Settings", leftIcon: "settings", rightIcon: "" },
};

export const WithSubtitle: Story = {
  args: { size: "lg", showSubtitle: true, rightIcon: "" },
};

export const WithRightText: Story = {
  args: { title: "Preferences", leftIcon: "settings", rightIcon: "", rightText: "⌘," },
};

export const WithAvatar: Story = {
  args: { size: "lg", title: "Nicholas Cooper", subtitle: "Reviewer", showSubtitle: true, avatar: "NC", rightIcon: "" },
};

export const Combined: Story = {
  args: {
    size: "lg",
    combined: true,
    badgeIcon: "users",
    title: "Combined",
    subtitle: "Both Applicants",
    showSubtitle: true,
    rightIcon: "check",
  },
};

export const Selected: Story = {
  args: { title: "Weekly", selected: true, rightIcon: "check" },
};

export const Disabled: Story = {
  args: { title: "Archived", disabled: true, rightIcon: "" },
};

export const AllSizes: Story = {
  render: () => {
    const row = (size: "sm" | "md" | "lg", note: string) => `
      <div>
        <p class="demo-label">${size} — ${note}</p>
        <div class="demo-panel">
          <button class="menu-item menu-item-${size}" role="menuitem">
            <svg class="icon icon-size-${iconSizeFor(size)}" aria-hidden="true"><use href="#folder" /></svg>
            <span class="menu-item-text"><span class="menu-item-title">Combined</span></span>
            <svg class="icon icon-size-${iconSizeFor(size)}" aria-hidden="true"><use href="#check" /></svg>
          </button>
        </div>
      </div>
    `;
    return `
      <style>
        .demo-wrap { padding: 20px; display: flex; flex-direction: column; gap: 20px; width: 260px; }
        .demo-label { margin: 0 0 6px; font-size: 12px; color: #727280; }
        .demo-panel { border: 1px dashed #e4e4ea; border-radius: 8px; padding: 4px; }
      </style>
      <div class="demo-wrap">
        ${row("sm", "11px title, 10/6 padding, 12px icons")}
        ${row("md", "12.5px title, 12/7 padding, 15px icons")}
        ${row("lg", "13px title, 12/11 padding, 15px icons")}
      </div>
    `;
  },
};

export const AllSlots: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 20px; display: flex; flex-direction: column; gap: 14px; width: 280px; }
      .demo-label { margin: 0 0 6px; font-size: 12px; color: #727280; }
    </style>
    <div class="demo-wrap">
      <div>
        <p class="demo-label">Title only</p>
        <button class="menu-item" role="menuitem">
          <span class="menu-item-text"><span class="menu-item-title">Daily</span></span>
        </button>
      </div>

      <div>
        <p class="demo-label">Left icon</p>
        <button class="menu-item" role="menuitem">
          <svg class="icon icon-size-15" aria-hidden="true"><use href="#file-text" /></svg>
          <span class="menu-item-text"><span class="menu-item-title">Export report</span></span>
        </button>
      </div>

      <div>
        <p class="demo-label">Right text</p>
        <button class="menu-item" role="menuitem">
          <svg class="icon icon-size-15" aria-hidden="true"><use href="#settings" /></svg>
          <span class="menu-item-text"><span class="menu-item-title">Preferences</span></span>
          <span class="menu-item-right-text">⌘,</span>
        </button>
      </div>

      <div>
        <p class="demo-label">Subtitle (lg)</p>
        <button class="menu-item menu-item-lg" role="menuitem">
          <span class="menu-item-text">
            <span class="menu-item-title">Combined</span>
            <span class="menu-item-subtitle">Both Applicants</span>
          </span>
        </button>
      </div>

      <div>
        <p class="demo-label">Avatar (lg)</p>
        <button class="menu-item menu-item-lg" role="menuitem">
          <span class="avatar avatar-md">NC</span>
          <span class="menu-item-text">
            <span class="menu-item-title">Nicholas Cooper</span>
            <span class="menu-item-subtitle">Reviewer</span>
          </span>
        </button>
      </div>

      <div>
        <p class="demo-label">Combined variant (lg) — badge + primary title</p>
        <button class="menu-item menu-item-lg menu-item-combined" role="menuitem">
          <span class="menu-item-badge">
            <svg class="icon icon-size-12" aria-hidden="true"><use href="#users" /></svg>
          </span>
          <span class="menu-item-text">
            <span class="menu-item-title">Combined</span>
            <span class="menu-item-subtitle">Both Applicants</span>
          </span>
          <svg class="icon icon-size-15" aria-hidden="true"><use href="#check" /></svg>
        </button>
      </div>
    </div>
  `,
};

export const AllStates: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 20px; display: flex; flex-direction: column; gap: 14px; width: 260px; }
      .demo-label { margin: 0 0 6px; font-size: 12px; color: #727280; }
    </style>
    <div class="demo-wrap">
      <div>
        <p class="demo-label">Rest</p>
        <button class="menu-item" role="menuitem">
          <span class="menu-item-text"><span class="menu-item-title">Daily</span></span>
        </button>
      </div>

      <div>
        <p class="demo-label">Hover — hover the row</p>
        <button class="menu-item" role="menuitem">
          <span class="menu-item-text"><span class="menu-item-title">Daily</span></span>
        </button>
      </div>

      <div>
        <p class="demo-label">Focus — tab to the row</p>
        <button class="menu-item" role="menuitem">
          <span class="menu-item-text"><span class="menu-item-title">Daily</span></span>
        </button>
      </div>

      <div>
        <p class="demo-label">Selected — aria-selected="true"</p>
        <button class="menu-item" role="menuitem" aria-selected="true">
          <span class="menu-item-text"><span class="menu-item-title">Weekly</span></span>
          <svg class="icon icon-size-15" aria-hidden="true"><use href="#check" /></svg>
        </button>
      </div>

      <div>
        <p class="demo-label">Disabled</p>
        <button class="menu-item" role="menuitem" disabled>
          <span class="menu-item-text"><span class="menu-item-title">Archived</span></span>
        </button>
      </div>
    </div>
  `,
};
