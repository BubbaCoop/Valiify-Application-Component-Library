/**
 * Toast — transient floating notification.
 * Figma: Toast (582:9325), partial Type {success, error, info} × Style
 * {Full, Simple} matrix. The status ramps' first binding — except "error",
 * which binds Warning/Base (amber) verbatim (the file-wide slip).
 */
import type { Meta, StoryObj } from "@storybook/html";

interface ToastArgs {
  type: "success" | "error" | "info";
  title: string;
  body: string;
}

const ICONS: Record<string, string> = {
  success: "circle-check",
  error: "circle-alert",
  info: "info",
};

const full = ({ type, title, body }: Partial<ToastArgs>) => `
  <div class="toast toast-${type}" role="status" style="max-width: 356px;">
    <svg class="toast-icon" aria-hidden="true"><use href="#${ICONS[type ?? "info"]}" /></svg>
    <div class="toast-content">
      <span class="toast-title">${title}</span>
      <span class="toast-body">${body}</span>
    </div>
    <button class="icon-button" type="button" aria-label="Dismiss">
      <svg aria-hidden="true"><use href="#x" /></svg>
    </button>
  </div>`;

const meta: Meta<ToastArgs> = {
  title: "Components/Toast",
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["success", "error", "info"],
      description: "Paints the status icon only — 'error' is amber (Warning) verbatim from Figma",
    },
    title: { control: "text" },
    body: { control: "text" },
  },
  args: {
    type: "success",
    title: "Document request sent",
    body: "Client has been notified to upload their W-9.",
  },
  render: (args) => full(args),
};

export default meta;
type Story = StoryObj<ToastArgs>;

export const Interactive: Story = {};

/** All three Full types — the icon ink is the only Type delta. */
export const AllTypes: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 356px;">
      ${full({ type: "success", title: "Document request sent", body: "Client has been notified to upload their W-9." })}
      ${full({ type: "error", title: "Upload failed", body: "The file exceeds the 10MB limit. Try a smaller scan." })}
      ${full({ type: "info", title: "Application saved", body: "You can pick up where you left off any time." })}
    </div>
  `,
};

/** The Simple style — a status-less dark pill (Figma draws it only as
 * info, with no status token bound). */
export const Simple: Story = {
  render: () => `
    <div class="toast-simple" role="status">
      <svg aria-hidden="true"><use href="#check" /></svg>
      Template Saved
    </div>
  `,
};

/** A consumer-positioned stack (positioning/timers are the caller's). */
export const Stacked: Story = {
  render: () => `
    <div style="position: relative; height: 260px;">
      <div style="position: absolute; bottom: 16px; right: 16px; display: flex; flex-direction: column; gap: 12px; width: 356px;">
        ${full({ type: "info", title: "Application saved", body: "You can pick up where you left off any time." })}
        ${full({ type: "success", title: "Document request sent", body: "Client has been notified to upload their W-9." })}
      </div>
    </div>
  `,
};
