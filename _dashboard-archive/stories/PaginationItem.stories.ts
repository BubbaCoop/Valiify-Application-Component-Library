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

type Kind = "default" | "active" | "ellipsis" | "nav";

const CHEVRON = (dir: "left" | "right") =>
  `<svg class="icon icon-size-14" aria-hidden="true"><use href="#chevron-${dir}" /></svg>`;

interface ItemArgs {
  kind: Kind;
  label: string;
  disabled: boolean;
}

const render = ({ kind, label, disabled }: ItemArgs) => {
  const cls = [
    "pagination-item",
    kind === "default" ? "" : `pagination-item-${kind}`,
  ]
    .filter(Boolean)
    .join(" ");

  // Ellipsis is a label, not a control — Figma draws no hover or pressed for it.
  if (kind === "ellipsis") {
    return `<span class="${cls}" aria-hidden="true">...</span>`;
  }
  if (kind === "nav") {
    return `<button class="${cls}" aria-label="Next page" ${disabled ? "disabled" : ""}>${CHEVRON("right")}</button>`;
  }
  return `<button class="${cls}" ${kind === "active" ? 'aria-current="page"' : ""} ${
    disabled ? "disabled" : ""
  }>${label}</button>`;
};

const meta: Meta<ItemArgs> = {
  title: "Components/PaginationItem",
  tags: ["autodocs"],
  argTypes: {
    kind: {
      control: "inline-radio",
      options: ["default", "active", "ellipsis", "nav"],
      description:
        "Figma's State axis, collapsed to its four kinds. Hover and pressed are live.",
    },
    label: {
      control: "text",
      description: "Page number (default and active only)",
    },
    disabled: {
      control: "boolean",
      description:
        "Not in Figma — a pagination bar needs it for the first/last arrows",
    },
  },
  args: { kind: "default", label: "2", disabled: false },
  render: (args) => `<div style="padding: 24px;">${render(args)}</div>`,
};

export default meta;
type Story = StoryObj<ItemArgs>;

export const Interactive: Story = {};

/**
 * All four kinds. Hover and press them — Figma draws those states for every
 * kind except ellipsis, which is a label rather than a control.
 */
export const AllKinds: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
      .demo-row { display: flex; gap: 14px; align-items: center; }
      .demo-label { margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #16161a; }
      .demo-note { margin: 6px 0 0; font-size: 11px; color: #9999a6; }
    </style>
    <div class="demo-wrap">
      <div>
        <p class="demo-label">default</p>
        <div class="demo-row">
          <button class="pagination-item">1</button>
          <button class="pagination-item">2</button>
          <button class="pagination-item">10</button>
        </div>
        <p class="demo-note">Surface/Paper + 1px Stroke/Border &middot; hover and press are live</p>
      </div>

      <div>
        <p class="demo-label">active</p>
        <div class="demo-row">
          <button class="pagination-item pagination-item-active" aria-current="page">3</button>
        </div>
        <p class="demo-note">
          Primary/Main, no stroke. Figma <em>lightens</em> on hover (#295c9e); this darkens to
          Primary/Dark like the rest of the library &mdash; a deliberate divergence.
        </p>
      </div>

      <div>
        <p class="demo-label">ellipsis</p>
        <div class="demo-row">
          <span class="pagination-item pagination-item-ellipsis" aria-hidden="true">...</span>
        </div>
        <p class="demo-note">No fill, no stroke, and no hover &mdash; a label, not a control</p>
      </div>

      <div>
        <p class="demo-label">nav</p>
        <div class="demo-row">
          <button class="pagination-item pagination-item-nav" aria-label="Previous page">${CHEVRON("left")}</button>
          <button class="pagination-item pagination-item-nav" aria-label="Next page">${CHEVRON("right")}</button>
        </div>
        <p class="demo-note">The default box with a 14px icon &middot; Secondary/Main</p>
      </div>
    </div>
  `,
};

/** Not in Figma — the arrows need it at the first and last page. */
export const Disabled: Story = {
  render: () => `
    <div style="padding: 24px; display: flex; gap: 14px; align-items: center;">
      <button class="pagination-item pagination-item-nav" aria-label="Previous page" disabled>${CHEVRON("left")}</button>
      <button class="pagination-item" disabled>1</button>
      <button class="pagination-item pagination-item-active" aria-current="page" disabled>2</button>
    </div>
    <p style="padding: 0 24px; margin: 0; font-size: 11px; color: #727280;">
      Disabled is scoped away from <code>active</code>, so a disabled current page keeps
      its fill instead of turning white.
    </p>
  `,
};

/** A whole bar, which is what these compose into. */
export const InABar: Story = {
  render: () => {
    const host = document.createElement("div");
    host.style.padding = "24px";
    host.innerHTML = `
      <div style="display: flex; gap: 6px; align-items: center;" role="navigation" aria-label="Pagination">
        <button class="pagination-item pagination-item-nav" aria-label="Previous page" disabled>${CHEVRON("left")}</button>
        <button class="pagination-item pagination-item-active" aria-current="page">1</button>
        <button class="pagination-item">2</button>
        <button class="pagination-item">3</button>
        <span class="pagination-item pagination-item-ellipsis" aria-hidden="true">...</span>
        <button class="pagination-item">24</button>
        <button class="pagination-item pagination-item-nav" aria-label="Next page">${CHEVRON("right")}</button>
      </div>
      <p style="margin-top: 14px; font-size: 12px; color: #727280;">
        Click a number to move the current page. The 6px gap is this story's &mdash; the
        Pagination bar itself is a separate Figma component.
      </p>
    `;
    const nums = host.querySelectorAll<HTMLButtonElement>(
      ".pagination-item:not(.pagination-item-nav):not(.pagination-item-ellipsis)",
    );
    nums.forEach((el) =>
      el.addEventListener("click", () => {
        nums.forEach((o) => {
          o.classList.remove("pagination-item-active");
          o.removeAttribute("aria-current");
        });
        el.classList.add("pagination-item-active");
        el.setAttribute("aria-current", "page");
      }),
    );
    return host;
  },
};
