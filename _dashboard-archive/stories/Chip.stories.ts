import type { Meta, StoryObj } from "@storybook/html";

interface ChipArgs {
  text: string;
  variant: "warning" | "critical" | "success" | "neutral" | "primary";
  type: "chip" | "badge" | "dot";
  size: "sm" | "md";
  withDot: boolean;
  withRing: boolean;
}

const meta: Meta<ChipArgs> = {
  title: "Components/Chip",
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "Chip or badge content",
      if: { arg: "type", neq: "dot" },
    },
    variant: {
      control: "select",
      options: ["warning", "critical", "success", "neutral", "primary"],
      description: "Status variant (determines color)",
    },
    type: {
      control: "select",
      options: ["chip", "badge", "dot"],
      description: "Component type",
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md"],
      description:
        "Figma Size property. SM is the default. MD raises the type to 11px (chip and badge) and the dot to 7px.",
    },
    withDot: {
      control: "boolean",
      description: "Show dot indicator (chip only)",
      if: { arg: "type", eq: "chip" },
    },
    withRing: {
      control: "boolean",
      description: "Show ring state (2px inset ring in Primary/Main)",
    },
  },
  args: {
    text: "Status",
    variant: "warning",
    type: "chip",
    size: "sm",
    withDot: true,
    withRing: false,
  },
  render: ({ text, variant, type, size, withDot, withRing }) => {
    const ringClass = withRing ? "with-ring" : "";

    if (type === "dot") {
      return `<span class="dot dot-${variant} dot-${size} ${ringClass}"></span>`;
    }

    if (type === "badge") {
      return `<span class="badge badge-${variant} badge-${size} ${ringClass}">${text}</span>`;
    }

    // Chip
    const dotElement = withDot ? `<span class="chip-dot"></span>` : "";
    return `<span class="chip chip-${variant} chip-${size} ${ringClass}">${dotElement}<span>${text}</span></span>`;
  },
};

export default meta;
type Story = StoryObj<ChipArgs>;

export const Default: Story = {};

/**
 * Figma's Size property. SM is the default and unchanged; MD is the new
 * addition. Note MD does NOT change the chip's padding or the badge's box —
 * only gap, type, and the standalone dot's diameter.
 */
export const AllSizes: Story = {
  render: () => {
    const row = (size: "sm" | "md") => `
      <div>
        <p class="demo-label">${size.toUpperCase()}</p>
        <div class="demo-row">
          <span class="chip chip-warning chip-${size}">
            <span class="chip-dot"></span><span>REVIEW</span>
          </span>
          <span class="chip chip-critical chip-${size}">
            <span class="chip-dot"></span><span>FLAGGED</span>
          </span>
          <span class="chip chip-success chip-${size}">APPROVED</span>
          <span class="badge badge-critical badge-${size}">2</span>
          <span class="dot dot-warning dot-${size}"></span>
        </div>
      </div>
    `;
    return `
      <style>
        .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
        .demo-row { display: flex; gap: 12px; align-items: center; }
        .demo-label { margin: 0 0 8px; font-size: 12px; color: #727280; }
      </style>
      <div class="demo-wrap">
        ${row("sm")}
        ${row("md")}
      </div>
    `;
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    text: "Warning",
  },
};

export const Critical: Story = {
  args: {
    variant: "critical",
    text: "Critical",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    text: "Success",
  },
};

export const Neutral: Story = {
  args: {
    variant: "neutral",
    text: "Neutral",
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
    text: "Primary",
  },
};

export const WithoutDot: Story = {
  args: {
    variant: "warning",
    text: "No dot",
    withDot: false,
  },
};

export const WithRing: Story = {
  args: {
    variant: "critical",
    text: "With ring",
    withRing: true,
  },
};

export const Badge: Story = {
  args: {
    type: "badge",
    variant: "critical",
    text: "3",
  },
};

export const Dot: Story = {
  args: {
    type: "dot",
    variant: "success",
  },
};

