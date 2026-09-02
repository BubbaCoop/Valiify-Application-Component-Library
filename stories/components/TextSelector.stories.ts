/**
 * TextSelector — language-picker dropdown trigger.
 * Figma: Text Selector (1:489), 12 variants across Hover × Active × Mobile.
 */
import type { Meta, StoryObj } from "@storybook/html";

interface TextSelectorArgs {
  label: string;
  expanded: boolean;
}

const ts = (label = "English", expanded = false) => `
  <button class="text-selector" aria-haspopup="listbox" aria-expanded="${expanded}">
    <svg class="text-selector-icon" aria-hidden="true"><use href="#globe" /></svg>
    <span class="text-selector-label">${label}</span>
    <svg class="text-selector-chevron" aria-hidden="true"><use href="#chevron-down" /></svg>
  </button>`;

const meta: Meta<TextSelectorArgs> = {
  title: "Components/TextSelector",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text", description: 'Mobile is a label swap: pass "EN"' },
    expanded: {
      control: "boolean",
      description: "aria-expanded — darkens all inks and rotates the chevron",
    },
  },
  args: { label: "English", expanded: false },
  render: ({ label, expanded }) => ts(label, expanded),
};

export default meta;
type Story = StoryObj<TextSelectorArgs>;

export const Interactive: Story = {};

/** Closed and open, desktop and mobile labels. */
export const AllStates: Story = {
  render: () => `
    <div style="display: flex; gap: 40px; align-items: center;">
      ${ts("English", false)}
      ${ts("English", true)}
      ${ts("EN", false)}
      ${ts("EN", true)}
    </div>
  `,
};

/** Wired to a real toggle for the docs playground. */
export const Working: Story = {
  render: () => {
    const wrap = document.createElement("div");
    wrap.innerHTML = ts("English", false);
    const btn = wrap.querySelector("button")!;
    btn.addEventListener("click", () =>
      btn.setAttribute(
        "aria-expanded",
        btn.getAttribute("aria-expanded") === "true" ? "false" : "true",
      ),
    );
    return wrap;
  },
};
