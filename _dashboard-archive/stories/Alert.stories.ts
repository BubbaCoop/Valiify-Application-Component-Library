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

type AlertType = "critical" | "warning" | "success" | "info" | "neutral";

/**
 * The glyph is a slot — Type only sets its colour. These are what Figma draws.
 * Note `warning` uses an info glyph and `info` uses a refresh glyph.
 */
const TYPES: Record<AlertType, { icon: string; action: string; note: string }> =
  {
    critical: {
      icon: "triangle-alert",
      action: "Review Field",
      note: "Critical/Soft + Critical/Main",
    },
    warning: {
      icon: "info",
      action: "Re-calculate shares",
      note: "Warning/Soft + Warning/Main",
    },
    success: {
      icon: "check",
      action: "Review Field",
      note: "Approved/Soft + Approved/Main",
    },
    info: {
      icon: "refresh-cw",
      action: "Review Field",
      note: "Primary/Soft + Primary/Main",
    },
    neutral: {
      icon: "refresh-cw",
      action: "Review Field",
      note: "Neutral/Soft + Neutral/Main rail — but a Neutral/Content glyph",
    },
  };

const TITLE = "Business address mismatch";
const MESSAGE =
  "Middesk returns a registered-agent address, not the operating unit on file.";

interface AlertArgs {
  type: AlertType;
  icon: boolean;
  actionButton: boolean;
  dismiss: boolean;
  title: string;
  message: string;
}

const render = ({
  type,
  icon,
  actionButton,
  dismiss,
  title,
  message,
}: AlertArgs) => {
  const t = TYPES[type];
  return `
    <div class="alert alert-${type}" role="alert">
      <div class="alert-body">
        ${
          icon
            ? `<svg class="alert-icon icon icon-size-18" aria-hidden="true"><use href="#${t.icon}" /></svg>`
            : ""
        }
        <div class="alert-content">
          <p class="alert-title">${title}</p>
          <p class="alert-message">${message}</p>
          ${actionButton ? `<button class="text-button text-button-primary">${t.action}</button>` : ""}
        </div>
        ${
          dismiss
            ? `<button class="icon-button icon-button-md" aria-label="Dismiss" data-dismiss>
                 <svg class="icon icon-size-14" aria-hidden="true"><use href="#x" /></svg>
               </button>`
            : ""
        }
      </div>
    </div>
  `;
};

const meta: Meta<AlertArgs> = {
  title: "Components/Alert",
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["critical", "warning", "success", "info", "neutral"],
      description:
        "Required — .alert carries layout only. Sets the fill, the rail and the icon colour.",
    },
    icon: {
      control: "boolean",
      description: "Figma's Icon boolean (default on)",
    },
    actionButton: {
      control: "boolean",
      description:
        "Figma's Action Button boolean (default on) — a Text Button instance",
    },
    dismiss: {
      control: "boolean",
      description: "Figma's Dismiss boolean (default off)",
    },
    title: { control: "text" },
    message: { control: "text" },
  },
  args: {
    type: "critical",
    icon: true,
    actionButton: true,
    dismiss: false,
    title: TITLE,
    message: MESSAGE,
  },
  render: (args) =>
    `<div style="padding: 24px; max-width: 880px;">${render(args)}</div>`,
};

export default meta;
type Story = StoryObj<AlertArgs>;

export const Interactive: Story = {};

/** All five types, with Figma's own copy and glyphs. */
export const AllTypes: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; max-width: 880px; display: flex; flex-direction: column; gap: 16px; }
      .demo-note { margin: 0 0 6px; font-size: 11px; color: #9999a6; }
    </style>
    <div class="demo-wrap">
      ${(Object.keys(TYPES) as AlertType[])
        .map(
          (type) => `
        <div>
          <p class="demo-note">${type} &middot; ${TYPES[type].note}</p>
          ${render({ type, icon: true, actionButton: true, dismiss: false, title: TITLE, message: MESSAGE })}
        </div>`,
        )
        .join("")}
    </div>
  `,
};

/** Figma's three booleans. */
export const Booleans: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; max-width: 880px; display: flex; flex-direction: column; gap: 18px; }
      .demo-note { margin: 0 0 6px; font-size: 11px; color: #9999a6; }
    </style>
    <div class="demo-wrap">
      <div>
        <p class="demo-note">Dismiss = on</p>
        ${render({ type: "warning", icon: true, actionButton: true, dismiss: true, title: TITLE, message: MESSAGE })}
      </div>
      <div>
        <p class="demo-note">Action Button = off</p>
        ${render({ type: "info", icon: true, actionButton: false, dismiss: false, title: TITLE, message: MESSAGE })}
      </div>
      <div>
        <p class="demo-note">Icon = off</p>
        ${render({ type: "success", icon: false, actionButton: true, dismiss: false, title: TITLE, message: MESSAGE })}
      </div>
      <div>
        <p class="demo-note">Message only — title, message and action are all text slots</p>
        ${render({ type: "neutral", icon: true, actionButton: false, dismiss: true, title: "Sync complete", message: "No further action required." })}
      </div>
    </div>
  `,
};

/**
 * The banner fills its container — Figma's 828px is an artboard leftover, not a
 * spec. Long copy wraps rather than overflowing.
 */
export const Widths: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 18px; }
      .demo-note { margin: 0 0 6px; font-size: 11px; color: #9999a6; }
    </style>
    <div class="demo-wrap">
      <div style="max-width: 420px;">
        <p class="demo-note">420px container</p>
        ${render({ type: "critical", icon: true, actionButton: true, dismiss: true, title: TITLE, message: MESSAGE })}
      </div>
      <div style="max-width: 828px;">
        <p class="demo-note">828px — Figma's sample width</p>
        ${render({ type: "critical", icon: true, actionButton: true, dismiss: true, title: TITLE, message: MESSAGE })}
      </div>
    </div>
  `,
};

/** Dismiss really removes the banner. */
export const Dismissable: Story = {
  render: () => {
    const host = document.createElement("div");
    host.style.cssText = "padding: 24px; max-width: 880px;";
    host.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${(["critical", "warning", "neutral"] as AlertType[])
          .map((type) =>
            render({
              type,
              icon: true,
              actionButton: false,
              dismiss: true,
              title: TITLE,
              message: MESSAGE,
            }),
          )
          .join("")}
      </div>
    `;
    host
      .querySelectorAll("[data-dismiss]")
      .forEach((el) =>
        el.addEventListener("click", () => el.closest(".alert")?.remove()),
      );
    return host;
  },
};
