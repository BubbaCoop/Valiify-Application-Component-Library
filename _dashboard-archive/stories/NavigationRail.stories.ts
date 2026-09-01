import type { Meta, StoryObj } from "@storybook/html-vite";

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

const icon = (name: string, size = 16) =>
  `<svg class="nav-item-icon icon icon-size-${size}" aria-hidden="true"><use href="#${name}" /></svg>`;

/**
 * Wrapper width for the isolated part stories. The real rail is 240px wide and
 * sets that itself (`.nav-rail` = w-60); this only matters for the older
 * single-part stories that predate the rail extraction.
 */
const RAIL_W = 240;

interface NavArgs {
  label: string;
  iconName: string;
  state: "rest" | "current" | "active" | "disabled";
  collapsed: boolean;
  badge: boolean;
  count: string;
  status: boolean;
}

/** Nav item row. `status` takes a colour modifier, as the rail uses three. */
const item = (
  ico: string,
  label: string,
  opts: {
    current?: boolean;
    active?: boolean;
    badge?: boolean;
    count?: string;
    status?: string;
  } = {},
) => {
  const cls = ["nav-item", opts.active ? "nav-item-active" : ""]
    .filter(Boolean)
    .join(" ");
  return `<a href="#" class="${cls}" ${opts.current ? 'aria-current="page"' : ""}>
      ${icon(ico)}
      <span class="nav-item-label">${label}</span>
      ${opts.badge ? '<span class="nav-badge">Beta</span>' : ""}
      ${opts.count ? `<span class="nav-item-count">${opts.count}</span>` : ""}
      ${opts.status ? `<span class="nav-item-status ${opts.status}"></span>` : ""}
    </a>`;
};

/**
 * Group header. `aria-controls` points at the `.nav-rail-items` wrapper holding
 * the rows it discloses — that pairing is what makes this a real ARIA
 * disclosure rather than a button that happens to hide things.
 */
const group = (label: string, id: string, expanded = true) => `
  <button class="nav-group" aria-expanded="${expanded}" aria-controls="${id}">
    <span class="nav-group-label">${label}</span>
    <svg class="nav-group-chevron icon icon-size-16" aria-hidden="true"><use href="#chevron-down" /></svg>
    <span class="nav-group-rule"></span>
  </button>`;

/** The rows a group controls. Wrapped so `aria-controls` has a target. */
const items = (id: string, rows: string) =>
  `<div class="nav-rail-items" id="${id}">${rows}</div>`;

/**
 * The full rail. `collapsed` toggles ONE class on the container — every part
 * follows, which is the point of driving it from the rail.
 */
const rail = (collapsed: boolean) => `
  <nav class="nav-rail ${collapsed ? "nav-rail-collapsed" : ""}" aria-label="${collapsed ? "Main (collapsed)" : "Main"}">
    <div class="nav-rail-content">
      <a href="#" class="nav-title">
        <span class="nav-title-logo"><svg class="icon icon-size-20" aria-hidden="true"><use href="#building-2" /></svg></span>
        <span class="nav-title-details">
          <span class="nav-title-name">Central Williamette</span>
          <span class="nav-title-subtitle">Main st branch</span>
        </span>
        <span class="nav-title-action"><svg class="icon icon-size-14" aria-hidden="true"><use href="#chevron-down" /></svg></span>
        <span class="nav-title-action"><svg class="icon icon-size-14" aria-hidden="true"><use href="#search" /></svg></span>
      </a>

      <!-- Apps — the one section with no group header -->
      <div class="nav-rail-section">
        ${item("plus", "New Application", { current: true })}
        ${item("inbox", "Inbox", { status: "nav-item-status" })}
        ${item("bell", "Alerts", { status: "nav-item-status-warning" })}
        ${item("users", "Applications", { active: true })}
        ${item("circle-alert", "Adverse Actions")}
      </div>

      <div class="nav-rail-section">
        ${group("Analyze", "grp-analyze")}
        ${items(
          "grp-analyze",
          `${item("layout-dashboard", "Dashboard")}
           ${item("activity", "Analytics", { status: "nav-item-status-primary" })}
           ${item("file-text", "Reports")}
           ${item("arrow-right-left", "Rules")}`,
        )}
      </div>

      <div class="nav-rail-section">
        ${group("CRM", "grp-crm")}
        ${items(
          "grp-crm",
          `${item("building-2", "Dashboard")}
           ${item("user", "Members")}
           ${item("clock", "Application History")}`,
        )}
      </div>

      <div class="nav-rail-section">
        ${group("Automation", "grp-automation")}
        ${items(
          "grp-automation",
          `${item("mail", "Email Template")}
           ${item("send", "Email automation", { badge: true })}
           ${item("refresh-cw", "Workflow automation", { badge: true })}`,
        )}
      </div>
    </div>

    <div class="nav-rail-footer">
      ${item("settings", "Settings")}
      ${item("panel-right", "Collapse")}
    </div>
  </nav>`;

