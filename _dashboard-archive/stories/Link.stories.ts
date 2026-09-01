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

type Style = "strong" | "quiet" | "monospace" | "critical";

const ALERT = `<svg class="icon icon-size-12" aria-hidden="true"><use href="#alert-triangle" /></svg>`;

const CONTENT: Record<Style, string> = {
  strong: "Open full report →",
  quiet: "View activity log",
  monospace: "#BA-204417",
  critical: `${ALERT}Resolve mismatch`,
};

const NOTES: Record<Style, string> = {
  strong:
    "Inter SemiBold 14 · Primary → Dark → Pressed · the only style with NO underline at rest",
  quiet: "Inter Regular 14 · Content/Secondary → Primary → Dark",
  monospace: "JetBrains Mono Medium 13 · Content/Primary → Primary → Dark",
  critical: "Inter Medium 14 + 12px icon · Critical Main → Strong → Content",
};

const PROSE = `Valiify utilizes <a href="#">Middesk</a> for instant background screenings. All
registered details are checked directly against the <a href="#">Delaware filing</a> database
system automatically.`;

interface LinkArgs {
  style: Style;
  label: string;
}

const meta: Meta<LinkArgs> = {
  title: "Components/Link",
  tags: ["autodocs"],
  argTypes: {
    style: {
      control: "inline-radio",
      options: ["strong", "quiet", "monospace", "critical"],
      description:
        "Figma's Style axis, minus `inline` — that one is a paragraph rather than a link, so it has its own story.",
    },
    label: { control: "text", description: "Overrides the sample content" },
  },
  args: { style: "strong", label: "" },
  render: ({ style, label }) => `
    <div style="padding: 24px;">
      <a class="link${style === "strong" ? "" : ` link-${style}`}" href="#">${
        label || CONTENT[style]
      }</a>
    </div>`,
};

export default meta;
type Story = StoryObj<LinkArgs>;

export const Interactive: Story = {};

/**
 * The four standalone styles. Hover and press each one — the ramps differ in
 * length: strong runs Main → Dark → Pressed, while quiet and monospace only
 * reach Dark because they start outside the primary scale.
 */
export const AllStyles: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 22px; }
      .demo-label { margin: 0 0 6px; font-size: 12px; font-weight: 600; color: #16161a; }
      .demo-note { margin: 6px 0 0; font-size: 11px; color: #9999a6; }
    </style>
    <div class="demo-wrap">
      ${(Object.keys(CONTENT) as Style[])
        .map(
          (s) => `
        <div>
          <p class="demo-label">${s}</p>
          <a class="link${s === "strong" ? "" : ` link-${s}`}" href="#">${CONTENT[s]}</a>
          <p class="demo-note">${NOTES[s]}</p>
        </div>`,
        )
        .join("")}
    </div>
  `,
};

/**
 * `Style=inline` is a paragraph, not a link — Figma draws body copy carrying
 * anchors. It deliberately does not take `.link`; the anchors are styled as
 * descendants.
 */
export const Inline: Story = {
  render: () => `
    <div style="padding: 24px; max-width: 536px;">
      <p class="link-inline">${PROSE}</p>
      <p style="margin-top: 14px; font-size: 11px; color: #9999a6;">
        The only style with a real Figma text style behind it
        (<code>Body Content/Caption</code>). Hover either link.
      </p>
    </div>
  `,
};

/** Strong is the one style whose underline is a STATE rather than a constant. */
export const UnderlineIsAState: Story = {
  render: () => `
    <style>
      .demo-grid { padding: 24px; display: grid; grid-template-columns: auto 1fr; gap: 12px 20px; align-items: center; }
      .demo-k { font-size: 11px; color: #727280; }
    </style>
    <div class="demo-grid">
      <span class="demo-k">strong, rest</span>
      <span><a class="link" href="#">Open full report →</a> &nbsp;<em style="font-size:11px;color:#9999a6">no underline</em></span>
      <span class="demo-k">quiet, rest</span>
      <span><a class="link link-quiet" href="#">View activity log</a> &nbsp;<em style="font-size:11px;color:#9999a6">underlined</em></span>
      <span class="demo-k">monospace, rest</span>
      <span><a class="link link-monospace" href="#">#BA-204417</a> &nbsp;<em style="font-size:11px;color:#9999a6">underlined</em></span>
      <span class="demo-k">critical, rest</span>
      <span><a class="link link-critical" href="#">${CONTENT.critical}</a> &nbsp;<em style="font-size:11px;color:#9999a6">underlined</em></span>
    </div>
  `,
};

/** In context — links inside real content. */
export const InContext: Story = {
  render: () => `
    <style>
      .demo-card { margin: 24px; max-width: 520px; padding: 16px; background: #fff;
        border: 1px solid rgba(20,20,40,0.08); border-radius: 8px; }
      .demo-row { display: flex; justify-content: space-between; align-items: center;
        padding: 8px 0; border-bottom: 1px solid rgba(20,20,40,0.06); font-size: 12px; }
      .demo-row:last-child { border-bottom: 0; }
      .demo-k { color: #727280; }
    </style>
    <div class="demo-card">
      <div class="demo-row"><span class="demo-k">Case</span><a class="link link-monospace" href="#">#BA-204417</a></div>
      <div class="demo-row"><span class="demo-k">Registry</span><a class="link link-quiet" href="#">View activity log</a></div>
      <div class="demo-row"><span class="demo-k">Address</span><a class="link link-critical" href="#">${CONTENT.critical}</a></div>
      <p class="link-inline" style="margin-top: 14px;">${PROSE}</p>
      <div style="margin-top: 14px;"><a class="link" href="#">Open full report →</a></div>
    </div>
  `,
};
