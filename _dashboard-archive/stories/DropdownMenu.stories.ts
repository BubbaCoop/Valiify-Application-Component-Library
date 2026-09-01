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

interface DropdownMenuArgs {
  size: "sm" | "md" | "lg";
  selectedIndex: number;
  showCheck: boolean;
  showDivider: boolean;
  width: number;
}

const OPTIONS = ["Weekly", "Daily", "Monthly", "Quarterly"];

const meta: Meta<DropdownMenuArgs> = {
  title: "Components/DropdownMenu",
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the rows inside the panel",
    },
    selectedIndex: {
      control: { type: "number", min: -1, max: 3 },
      description: "Index of the selected row (-1 for none)",
    },
    showCheck: {
      control: "boolean",
      description: "Show a check icon on the selected row",
    },
    showDivider: {
      control: "boolean",
      description: "Insert a divider before the last row",
    },
    width: {
      control: { type: "number", min: 160, max: 400 },
      description: "Panel width in px (the panel has a 200px minimum)",
    },
  },
  args: {
    size: "md",
    selectedIndex: 0,
    showCheck: true,
    showDivider: false,
    width: 200,
  },
  render: ({ size, selectedIndex, showCheck, showDivider, width }) => {
    const iconSize = size === "sm" ? 12 : 15;

    const rows = OPTIONS.map((label, i) => {
      const isSelected = i === selectedIndex;
      const divider =
        showDivider && i === OPTIONS.length - 1 ? `<div class="dropdown-menu-divider"></div>` : "";

      return `
        ${divider}
        <button
          class="menu-item menu-item-${size}"
          role="menuitem"
          ${isSelected ? 'aria-selected="true"' : ""}
        >
          <span class="menu-item-text"><span class="menu-item-title">${label}</span></span>
          ${
            isSelected && showCheck
              ? `<svg class="icon icon-size-${iconSize}" aria-hidden="true"><use href="#check" /></svg>`
              : ""
          }
        </button>
      `;
    }).join("");

    return `
      <div style="padding: 24px;">
        <div class="dropdown-menu" role="menu" style="width: ${width}px;">
          ${rows}
        </div>
      </div>
    `;
  },
};

export default meta;
type Story = StoryObj<DropdownMenuArgs>;

export const Interactive: Story = {};

/** The exact composition from Figma (139:798). */
export const Default: Story = {
  args: { size: "md", selectedIndex: 0, showCheck: true },
};

export const WithIcons: Story = {
  render: () => `
    <div style="padding: 24px;">
      <div class="dropdown-menu" role="menu">
        <button class="menu-item" role="menuitem">
          <svg class="icon icon-size-15" aria-hidden="true"><use href="#pencil" /></svg>
          <span class="menu-item-text"><span class="menu-item-title">Edit</span></span>
        </button>
        <button class="menu-item" role="menuitem">
          <svg class="icon icon-size-15" aria-hidden="true"><use href="#copy" /></svg>
          <span class="menu-item-text"><span class="menu-item-title">Duplicate</span></span>
        </button>
        <button class="menu-item" role="menuitem">
          <svg class="icon icon-size-15" aria-hidden="true"><use href="#share-2" /></svg>
          <span class="menu-item-text"><span class="menu-item-title">Share</span></span>
        </button>
      </div>
    </div>
  `,
};

export const WithShortcuts: Story = {
  render: () => `
    <div style="padding: 24px;">
      <div class="dropdown-menu" role="menu" style="width: 220px;">
        <button class="menu-item" role="menuitem">
          <svg class="icon icon-size-15" aria-hidden="true"><use href="#file-plus" /></svg>
          <span class="menu-item-text"><span class="menu-item-title">New review</span></span>
          <span class="menu-item-right-text">⌘N</span>
        </button>
        <button class="menu-item" role="menuitem">
          <svg class="icon icon-size-15" aria-hidden="true"><use href="#search" /></svg>
          <span class="menu-item-text"><span class="menu-item-title">Search</span></span>
          <span class="menu-item-right-text">⌘K</span>
        </button>
        <button class="menu-item" role="menuitem">
          <svg class="icon icon-size-15" aria-hidden="true"><use href="#settings" /></svg>
          <span class="menu-item-text"><span class="menu-item-title">Preferences</span></span>
          <span class="menu-item-right-text">⌘,</span>
        </button>
      </div>
    </div>
  `,
};

