import type { Meta, StoryObj } from "@storybook/html-vite";

// The Positioned story borrows an IconButton, which needs the sprite.
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

const SAMPLE =
  "North American Industry Classification System code — six digits used by business and federal agencies to classify business establishments.";

interface TooltipArgs {
  title: string;
  content: string;
  subtext: string;
}

const meta: Meta<TooltipArgs> = {
  title: "Components/Tooltip",
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text", description: "Optional label above the body. Empty to hide." },
    content: { control: "text", description: "The explanation itself" },
    subtext: {
      control: "text",
      description: "Optional attribution below a divider. Empty to hide both it and the rule.",
    },
  },
  args: {
    title: "INDUSTRY / NAICS",
    content: SAMPLE,
    subtext: "Middesk · Secretary of State",
  },
  render: ({ title, content, subtext }) => `
    <div style="padding: 32px;">
      <div class="tooltip" role="tooltip">
        ${title ? `<p class="tooltip-title">${title}</p>` : ""}
        ${content ? `<p class="tooltip-content">${content}</p>` : ""}
        ${subtext ? `<hr class="tooltip-divider" /><p class="tooltip-subtext">${subtext}</p>` : ""}
      </div>
    </div>
  `,
};

export default meta;
type Story = StoryObj<TooltipArgs>;

/** The exact composition from Figma (880:31125). */
export const Interactive: Story = {};

/**
 * Every part is optional in markup. Figma draws all four because it models
 * title / content / subtext as text properties rather than toggles, but a
 * body-only tooltip is the common case.
 */
export const Parts: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 32px; display: flex; flex-direction: column; gap: 24px; align-items: flex-start; }
      .demo-label { margin: 0 0 8px; font-size: 12px; color: #727280; }
    </style>
    <div class="demo-wrap">
      <div>
        <p class="demo-label">Body only — the common case</p>
        <div class="tooltip" role="tooltip" id="tt-body-only">
          <p class="tooltip-content">Six digits used to classify business establishments.</p>
        </div>
      </div>

      <div>
        <p class="demo-label">Title + body</p>
        <div class="tooltip" role="tooltip">
          <p class="tooltip-title">INDUSTRY / NAICS</p>
          <p class="tooltip-content">${SAMPLE}</p>
        </div>
      </div>

      <div>
        <p class="demo-label">Full — as drawn in Figma</p>
        <div class="tooltip" role="tooltip">
          <p class="tooltip-title">INDUSTRY / NAICS</p>
          <p class="tooltip-content">${SAMPLE}</p>
          <hr class="tooltip-divider" />
          <p class="tooltip-subtext">Middesk · Secretary of State</p>
        </div>
      </div>
    </div>
  `,
};

/**
 * Positioning is not modelled in Figma — no arrow, no placement, no collision
 * handling. The library styles the bubble; the consuming app places it. This
 * shows the minimum that works.
 */
export const Positioned: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 32px; height: 260px; }
      .demo-anchor { position: relative; display: inline-block; }
      .demo-pop { position: absolute; top: calc(100% + 8px); left: 0; z-index: 50; }
      .demo-note { margin: 150px 0 0; font-size: 11px; color: #727280; max-width: 420px; line-height: 1.5; }
    </style>
    <div class="demo-wrap">
      <div class="demo-anchor">
        <button class="icon-button icon-button-xs" aria-describedby="tt-1" aria-label="What is NAICS?">
          <svg class="icon icon-size-12" aria-hidden="true"><use href="#custom-help" /></svg>
        </button>
        <div class="demo-pop">
          <div class="tooltip" role="tooltip" id="tt-1">
            <p class="tooltip-title">INDUSTRY / NAICS</p>
            <p class="tooltip-content">${SAMPLE}</p>
            <hr class="tooltip-divider" />
            <p class="tooltip-subtext">Middesk · Secretary of State</p>
          </div>
        </div>
      </div>
      <p class="demo-note">
        Anchor with <code>position: relative</code>, place the tooltip absolutely,
        and point the trigger at it with <code>aria-describedby</code>.
      </p>
    </div>
  `,
};

/**
 * The only dark surface in the library — the text tokens invert.
 */
export const OnLightAndDark: Story = {
  render: () => `
    <style>
      .demo-row { display: flex; gap: 24px; padding: 32px; flex-wrap: wrap; }
      .demo-cell { padding: 24px; border-radius: 8px; }
      .on-paper { background: #ffffff; }
      .on-frame { background: #f0f3f7; }
    </style>
    <div class="demo-row">
      <div class="demo-cell on-paper">
        <div class="tooltip" role="tooltip">
          <p class="tooltip-title">ON SURFACE/PAPER</p>
          <p class="tooltip-content">The shadow and the dark fill carry it against white.</p>
        </div>
      </div>
      <div class="demo-cell on-frame">
        <div class="tooltip" role="tooltip">
          <p class="tooltip-title">ON SURFACE/FRAME</p>
          <p class="tooltip-content">Same treatment on the app background.</p>
        </div>
      </div>
    </div>
  `,
};
