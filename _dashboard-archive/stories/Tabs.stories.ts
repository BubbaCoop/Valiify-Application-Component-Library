import type { Meta, StoryObj } from "@storybook/html-vite";

interface TabsArgs {
  type: "underline" | "chip" | "segment";
  size: "lg" | "sm";
  label: string;
  subtitle: string;
  badge: string;
  active: boolean;
  disabled: boolean;
}

const meta: Meta<TabsArgs> = {
  title: "Components/Tabs",
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["underline", "chip", "segment"],
      description: "underline 32px · chip 26px (6px radius) · segment 26px (2px radius)",
    },
    size: {
      control: "inline-radio",
      options: ["lg", "sm"],
      description: "sm exists for underline ONLY — Figma draws no small chip or segment",
      if: { arg: "type", eq: "underline" },
    },
    label: { control: "text", description: "Tab label" },
    subtitle: {
      control: "text",
      description: "Optional second line — 8px semibold in primary. Empty to hide.",
    },
    badge: {
      control: "text",
      description: "Optional count. Reuses .badge badge-neutral from Chip.",
    },
    active: { control: "boolean", description: "Selected (aria-selected / aria-checked)" },
    disabled: { control: "boolean", description: "Not in Figma — house convention" },
  },
  args: {
    type: "underline",
    size: "lg",
    label: "Overview",
    subtitle: "",
    badge: "",
    active: false,
    disabled: false,
  },
  render: ({ type, size, label, subtitle, badge, active, disabled }) => {
    const classes = [
      "tab",
      `tab-${type}`,
      type === "underline" && size === "sm" ? "tab-sm" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const body = subtitle
      ? `<span>${label}<span class="tab-subtitle">${subtitle}</span></span>`
      : label;

    return `
      <div style="padding: 24px;">
        <div class="tabs" role="tablist">
          <button
            class="${classes}"
            role="tab"
            aria-selected="${active}"
            ${disabled ? "disabled" : ""}
          >
            ${body}${badge ? `<span class="badge badge-neutral">${badge}</span>` : ""}
          </button>
        </div>
      </div>
    `;
  },
};

export default meta;
type Story = StoryObj<TabsArgs>;

export const Interactive: Story = {};

/** All three types, each in rest / hover / active. */
export const AllTypes: Story = {
  render: () => {
    const set = (type: string, note: string) => `
      <div>
        <p class="demo-label">${type} — ${note}</p>
        <div class="tabs" role="tablist">
          <button class="tab tab-${type}" role="tab" aria-selected="false">Overview</button>
          <button class="tab tab-${type}" role="tab" aria-selected="false">Overview</button>
          <button class="tab tab-${type}" role="tab" aria-selected="true">Overview</button>
        </div>
        <p class="demo-note">rest · hover (hover it) · active</p>
      </div>
    `;
    return `
      <style>
        .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 26px; }
        .demo-label { margin: 0 0 8px; font-size: 12px; color: #727280; }
        .demo-note { margin: 6px 0 0; font-size: 11px; color: #9999a6; }
      </style>
      <div class="demo-wrap">
        ${set("underline", "32px, 2px bottom rule, label steps to semibold")}
        ${set("chip", "26px, 6px radius, grey tint when active")}
        ${set("segment", "26px, 2px radius, white when active")}
        <p class="demo-note">
          Underline hover reaches the active colour but keeps rest's weight and
          gains no rule — so it previews the active state without asserting it.
        </p>
      </div>
    `;
  },
};

