/**
 * Upload — the file drop zone / picker row (Figma Upload 778:6949).
 * A <label> wrapping a visually-hidden file input; drag-over and completed
 * are consumer-toggled classes. Height/LG, radius 8, DASHED border.
 */
import type { Meta, StoryObj } from "@storybook/html";

interface UploadArgs {
  meta: string;
  active: boolean;
}

const zone = ({ meta, active }: Partial<UploadArgs>) => `
  <label class="va-upload${active ? " va-upload-active" : ""}">
    <input class="va-upload-input" type="file" />
    <span class="va-upload-left">
      <svg class="va-upload-icon" aria-hidden="true"><use href="#upload" /></svg>
      <span class="va-upload-prompt">Drop a file here or <span class="va-upload-browse">choose a file</span></span>
    </span>
    <span class="va-upload-meta">${meta ?? "PDF, JPG, PNG · 20 MB"}</span>
  </label>`;

const complete = (name = "certificate-of-formation.pdf") => `
  <div class="va-upload va-upload-complete">
    <span class="va-upload-left">
      <svg class="va-upload-icon" aria-hidden="true"><use href="#file" /></svg>
      <span class="va-upload-filename">${name}</span>
    </span>
    <button class="va-utility-button va-utility-button-text" type="button">
      Remove
      <svg aria-hidden="true"><use href="#chevron-right" /></svg>
    </button>
  </div>`;

const meta: Meta<UploadArgs> = {
  title: "Components/Upload",
  tags: ["autodocs"],
  argTypes: {
    meta: { control: "text" },
    active: {
      control: "boolean",
      description: "Drag-over (Figma Expanded) — consumer JS toggles it",
    },
  },
  args: { meta: "PDF, JPG, PNG · 20 MB", active: false },
  render: (args) => `<div style="max-width: 499px;">${zone(args)}</div>`,
};

export default meta;
type Story = StoryObj<UploadArgs>;

export const Interactive: Story = {};

/** Rest · drag-over · completed. */
export const AllStates: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 499px;">
      ${zone({})}
      ${zone({ active: true })}
      ${complete()}
    </div>
  `,
};