const meta: Meta<NavArgs> = {
  title: "Components/NavigationRail",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text", description: "Nav item label" },
    iconName: { control: "text", description: "Sprite icon id" },
    state: {
      control: "inline-radio",
      options: ["rest", "current", "active", "disabled"],
      description:
        "current = Figma 'Passive' (blue, aria-current) · active = Figma 'Active' (neutral grey). Figma's names are inverted; see CLAUDE.md.",
    },
    collapsed: {
      control: "boolean",
      description: "Icon-only rail — Figma drops the label entirely (44px)",
    },
    badge: { control: "boolean", description: "Trailing 'Beta' Nav Badge" },
    count: {
      control: "text",
      description: "Trailing mono count. Empty to hide.",
    },
    status: { control: "boolean", description: "5px warning status dot" },
  },
  args: {
    label: "Inbox",
    iconName: "inbox",
    state: "rest",
    collapsed: false,
    badge: false,
    count: "",
    status: false,
  },
  render: ({ label, iconName, state, collapsed, badge, count, status }) => {
    const cls = [
      "nav-item",
      collapsed ? "nav-item-collapsed" : "",
      state === "active" ? "nav-item-active" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const attrs = [
      state === "current" ? 'aria-current="page"' : "",
      state === "disabled" ? 'aria-disabled="true"' : "",
    ]
      .filter(Boolean)
      .join(" ");
    return `
      <nav class="nav-rail" style="width:${collapsed ? 44 : RAIL_W}px">
        <a href="#" class="${cls}" ${attrs}>
          ${icon(iconName)}
          <span class="nav-item-label">${label}</span>
          ${badge ? '<span class="nav-badge">Beta</span>' : ""}
          ${count ? `<span class="nav-item-count">${count}</span>` : ""}
          ${status ? '<span class="nav-item-status"></span>' : ""}
        </a>
      </nav>`;
  },
};

export default meta;
type Story = StoryObj<NavArgs>;

export const Interactive: Story = {};

/**
 * Every Nav Item state at once. Figma's Passive/Active naming is inverted, so
 * both are labelled by what they MEAN here, not what Figma calls them.
 */
export const ItemStates: Story = {
  render: () => `
    <nav class="nav-rail" style="width:${RAIL_W}px; gap:4px">
      <a href="#" class="nav-item">${icon("inbox")}<span class="nav-item-label">Rest</span></a>
      <a href="#" class="nav-item" aria-current="page">${icon("inbox")}<span class="nav-item-label">Current page</span></a>
      <a href="#" class="nav-item nav-item-active">${icon("inbox")}<span class="nav-item-label">Active section</span></a>
      <a href="#" class="nav-item" aria-disabled="true">${icon("inbox")}<span class="nav-item-label">Disabled</span></a>
    </nav>`,
};

/** Optional slots: badge, count, status dot. */
export const ItemSlots: Story = {
  render: () => `
    <nav class="nav-rail" style="width:${RAIL_W}px; gap:4px">
      <a href="#" class="nav-item">
        ${icon("inbox")}<span class="nav-item-label">Inbox</span>
        <span class="nav-item-count">41</span>
      </a>
      <a href="#" class="nav-item">
        ${icon("flask-conical")}<span class="nav-item-label">Sandbox</span>
        <span class="nav-badge">Beta</span>
      </a>
      <a href="#" class="nav-item" aria-current="page">
        ${icon("shield")}<span class="nav-item-label">Watchlist</span>
        <span class="nav-badge">Beta</span>
        <span class="nav-item-count">7</span>
      </a>
    </nav>`,
};

/** Nav Title, expanded and collapsed. */
export const Title: Story = {
  render: () => `
    <div style="display:flex; gap:32px; align-items:flex-start">
      <nav class="nav-rail" style="width:${RAIL_W}px" aria-label="Expanded">
        <a href="#" class="nav-title">
          <span class="nav-title-logo"><svg class="icon icon-size-20" aria-hidden="true"><use href="#building-2" /></svg></span>
          <span class="nav-title-details">
            <span class="nav-title-name">Central Williamette</span>
            <span class="nav-title-subtitle">Main st branch</span>
          </span>
          <span class="nav-title-action"><svg class="icon icon-size-14" aria-hidden="true"><use href="#chevron-down" /></svg></span>
          <span class="nav-title-action"><svg class="icon icon-size-14" aria-hidden="true"><use href="#search" /></svg></span>
        </a>
      </nav>
      <nav class="nav-rail" style="width:44px" aria-label="Collapsed">
        <a href="#" class="nav-title nav-title-collapsed">
          <span class="nav-title-logo"><svg class="icon icon-size-20" aria-hidden="true"><use href="#building-2" /></svg></span>
          <!-- Keep the details block even when collapsed: it is sr-only'd, not
               removed, and it is what gives this link its accessible name.
               Omitting it renders an anonymous link in the tab order. -->
          <span class="nav-title-details">
            <span class="nav-title-name">Central Williamette</span>
            <span class="nav-title-subtitle">Main st branch</span>
          </span>
        </a>
      </nav>
    </div>`,
};

