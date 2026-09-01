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

/** The numbered cells use chevrons; the simple buttons use arrows. */
const CH = (dir: "left" | "right", size = 14) =>
  `<svg class="icon icon-size-${size}" aria-hidden="true"><use href="#chevron-${dir}" /></svg>`;
const ARROW = (dir: "left" | "right", size = 13) =>
  `<svg class="icon icon-size-${size}" aria-hidden="true"><use href="#arrow-${dir}" /></svg>`;

/** Figma's numbered type: a cell row on the left, a record summary on the right. */
const numbered = ({ summary = "1-20 of 352" } = {}) => `
  <nav class="pagination" aria-label="Pagination">
    <div class="pagination-pages">
      <button class="pagination-item pagination-item-nav" aria-label="Previous page">${CH("left")}</button>
      <button class="pagination-item pagination-item-active" aria-current="page">1</button>
      <button class="pagination-item">2</button>
      <button class="pagination-item">3</button>
      <button class="pagination-item">4</button>
      <span class="pagination-item pagination-item-ellipsis" aria-hidden="true">...</span>
      <button class="pagination-item">18</button>
      <button class="pagination-item pagination-item-nav" aria-label="Next page">${CH("right")}</button>
    </div>
    <p class="pagination-summary">${summary}</p>
  </nav>
`;

/** Figma's simple type: two Button instances around a page counter. */
const simple = ({ page = 7, total = 18 } = {}) => `
  <nav class="pagination" aria-label="Pagination">
    <button class="btn btn-outline btn-sm">
      ${ARROW("left")}
      Prev
    </button>
    <p class="pagination-status">
      Page <span class="pagination-status-current">${page}</span> of ${total}
    </p>
    <button class="btn btn-outline btn-sm">
      Next
      ${ARROW("right")}
    </button>
  </nav>
`;

interface PaginationArgs {
  type: "numbered" | "simple";
}

const meta: Meta<PaginationArgs> = {
  title: "Components/Pagination",
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["numbered", "simple"],
      description:
        "Figma's Type axis. Both share the same root — only the children differ, so there is no modifier class.",
    },
  },
  args: { type: "numbered" },
  render: ({ type }) =>
    `<div style="padding: 24px; max-width: 900px;">${type === "simple" ? simple() : numbered()}</div>`,
};

export default meta;
type Story = StoryObj<PaginationArgs>;

export const Interactive: Story = {};

/** Both types. The root is identical; only what sits inside changes. */
export const BothTypes: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; max-width: 900px; display: flex; flex-direction: column; gap: 34px; }
      .demo-label { margin: 0 0 10px; font-size: 12px; font-weight: 600; color: #16161a; }
      .demo-note { margin: 8px 0 0; font-size: 11px; color: #9999a6; }
    </style>
    <div class="demo-wrap">
      <div>
        <p class="demo-label">Type = numbered</p>
        ${numbered()}
        <p class="demo-note">.pagination-item cells at a 4px gap, plus a mono record summary</p>
      </div>
      <div>
        <p class="demo-label">Type = simple</p>
        ${simple()}
        <p class="demo-note">
          Prev and Next are literal Button instances in Figma &mdash;
          <code>.btn .btn-outline .btn-sm</code> matches them to the pixel
        </p>
      </div>
    </div>
  `,
};

/**
 * The bar spans its container — Figma's 1208px is the artboard content width,
 * not a spec.
 */
export const Widths: Story = {
  render: () => `
    <style>
      .demo-wrap { padding: 24px; display: flex; flex-direction: column; gap: 28px; }
      .demo-note { margin: 0 0 8px; font-size: 11px; color: #9999a6; }
    </style>
    <div class="demo-wrap">
      <div style="max-width: 520px;">
        <p class="demo-note">520px container</p>
        ${numbered({ summary: "1-20 of 352" })}
      </div>
      <div style="max-width: 900px;">
        <p class="demo-note">900px container</p>
        ${numbered({ summary: "1-20 of 352" })}
      </div>
    </div>
  `,
};

/** A working bar — the current page moves and the arrows disable at the ends. */
export const Working: Story = {
  render: () => {
    const host = document.createElement("div");
    host.style.cssText = "padding: 24px; max-width: 900px;";
    const TOTAL = 18;
    let page = 1;

    const paint = () => {
      const cells: string[] = [];
      const nums = new Set<number>([1, TOTAL, page, page - 1, page + 1]);
      const shown = [...nums]
        .filter((n) => n >= 1 && n <= TOTAL)
        .sort((a, b) => a - b);

      let prev = 0;
      for (const n of shown) {
        if (n - prev > 1) {
          cells.push(
            `<span class="pagination-item pagination-item-ellipsis" aria-hidden="true">...</span>`,
          );
        }
        cells.push(
          `<button class="pagination-item${n === page ? " pagination-item-active" : ""}"${
            n === page ? ' aria-current="page"' : ""
          } data-page="${n}">${n}</button>`,
        );
        prev = n;
      }

      host.innerHTML = `
        <nav class="pagination" aria-label="Pagination">
          <div class="pagination-pages">
            <button class="pagination-item pagination-item-nav" aria-label="Previous page"
              data-step="-1" ${page === 1 ? "disabled" : ""}>${CH("left")}</button>
            ${cells.join("")}
            <button class="pagination-item pagination-item-nav" aria-label="Next page"
              data-step="1" ${page === TOTAL ? "disabled" : ""}>${CH("right")}</button>
          </div>
          <p class="pagination-summary">${(page - 1) * 20 + 1}-${Math.min(page * 20, 352)} of 352</p>
        </nav>
      `;

      host.querySelectorAll<HTMLButtonElement>("[data-page]").forEach((el) =>
        el.addEventListener("click", () => {
          page = Number(el.dataset.page);
          paint();
        }),
      );
      host.querySelectorAll<HTMLButtonElement>("[data-step]").forEach((el) =>
        el.addEventListener("click", () => {
          page = Math.min(TOTAL, Math.max(1, page + Number(el.dataset.step)));
          paint();
        }),
      );
    };

    paint();
    return host;
  },
};
