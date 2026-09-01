import type { Meta, StoryObj } from "@storybook/html";

interface IconArgs {
  size: "10" | "11" | "12" | "13" | "14" | "15" | "16" | "18" | "20" | "22" | "24";
  ring: boolean;
  iconType: "chevron" | "check" | "x" | "star" | "heart";
}

// Helper to generate SVG icons
const generateIcon = (type: string, size: string) => {
  const icons: Record<string, string> = {
    chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
    heart: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
  };
  return icons[type] || icons.chevron;
};

const meta: Meta<IconArgs> = {
  title: "Components/Icon",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
Wrapper container for icons at standardized sizes. Maintains consistent icon dimensions across the UI and prevents squashing in flex layouts.

**Specifications:**
- Container: inline-flex with centered content
- Default size: 16px × 16px
- Available sizes: 10px, 11px, 12px, 13px, 14px, 15px, 16px, 18px, 20px, 22px, 24px
- Color: Inherits current text color via \`currentColor\`
- Layout behavior: \`shrink-0\` prevents flex containers from compressing icons

**Ring State:**
- Adds circular border: 2px width in Primary/Main color
- Useful for badge/avatar icons or to highlight status

**Usage:**
Wrap SVG icons with \`<span class="icon">\` and add a size class like \`icon-size-16\`.
The icon inherits text color, so you can control color with standard text utilities or inline styles.

**Common Patterns:**
- Button icons: Use \`.icon-size-13\` for buttons (matches 13px line height)
- Input icons: Use \`.icon-size-16\` for input field icons
- List icons: Size to match text (12px for caption, 14px for body, 16px for headings)
- Badge/Avatar icons: Use \`.icon-ring\` state for visual emphasis
        `.trim(),
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["10", "11", "12", "13", "14", "15", "16", "18", "20", "22", "24"],
      description: "Icon size in pixels",
    },
    ring: {
      control: "boolean",
      description: "Show ring border (useful for avatar/badge icons)",
    },
    iconType: {
      control: "select",
      options: ["chevron", "check", "x", "star", "heart"],
      description: "Icon type for demo purposes",
    },
  },
  args: {
    size: "16",
    ring: false,
    iconType: "chevron",
  },
  render: ({ size, ring, iconType }) => {
    const sizeClass = `icon-size-${size}`;
    const ringClass = ring ? "icon-ring" : "";
    const classes = ["icon", sizeClass, ringClass].filter(Boolean).join(" ");
    const svg = generateIcon(iconType, size);

    return `<span class="${classes}">${svg}</span>`;
  },
};

export default meta;
type Story = StoryObj<IconArgs>;

export const Default: Story = {};

export const Size10: Story = {
  args: {
    size: "10",
    iconType: "star",
  },
};

export const Size12: Story = {
  args: {
    size: "12",
    iconType: "check",
  },
};

export const Size16: Story = {
  args: {
    size: "16",
    iconType: "chevron",
  },
};

export const Size20: Story = {
  args: {
    size: "20",
    iconType: "heart",
  },
};

export const Size24: Story = {
  args: {
    size: "24",
    iconType: "star",
  },
};

export const WithRing: Story = {
  args: {
    size: "20",
    ring: true,
    iconType: "check",
  },
};

