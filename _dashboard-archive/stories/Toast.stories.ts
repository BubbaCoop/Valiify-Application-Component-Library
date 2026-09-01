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

type ToastType = "success" | "error" | "info";

/**
 * The glyph is a slot — Type only sets its colour. These are what Figma draws.
 * Note `info` is a refresh icon, not an info glyph.
 */
const TYPES: Record<
  ToastType,
  { icon: string; title: string; message: string; time: string }
> = {
  success: {
    icon: "circle-check",
    title: "Document request sent",
    message: "Client has been notified to upload their W-9.",
    time: "just now",
  },
  error: {
    icon: "triangle-alert",
    title: "Verification failed to run",
    message: "LexisNexis API timeout occurred.",
    time: "2m ago",
  },
  info: {
    icon: "refresh-cw",
    title: "Response received",
    message: "State corporate registry records processed.",
    time: "5m ago",
  },
};

interface ToastArgs {
  type: ToastType;
  style: "full" | "simple";
  action: boolean;
}

const full = (
  type: ToastType,
  { action = true }: { action?: boolean } = {},
) => {
  const t = TYPES[type];
  return `
    <div class="toast toast-${type}" role="status">
      <div class="toast-header">
        <div class="toast-main">
          <svg class="toast-icon icon icon-size-18" aria-hidden="true"><use href="#${t.icon}" /></svg>
          <div class="toast-text">
            <p class="toast-title">${t.title}</p>
            <p class="toast-message">${t.message}</p>
          </div>
        </div>
        <button class="icon-button icon-button-md" aria-label="Dismiss" data-dismiss>
          <svg class="icon icon-size-14" aria-hidden="true"><use href="#x" /></svg>
        </button>
      </div>
      <div class="toast-footer">
        <span class="toast-timestamp">${t.time}</span>
        ${action ? `<button class="text-button text-button-primary">Retry</button>` : ""}
      </div>
    </div>
  `;
};

const simple = (label = "Template Saved") => `
  <div class="toast toast-simple" role="status">
    <svg class="icon icon-size-15" aria-hidden="true"><use href="#check" /></svg>
    ${label}
  </div>
`;

const meta: Meta<ToastArgs> = {
  title: "Components/Toast",
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["success", "error", "info"],
      description:
        "Sets the icon colour only. Ignored by the Simple style, which Figma only draws as info.",
    },
    style: {
      control: "inline-radio",
      options: ["full", "simple"],
      description:
        "Full is a 356px white card; Simple is a 280px dark pill. They share almost nothing.",
    },
    action: {
      control: "boolean",
      description: "Trailing Text Button in the footer (Full only)",
    },
  },
  args: { type: "success", style: "full", action: true },
  render: ({ type, style, action }) =>
    `<div style="padding: 24px;">${style === "simple" ? simple() : full(type, { action })}</div>`,
};

export default meta;
type Story = StoryObj<ToastArgs>;

export const Interactive: Story = {};

/** The three Full types, with Figma's own copy. Type sets the icon colour only. */
export const AllTypes: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
    </style>
    <div class="demo-wrap">
      ${(Object.keys(TYPES) as ToastType[]).map((t) => full(t)).join("")}
    </div>
  `,
};

/**
 * Style=Simple. Figma draws exactly one of these — Type=info — and gives it a
 * success checkmark, so the type classes are deliberately inert here.
 */
export const Simple: Story = {
  render: () => `
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 14px; align-items: flex-start;">
      ${simple()}
      ${simple("Changes discarded")}
    </div>
  `,
};

/** The two styles side by side — the point being how little they share. */
export const FullVsSimple: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; gap: 28px; align-items: flex-start; flex-wrap: wrap; }
      .demo-label { margin: 0 0 10px; font-size: 12px; color: #727280; }
    </style>
    <div class="demo-wrap">
      <div>
        <p class="demo-label">Full &middot; 356px card, Surface/Paper</p>
        ${full("success")}
      </div>
      <div>
        <p class="demo-label">Simple &middot; 280px pill, Content/Primary</p>
        ${simple()}
      </div>
    </div>
  `,
};

/** Without the footer action — the timestamp then sits alone. */
export const NoAction: Story = {
  render: () =>
    `<div style="padding: 24px;">${full("info", { action: false })}</div>`,
};

/** Dismiss really removes the toast, so the close button is exercised. */
export const Dismissable: Story = {
  render: () => {
    const host = document.createElement("div");
    host.style.padding = "24px";
    host.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${(Object.keys(TYPES) as ToastType[]).map((t) => full(t)).join("")}
      </div>
      <p style="margin-top: 14px; font-size: 12px; color: #727280;">Dismiss each one to clear the stack.</p>
    `;
    host
      .querySelectorAll("[data-dismiss]")
      .forEach((el) =>
        el.addEventListener("click", () => el.closest(".toast")?.remove()),
      );
    return host;
  },
};
