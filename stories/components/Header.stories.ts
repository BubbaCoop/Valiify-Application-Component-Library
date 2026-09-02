/**
 * Header — the application shell header.
 * Figma: Header (550:7507), Web/Mobile variants (label + width only).
 * Sticky, full-width, and the 768px breakpoint are labeled library
 * extensions per the consumer contract.
 */
import type { Meta, StoryObj } from "@storybook/html";

const selector = (label: string) => `
  <button class="text-selector" aria-haspopup="listbox" aria-expanded="false">
    <svg class="text-selector-icon" aria-hidden="true"><use href="#globe" /></svg>
    <span class="text-selector-label">${label}</span>
    <svg class="text-selector-chevron" aria-hidden="true"><use href="#chevron-down" /></svg>
  </button>`;

// Placeholder logo — real apps pass their brand asset.
const logo = `
  <svg class="header-logo" viewBox="0 0 95 30" role="img" aria-label="Valiify">
    <rect x="0" y="4" width="22" height="22" rx="4" fill="#a6192e" />
    <text x="30" y="21" font-family="Inter, sans-serif" font-size="13" font-weight="600" letter-spacing="1.3" fill="#a6192e">VALIIFY</text>
  </svg>`;

const header = () => `
  <header class="header">
    ${logo}
    <span class="header-desktop">${selector("English")}</span>
    <span class="header-mobile">${selector("EN")}</span>
  </header>`;

const meta: Meta = {
  title: "Components/Header",
  tags: ["autodocs"],
  render: () => header(),
};

export default meta;
type Story = StoryObj;

export const Interactive: Story = {};

/** Sticky in a scroll context — the header pins while content scrolls. */
export const Sticky: Story = {
  render: () => `
    <div style="height: 320px; overflow-y: auto; border: 1px dashed #ccc;">
      ${header()}
      <div style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
        ${Array.from({ length: 12 }, (_, i) => `<p style="margin:0; color:#54565b;">Scrolling content row ${i + 1}…</p>`).join("")}
      </div>
    </div>
  `,
};

/**
 * The 768px breakpoint swaps the "English"/"EN" selectors (resize the
 * canvas below 768px to see the mobile side).
 */
export const Responsive: Story = {
  render: () => header(),
};