export const WithDivider: Story = {
  render: () => `
    <div style="padding: 24px;">
      <div class="dropdown-menu" role="menu">
        <button class="menu-item" role="menuitem">
          <svg class="icon icon-size-15" aria-hidden="true"><use href="#pencil" /></svg>
          <span class="menu-item-text"><span class="menu-item-title">Edit</span></span>
        </button>
        <button class="menu-item" role="menuitem">
          <svg class="icon icon-size-15" aria-hidden="true"><use href="#copy" /></svg>
          <span class="menu-item-text"><span class="menu-item-title">Duplicate</span></span>
        </button>

        <div class="dropdown-menu-divider"></div>

        <button class="menu-item" role="menuitem">
          <svg class="icon icon-size-15 text-critical" aria-hidden="true"><use href="#trash-2" /></svg>
          <span class="menu-item-text"><span class="menu-item-title text-critical">Delete</span></span>
        </button>
      </div>
    </div>
  `,
};

/** Applicant picker — the Combined variant alongside avatar rows. */
export const ApplicantPicker: Story = {
  render: () => `
    <div style="padding: 24px;">
      <div class="dropdown-menu" role="menu" style="width: 240px;">
        <button class="menu-item menu-item-lg menu-item-combined" role="menuitem" aria-selected="true">
          <span class="menu-item-badge">
            <svg class="icon icon-size-12" aria-hidden="true"><use href="#users" /></svg>
          </span>
          <span class="menu-item-text">
            <span class="menu-item-title">Combined</span>
            <span class="menu-item-subtitle">Both Applicants</span>
          </span>
          <svg class="icon icon-size-15" aria-hidden="true"><use href="#check" /></svg>
        </button>

        <div class="dropdown-menu-divider"></div>

        <button class="menu-item menu-item-lg" role="menuitem">
          <span class="avatar avatar-md">NC</span>
          <span class="menu-item-text">
            <span class="menu-item-title">Nicholas Cooper</span>
            <span class="menu-item-subtitle">Primary applicant</span>
          </span>
        </button>

        <button class="menu-item menu-item-lg" role="menuitem">
          <span class="avatar avatar-md">JD</span>
          <span class="menu-item-text">
            <span class="menu-item-title">Jordan Diaz</span>
            <span class="menu-item-subtitle">Co-applicant</span>
          </span>
        </button>
      </div>
    </div>
  `,
};

export const AllSizes: Story = {
  render: () => {
    const panel = (size: "sm" | "md" | "lg") => {
      const iconSize = size === "sm" ? 12 : 15;
      const rows = OPTIONS.map(
        (label, i) => `
          <button class="menu-item menu-item-${size}" role="menuitem" ${i === 0 ? 'aria-selected="true"' : ""}>
            <span class="menu-item-text"><span class="menu-item-title">${label}</span></span>
            ${i === 0 ? `<svg class="icon icon-size-${iconSize}" aria-hidden="true"><use href="#check" /></svg>` : ""}
          </button>
        `,
      ).join("");
      return `
        <div>
          <p class="demo-label">${size}</p>
          <div class="dropdown-menu" role="menu">${rows}</div>
        </div>
      `;
    };

    return `
      <style>
        .demo-wrap { padding: 24px; display: flex; gap: 24px; align-items: flex-start; }
        .demo-label { margin: 0 0 8px; font-size: 12px; color: #727280; }
      </style>
      <div class="demo-wrap">
        ${panel("sm")}
        ${panel("md")}
        ${panel("lg")}
      </div>
    `;
  },
};

/**
 * Anchored under a trigger with the `.dropdown` / `.dropdown-panel` helpers.
 * Shown open — the library ships no JavaScript, so the consuming app toggles
 * `hidden` on the panel and `aria-expanded` on the trigger. See the
 * DropdownField stories for a fully wired, clickable example.
 */
export const WithTrigger: Story = {
  render: () => `
    <div style="padding: 24px; height: 240px; width: 200px;">
      <div class="dropdown">
        <button class="btn btn-outline" aria-expanded="true" aria-haspopup="menu">
          Weekly
          <svg class="icon icon-size-14" aria-hidden="true"><use href="#chevron-down" /></svg>
        </button>

        <div class="dropdown-panel">
          <div class="dropdown-menu" role="menu">
            <button class="menu-item" role="menuitem" aria-selected="true">
              <span class="menu-item-text"><span class="menu-item-title">Weekly</span></span>
              <svg class="icon icon-size-15" aria-hidden="true"><use href="#check" /></svg>
            </button>
            <button class="menu-item" role="menuitem">
              <span class="menu-item-text"><span class="menu-item-title">Daily</span></span>
            </button>
            <button class="menu-item" role="menuitem">
              <span class="menu-item-text"><span class="menu-item-title">Monthly</span></span>
            </button>
            <button class="menu-item" role="menuitem">
              <span class="menu-item-text"><span class="menu-item-title">Quarterly</span></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
};
