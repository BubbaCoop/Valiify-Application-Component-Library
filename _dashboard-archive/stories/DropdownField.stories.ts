import type { Meta, StoryObj } from "@storybook/html-vite";

// Load sprite into page for icon <use> references
const spriteUrl = "/sprite.svg";

const loadSprite = () => {
  if (typeof document !== "undefined" && !document.getElementById("icon-sprite")) {
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

/* ---------------------------------------------------------------------------
 * Demo-only interactivity.
 *
 * The library itself ships ZERO JavaScript — `.dropdown-field` reacts to
 * `aria-expanded` and `.dropdown-panel` to the native `hidden` attribute, and
 * it is the consuming app's job to toggle them. This delegated listener exists
 * so the Storybook demos actually open, select, and close. It is attached once
 * at module load and never becomes part of the published package.
 * ------------------------------------------------------------------------ */

let wired = false;

const wireDropdowns = () => {
  if (wired || typeof document === "undefined") return;
  wired = true;

  const closeAll = (except?: Element | null) => {
    document.querySelectorAll<HTMLElement>(".dropdown").forEach((dd) => {
      if (dd === except) return;
      dd.querySelector(".dropdown-field")?.setAttribute("aria-expanded", "false");
      const panel = dd.querySelector<HTMLElement>(".dropdown-panel");
      if (panel) panel.hidden = true;
    });
  };

  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const trigger = target.closest<HTMLButtonElement>(".dropdown-field");
    const option = target.closest<HTMLElement>(".dropdown-panel .menu-item");

    // 1. Toggling the trigger
    if (trigger) {
      if (trigger.disabled) return;
      const dropdown = trigger.closest(".dropdown");
      const panel = dropdown?.querySelector<HTMLElement>(".dropdown-panel");
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      closeAll(dropdown);
      trigger.setAttribute("aria-expanded", String(!isOpen));
      if (panel) panel.hidden = isOpen;
      return;
    }

    // 2. Choosing an option
    if (option) {
      const dropdown = option.closest(".dropdown");
      const trig = dropdown?.querySelector<HTMLElement>(".dropdown-field");
      const panel = dropdown?.querySelector<HTMLElement>(".dropdown-panel");
      const label = option.querySelector(".menu-item-title")?.textContent?.trim() ?? "";

      dropdown
        ?.querySelectorAll(".menu-item")
        .forEach((item) => item.setAttribute("aria-selected", "false"));
      option.setAttribute("aria-selected", "true");

      // Placeholder becomes a real value once something is chosen
      const slot = trig?.querySelector(".dropdown-field-placeholder, .dropdown-field-value");
      if (slot) {
        slot.className = "dropdown-field-value";
        slot.textContent = label;
      }

      trig?.setAttribute("aria-expanded", "false");
      if (panel) panel.hidden = true;
      return;
    }

    // 3. Clicking anywhere else
    closeAll();
  });

  document.addEventListener("keydown", (event) => {
    if ((event as KeyboardEvent).key === "Escape") closeAll();
  });
};

wireDropdowns();

/** Shows a check on the selected row — demo styling, not part of the library. */
const CHECK_STYLE = `
  <style>
    .dropdown-demo-menu .menu-item-check { visibility: hidden; }
    .dropdown-demo-menu .menu-item[aria-selected="true"] .menu-item-check { visibility: visible; }
  </style>
`;

const OPTIONS = ["Weekly", "Daily", "Monthly", "Quarterly"];

/** Menu rows sized to match the trigger. */
const renderMenu = (size: "sm" | "md" | "lg", options = OPTIONS, selected = "") => {
  const iconSize = size === "sm" ? 12 : 15;
  const rows = options
    .map(
      (label) => `
        <button
          class="menu-item menu-item-${size === "lg" ? "md" : size}"
          role="option"
          aria-selected="${label === selected}"
        >
          <span class="menu-item-text"><span class="menu-item-title">${label}</span></span>
          <svg class="menu-item-check icon icon-size-${iconSize}" aria-hidden="true">
            <use href="#check" />
          </svg>
        </button>
      `,
    )
    .join("");

  return `<div class="dropdown-menu dropdown-demo-menu" role="listbox">${rows}</div>`;
};

interface DropdownFieldArgs {
  label: string;
  showLabel: boolean;
  showHelp: boolean;
  placeholder: string;
  value: string;
  leftIcon: string;
  avatar: string;
  size: "sm" | "md" | "lg";
  bgVariant: "white" | "neutral";
  error: boolean;
  errorMessage: string;
  disabled: boolean;
  open: boolean;
}

