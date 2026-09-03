/**
 * Modal — confirmation dialog card.
 * Figma: Modal (557:5127), Type {Destructive, Neutral, Success}, 480 wide.
 * The Type axis IS the notice banner (Neutral omits it). The backdrop and
 * <dialog> plumbing are library extensions — no scrim exists in Figma.
 */
import type { Meta, StoryObj } from "@storybook/html";

interface ModalArgs {
  title: string;
  description: string;
  notice: "none" | "destructive" | "success";
  noticeLabel: string;
  noticeBody: string;
}

let uid = 0;
const card = ({ title, description, notice, noticeLabel, noticeBody }: Partial<ModalArgs>) => {
  const id = `modal-${uid++}`;
  const banner =
    notice && notice !== "none"
      ? `<div class="modal-notice modal-notice-${notice}">
          <span class="modal-notice-label">${noticeLabel}</span>
          <span class="modal-notice-body">${noticeBody}</span>
        </div>`
      : "";
  return `
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="${id}-t" aria-describedby="${id}-d">
    <div class="modal-header">
      <h2 id="${id}-t" class="modal-title">${title ?? "Confirm Action"}</h2>
      <button class="icon-button" type="button" aria-label="Close">
        <svg aria-hidden="true"><use href="#x" /></svg>
      </button>
    </div>
    <p id="${id}-d" class="modal-description">${description ?? "Are you sure you want to proceed?"}</p>
    ${banner}
    <div class="modal-actions">
      <button class="btn btn-secondary" type="button">Cancel</button>
      <button class="btn btn-primary" type="button">Confirm</button>
    </div>
  </div>`;
};

// Default copy sized to reproduce Figma's frames: single-line title and
// description, two-line banner body (the 308/196 height assertions in the
// visual spec depend on these line counts).
const destructive: Partial<ModalArgs> = {
  title: "Delete this application?",
  description: "Are you sure you want to proceed?",
  notice: "destructive",
  noticeLabel: "Critical warning",
  noticeBody:
    "This permanently removes the application and everything attached to it. This action cannot be undone.",
};

const success: Partial<ModalArgs> = {
  title: "Submit your application?",
  description: "Everything looks complete and ready.",
  notice: "success",
  noticeLabel: "Ready to submit",
  noticeBody:
    "All required sections are complete and verified. You can still make changes until final submission.",
};

const meta: Meta<ModalArgs> = {
  title: "Components/Modal",
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    notice: {
      control: "select",
      options: ["none", "destructive", "success"],
      description: "Figma's Type axis — the notice banner (none = Neutral)",
    },
    noticeLabel: { control: "text" },
    noticeBody: { control: "text" },
  },
  args: destructive as ModalArgs,
  render: (args) => card(args),
};

export default meta;
type Story = StoryObj<ModalArgs>;

export const Interactive: Story = {};

export const Destructive: Story = { render: () => card(destructive) };

export const Neutral: Story = {
  render: () => card({ title: "Confirm Action", description: "Are you sure you want to proceed?", notice: "none" }),
};

export const Success: Story = { render: () => card(success) };

/** The div-fallback overlay path — backdrop wash + centered card. */
export const WithBackdrop: Story = {
  render: () => `
    <div style="position: relative; height: 480px;">
      <p style="margin: 16px; color: #54565b;">Page content behind the overlay…</p>
      <div class="modal-backdrop" style="position: absolute;">
        ${card(destructive)}
      </div>
    </div>
  `,
};

/** The PRIMARY path: native <dialog> + showModal() — free focus trap,
 * Escape, and ::backdrop. Click the button to open. */
export const NativeDialog: Story = {
  render: () => `
    <button class="btn btn-primary" type="button" data-open>Open modal</button>
    <dialog class="modal" aria-labelledby="nd-t">
      <div class="modal-header">
        <h2 id="nd-t" class="modal-title">Delete this application?</h2>
        <button class="icon-button" type="button" aria-label="Close" data-close>
          <svg aria-hidden="true"><use href="#x" /></svg>
        </button>
      </div>
      <p class="modal-description">Are you sure you want to proceed?</p>
      <div class="modal-actions">
        <button class="btn btn-secondary" type="button" data-close>Cancel</button>
        <button class="btn btn-primary" type="button" data-close>Confirm</button>
      </div>
    </dialog>
  `,
  play: async ({ canvasElement }) => {
    const dialog = canvasElement.querySelector<HTMLDialogElement>("dialog.modal");
    canvasElement.querySelector("[data-open]")?.addEventListener("click", () => dialog?.showModal());
    canvasElement.querySelectorAll("[data-close]").forEach((el) => {
      el.addEventListener("click", () => dialog?.close());
    });
  },
};
