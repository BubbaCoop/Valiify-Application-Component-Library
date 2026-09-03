/**
 * Tooltip — dark contrast tooltip with an optional muted title.
 * Figma: tooltip (582:9178), single symbol, no axes. First use of the
 * BG/Contrast token and the Field Label type style.
 */
import type { Meta, StoryObj } from "@storybook/html";

interface TooltipArgs {
  title: string;
  body: string;
}

const tip = ({ title, body }: Partial<TooltipArgs>) => `
  <div class="tooltip" role="tooltip">
    ${title ? `<span class="tooltip-title">${title}</span>` : ""}
    <span class="tooltip-body">${body}</span>
  </div>`;

const meta: Meta<TooltipArgs> = {
  title: "Components/Tooltip",
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text", description: "Optional muted heading" },
    body: { control: "text" },
  },
  args: {
    title: "Title",
    body: "lorem ipsum dolor sit amet consectetur adipiscing elit eligendi proident illum quos dolor at officia mollit sint quidem qui aliquip consectetur ullamco est cumque fuga",
  },
  render: (args) => tip(args),
};

export default meta;
type Story = StoryObj<TooltipArgs>;

export const Interactive: Story = {};

/** The Figma sample — title + five-line body at the 280px max width. */
export const WithTitle: Story = {};

/** Short content hugs (max-w reading of Figma's fixed sample frame). */
export const Short: Story = {
  render: () => tip({ body: "Routing number" }),
};

/** Body-only — the title is an optional slot. */
export const BodyOnly: Story = {
  render: () =>
    tip({ body: "Your Social Security number is encrypted and used only for identity verification." }),
};

/** Composed with a trigger via aria-describedby (positioning is the
 * consumer's; shown static here). */
export const WithTrigger: Story = {
  render: () => `
    <div style="display: inline-flex; flex-direction: column; gap: 8px; align-items: flex-start;">
      <button class="icon-button" aria-label="What is a routing number?" aria-describedby="tip-1">
        <svg aria-hidden="true"><use href="#circle-help" /></svg>
      </button>
      <div class="tooltip" role="tooltip" id="tip-1">
        <span class="tooltip-title">Routing number</span>
        <span class="tooltip-body">The nine-digit code on the bottom left of your checks.</span>
      </div>
    </div>
  `,
};