/**
 * Nav Group. The chevron is HOVER-ONLY in Figma, which is why the row grows
 * 58 -> 77px when the pointer enters. Hover the first two to see it.
 */
export const Groups: Story = {
  render: () => `
    <nav class="nav-rail" style="width:${RAIL_W}px; gap:4px; align-items:flex-start">
      <button class="nav-group" aria-expanded="true" style="width:auto">
        <span class="nav-group-label">Analyze</span>
        <svg class="nav-group-chevron icon icon-size-16" aria-hidden="true"><use href="#chevron-down" /></svg>
      </button>
      <button class="nav-group" aria-expanded="false" style="width:auto">
        <span class="nav-group-label">Collapsed</span>
        <svg class="nav-group-chevron icon icon-size-16" aria-hidden="true"><use href="#chevron-down" /></svg>
      </button>
      <div class="nav-group nav-group-collapsed"><span class="nav-group-rule"></span></div>
    </nav>`,
};

/** Nav Badge on its own. Figma's micro/md sizes are pixel-identical. */
export const Badge: Story = {
  render: () => `<span class="nav-badge">Beta</span>`,
};

/**
 * The real rail, expanded — Figma 728:20677 Expanded=yes (240 x 897).
 *
 * Structure straight from the file: a scrolling content column of sections
 * separated by 20px, and a footer pinned to the bottom by `justify-between`
 * (Figma has 149px of slack there and no spacer node). The first section has no
 * group header; the other three do.
 *
 * Note the rail has NO surface of its own — no fill, border or shadow. The grey
 * behind it here comes from the wrapper, standing in for the page.
 */
export const Rail: Story = {
  render: () => `
    <div style="background:var(--color-surface-frame); padding:16px; height:720px; display:flex">
      ${rail(false)}
    </div>`,
};

/** The same rail collapsed — Figma Expanded=no (60 x 897). One class flips it. */
export const RailCollapsed: Story = {
  render: () => `
    <div style="background:var(--color-surface-frame); padding:16px; height:720px; display:flex">
      ${rail(true)}
    </div>`,
};

/** Both states side by side, matching the Figma component set. */
export const RailBothStates: Story = {
  render: () => `
    <div style="background:var(--color-surface-frame); padding:16px; height:720px; display:flex; gap:24px">
      ${rail(false)}
      ${rail(true)}
    </div>`,
};

/**
 * Disclosure, actually wired. Click a group header to collapse the rows it
 * controls.
 *
 * This library ships no JavaScript, so `aria-expanded` is the consumer's to
 * flip. The whole integration is the handler below — the CSS does the rest:
 *
 * ```js
 * rail.addEventListener("click", (e) => {
 *   const header = e.target.closest(".nav-group");
 *   if (!header) return;
 *   const open = header.getAttribute("aria-expanded") === "true";
 *   header.setAttribute("aria-expanded", String(!open));
 * });
 * ```
 *
 * Because the header is a real `<button>` with `aria-controls` and
 * `aria-expanded`, keyboard and screen-reader support come for free: Enter and
 * Space activate it, and the state is announced.
 */
export const GroupDisclosure: Story = {
  render: () => {
    const html = `
      <div style="background:var(--color-surface-frame); padding:16px; height:620px; display:flex; gap:24px">
        ${rail(false)}
        ${rail(true)}
      </div>`;
    const host = document.createElement("div");
    host.innerHTML = html;
    host.addEventListener("click", (e) => {
      const header = (e.target as HTMLElement).closest(".nav-group");
      if (!header) return;
      const open = header.getAttribute("aria-expanded") === "true";
      header.setAttribute("aria-expanded", String(!open));
    });
    return host;
  },
};

/**
 * A group that starts collapsed, for asserting the closed state statically.
 * The left rail is expanded (rows hidden); the right rail is collapsed, where
 * disclosure is deliberately inert — see the CSS notes.
 */
export const GroupCollapsed: Story = {
  render: () => `
    <div style="background:var(--color-surface-frame); padding:16px; height:520px; display:flex; gap:24px">
      <nav class="nav-rail" aria-label="Disclosure closed">
        <div class="nav-rail-content">
          <div class="nav-rail-section">
            ${group("Analyze", "closed-1", false)}
            ${items("closed-1", `${item("layout-dashboard", "Dashboard")}${item("file-text", "Reports")}`)}
          </div>
          <div class="nav-rail-section">
            ${group("CRM", "closed-2", true)}
            ${items("closed-2", `${item("user", "Members")}`)}
          </div>
        </div>
      </nav>
      <nav class="nav-rail nav-rail-collapsed" aria-label="Collapsed rail, disclosure inert">
        <div class="nav-rail-content">
          <div class="nav-rail-section">
            ${group("Analyze", "closed-3", false)}
            ${items("closed-3", `${item("layout-dashboard", "Dashboard")}${item("file-text", "Reports")}`)}
          </div>
        </div>
      </nav>
    </div>`,
};