const meta: Meta<DropdownFieldArgs> = {
  title: "Components/DropdownField",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text", description: "Field label text" },
    showLabel: { control: "boolean", description: "Show the label above the field" },
    showHelp: { control: "boolean", description: "Show the help icon button next to the label" },
    placeholder: { control: "text", description: "Placeholder shown when nothing is chosen" },
    value: {
      control: "text",
      description: "Chosen value — when set, the field renders filled (content-primary)",
    },
    leftIcon: {
      control: "select",
      options: ["", "search", "calendar", "filter", "user", "building-2"],
      description: "Leading icon (14px at every size)",
    },
    avatar: {
      control: "text",
      description:
        "Avatar initials. Pairs with Avatar: avatar-sm (18px) at lg, avatar-xs (16px) at md/sm.",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Field size — sm (25px), md (29px), lg (35px, default)",
    },
    bgVariant: {
      control: "select",
      options: ["white", "neutral"],
      description: "Background variant (white=surface-paper, neutral=surface-card)",
    },
    error: { control: "boolean", description: "Error state (red hairline)" },
    errorMessage: { control: "text", description: "Error text below the field" },
    disabled: { control: "boolean", description: "Disabled state" },
    open: { control: "boolean", description: "Start with the menu open" },
  },
  args: {
    label: "Frequency",
    showLabel: false,
    showHelp: false,
    placeholder: "Select",
    value: "",
    leftIcon: "",
    avatar: "",
    size: "lg",
    bgVariant: "white",
    error: false,
    errorMessage: "Please choose an option",
    disabled: false,
    open: false,
  },
  render: ({
    label,
    showLabel,
    showHelp,
    placeholder,
    value,
    leftIcon,
    avatar,
    size,
    bgVariant,
    error,
    errorMessage,
    disabled,
    open,
  }) => {
    const fieldClasses = [
      "dropdown-field",
      `dropdown-field-${size}`,
      bgVariant === "neutral" ? "dropdown-field-bg-neutral" : "",
      error ? "dropdown-field-error" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const labelHtml = showLabel
      ? `
        <div class="dropdown-field-label">
          <span>${label}</span>
          ${
            showHelp
              ? `<button class="icon-button icon-button-xs" aria-label="Help">
                   <svg class="icon icon-size-12" aria-hidden="true"><use href="#custom-help" /></svg>
                 </button>`
              : ""
          }
        </div>`
      : "";

    const slot = value
      ? `<span class="dropdown-field-value">${value}</span>`
      : `<span class="dropdown-field-placeholder">${placeholder}</span>`;

    return `
      ${CHECK_STYLE}
      <div style="padding: 24px; width: 260px;">
        <div class="dropdown-field-container">
          ${labelHtml}
          <div class="dropdown">
            <button
              class="${fieldClasses}"
              aria-haspopup="listbox"
              aria-expanded="${open}"
              ${disabled ? "disabled" : ""}
            >
              ${avatar ? `<span class="avatar avatar-${size === "lg" ? "sm" : "xs"}">${avatar}</span>` : ""}
              ${
                leftIcon
                  ? `<svg class="dropdown-field-icon icon icon-size-14" aria-hidden="true"><use href="#${leftIcon}" /></svg>`
                  : ""
              }
              ${slot}
              <svg class="dropdown-field-chevron icon icon-size-14" aria-hidden="true">
                <use href="#chevron-down" />
              </svg>
            </button>
            <div class="dropdown-panel" ${open ? "" : "hidden"}>
              ${renderMenu(size, OPTIONS, value)}
            </div>
          </div>
          ${error && errorMessage ? `<div class="dropdown-field-error-message">${errorMessage}</div>` : ""}
        </div>
      </div>
    `;
  },
};

export default meta;
type Story = StoryObj<DropdownFieldArgs>;

/** Click the field — it opens, you can choose, and it closes. */
export const Interactive: Story = {};

export const Open: Story = {
  args: { open: true },
};

export const Filled: Story = {
  args: { value: "Weekly" },
};

export const WithLabel: Story = {
  args: { showLabel: true, showHelp: true, label: "Reporting cadence" },
};

export const WithLeftIcon: Story = {
  args: { leftIcon: "calendar", showLabel: true, label: "Period" },
};

export const WithAvatar: Story = {
  args: { avatar: "NC", value: "Nicholas Cooper", showLabel: true, label: "Assignee" },
};

export const ErrorState: Story = {
  args: { error: true, showLabel: true, label: "Frequency", errorMessage: "Please choose an option" },
};

export const Disabled: Story = {
  args: { disabled: true, value: "Weekly", showLabel: true, label: "Frequency" },
};

