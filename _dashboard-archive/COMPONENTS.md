# Component Reference

Complete markup examples for every component in @valiify/dashboard-ui.

> **📘 For Technical Details:** See [CLAUDE.md](CLAUDE.md) for the complete technical reference including what Figma specified, what was changed, and why.

## Table of Contents

- [Form Controls](#form-controls)
  - [Button](#button)
  - [IconButton](#iconbutton)
  - [TextButton](#textbutton)
  - [Input](#input)
  - [Textarea](#textarea)
  - [Checkbox](#checkbox)
  - [RadioSelect](#radioselect)
  - [Switch](#switch)
  - [DropdownField](#dropdownfield)
- [Data Display](#data-display)
  - [Avatar](#avatar)
  - [Chip / Badge / Dot](#chip--badge--dot)
  - [Tag](#tag)
  - [Pill](#pill)
  - [DataRow](#datarow)
  - [Divider](#divider)
  - [Icon](#icon)
  - [Skeleton](#skeleton)
- [Navigation](#navigation)
  - [NavigationRail](#navigationrail)
  - [Tabs](#tabs)
  - [SegmentSelector](#segmentselector)
  - [FilterSegment](#filtersegment)
  - [Breadcrumbs](#breadcrumbs)
  - [Pagination](#pagination)
  - [MenuItem](#menuitem)
  - [DropdownMenu](#dropdownmenu)
  - [Link](#link)
- [Feedback](#feedback)
  - [Alert](#alert)
  - [Toast](#toast)
  - [Modal](#modal)
  - [Tooltip](#tooltip)
  - [LoadingIndicator](#loadingindicator)
  - [LoadingInline](#loadinginline)
  - [ProgressBar](#progressbar)
  - [Stepper](#stepper)
- [Review Components](#review-components)
  - [FieldVerification](#fieldverification)
  - [SectionMarker](#sectionmarker)
  - [SensitiveData](#sensitivedata)

---

## Form Controls

### Button

Three displays (primary / outline / empty) × three sizes (sm=24px / md=28px / lg=32px).

**Default:** outline at medium size, so bare `.btn` is outline-md.

```html
<!-- Basic buttons -->
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-outline">Outline Button</button>
<button class="btn btn-empty">Empty Button</button>
<button class="btn btn-critical">Destructive Action</button>

<!-- Sizes -->
<button class="btn btn-primary btn-sm">Small (24px)</button>
<button class="btn btn-primary">Medium (28px, default)</button>
<button class="btn btn-primary btn-lg">Large (32px)</button>

<!-- States -->
<button class="btn btn-outline" disabled>Disabled</button>
<button class="btn btn-outline" aria-selected="true">Selected</button>

<!-- With icons (match icon size to button size) -->
<button class="btn btn-primary btn-sm">
  <svg class="icon icon-size-13" aria-hidden="true">
    <use href="#save" />
  </svg>
  Save
</button>

<button class="btn btn-primary">
  <svg class="icon icon-size-14" aria-hidden="true">
    <use href="#save" />
  </svg>
  Save
</button>

<button class="btn btn-primary btn-lg">
  <svg class="icon icon-size-15" aria-hidden="true">
    <use href="#save" />
  </svg>
  Save
</button>

<!-- Icon-only (requires aria-label) -->
<button class="btn btn-outline" aria-label="Settings">
  <svg class="icon icon-size-14" aria-hidden="true">
    <use href="#settings" />
  </svg>
</button>
```

---

### IconButton

Compact icon-only button. Three sizes: xs=12px, md=18px, lg=28px (default).

```html
<!-- Extra small (12px - for labels) -->
<button class="icon-button icon-button-xs" aria-label="Help">
  <svg class="icon icon-size-12" aria-hidden="true">
    <use href="#custom-help" />
  </svg>
</button>

<!-- Medium (18px - compact actions) -->
<button class="icon-button icon-button-md" aria-label="Close">
  <svg class="icon icon-size-14" aria-hidden="true">
    <use href="#x" />
  </svg>
</button>

<!-- Large (28px - default, primary actions) -->
<button class="icon-button icon-button-lg" aria-label="Settings">
  <svg class="icon icon-size-16" aria-hidden="true">
    <use href="#settings" />
  </svg>
</button>

<!-- States -->
<button class="icon-button icon-button-md" disabled aria-label="Disabled">
  <svg class="icon icon-size-14" aria-hidden="true">
    <use href="#x" />
  </svg>
</button>
```

---

### TextButton

Text-only button for inline or cell actions. Three types: cell / text / primary.

```html
<!-- Cell: inline action inside a table -->
<button class="text-button text-button-cell" aria-pressed="false">
  Select all
</button>

<!-- Text: standalone link-style action -->
<button class="text-button text-button-text">View details</button>

<!-- Primary: emphasized action with optional icon -->
<button class="text-button text-button-primary">
  <svg class="icon icon-size-12" aria-hidden="true">
    <use href="#plus" />
  </svg>
  Add row
</button>

<!-- Selected state -->
<button class="text-button text-button-cell" aria-pressed="true">
  Select all
</button>
```

---

### Input

**Structure:** `.input-container` › `.input-label` › `.input-field` › `.input`

Three sizes: sm=25px, md=29px, lg=35px (default).

```html
<!-- Complete input field -->
<div class="input-container">
  <div class="input-label">
    <span>Email Address</span>
    <button class="icon-button icon-button-xs" aria-label="Help">
      <svg class="icon icon-size-12" aria-hidden="true">
        <use href="#custom-help" />
      </svg>
    </button>
  </div>

  <div class="input-field input-lg">
    <svg class="input-icon-left icon icon-size-14" aria-hidden="true">
      <use href="#mail" />
    </svg>
    <input type="email" class="input" placeholder="you@example.com" />
  </div>

  <div class="input-error-message">Please enter a valid email address</div>
</div>

<!-- Simple input (no label/icons) -->
<div class="input-container">
  <div class="input-field">
    <input type="text" class="input" placeholder="Enter text..." />
  </div>
</div>

<!-- Small input with right icon -->
<div class="input-container">
  <div class="input-field input-sm">
    <input type="text" class="input" placeholder="Search..." />
    <svg class="input-icon-right icon icon-size-14" aria-hidden="true">
      <use href="#search" />
    </svg>
  </div>
</div>

<!-- Error state -->
<div class="input-container">
  <div class="input-field input-error">
    <input type="text" class="input" value="Invalid value" />
  </div>
  <div class="input-error-message">This field is required</div>
</div>

<!-- Disabled -->
<div class="input-container">
  <div class="input-field">
    <input type="text" class="input" disabled value="Cannot edit" />
  </div>
</div>

<!-- Neutral background variant -->
<div class="input-container">
  <div class="input-field input-bg-neutral">
    <input type="text" class="input" placeholder="On neutral surface" />
  </div>
</div>
```

---

### Textarea

**Structure:** `.textarea-container` › `.textarea-label` › `.textarea-field` › `.textarea`

Height is set by `rows` attribute, a height utility, or the resize handle.

```html
<!-- Complete textarea -->
<div class="textarea-container">
  <div class="textarea-label">
    <span>Description</span>
    <button class="icon-button icon-button-xs" aria-label="Help">
      <svg class="icon icon-size-12" aria-hidden="true">
        <use href="#custom-help" />
      </svg>
    </button>
  </div>

  <div class="textarea-field">
    <textarea
      class="textarea"
      rows="4"
      placeholder="Enter description..."
    ></textarea>
  </div>

  <div class="textarea-counter">45 / 500</div>
</div>

<!-- Simple textarea -->
<div class="textarea-container">
  <div class="textarea-field">
    <textarea class="textarea" rows="4" placeholder="Enter text..."></textarea>
  </div>
</div>

<!-- Error state -->
<div class="textarea-container">
  <div class="textarea-field textarea-error">
    <textarea class="textarea" rows="4">Invalid content</textarea>
  </div>
  <div class="textarea-error-message">Please provide more details</div>
</div>

<!-- Disabled -->
<div class="textarea-container">
  <div class="textarea-field">
    <textarea class="textarea" rows="4" disabled>Cannot edit</textarea>
  </div>
</div>

<!-- Fixed height with no resize -->
<div class="textarea-container">
  <div class="textarea-field" style="height: 120px;">
    <textarea class="textarea resize-none">Fixed height</textarea>
  </div>
</div>
```

---

### Checkbox

Native checkbox with label, optional subtitle, and trailing action.

```html
<!-- Basic checkbox -->
<label class="checkbox">
  <span class="checkbox-control">
    <input type="checkbox" class="checkbox-input" />
    <svg class="checkbox-check icon icon-size-10" aria-hidden="true">
      <use href="#check" />
    </svg>
  </span>
  <span class="checkbox-label">I agree to the terms</span>
</label>

<!-- Checked -->
<label class="checkbox">
  <span class="checkbox-control">
    <input type="checkbox" class="checkbox-input" checked />
    <svg class="checkbox-check icon icon-size-10" aria-hidden="true">
      <use href="#check" />
    </svg>
  </span>
  <span class="checkbox-label">Subscribe to newsletter</span>
</label>

<!-- With subtitle and action button -->
<label class="checkbox">
  <span class="checkbox-control">
    <input type="checkbox" class="checkbox-input" checked />
    <svg class="checkbox-check icon icon-size-10" aria-hidden="true">
      <use href="#check" />
    </svg>
  </span>
  <span class="checkbox-label">Beneficial owner</span>
  <span class="checkbox-subtitle">TYPE</span>
  <button
    type="button"
    class="icon-button icon-button-md"
    aria-label="Open details"
  >
    <svg class="icon icon-size-14" aria-hidden="true">
      <use href="#chevron-right" />
    </svg>
  </button>
</label>

<!-- Disabled -->
<label class="checkbox">
  <span class="checkbox-control">
    <input type="checkbox" class="checkbox-input" disabled />
    <svg class="checkbox-check icon icon-size-10" aria-hidden="true">
      <use href="#check" />
    </svg>
  </span>
  <span class="checkbox-label">Cannot select</span>
</label>
```

---

### RadioSelect

Native radio button with label.

```html
<label class="radio-select">
  <input type="radio" name="frequency" class="radio-select-input" />
  <span class="radio-select-label">Daily</span>
</label>

<label class="radio-select">
  <input type="radio" name="frequency" class="radio-select-input" checked />
  <span class="radio-select-label">Weekly</span>
</label>

<label class="radio-select">
  <input type="radio" name="frequency" class="radio-select-input" />
  <span class="radio-select-label">Monthly</span>
</label>

<!-- Disabled -->
<label class="radio-select">
  <input type="radio" name="frequency" class="radio-select-input" disabled />
  <span class="radio-select-label">Yearly</span>
</label>
```

---

### Switch

Toggle switch for binary settings.

```html
<!-- Basic switch (unchecked) -->
<label class="switch">
  <input type="checkbox" class="switch-input" />
</label>

<!-- Checked -->
<label class="switch">
  <input type="checkbox" class="switch-input" checked />
</label>

<!-- Disabled -->
<label class="switch">
  <input type="checkbox" class="switch-input" disabled />
</label>

<label class="switch">
  <input type="checkbox" class="switch-input" checked disabled />
</label>

<!-- With label (common pattern) -->
<label style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
  <span>Enable notifications</span>
  <div class="switch">
    <input type="checkbox" class="switch-input" checked />
  </div>
</label>
```

---

### DropdownField

⚠️ **Requires JavaScript** - See [GETTING_STARTED.md](GETTING_STARTED.md) for minimal implementation.

Dropdown select trigger. Pairs with [DropdownMenu](#dropdownmenu).

**Structure:** `.dropdown-field-container` › `.dropdown-field-label` › `.dropdown` › `.dropdown-field` + `.dropdown-panel`

```html
<!-- Complete dropdown field -->
<div class="dropdown-field-container">
  <div class="dropdown-field-label">
    <span>Frequency</span>
    <button class="icon-button icon-button-xs" aria-label="Help">
      <svg class="icon icon-size-12" aria-hidden="true">
        <use href="#custom-help" />
      </svg>
    </button>
  </div>

  <div class="dropdown">
    <button
      class="dropdown-field"
      aria-haspopup="listbox"
      aria-expanded="false"
    >
      <svg class="dropdown-field-icon icon icon-size-14" aria-hidden="true">
        <use href="#calendar" />
      </svg>
      <span class="dropdown-field-placeholder">Select</span>
      <svg class="dropdown-field-chevron icon icon-size-14" aria-hidden="true">
        <use href="#chevron-down" />
      </svg>
    </button>

    <div class="dropdown-panel" hidden>
      <div class="dropdown-menu" role="listbox">
        <!-- menu items -->
      </div>
    </div>
  </div>
</div>

<!-- With selected value -->
<button class="dropdown-field" aria-haspopup="listbox" aria-expanded="false">
  <span class="dropdown-field-value">Weekly</span>
  <svg class="dropdown-field-chevron icon icon-size-14" aria-hidden="true">
    <use href="#chevron-down" />
  </svg>
</button>

<!-- With avatar (use avatar-sm for lg field, avatar-xs for md/sm) -->
<button class="dropdown-field" aria-haspopup="listbox" aria-expanded="false">
  <span class="avatar avatar-sm">NC</span>
  <span class="dropdown-field-value">Nicholas Cooper</span>
  <svg class="dropdown-field-chevron icon icon-size-14" aria-hidden="true">
    <use href="#chevron-down" />
  </svg>
</button>

<!-- Small size -->
<button
  class="dropdown-field dropdown-field-sm"
  aria-haspopup="listbox"
  aria-expanded="false"
>
  <span class="dropdown-field-placeholder">Select</span>
  <svg class="dropdown-field-chevron icon icon-size-14" aria-hidden="true">
    <use href="#chevron-down" />
  </svg>
</button>

<!-- Error state -->
<div class="dropdown-field-container">
  <button
    class="dropdown-field dropdown-field-error"
    aria-haspopup="listbox"
    aria-expanded="false"
  >
    <span class="dropdown-field-placeholder">Select</span>
    <svg class="dropdown-field-chevron icon icon-size-14" aria-hidden="true">
      <use href="#chevron-down" />
    </svg>
  </button>
  <div class="dropdown-field-error-message">Please choose an option</div>
</div>

<!-- Disabled -->
<button
  class="dropdown-field"
  aria-haspopup="listbox"
  aria-expanded="false"
  disabled
>
  <span class="dropdown-field-value">Weekly</span>
  <svg class="dropdown-field-chevron icon icon-size-14" aria-hidden="true">
    <use href="#chevron-down" />
  </svg>
</button>
```

---

## Data Display

### Avatar

Circular initials indicator. Four sizes: xs=16px, sm=18px, md=20px (default), lg=34px.

```html
<!-- Default (md, 20px) -->
<span class="avatar avatar-md">NC</span>

<!-- All sizes -->
<span class="avatar avatar-xs">NC</span>
<span class="avatar avatar-sm">NC</span>
<span class="avatar avatar-lg">NC</span>

<!-- Disabled -->
<span class="avatar avatar-md avatar-disabled">NC</span>

<!-- With ring -->
<span class="avatar avatar-lg with-ring">NC</span>
```

---

### Chip / Badge / Dot

Status indicator system with three presentation modes.

**Default:** SM size, filled background. Add `-md` for larger, `-bg-no` for unfilled.

```html
<!-- Chip with dot -->
<span class="chip chip-warning">
  <span class="chip-dot"></span>
  <span>Warning</span>
</span>

<!-- Chip without dot -->
<span class="chip chip-success">Approved</span>

<!-- Unfilled (BG=no) -->
<span class="chip chip-warning chip-bg-no">
  <span class="chip-dot"></span>
  <span>Warning</span>
</span>

<!-- MD size -->
<span class="chip chip-critical chip-md">
  <span class="chip-dot"></span>
  <span>Critical</span>
</span>

<!-- With ring -->
<span class="chip chip-warning with-ring">
  <span class="chip-dot"></span>
  <span>Alert</span>
</span>

<!-- Badge (circular number) -->
<span class="badge badge-critical">3</span>
<span class="badge badge-warning badge-md">5</span>
<span class="badge badge-neutral badge-bg-no">12</span>

<!-- Dot (indicator only) -->
<span class="dot dot-success"></span>
<span class="dot dot-warning dot-md"></span>
<span class="dot dot-critical with-ring"></span>
```

---

### Tag

Clickable label for categories and filtering. Two sizes: sm=21px (default), md=24px.

```html
<!-- Simple tag -->
<button class="tag" aria-pressed="false">Design</button>

<!-- Selected -->
<button class="tag" aria-pressed="true">Approved</button>

<!-- Medium size with all slots -->
<button class="tag tag-md" aria-pressed="false">
  <span class="avatar avatar-xs">JS</span>
  Engineering
  <span class="tag-count">12</span>
  <span class="dot dot-warning"></span>
</button>

<!-- Disabled -->
<button class="tag" disabled>Archived</button>
```

---

### Pill

Compact filter toggle or dropdown trigger. Height: 17px.

```html
<!-- Dropdown trigger (with chevron) -->
<button class="pill" aria-haspopup="listbox" aria-expanded="false">
  John Smith
  <svg class="pill-chevron icon icon-size-13" aria-hidden="true">
    <use href="#chevron-down" />
  </svg>
</button>

<!-- Filter toggle (no chevron) -->
<button class="pill" aria-pressed="false">Overdue</button>
<button class="pill" aria-pressed="true">Approved</button>

<!-- With ring -->
<button class="pill with-ring" aria-pressed="false">Important</button>
```

---

### DataRow

One labelled field in a review panel. Three columns: field name (200px), value (400px), status (flex-1).

```html
<div class="data-row">
  <span class="data-row-field">First Name</span>
  <span class="data-row-value">John</span>

  <!-- Status column with field verification -->
  <span class="field-verification field-verification-verified data-row-status">
    <span class="section-marker section-marker-approve" role="img" aria-label="Verified">
      <svg class="icon icon-size-14" aria-hidden="true">
        <use href="#check" />
      </svg>
    </span>
    <span class="field-verification-label">Matches Plaid KYC</span>
  </span>

  <!-- Hover-revealed action -->
  <button class="icon-button icon-button-md data-row-action" aria-label="Help">
    <svg class="icon icon-size-14" aria-hidden="true">
      <use href="#circle-question-mark" />
    </svg>
  </button>
</div>

<!-- With sensitive data value -->
<div class="data-row">
  <span class="data-row-field">SSN</span>
  <span class="sensitive-data data-row-value">
    <span class="sensitive-data-value">***-**-1234</span>
    <button class="icon-button icon-button-md" aria-pressed="true" aria-label="Show">
      <svg class="icon icon-size-14" aria-hidden="true">
        <use href="#eye-off" />
      </svg>
    </button>
  </span>

  <span class="field-verification field-verification-pending data-row-status">
    <span class="section-marker" role="img" aria-label="Pending">
      <svg class="icon icon-size-14" aria-hidden="true">
        <use href="#circle" />
      </svg>
    </span>
    <span class="field-verification-label">Verification pending</span>
  </span>
</div>
```

---

### Divider

Three types: simple (bare rule), labeled, metadata.

```html
<!-- Simple divider -->
<hr class="divider" />

<!-- Labeled divider -->
<div class="divider-labeled">
  <hr class="divider" />
  <span class="divider-label">Beneficial owners</span>
  <hr class="divider" />
</div>

<!-- Metadata divider -->
<div class="divider-metadata">
  <span class="divider-metadata-item">
    <span class="divider-metadata-key">Updated</span>
    <span class="divider-metadata-value font-mono">Jul 17</span>
  </span>
  <span class="divider-metadata-separator"></span>
  <span class="divider-metadata-item">
    <span class="divider-metadata-key">Reviewer</span>
    <span class="divider-metadata-value">M. Carden</span>
  </span>
</div>
```

---

### Icon

Wrapper for icons at standardized sizes (10-24px). Icons inherit text color.

```html
<!-- Basic icon -->
<svg class="icon icon-size-14" aria-hidden="true">
  <use href="#save" />
</svg>

<!-- With status color -->
<svg class="icon icon-size-13 text-approved" aria-hidden="true">
  <use href="#check-circle" />
</svg>

<!-- All sizes -->
<svg class="icon icon-size-10" aria-hidden="true"><use href="#x" /></svg>
<svg class="icon icon-size-12" aria-hidden="true"><use href="#x" /></svg>
<svg class="icon icon-size-14" aria-hidden="true"><use href="#x" /></svg>
<svg class="icon icon-size-16" aria-hidden="true"><use href="#x" /></svg>
<svg class="icon icon-size-18" aria-hidden="true"><use href="#x" /></svg>
<svg class="icon icon-size-20" aria-hidden="true"><use href="#x" /></svg>
<svg class="icon icon-size-24" aria-hidden="true"><use href="#x" /></svg>
```

---

### Skeleton

Loading placeholder. Requires both a shape class and a size class.

```html
<!-- Line skeletons -->
<span class="skeleton skeleton-line skeleton-sm" aria-hidden="true"></span>
<span class="skeleton skeleton-line skeleton-md" aria-hidden="true"></span>
<span class="skeleton skeleton-line skeleton-lg w-full" aria-hidden="true"></span>

<!-- Heading skeleton -->
<span class="skeleton skeleton-heading skeleton-lg" aria-hidden="true"></span>

<!-- Circle skeleton -->
<span class="skeleton skeleton-circle skeleton-md" aria-hidden="true"></span>

<!-- Rectangle skeleton -->
<span class="skeleton skeleton-rectangle skeleton-md" aria-hidden="true"></span>

<!-- Button skeleton -->
<span class="skeleton skeleton-button skeleton-lg" aria-hidden="true"></span>

<!-- Card composition -->
<div role="status" aria-busy="true" aria-label="Loading card">
  <span class="skeleton skeleton-rectangle skeleton-md" aria-hidden="true"></span>
  <span class="skeleton skeleton-heading skeleton-md" aria-hidden="true"></span>
  <span class="skeleton skeleton-line skeleton-md" aria-hidden="true"></span>
  <span class="skeleton skeleton-line skeleton-md" aria-hidden="true"></span>
  <span class="skeleton skeleton-line skeleton-sm" aria-hidden="true"></span>
</div>
```

---

## Navigation

### NavigationRail

⚠️ **Group disclosure requires JavaScript** - Toggle `aria-expanded` on `.nav-group`.

Sidebar with title, groups, and items. Use `-collapsed` variants for a collapsed state.

```html
<!-- Expanded rail -->
<nav class="nav-rail">
  <!-- Title -->
  <a href="#" class="nav-title">
    <span class="nav-title-logo"><img src="/logo.svg" alt="" /></span>
    <span class="nav-title-details">
      <span class="nav-title-name">Central Williamette</span>
      <span class="nav-title-subtitle">Main st branch</span>
    </span>
    <span class="nav-title-action">
      <svg class="icon icon-size-14" aria-hidden="true">
        <use href="#chevron-down" />
      </svg>
    </span>
  </a>

  <!-- Current page -->
  <a href="#" class="nav-item" aria-current="page">
    <svg class="nav-item-icon icon icon-size-16" aria-hidden="true">
      <use href="#inbox" />
    </svg>
    <span class="nav-item-label">Inbox</span>
    <span class="nav-item-count">41</span>
  </a>

  <!-- Group (with disclosure) -->
  <button class="nav-group" aria-expanded="true" aria-controls="analyze-items">
    <span class="nav-group-label">Analyze</span>
    <svg class="nav-group-chevron icon icon-size-16" aria-hidden="true">
      <use href="#chevron-down" />
    </svg>
  </button>

  <!-- Items in group -->
  <div id="analyze-items" class="nav-rail-items">
    <a href="#" class="nav-item nav-item-active">
      <svg class="nav-item-icon icon icon-size-16" aria-hidden="true">
        <use href="#users" />
      </svg>
      <span class="nav-item-label">Businesses</span>
      <span class="nav-badge">Beta</span>
    </a>
  </div>
</nav>

<!-- Collapsed rail -->
<nav class="nav-rail">
  <a href="#" class="nav-title nav-title-collapsed">
    <span class="nav-title-logo"><img src="/logo.svg" alt="" /></span>
    <span class="nav-title-details">
      <span class="nav-title-name">Central Williamette</span>
      <span class="nav-title-subtitle">Main st branch</span>
    </span>
  </a>

  <div class="nav-group nav-group-collapsed">
    <span class="nav-group-rule"></span>
  </div>

  <a href="#" class="nav-item nav-item-collapsed">
    <svg class="nav-item-icon icon icon-size-16" aria-hidden="true">
      <use href="#bell" />
    </svg>
    <span class="nav-item-label">Alerts</span>
    <span class="nav-item-status"></span>
  </a>
</nav>
```

---

### Tabs

⚠️ **Tab switching requires JavaScript** - Manage `aria-selected` and panel visibility.

Three types (underline / chip / segment) × two sizes (sm / lg). **Type is required.**

```html
<!-- Underline tabs (navigator) -->
<div class="tabs" role="tablist" aria-label="Sections">
  <button class="tab tab-underline" role="tab" aria-selected="true" aria-controls="p1">
    Overview
    <span class="badge badge-neutral">3</span>
  </button>
  <button class="tab tab-underline" role="tab" aria-selected="false" aria-controls="p2">
    Documents
  </button>
</div>
<div id="p1" role="tabpanel">Panel 1</div>
<div id="p2" role="tabpanel" hidden>Panel 2</div>

<!-- Small underline -->
<button class="tab tab-underline tab-sm" role="tab" aria-selected="true">
  Overview
</button>

<!-- With subtitle -->
<button class="tab tab-underline" role="tab" aria-selected="true">
  <span>
    Overview
    <span class="tab-subtitle">APPLICANT</span>
  </span>
</button>

<!-- Chip tabs -->
<div class="tabs tabs-chip" role="tablist">
  <button class="tab tab-chip" role="tab" aria-selected="true">
    All
  </button>
  <button class="tab tab-chip" role="tab" aria-selected="false">
    Active
  </button>
</div>

<!-- Segment tabs (use in SegmentSelector) -->
```

---

### SegmentSelector

Framed container for segment tabs (selector, not navigator).

```html
<!-- Basic selector -->
<div class="segment-selector" role="radiogroup" aria-label="Density">
  <button class="tab tab-segment" role="radio" aria-checked="true">
    Compact
  </button>
  <button class="tab tab-segment" role="radio" aria-checked="false">
    Comfortable
  </button>
</div>

<!-- Equal-width variant -->
<div class="segment-selector segment-selector-fill" role="radiogroup">
  <button class="tab tab-segment" role="radio" aria-checked="true">
    All
  </button>
  <button class="tab tab-segment" role="radio" aria-checked="false">
    Needs review
  </button>
</div>
```

---

### FilterSegment

Individual segment within a filter control. Three positions: first / middle (default) / last.

```html
<div class="filter-segments">
  <button class="filter-segment filter-segment-first filter-segment-md">
    Product
  </button>
  <button class="filter-segment filter-segment-md">
    Is any of
  </button>
  <button class="filter-segment filter-segment-md">
    Deposit Account
  </button>
  <span class="filter-segment filter-segment-last filter-segment-md">
    <button class="icon-button icon-button-md" aria-label="Remove filter">
      <svg class="icon icon-size-14" aria-hidden="true">
        <use href="#x" />
      </svg>
    </button>
  </span>
</div>

<!-- As a toggle group -->
<div class="filter-segments" role="group" aria-label="Match mode">
  <button class="filter-segment filter-segment-first" aria-pressed="true">
    All
  </button>
  <button class="filter-segment" aria-pressed="false">
    Any
  </button>
  <button class="filter-segment filter-segment-last" aria-pressed="false">
    None
  </button>
</div>
```

---

### Breadcrumbs

Hierarchical navigation path. Separator glyphs need `aria-hidden="true"`.

```html
<!-- Chevron separator -->
<nav class="breadcrumbs" aria-label="Breadcrumb">
  <svg class="breadcrumb-home icon icon-size-14" aria-hidden="true">
    <use href="#home" />
  </svg>
  <span class="breadcrumb-separator" aria-hidden="true">&gt;</span>
  <a class="breadcrumb" href="/applications">Applications</a>
  <span class="breadcrumb-separator" aria-hidden="true">&gt;</span>
  <span class="breadcrumb breadcrumb-current" aria-current="page">
    #BA-204417
  </span>
</nav>

<!-- Slash separator with middot joining two current items -->
<nav class="breadcrumbs" aria-label="Breadcrumb">
  <a class="breadcrumb" href="/queue">Queue</a>
  <span class="breadcrumb-separator" aria-hidden="true">/</span>
  <span class="breadcrumb breadcrumb-current">#BA-204417</span>
  <span class="breadcrumb-separator breadcrumb-separator-dot" aria-hidden="true">
    &middot;
  </span>
  <span class="breadcrumb breadcrumb-current" aria-current="page">
    Northwind Freight LLC
  </span>
</nav>
```

---

### Pagination

Two types: numbered (with PaginationItem cells), simple (with text and buttons).

```html
<!-- Numbered pagination -->
<nav class="pagination" aria-label="Pagination">
  <div class="pagination-pages">
    <button class="pagination-item pagination-item-nav" aria-label="Previous">
      <svg class="icon icon-size-14" aria-hidden="true">
        <use href="#chevron-left" />
      </svg>
    </button>
    <button class="pagination-item pagination-item-active" aria-current="page">
      1
    </button>
    <button class="pagination-item">2</button>
    <span class="pagination-item pagination-item-ellipsis" aria-hidden="true">
      ...
    </span>
    <button class="pagination-item">18</button>
    <button class="pagination-item pagination-item-nav" aria-label="Next">
      <svg class="icon icon-size-14" aria-hidden="true">
        <use href="#chevron-right" />
      </svg>
    </button>
  </div>
  <p class="pagination-summary">1-20 of 352</p>
</nav>

<!-- Simple pagination -->
<nav class="pagination" aria-label="Pagination">
  <button class="btn btn-outline btn-sm">
    <svg class="icon icon-size-13" aria-hidden="true">
      <use href="#arrow-left" />
    </svg>
    Prev
  </button>
  <p class="pagination-status">
    Page <span class="pagination-status-current">7</span> of 18
  </p>
  <button class="btn btn-outline btn-sm">
    Next
    <svg class="icon icon-size-13" aria-hidden="true">
      <use href="#arrow-right" />
    </svg>
  </button>
</nav>
```

---

### MenuItem

Single row within a dropdown menu. Three sizes: sm=25px, md=29px (default), lg=42px.

```html
<!-- Simple row -->
<button class="menu-item" role="menuitem">
  <span class="menu-item-text">
    <span class="menu-item-title">Daily</span>
  </span>
</button>

<!-- Selected with check -->
<button class="menu-item" role="menuitem" aria-selected="true">
  <span class="menu-item-text">
    <span class="menu-item-title">Weekly</span>
  </span>
  <svg class="icon icon-size-15" aria-hidden="true">
    <use href="#check" />
  </svg>
</button>

<!-- With left icon and keyboard shortcut -->
<button class="menu-item" role="menuitem">
  <svg class="icon icon-size-15" aria-hidden="true">
    <use href="#settings" />
  </svg>
  <span class="menu-item-text">
    <span class="menu-item-title">Preferences</span>
  </span>
  <span class="menu-item-right-text">⌘,</span>
</button>

<!-- Large row with avatar and subtitle -->
<button class="menu-item menu-item-lg" role="menuitem">
  <span class="avatar avatar-md">NC</span>
  <span class="menu-item-text">
    <span class="menu-item-title">Nicholas Cooper</span>
    <span class="menu-item-subtitle">Primary applicant</span>
  </span>
</button>

<!-- Combined variant: badge + primary title -->
<button class="menu-item menu-item-lg menu-item-combined" role="menuitem">
  <span class="menu-item-badge">
    <svg class="icon icon-size-12" aria-hidden="true">
      <use href="#users" />
    </svg>
  </span>
  <span class="menu-item-text">
    <span class="menu-item-title">Combined</span>
    <span class="menu-item-subtitle">Both Applicants</span>
  </span>
</button>

<!-- Disabled -->
<button class="menu-item" role="menuitem" disabled>
  <span class="menu-item-text">
    <span class="menu-item-title">Archived</span>
  </span>
</button>
```

---

### DropdownMenu

⚠️ **Requires JavaScript** - Manage `aria-expanded` and `hidden` on panel.

Overlay panel holding MenuItem rows. Use `.dropdown` positioning wrapper.

```html
<!-- Select-style menu -->
<div class="dropdown-menu" role="menu">
  <button class="menu-item" role="menuitem" aria-selected="true">
    <span class="menu-item-text">
      <span class="menu-item-title">Weekly</span>
    </span>
    <svg class="icon icon-size-15" aria-hidden="true">
      <use href="#check" />
    </svg>
  </button>
  <button class="menu-item" role="menuitem">
    <span class="menu-item-text">
      <span class="menu-item-title">Daily</span>
    </span>
  </button>
  <button class="menu-item" role="menuitem">
    <span class="menu-item-text">
      <span class="menu-item-title">Monthly</span>
    </span>
  </button>
</div>

<!-- Action menu with divider -->
<div class="dropdown-menu" role="menu">
  <button class="menu-item" role="menuitem">
    <svg class="icon icon-size-15" aria-hidden="true">
      <use href="#pencil" />
    </svg>
    <span class="menu-item-text">
      <span class="menu-item-title">Edit</span>
    </span>
  </button>

  <div class="dropdown-menu-divider"></div>

  <button class="menu-item" role="menuitem">
    <svg class="icon icon-size-15 text-critical" aria-hidden="true">
      <use href="#trash-2" />
    </svg>
    <span class="menu-item-text">
      <span class="menu-item-title text-critical">Delete</span>
    </span>
  </button>
</div>

<!-- Anchored under a trigger -->
<div class="dropdown">
  <button class="btn btn-outline" aria-expanded="false" aria-haspopup="menu">
    Weekly
    <svg class="icon icon-size-14" aria-hidden="true">
      <use href="#chevron-down" />
    </svg>
  </button>
  <div class="dropdown-panel" hidden>
    <div class="dropdown-menu" role="menu">
      <!-- menu items -->
    </div>
  </div>
</div>
```

---

### Link

Four standalone styles plus one paragraph style. Underline is a state on `strong`, present on the other three.

```html
<!-- Strong link (no underline at rest, gains one on hover) -->
<a class="link" href="/report">Open full report →</a>

<!-- Quiet link -->
<a class="link link-quiet" href="/log">View activity log</a>

<!-- Monospace link -->
<a class="link link-monospace" href="/case">#BA-204417</a>

<!-- Critical link with icon -->
<a class="link link-critical" href="/fix">
  <svg class="icon icon-size-12" aria-hidden="true">
    <use href="#alert-triangle" />
  </svg>
  Resolve mismatch
</a>

<!-- Inline links (paragraph style, not used with .link) -->
<p class="link-inline">
  Valiify utilizes <a href="/middesk">Middesk</a> for instant background screenings.
</p>
```

---

## Feedback

### Alert

Contextual banner. Five types: critical / warning / success / info / neutral. **Type is required.**

```html
<div class="alert alert-critical" role="alert">
  <div class="alert-body">
    <svg class="alert-icon icon icon-size-18" aria-hidden="true">
      <use href="#triangle-alert" />
    </svg>
    <div class="alert-content">
      <p class="alert-title">Business address mismatch</p>
      <p class="alert-message">
        Middesk returns a registered-agent address.
      </p>
      <button class="text-button text-button-primary">Review Field</button>
    </div>
    <button class="icon-button icon-button-md" aria-label="Dismiss">
      <svg class="icon icon-size-14" aria-hidden="true">
        <use href="#x" />
      </svg>
    </button>
  </div>
</div>

<!-- Other types -->
<div class="alert alert-warning" role="alert"><!-- ... --></div>
<div class="alert alert-success" role="alert"><!-- ... --></div>
<div class="alert alert-info" role="alert"><!-- ... --></div>
<div class="alert alert-neutral" role="alert"><!-- ... --></div>
```

---

### Toast

Transient notification. Two styles: full (card) / simple (dark pill).

```html
<!-- Full toast -->
<div class="toast toast-success" role="status">
  <div class="toast-header">
    <div class="toast-main">
      <svg class="toast-icon icon icon-size-18" aria-hidden="true">
        <use href="#circle-check" />
      </svg>
      <div class="toast-text">
        <p class="toast-title">Document request sent</p>
        <p class="toast-message">
          Client has been notified to upload their W-9.
        </p>
      </div>
    </div>
    <button class="icon-button icon-button-md" aria-label="Dismiss">
      <svg class="icon icon-size-14" aria-hidden="true">
        <use href="#x" />
      </svg>
    </button>
  </div>
  <div class="toast-footer">
    <span class="toast-timestamp">just now</span>
    <button class="text-button text-button-primary">Retry</button>
  </div>
</div>

<!-- Simple toast -->
<div class="toast toast-simple" role="status">
  <svg class="icon icon-size-15" aria-hidden="true">
    <use href="#check" />
  </svg>
  Template Saved
</div>
```

---

### Modal

⚠️ **Recommended: Use native `<dialog>`** - Browser handles backdrop, Escape, focus trap.

Dialog for confirmations. Three actions: destructive / positive / neutral.

```html
<dialog class="modal modal-destructive" aria-labelledby="modal-title">
  <div class="modal-header">
    <div class="modal-title-group">
      <span class="modal-icon">
        <svg class="icon icon-size-20" aria-hidden="true">
          <use href="#triangle-alert" />
        </svg>
      </span>
      <h2 class="modal-title" id="modal-title">
        Decline this application?
      </h2>
    </div>
    <button class="icon-button icon-button-lg" aria-label="Close">
      <svg class="icon icon-size-16" aria-hidden="true">
        <use href="#x" />
      </svg>
    </button>
  </div>

  <div class="modal-subtitles">
    <p class="modal-subtitle">
      The applicant is notified through the portal.
    </p>
    <p class="modal-description">
      Two blocking items remain unresolved.
    </p>
  </div>

  <div class="modal-context">
    <p class="modal-context-text">#BA-204417 &middot; Northwind Freight LLC</p>
  </div>

  <div class="modal-footer">
    <button class="btn btn-empty btn-lg">Cancel</button>
    <button class="btn btn-critical btn-lg">Decline application</button>
  </div>
</dialog>

<script>
  const modal = document.querySelector("dialog");
  modal.showModal(); // Opens with backdrop, Escape handling, focus trap
</script>
```

---

### Tooltip

⚠️ **Positioning is yours** - Tooltip only styles the bubble.

Dark popover for helper text.

```html
<!-- Full tooltip -->
<div class="tooltip" role="tooltip" id="tt-naics">
  <p class="tooltip-title">INDUSTRY / NAICS</p>
  <p class="tooltip-content">
    Six digits used to classify business establishments.
  </p>
  <hr class="tooltip-divider" />
  <p class="tooltip-subtext">Middesk · Secretary of State</p>
</div>

<!-- Body only (most common) -->
<div class="tooltip" role="tooltip">
  <p class="tooltip-content">
    Six digits used to classify business establishments.
  </p>
</div>

<!-- Anchored to a trigger (positioning is yours) -->
<span style="position: relative; display: inline-block;">
  <button
    class="icon-button icon-button-xs"
    aria-describedby="tt-naics"
    aria-label="What is NAICS?"
  >
    <svg class="icon icon-size-12" aria-hidden="true">
      <use href="#custom-help" />
    </svg>
  </button>
  <span style="position: absolute; top: calc(100% + 8px); left: 0; z-index: 50;">
    <!-- .tooltip -->
  </span>
</span>
```

---

### LoadingIndicator

Two types: circle (spinning ring) / dots (pulsing). Four sizes: xs=12px (default), sm=16px, md=24px, lg=32px.

```html
<!-- Circle (default xs) -->
<span class="loading-indicator" role="status" aria-label="Loading"></span>

<!-- Circle with sizes -->
<span class="loading-indicator loading-indicator-sm" role="status" aria-label="Loading"></span>
<span class="loading-indicator loading-indicator-md" role="status" aria-label="Loading"></span>
<span class="loading-indicator loading-indicator-lg" role="status" aria-label="Loading"></span>

<!-- Dots -->
<span class="loading-indicator loading-indicator-dots" role="status" aria-label="Loading">
  <span class="loading-indicator-dot"></span>
  <span class="loading-indicator-dot"></span>
  <span class="loading-indicator-dot"></span>
</span>
```

---

### LoadingInline

Loading indicator with a label. Four sizes: xs / sm / md / lg.

```html
<span class="loading-inline loading-inline-md" role="status">
  <span class="loading-indicator"></span>
  Loading...
</span>

<!-- All sizes -->
<span class="loading-inline loading-inline-xs" role="status">
  <span class="loading-indicator"></span>
  Loading...
</span>
<span class="loading-inline loading-inline-sm" role="status">
  <span class="loading-indicator"></span>
  Loading...
</span>
<span class="loading-inline loading-inline-lg" role="status">
  <span class="loading-indicator"></span>
  Loading...
</span>
```

---

### ProgressBar

Two schemes: primary (default) / success.

```html
<div class="progress-bar progress-bar-success">
  <div class="progress-bar-header">
    <span class="progress-bar-title">Review completion</span>
    <span class="progress-bar-value">92%</span>
  </div>

  <div
    class="progress-bar-track"
    role="progressbar"
    aria-valuenow="92"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label="Review completion"
  >
    <div class="progress-bar-fill" style="width: 92%"></div>
  </div>

  <div class="progress-bar-legend">
    <span class="progress-bar-legend-item">
      <span class="progress-bar-legend-swatch"></span>
      <span class="progress-bar-legend-label">92% verified</span>
    </span>
    <span class="progress-bar-legend-item">
      <span class="progress-bar-legend-swatch progress-bar-legend-swatch-neutral"></span>
      <span class="progress-bar-legend-label">8% unaccounted</span>
    </span>
  </div>
</div>
```

---

### Stepper

Row of steps joined by connectors.

```html
<div class="stepper">
  <p class="stepper-title">Stepped progression flow</p>
  <div class="stepper-steps">
    <div class="step">
      <span class="step-marker">
        <svg class="icon icon-size-12" aria-hidden="true">
          <use href="#check" />
        </svg>
      </span>
      <span class="step-label">Intake</span>
    </div>
    <span class="stepper-connector stepper-connector-complete"></span>

    <div class="step step-active" aria-current="step">
      <span class="step-marker">2</span>
      <span class="step-label">Review</span>
    </div>
    <span class="stepper-connector"></span>

    <div class="step step-upcoming">
      <span class="step-marker">3</span>
      <span class="step-label">Decision</span>
    </div>
  </div>
</div>
```

---

## Review Components

### FieldVerification

Inline verification indicator. Four states: verified / pending / none / mismatch.

```html
<!-- Verified -->
<span class="field-verification field-verification-verified">
  <span class="section-marker section-marker-approve" role="img" aria-label="Verified">
    <svg class="icon icon-size-14" aria-hidden="true">
      <use href="#check" />
    </svg>
  </span>
  <span class="field-verification-label">Matches X</span>
</span>

<!-- Pending -->
<span class="field-verification field-verification-pending">
  <span class="section-marker" role="img" aria-label="Pending">
    <svg class="icon icon-size-14" aria-hidden="true">
      <use href="#circle" />
    </svg>
  </span>
  <span class="field-verification-label">Verification pending</span>
</span>

<!-- None -->
<span class="field-verification field-verification-none" role="img" aria-label="No status">
  <span class="section-marker">
    <svg class="icon icon-size-14" aria-hidden="true">
      <use href="#minus" />
    </svg>
  </span>
</span>

<!-- Mismatch (preview) -->
<span class="field-verification field-verification-mismatch">
  <svg class="field-verification-icon icon icon-size-15" aria-hidden="true">
    <use href="#triangle-alert" />
  </svg>
  <span class="field-verification-label">Does not match KYC</span>
</span>

<!-- Mismatch (expanded) -->
<span class="field-verification field-verification-mismatch">
  <svg class="field-verification-icon icon icon-size-15" aria-hidden="true">
    <use href="#triangle-alert" />
  </svg>
  <span class="field-verification-details">
    <span class="field-verification-label">Does not match KYC</span>
    <span class="field-verification-detail">Reported: 04/12/1988</span>
    <span class="field-verification-action">
      Review discrepancy
      <svg class="icon icon-size-15" aria-hidden="true">
        <use href="#arrow-right" />
      </svg>
    </span>
  </span>
</span>
```

---

### SectionMarker

16×16 verification marker. Four statuses: approve / mismatch / unverified / na.

```html
<!-- Approve -->
<span class="section-marker section-marker-approve" role="img" aria-label="Approved">
  <svg class="icon icon-size-14" aria-hidden="true">
    <use href="#check" />
  </svg>
</span>

<!-- Mismatch -->
<span class="section-marker section-marker-mismatch" role="img" aria-label="Mismatch">
  <span class="section-marker-dot"></span>
</span>

<!-- Unverified -->
<span class="section-marker section-marker-unverified" role="img" aria-label="Unverified">
  <svg class="icon icon-size-14" aria-hidden="true">
    <use href="#circle" />
  </svg>
</span>

<!-- NA (no status class, no child, but needs label) -->
<span class="section-marker" role="img" aria-label="Not applicable"></span>
```

---

### SensitiveData

Masked value with toggle.

```html
<!-- Hidden -->
<span class="sensitive-data">
  <span class="sensitive-data-value">***-**-1234</span>
  <button
    class="icon-button icon-button-md"
    aria-pressed="true"
    aria-label="Show full value"
  >
    <svg class="icon icon-size-14" aria-hidden="true">
      <use href="#eye-off" />
    </svg>
  </button>
</span>

<!-- Revealed -->
<span class="sensitive-data">
  <span class="sensitive-data-value">123-12-1234</span>
  <button
    class="icon-button icon-button-md"
    aria-pressed="false"
    aria-label="Hide value"
  >
    <svg class="icon icon-size-14" aria-hidden="true">
      <use href="#eye" />
    </svg>
  </button>
</span>
```

---

## Need More Help?

- **Installation issues:** See [GETTING_STARTED.md](GETTING_STARTED.md)
- **Broken components:** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Technical details:** See [CLAUDE.md](CLAUDE.md)
- **Working examples:** See `examples/vite-starter/` and `examples/postcss-starter/`
