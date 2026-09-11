<script>
  // b01 — header. Markup is the library's Header example (CLAUDE.md › Header), verbatim.
  // sticky / top-0 / z-40 are the library's own .header rules (§1.1 "by library contract"),
  // so they are NOT written as utilities here — writing them would restate the component CSS.
  // The language selector is a trigger only: the concept draws no listbox panel, so none is
  // built (HANDOFF §12 — the host app owns the language menu).
  /** @type {{ logoSrc: string, logoAlt: string, label?: string, shortLabel?: string }} */
  let { logoSrc, logoAlt, label = "English", shortLabel = "EN" } = $props();
</script>

<header class="header" data-block="b01">
  <img class="header-logo" src={logoSrc} alt={logoAlt} />
  <span class="header-desktop">
    <button class="text-selector" aria-haspopup="listbox" aria-expanded="false">
      <svg class="text-selector-icon" aria-hidden="true"><use href="#globe" /></svg>
      <span class="text-selector-label">{label}</span>
      <svg class="text-selector-chevron" aria-hidden="true"><use href="#chevron-down" /></svg>
    </button>
  </span>
  <span class="header-mobile">
    <button class="text-selector" aria-haspopup="listbox" aria-expanded="false">
      <svg class="text-selector-icon" aria-hidden="true"><use href="#globe" /></svg>
      <span class="text-selector-label">{shortLabel}</span>
      <svg class="text-selector-chevron" aria-hidden="true"><use href="#chevron-down" /></svg>
    </button>
  </span>
</header>
