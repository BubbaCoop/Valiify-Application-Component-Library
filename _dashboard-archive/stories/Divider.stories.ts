import type { Meta, StoryObj } from "@storybook/html-vite";

type Type = "simple" | "labeled" | "metadata";

const simple = () => `<hr class="divider" />`;

const labeled = (label = "Beneficial owners") => `
  <div class="divider-labeled">
    <hr class="divider" />
    <span class="divider-label">${label}</span>
    <hr class="divider" />
  </div>`;

/** Figma's sample renders the date value in mono — an instance override for data. */
const metadata = () => `
  <div class="divider-metadata">
    <span class="divider-metadata-item">
      <span class="divider-metadata-key">Updated</span>
      <span class="divider-metadata-value font-mono">Jul 17</span>
    </span>
    <span class="divider-metadata-separator"></span>
    <span class="divider-metadata-item">
      <span class="divider-metadata-key">Reviewer</span>
      <span class="divider-metadata-value">M. Carden</span>
    </span>
    <span class="divider-metadata-separator"></span>
    <span class="divider-metadata-item">
      <span class="divider-metadata-key">Source</span>
      <span class="divider-metadata-value">Middesk</span>
    </span>
  </div>`;

const RENDER: Record<Type, () => string> = { simple, labeled, metadata };

interface DividerArgs {
  type: Type;
  label: string;
}

const meta: Meta<DividerArgs> = {
  title: "Components/Divider",
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["simple", "labeled", "metadata"],
      description:
        "The three types are structurally incompatible, so they are separate classes rather than modifiers of one base.",
    },
    label: { control: "text", description: "labeled only" },
  },
  args: { type: "labeled", label: "Beneficial owners" },
  render: ({ type, label }) =>
    `<div style="padding: 24px; max-width: 640px;">${
      type === "labeled" ? labeled(label) : RENDER[type]()
    }</div>`,
};

export default meta;
type Story = StoryObj<DividerArgs>;

export const Interactive: Story = {};

/** All three, with Figma's own content. */
export const AllTypes: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; max-width: 720px; display: flex; flex-direction: column; gap: 30px; }
      .demo-label { margin: 0 0 12px; font-size: 12px; font-weight: 600; color: #16161a; }
      .demo-note { margin: 10px 0 0; font-size: 11px; color: #9999a6; }
    </style>
    <div class="demo-wrap">
      <div>
        <p class="demo-label">Type = labeled</p>
        ${labeled()}
        <p class="demo-note">
          Two <code>.divider</code> rules flanking the label &mdash; exactly how Figma models
          it. They flex, so the label stays centred at any width.
        </p>
      </div>
      <div>
        <p class="demo-label">Type = simple</p>
        ${simple()}
        <p class="demo-note">A bare <code>.divider</code>: 1px, Stroke/Divider.</p>
      </div>
      <div>
        <p class="demo-label">Type = metadata</p>
        ${metadata()}
        <p class="demo-note">
          The vertical separators are Stroke/<strong>Border</strong> &mdash; heavier than the
          horizontal rules, which are Stroke/Divider.
        </p>
      </div>
    </div>
  `,
};

/** The labeled type centres its label at any container width. */
export const LabeledWidths: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
      .demo-note { margin: 0 0 8px; font-size: 11px; color: #9999a6; }
    </style>
    <div class="demo-wrap">
      <div style="max-width: 260px;"><p class="demo-note">260px</p>${labeled()}</div>
      <div style="max-width: 480px;"><p class="demo-note">480px</p>${labeled("Ownership")}</div>
      <div style="max-width: 720px;"><p class="demo-note">720px</p>${labeled()}</div>
    </div>
  `,
};

/** In context — what these actually separate. */
export const InContext: Story = {
  render: () => `
    <style>
      .demo-card { margin: 24px; max-width: 560px; padding: 20px; background: #fff;
        border: 1px solid rgba(20,20,40,0.08); border-radius: 8px; }
      .demo-row { display: flex; justify-content: space-between; padding: 7px 0; font-size: 12px; }
      .demo-k { color: #727280; }
      .demo-v { color: #16161a; }
      .demo-space { height: 16px; }
    </style>
    <div class="demo-card">
      ${labeled("Business details")}
      <div class="demo-space"></div>
      <div class="demo-row"><span class="demo-k">Legal name</span><span class="demo-v">Northwind Freight LLC</span></div>
      <div class="demo-row"><span class="demo-k">EIN</span><span class="demo-v">84-2910473</span></div>
      <div class="demo-space"></div>
      ${labeled("Beneficial owners")}
      <div class="demo-space"></div>
      <div class="demo-row"><span class="demo-k">Primary</span><span class="demo-v">M. Carden</span></div>
      <div class="demo-space"></div>
      ${simple()}
      <div class="demo-space"></div>
      ${metadata()}
    </div>
  `,
};