/** Size=sm exists for underline only. */
export const UnderlineSizes: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
      .demo-label { margin: 0 0 8px; font-size: 12px; color: #727280; }
    </style>
    <div class="demo-wrap">
      <div>
        <p class="demo-label">lg — 32px, 13px label</p>
        <div class="tabs" role="tablist">
          <button class="tab tab-underline" role="tab" aria-selected="true">Overview</button>
          <button class="tab tab-underline" role="tab" aria-selected="false">Detail</button>
        </div>
      </div>
      <div>
        <p class="demo-label">sm — 26px, 12px label</p>
        <div class="tabs" role="tablist">
          <button class="tab tab-underline tab-sm" role="tab" aria-selected="true">Overview</button>
          <button class="tab tab-underline tab-sm" role="tab" aria-selected="false">Detail</button>
        </div>
      </div>
    </div>
  `,
};

/**
 * The subtitle and badge slots. The badge is the existing Chip component —
 * `.badge badge-neutral` maps onto Figma's byte-for-byte.
 */
export const Slots: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 22px; }
      .demo-label { margin: 0 0 8px; font-size: 12px; color: #727280; }
    </style>
    <div class="demo-wrap">
      <div>
        <p class="demo-label">Badge — reuses .badge badge-neutral</p>
        <div class="tabs" role="tablist">
          <button class="tab tab-underline" role="tab" aria-selected="true">
            Overview<span class="badge badge-neutral">3</span>
          </button>
          <button class="tab tab-underline" role="tab" aria-selected="false">
            Detail<span class="badge badge-neutral">12</span>
          </button>
        </div>
      </div>
      <div>
        <p class="demo-label">Subtitle — 8px semibold, primary</p>
        <div class="tabs" role="tablist">
          <button class="tab tab-underline" role="tab" aria-selected="true">
            <span>Overview<span class="tab-subtitle">APPLICANT</span></span>
          </button>
          <button class="tab tab-underline" role="tab" aria-selected="false">
            <span>Detail<span class="tab-subtitle">CO-APPLICANT</span></span>
          </button>
        </div>
      </div>
    </div>
  `,
};

/**
 * Figma's Navigation set defines a container per type. The underline row is a
 * bare 8px-gap row; the chip row is 12px with inset padding.
 */
export const ChipRow: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 22px; align-items: flex-start; }
      .demo-label { margin: 0 0 8px; font-size: 12px; color: #727280; }
      .demo-outline { outline: 1px dashed #c4c4ce; }
    </style>
    <div class="demo-wrap">
      <div>
        <p class="demo-label">Underline row — .tabs, 8px gap</p>
        <div class="tabs demo-outline" role="tablist">
          <button class="tab tab-underline" role="tab" aria-selected="true">Application</button>
          <button class="tab tab-underline" role="tab" aria-selected="false">KYB</button>
          <button class="tab tab-underline" role="tab" aria-selected="false">Documents</button>
        </div>
      </div>
      <div>
        <p class="demo-label">Chip row — .tabs tabs-chip, 12px gap + inset padding</p>
        <div class="tabs tabs-chip demo-outline" role="tablist">
          <button class="tab tab-chip" role="tab" aria-selected="true">Application</button>
          <button class="tab tab-chip" role="tab" aria-selected="false">KYB</button>
          <button class="tab tab-chip" role="tab" aria-selected="false">Documents</button>
        </div>
      </div>
    </div>
  `,
};

/**
 * The same styling serves two different contracts. Pick the one that matches
 * what the control actually does.
 */
export const NavigatorVsSelector: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 26px; max-width: 560px; }
      .demo-label { margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #16161a; }
      .demo-note { margin: 8px 0 0; font-size: 11px; line-height: 1.5; color: #727280; }
      .demo-panel { margin-top: 10px; padding: 12px; border: 1px dashed #e4e4ea; border-radius: 6px; font-size: 12px; color: #5b5b68; }
    </style>
    <div class="demo-wrap">
      <div>
        <p class="demo-label">Navigator — swaps a panel</p>
        <div class="tabs" role="tablist" aria-label="Applicant sections">
          <button class="tab tab-underline" role="tab" aria-selected="true" aria-controls="panel-overview">Overview</button>
          <button class="tab tab-underline" role="tab" aria-selected="false" aria-controls="panel-docs">Documents</button>
          <button class="tab tab-underline" role="tab" aria-selected="false" aria-controls="panel-history">History</button>
        </div>
        <div class="demo-panel" id="panel-overview" role="tabpanel">Overview panel</div>
        <p class="demo-note">
          role="tablist" › role="tab" › aria-selected, each pointing at a
          role="tabpanel" via aria-controls.
        </p>
      </div>

      <div>
        <p class="demo-label">Selector — sets a value</p>
        <div class="segment-selector" role="radiogroup" aria-label="Density">
          <button class="tab tab-segment" role="radio" aria-checked="true">Compact</button>
          <button class="tab tab-segment" role="radio" aria-checked="false">Comfortable</button>
        </div>
        <p class="demo-note">
          role="radiogroup" › role="radio" › aria-checked. No panels — it is a
          form control.
        </p>
      </div>
    </div>
  `,
};
