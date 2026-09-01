import type { Meta, StoryObj } from "@storybook/html-vite";

interface AvatarArgs {
  initials: string;
  size: "xs" | "sm" | "md" | "lg";
  disabled: boolean;
  withRing: boolean;
}

const SIZES = [
  { key: "xs", px: 16, type: "8px / 600" },
  { key: "sm", px: 18, type: "8px / 600" },
  { key: "md", px: 20, type: "8.5px / 500" },
  { key: "lg", px: 34, type: "11px / 500" },
] as const;

const meta: Meta<AvatarArgs> = {
  title: "Components/Avatar",
  tags: ["autodocs"],
  argTypes: {
    initials: {
      control: "text",
      description: "Initials shown in the circle. Two characters is the design intent.",
    },
    size: {
      control: "inline-radio",
      options: ["xs", "sm", "md", "lg"],
      description: "xs 16px · sm 18px · md 20px (default) · lg 34px",
    },
    disabled: {
      control: "boolean",
      description: "Dims the fill to Primary/Disabled. The initials do NOT dim.",
    },
    withRing: {
      control: "boolean",
      description: "Figma's Ring boolean — 2px inset ring in Primary/Main",
    },
  },
  args: {
    initials: "NC",
    size: "md",
    disabled: false,
    withRing: false,
  },
  render: ({ initials, size, disabled, withRing }) => {
    const classes = [
      "avatar",
      `avatar-${size}`,
      disabled ? "avatar-disabled" : "",
      withRing ? "with-ring" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return `<span class="${classes}">${initials}</span>`;
  },
};

export default meta;
type Story = StoryObj<AvatarArgs>;

export const Interactive: Story = {};

/**
 * Four sizes, but only three type styles — xs and sm share Micro S - Bold.
 */
export const AllSizes: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; gap: 28px; align-items: flex-end; }
      .demo-cell { text-align: center; }
      .demo-label { margin: 10px 0 0; font-size: 12px; color: #727280; }
      .demo-type { margin: 2px 0 0; font-size: 11px; color: #9999a6; }
    </style>
    <div class="demo-wrap">
      ${SIZES.map(
        (s) => `
        <div class="demo-cell">
          <span class="avatar avatar-${s.key}">NC</span>
          <p class="demo-label">${s.key} · ${s.px}px</p>
          <p class="demo-type">${s.type}</p>
        </div>`,
      ).join("")}
    </div>
  `,
};

/**
 * Disabled changes the fill and nothing else — the initials stay
 * Content/Contrast rather than dimming with the background.
 */
export const Disabled: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
      .demo-row { display: flex; gap: 28px; align-items: flex-end; }
      .demo-label { margin: 0 0 8px; font-size: 12px; color: #727280; }
    </style>
    <div class="demo-wrap">
      <div>
        <p class="demo-label">Enabled</p>
        <div class="demo-row">
          ${SIZES.map((s) => `<span class="avatar avatar-${s.key}">NC</span>`).join("")}
        </div>
      </div>
      <div>
        <p class="demo-label">Disabled</p>
        <div class="demo-row">
          ${SIZES.map(
            (s) => `<span class="avatar avatar-${s.key} avatar-disabled">NC</span>`,
          ).join("")}
        </div>
      </div>
    </div>
  `,
};

export const WithRing: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; gap: 28px; align-items: flex-end; }
    </style>
    <div class="demo-wrap">
      ${SIZES.map(
        (s) => `<span class="avatar avatar-${s.key} with-ring">NC</span>`,
      ).join("")}
    </div>
  `,
};

/**
 * Avatar is the shared primitive behind the initials bubbles in MenuItem and
 * DropdownField — those used to hand-roll their own copies.
 */
export const InContext: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 24px; width: 280px; }
      .demo-label { margin: 0 0 8px; font-size: 12px; color: #727280; }
    </style>
    <div class="demo-wrap">
      <div>
        <p class="demo-label">MenuItem (md)</p>
        <button class="menu-item menu-item-lg" role="menuitem">
          <span class="avatar avatar-md">NC</span>
          <span class="menu-item-text">
            <span class="menu-item-title">Nicholas Cooper</span>
            <span class="menu-item-subtitle">Primary applicant</span>
          </span>
        </button>
      </div>

      <div>
        <p class="demo-label">DropdownField (sm at lg, xs at md/sm)</p>
        <div class="dropdown-field-container">
          <div class="dropdown">
            <button class="dropdown-field" aria-haspopup="listbox" aria-expanded="false">
              <span class="avatar avatar-sm">NC</span>
              <span class="dropdown-field-value">Nicholas Cooper</span>
              <svg class="dropdown-field-chevron icon icon-size-14" aria-hidden="true">
                <use href="#chevron-down" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
};