// Showcase all chip variants
/**
 * Figma's BG axis. Every colour ships filled (`BG=yes`, the default) and
 * unfilled (`BG=no`) — only the fill changes, and there is deliberately no
 * border in the unfilled form. `primary` exists only unfilled in Figma.
 *
 * `dot` is absent on purpose: BG is a no-op for it, since a dot is its fill.
 */
export const BackgroundAxis: Story = {
  render: () => {
    const COLORS = ["warning", "critical", "success", "neutral", "primary"];
    return `
      <style>
        .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 22px; }
        .demo-label { margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #16161a; }
        .demo-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
        .demo-note { margin: 6px 0 0; font-size: 11px; color: #9999a6; }
      </style>
      <div class="demo-wrap">
        <div>
          <p class="demo-label">BG = yes &mdash; the default, no class needed</p>
          <div class="demo-row" id="bg-yes">
            ${COLORS.map(
              (c) =>
                `<span class="chip chip-${c}"><span class="chip-dot"></span><span>Flagged</span></span>`,
            ).join("")}
            ${COLORS.map((c) => `<span class="badge badge-${c}">2</span>`).join("")}
          </div>
          <p class="demo-note">Soft tinted fill &middot; primary has none even here, because Figma draws no filled primary</p>
        </div>

        <div>
          <p class="demo-label">BG = no</p>
          <div class="demo-row" id="bg-no">
            ${COLORS.map(
              (c) =>
                `<span class="chip chip-${c} chip-bg-no"><span class="chip-dot"></span><span>Flagged</span></span>`,
            ).join("")}
            ${COLORS.map((c) => `<span class="badge badge-${c} badge-bg-no">2</span>`).join("")}
          </div>
          <p class="demo-note">
            No fill and no border &mdash; the badge loses its circle entirely. Text and dot
            keep the same colour token.
          </p>
        </div>

        <div>
          <p class="demo-label">dot &mdash; BG is a no-op</p>
          <div class="demo-row" id="bg-dot">
            ${COLORS.map((c) => `<span class="dot dot-${c}"></span>`).join("")}
          </div>
          <p class="demo-note">
            Figma draws 18 dot variants across the axis, but BG=yes and BG=no sample
            byte-identical. No <code>.dot-bg-no</code> exists.
          </p>
        </div>
      </div>
    `;
  },
};

export const AllChips: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 24px; padding: 20px;">
      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">Chips with Dot</h3>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <span class="chip chip-warning">
            <span class="chip-dot"></span>
            <span>Warning</span>
          </span>
          <span class="chip chip-critical">
            <span class="chip-dot"></span>
            <span>Critical</span>
          </span>
          <span class="chip chip-success">
            <span class="chip-dot"></span>
            <span>Success</span>
          </span>
          <span class="chip chip-neutral">
            <span class="chip-dot"></span>
            <span>Neutral</span>
          </span>
          <span class="chip chip-primary">
            <span class="chip-dot"></span>
            <span>Primary</span>
          </span>
        </div>
      </div>

      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">Chips without Dot</h3>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <span class="chip chip-warning">Warning</span>
          <span class="chip chip-critical">Critical</span>
          <span class="chip chip-success">Success</span>
          <span class="chip chip-neutral">Neutral</span>
          <span class="chip chip-primary">Primary</span>
        </div>
      </div>

      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">Chips with Ring State</h3>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <span class="chip chip-warning with-ring">
            <span class="chip-dot"></span>
            <span>Warning</span>
          </span>
          <span class="chip chip-critical with-ring">
            <span class="chip-dot"></span>
            <span>Critical</span>
          </span>
          <span class="chip chip-success with-ring">
            <span class="chip-dot"></span>
            <span>Success</span>
          </span>
        </div>
      </div>
    </div>
  `,
};

// Showcase all badge variants
export const AllBadges: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 24px; padding: 20px;">
      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">Badges (Number Indicators)</h3>
        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <span class="badge badge-warning">1</span>
          <span class="badge badge-critical">3</span>
          <span class="badge badge-success">5</span>
          <span class="badge badge-neutral">9</span>
          <span class="badge badge-primary">7</span>
        </div>
      </div>

      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">Badges with Ring State</h3>
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <span class="badge badge-warning with-ring">2</span>
          <span class="badge badge-critical with-ring">4</span>
          <span class="badge badge-success with-ring">6</span>
        </div>
      </div>
    </div>
  `,
};