export const BackgroundVariants: Story = {
  render: () => `
    ${CHECK_STYLE}
    <style>
      .demo-section { margin-bottom: 24px; padding: 24px; border-radius: 8px; }
      .demo-title { margin: 0 0 12px; font-weight: 600; font-size: 15px; }
      .bg-white-demo { background: #ffffff; }
      .bg-neutral-demo { background: #fafafb; }
    </style>
    <div style="padding: 20px; width: 300px;">
      <div class="demo-section bg-white-demo">
        <h3 class="demo-title">White (default)</h3>
        <div class="dropdown-field-container">
          <div class="dropdown">
            <button class="dropdown-field dropdown-field-md" aria-haspopup="listbox" aria-expanded="false">
              <span class="dropdown-field-placeholder">bg-surface-paper</span>
              <svg class="dropdown-field-chevron icon icon-size-14" aria-hidden="true">
                <use href="#chevron-down" />
              </svg>
            </button>
            <div class="dropdown-panel" hidden>${renderMenu("md")}</div>
          </div>
        </div>
      </div>

      <div class="demo-section bg-neutral-demo">
        <h3 class="demo-title">Neutral</h3>
        <div class="dropdown-field-container">
          <div class="dropdown">
            <button class="dropdown-field dropdown-field-md dropdown-field-bg-neutral"
                    aria-haspopup="listbox" aria-expanded="false">
              <span class="dropdown-field-placeholder">bg-surface-card</span>
              <svg class="dropdown-field-chevron icon icon-size-14" aria-hidden="true">
                <use href="#chevron-down" />
              </svg>
            </button>
            <div class="dropdown-panel" hidden>${renderMenu("md")}</div>
          </div>
        </div>
      </div>
    </div>
  `,
};

export const AllSizes: Story = {
  render: () => {
    const field = (size: "sm" | "md" | "lg", height: string) => `
      <div>
        <p class="demo-label">${size} — ${height}</p>
        <div class="dropdown-field-container">
          <div class="dropdown">
            <button class="dropdown-field dropdown-field-${size}" aria-haspopup="listbox" aria-expanded="false">
              <span class="dropdown-field-placeholder">Select</span>
              <svg class="dropdown-field-chevron icon icon-size-14" aria-hidden="true">
                <use href="#chevron-down" />
              </svg>
            </button>
            <div class="dropdown-panel" hidden>${renderMenu(size)}</div>
          </div>
        </div>
      </div>
    `;

    return `
      ${CHECK_STYLE}
      <style>
        .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 20px; width: 260px; }
        .demo-label { margin: 0 0 6px; font-size: 12px; color: #727280; }
      </style>
      <div class="demo-wrap">
        ${field("sm", "25px")}
        ${field("md", "29px")}
        ${field("lg", "35px")}
      </div>
    `;
  },
};

export const AllStates: Story = {
  render: () => {
    const field = (note: string, attrs: string, cls = "", slot = "placeholder") => `
      <div>
        <p class="demo-label">${note}</p>
        <button class="dropdown-field ${cls}" aria-haspopup="listbox" ${attrs}>
          <span class="dropdown-field-${slot}">${slot === "value" ? "Weekly" : "Select"}</span>
          <svg class="dropdown-field-chevron icon icon-size-14" aria-hidden="true">
            <use href="#chevron-down" />
          </svg>
        </button>
      </div>
    `;

    return `
      <style>
        .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 18px; width: 260px; }
        .demo-label { margin: 0 0 6px; font-size: 12px; color: #727280; }
      </style>
      <div class="demo-wrap">
        ${field("Rest — empty", 'aria-expanded="false"')}
        ${field("Rest — filled", 'aria-expanded="false"', "", "value")}
        ${field("Hover — hover the field", 'aria-expanded="false"')}
        ${field("Open — ring + chevron flipped", 'aria-expanded="true"', "", "value")}
        ${field("Error", 'aria-expanded="false"', "dropdown-field-error", "value")}
        ${field("Disabled", 'aria-expanded="false" disabled', "", "value")}
      </div>
    `;
  },
};

/** Two fields side by side — only one menu stays open at a time. */
export const InAForm: Story = {
  render: () => `
    ${CHECK_STYLE}
    <style>
      .form-demo { max-width: 520px; padding: 32px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      .form-title { margin: 0 0 24px; font-size: 20px; font-weight: 600; }
      .form-row { display: flex; gap: 16px; }
      .form-row > * { flex: 1; }
    </style>
    <div class="form-demo">
      <h2 class="form-title">Report settings</h2>
      <div class="form-row">
        <div class="dropdown-field-container">
          <div class="dropdown-field-label"><span>Frequency</span></div>
          <div class="dropdown">
            <button class="dropdown-field dropdown-field-md" aria-haspopup="listbox" aria-expanded="false">
              <svg class="dropdown-field-icon icon icon-size-14" aria-hidden="true"><use href="#calendar" /></svg>
              <span class="dropdown-field-placeholder">Select</span>
              <svg class="dropdown-field-chevron icon icon-size-14" aria-hidden="true"><use href="#chevron-down" /></svg>
            </button>
            <div class="dropdown-panel" hidden>${renderMenu("md")}</div>
          </div>
        </div>

        <div class="dropdown-field-container">
          <div class="dropdown-field-label"><span>Owner</span></div>
          <div class="dropdown">
            <button class="dropdown-field dropdown-field-md" aria-haspopup="listbox" aria-expanded="false">
              <span class="dropdown-field-placeholder">Select</span>
              <svg class="dropdown-field-chevron icon icon-size-14" aria-hidden="true"><use href="#chevron-down" /></svg>
            </button>
            <div class="dropdown-panel" hidden>
              ${renderMenu("md", ["Nicholas Cooper", "Jordan Diaz", "Sam Ellis"])}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};