// Showcase all sizes
export const AllSizes: Story = {
  render: () => {
    const svg = generateIcon("star", "16");
    return `
    <div style="display: flex; flex-direction: column; gap: 32px; padding: 20px;">
      <div>
        <h3 style="margin-bottom: 16px; font-weight: 600;">All Icon Sizes</h3>
        <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <span class="icon icon-size-10">${svg}</span>
            <span style="font-size: 11px; color: #666;">10px</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <span class="icon icon-size-11">${svg}</span>
            <span style="font-size: 11px; color: #666;">11px</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <span class="icon icon-size-12">${svg}</span>
            <span style="font-size: 11px; color: #666;">12px</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <span class="icon icon-size-13">${svg}</span>
            <span style="font-size: 11px; color: #666;">13px</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <span class="icon icon-size-14">${svg}</span>
            <span style="font-size: 11px; color: #666;">14px</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <span class="icon icon-size-15">${svg}</span>
            <span style="font-size: 11px; color: #666;">15px</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <span class="icon icon-size-16">${svg}</span>
            <span style="font-size: 11px; color: #666;">16px</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <span class="icon icon-size-18">${svg}</span>
            <span style="font-size: 11px; color: #666;">18px</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <span class="icon icon-size-20">${svg}</span>
            <span style="font-size: 11px; color: #666;">20px</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <span class="icon icon-size-22">${svg}</span>
            <span style="font-size: 11px; color: #666;">22px</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <span class="icon icon-size-24">${svg}</span>
            <span style="font-size: 11px; color: #666;">24px</span>
          </div>
        </div>
      </div>

      <div>
        <h3 style="margin-bottom: 16px; font-weight: 600;">Ring State</h3>
        <div style="display: flex; gap: 24px; align-items: center;">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <span class="icon icon-size-16">${generateIcon("check", "16")}</span>
            <span style="font-size: 11px; color: #666;">Default</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <span class="icon icon-size-16 icon-ring">${generateIcon("check", "16")}</span>
            <span style="font-size: 11px; color: #666;">With Ring</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <span class="icon icon-size-20 icon-ring">${generateIcon("check", "20")}</span>
            <span style="font-size: 11px; color: #666;">20px + Ring</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <span class="icon icon-size-24 icon-ring">${generateIcon("check", "24")}</span>
            <span style="font-size: 11px; color: #666;">24px + Ring</span>
          </div>
        </div>
      </div>
    </div>
  `;
  },
};

// Real-world usage examples
export const UsageExamples: Story = {
  render: () => {
    const chevron = generateIcon("chevron", "16");
    const check = generateIcon("check", "16");
    const x = generateIcon("x", "16");
    const star = generateIcon("star", "16");

    return `
    <div style="display: flex; flex-direction: column; gap: 32px; padding: 20px;">
      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">Button with Icon</h3>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <button class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 6px;">
            <span class="icon icon-size-13">${check}</span>
            Save Changes
          </button>
          <button class="btn btn-outline" style="display: inline-flex; align-items: center; gap: 6px;">
            Download
            <span class="icon icon-size-13">${chevron}</span>
          </button>
          <button class="btn btn-empty btn-sm" style="display: inline-flex; align-items: center; gap: 4px;">
            <span class="icon icon-size-12">${x}</span>
            Close
          </button>
        </div>
      </div>

      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">Input with Leading Icon</h3>
        <div style="position: relative; max-width: 300px;">
          <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #666;">
            <span class="icon icon-size-16">${star}</span>
          </span>
          <input
            type="text"
            class="input"
            placeholder="Search..."
            style="padding-left: 40px;"
          />
        </div>
      </div>

      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">List with Icons</h3>
        <div style="display: flex; flex-direction: column; gap: 8px; max-width: 300px;">
          <div style="display: flex; align-items: center; gap: 8px; padding: 8px; border: 1px solid #e0e0e0; border-radius: 6px;">
            <span class="icon icon-size-16" style="color: #16a34a;">${check}</span>
            <span>Task completed</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; padding: 8px; border: 1px solid #e0e0e0; border-radius: 6px;">
            <span class="icon icon-size-16" style="color: #dc2626;">${x}</span>
            <span>Task failed</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; padding: 8px; border: 1px solid #e0e0e0; border-radius: 6px;">
            <span class="icon icon-size-16" style="color: #eab308;">${star}</span>
            <span>Task starred</span>
          </div>
        </div>
      </div>

      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">Icon Sizes in Context</h3>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="icon icon-size-12">${star}</span>
            <span style="font-size: 12px;">Caption text (12px icon)</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="icon icon-size-14">${star}</span>
            <span style="font-size: 14px;">Body text (14px icon)</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="icon icon-size-16">${star}</span>
            <span style="font-size: 16px;">Heading text (16px icon)</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="icon icon-size-20">${star}</span>
            <span style="font-size: 20px; font-weight: 600;">Large heading (20px icon)</span>
          </div>
        </div>
      </div>

      <div>
        <h3 style="margin-bottom: 12px; font-weight: 600;">Ring State for Badges/Avatars</h3>
        <div style="display: flex; gap: 16px; align-items: center;">
          <span class="icon icon-size-20 icon-ring" style="color: #16a34a;">${check}</span>
          <span class="icon icon-size-24 icon-ring" style="color: #dc2626;">${x}</span>
          <span class="icon icon-size-22 icon-ring" style="color: #eab308;">${star}</span>
        </div>
      </div>
    </div>
  `;
  },
};