// Showcase all dot variants
export const AllDots: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 24px; padding: 20px;">
      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">Dots (Indicator Only)</h3>
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <span class="dot dot-warning"></span>
          <span class="dot dot-critical"></span>
          <span class="dot dot-success"></span>
          <span class="dot dot-neutral"></span>
          <span class="dot dot-primary"></span>
        </div>
      </div>

      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">Dots with Ring State</h3>
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <span class="dot dot-warning with-ring"></span>
          <span class="dot dot-critical with-ring"></span>
          <span class="dot dot-success with-ring"></span>
        </div>
      </div>
    </div>
  `,
};

// Real-world usage examples
export const UsageExamples: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 32px; padding: 20px;">
      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">Status Labels</h3>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="chip chip-success">
              <span class="chip-dot"></span>
              <span>Approved</span>
            </span>
            <span style="font-size: 14px;">Document verified</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="chip chip-warning">
              <span class="chip-dot"></span>
              <span>Pending Review</span>
            </span>
            <span style="font-size: 14px;">Awaiting approval</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="chip chip-critical">
              <span class="chip-dot"></span>
              <span>Rejected</span>
            </span>
            <span style="font-size: 14px;">Verification failed</span>
          </div>
        </div>
      </div>

      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">Table Status Indicators</h3>
        <div style="border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 12px; text-align: left; font-weight: 600; font-size: 13px;">Name</th>
                <th style="padding: 12px; text-align: left; font-weight: 600; font-size: 13px;">Status</th>
                <th style="padding: 12px; text-align: left; font-weight: 600; font-size: 13px;">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 12px; border-top: 1px solid #e0e0e0; font-size: 14px;">Review A</td>
                <td style="padding: 12px; border-top: 1px solid #e0e0e0;">
                  <span class="chip chip-success"><span class="chip-dot"></span><span>Complete</span></span>
                </td>
                <td style="padding: 12px; border-top: 1px solid #e0e0e0;">
                  <span class="badge badge-success">12</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px; border-top: 1px solid #e0e0e0; font-size: 14px;">Review B</td>
                <td style="padding: 12px; border-top: 1px solid #e0e0e0;">
                  <span class="chip chip-warning"><span class="chip-dot"></span><span>In Progress</span></span>
                </td>
                <td style="padding: 12px; border-top: 1px solid #e0e0e0;">
                  <span class="badge badge-warning">5</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px; border-top: 1px solid #e0e0e0; font-size: 14px;">Review C</td>
                <td style="padding: 12px; border-top: 1px solid #e0e0e0;">
                  <span class="chip chip-critical"><span class="chip-dot"></span><span>Failed</span></span>
                </td>
                <td style="padding: 12px; border-top: 1px solid #e0e0e0;">
                  <span class="badge badge-critical">3</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">Notification Dots</h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 8px; padding: 12px; background: #f9f9f9; border-radius: 6px;">
            <span class="dot dot-critical"></span>
            <span style="font-size: 14px; font-weight: 500;">You have 3 critical alerts</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; padding: 12px; background: #f9f9f9; border-radius: 6px;">
            <span class="dot dot-success"></span>
            <span style="font-size: 14px; font-weight: 500;">All systems operational</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; padding: 12px; background: #f9f9f9; border-radius: 6px;">
            <span class="dot dot-warning"></span>
            <span style="font-size: 14px; font-weight: 500;">2 items need attention</span>
          </div>
        </div>
      </div>

      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">Category Tags</h3>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <span class="chip chip-neutral">Documents</span>
          <span class="chip chip-neutral">Reports</span>
          <span class="chip chip-primary">Priority</span>
          <span class="chip chip-neutral">Archive</span>
        </div>
      </div>
    </div>
  `,
};
