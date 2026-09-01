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

type Action = "destructive" | "positive" | "neutral";

/**
 * Action drives three things at once, and only the first is styled by the
 * component — the icon and the button are slots, exactly as in Figma.
 */
const ACTIONS: Record<Action, { icon: string; confirmClass: string }> = {
  destructive: { icon: "triangle-alert", confirmClass: "btn-critical" },
  positive: { icon: "circle-check", confirmClass: "btn-primary" },
  neutral: { icon: "info", confirmClass: "btn-outline" },
};

/** The exact copy Figma draws, so the story doubles as a visual reference. */
const COPY: Record<
  Action,
  { title: string; subtitle: string; description: string; confirm: string }
> = {
  destructive: {
    title: "Decline this application?",
    subtitle:
      "The applicant is notified through the portal. This can't be undone from here.",
    description:
      "Two blocking items remain unresolved. Declining closes the case and releases the assigned reviewer.",
    confirm: "Decline application",
  },
  positive: {
    title: "Approve this application?",
    subtitle:
      "The applicant will be notified of approval and next steps via the portal.",
    description:
      "All verification checks have passed. Approving moves the case to the onboarding queue.",
    confirm: "Approve application",
  },
  neutral: {
    title: "Reassign this application?",
    subtitle:
      "The current reviewer will be removed and the case will return to the queue.",
    description:
      "You can reassign to a specific reviewer or let the system auto-assign based on workload.",
    confirm: "Reassign case",
  },
};

interface ModalArgs {
  action: Action;
  leadingIcon: boolean;
  contextWindow: boolean;
}

/** Renders the dialog body. `tag` lets the same markup be a div or a <dialog>. */
const modalMarkup = (
  { action, leadingIcon, contextWindow }: ModalArgs,
  { tag = "div", id = "" }: { tag?: string; id?: string } = {},
) => {
  const { icon, confirmClass } = ACTIONS[action];
  const copy = COPY[action];

  return `
    <${tag} class="modal modal-${action}"${id ? ` id="${id}"` : ""} aria-labelledby="modal-title-${action}">
      <div class="modal-header">
        <div class="modal-title-group">
          ${
            leadingIcon
              ? `<span class="modal-icon">
                   <svg class="icon icon-size-20" aria-hidden="true"><use href="#${icon}" /></svg>
                 </span>`
              : ""
          }
          <h2 class="modal-title" id="modal-title-${action}">${copy.title}</h2>
        </div>
        <button class="icon-button icon-button-lg" aria-label="Close" data-close>
          <svg class="icon icon-size-16" aria-hidden="true"><use href="#x" /></svg>
        </button>
      </div>

      <div class="modal-subtitles">
        <p class="modal-subtitle">${copy.subtitle}</p>
        <p class="modal-description">${copy.description}</p>
      </div>

      ${
        contextWindow
          ? `<div class="modal-context">
               <p class="modal-context-text">#BA-204417 &middot; Northwind Freight LLC</p>
             </div>`
          : ""
      }

      <div class="modal-footer">
        <button class="btn btn-empty btn-lg" data-close>Cancel</button>
        <button class="btn ${confirmClass} btn-lg" data-close>${copy.confirm}</button>
      </div>
    </${tag}>
  `;
};

const meta: Meta<ModalArgs> = {
  title: "Components/Modal",
  tags: ["autodocs"],
  argTypes: {
    action: {
      control: "inline-radio",
      options: ["destructive", "positive", "neutral"],
      description:
        "Styles the icon container, and picks the header icon and confirm button — see the CSS header for the pairings.",
    },
    leadingIcon: {
      control: "boolean",
      description: "Figma's Leading Icon boolean",
    },
    contextWindow: {
      control: "boolean",
      description: "Figma's Context Window boolean",
    },
  },
  args: {
    action: "destructive",
    leadingIcon: true,
    contextWindow: true,
  },
  render: (args) => `<div style="padding: 24px;">${modalMarkup(args)}</div>`,
};

export default meta;
type Story = StoryObj<ModalArgs>;

export const Interactive: Story = {};

/** All three Action variants side by side, with Figma's own copy. */
export const AllActions: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; gap: 24px; flex-wrap: wrap; align-items: flex-start; }
      .demo-cell { display: flex; flex-direction: column; gap: 10px; }
      .demo-label { margin: 0; font-size: 12px; color: #727280; }
    </style>
    <div class="demo-wrap">
      ${(Object.keys(ACTIONS) as Action[])
        .map(
          (action) => `
        <div class="demo-cell">
          <p class="demo-label">${action} &middot; ${ACTIONS[action].confirmClass}</p>
          ${modalMarkup({ action, leadingIcon: true, contextWindow: true })}
        </div>`,
        )
        .join("")}
    </div>
  `,
};

/**
 * Figma's two booleans. Height is content-driven — the 299 / 317px difference
 * between variants in Figma is just the subtitle wrapping, not a spec.
 */
export const Booleans: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; gap: 24px; flex-wrap: wrap; align-items: flex-start; }
      .demo-cell { display: flex; flex-direction: column; gap: 10px; }
      .demo-label { margin: 0; font-size: 12px; color: #727280; }
    </style>
    <div class="demo-wrap">
      <div class="demo-cell">
        <p class="demo-label">No context window</p>
        ${modalMarkup(
          { action: "neutral", leadingIcon: true, contextWindow: false },
          { id: "modal-no-context" },
        )}
      </div>
      <div class="demo-cell">
        <p class="demo-label">No leading icon</p>
        ${modalMarkup(
          { action: "neutral", leadingIcon: false, contextWindow: true },
          { id: "modal-no-icon" },
        )}
      </div>
    </div>
  `,
};

/**
 * On a native `<dialog>` the browser supplies centring, the backdrop, focus
 * trapping and Escape-to-close — so the component needs no JS of its own.
 * This is the recommended way to use it.
 */
export const NativeDialog: Story = {
  render: () => {
    const host = document.createElement("div");
    host.style.padding = "24px";
    host.innerHTML = `
      <button class="btn btn-critical btn-lg" data-open>Decline application&hellip;</button>
      ${modalMarkup(
        { action: "destructive", leadingIcon: true, contextWindow: true },
        { tag: "dialog", id: "demo-dialog" },
      )}
    `;

    const dialog = host.querySelector("dialog") as HTMLDialogElement;
    host
      .querySelector("[data-open]")
      ?.addEventListener("click", () => dialog.showModal());
    dialog
      .querySelectorAll("[data-close]")
      .forEach((el) => el.addEventListener("click", () => dialog.close()));

    return host;
  },
};
