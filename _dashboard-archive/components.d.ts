/**
 * Type-safe component class names for @valiify/dashboard-ui
 *
 * Use these types to get autocomplete and type checking for component classes.
 *
 * Example:
 *   import type { ButtonClass } from '@valiify/dashboard-ui/types';
 *   const buttonClasses: ButtonClass = 'btn btn-primary';
 */

// Input component classes
export type InputSize = "input-sm" | "input-md" | "input-lg";
export type InputBgVariant = "input-bg-neutral";
export type InputState = "input-error" | "input-disabled";
export type InputPart =
  | "input-container"
  | "input-label"
  | "input-help-button"
  | "input-field"
  | "input"
  | "input-icon-left"
  | "input-icon-right"
  | "input-error-message";

export type InputClass = InputPart | InputSize | InputBgVariant | InputState;

// Card component classes
export type CardModifier = "card-compact" | "card-bordered" | "card-hover";
export type CardPart = "card-title" | "card-body";
export type CardClass = "card" | CardModifier | CardPart;

// RadioSelect component classes
export type RadioSelectPart = "radio-select-input" | "radio-select-label";
export type RadioSelectClass = "radio-select" | RadioSelectPart;

// Button component classes
// btn-critical is NOT in Figma's Button set (73:180) — it comes from Modal's
// destructive confirm button. See src/components/button.css.
export type ButtonVariant =
  "btn-primary" | "btn-outline" | "btn-empty" | "btn-critical";
export type ButtonSize = "btn-sm" | "btn-lg";
export type ButtonClass = "btn" | ButtonVariant | ButtonSize;

// Chip component classes
export type ChipVariant =
  | "chip-warning"
  | "chip-critical"
  | "chip-success"
  | "chip-neutral"
  | "chip-primary";
export type BadgeVariant =
  | "badge-warning"
  | "badge-critical"
  | "badge-success"
  | "badge-neutral"
  | "badge-primary";
export type DotVariant =
  | "dot-warning"
  | "dot-critical"
  | "dot-success"
  | "dot-neutral"
  | "dot-primary";
export type ChipPart = "chip-dot";
export type ChipState = "with-ring";
// Figma BG property. `yes` (filled) is the default, so it takes no class and
// only the opt-out is named — the same shape as Input/Textarea/DropdownField's
// `-bg-*` classes. There is no dot equivalent: BG is a no-op for a dot, whose
// BG=yes and BG=no variants render identically.
export type ChipBg = "chip-bg-no";
export type BadgeBg = "badge-bg-no";
// Figma Size property. SM is the default, so the bare classes stay SM.
export type ChipSize = "chip-sm" | "chip-md";
export type BadgeSize = "badge-sm" | "badge-md";
export type DotSize = "dot-sm" | "dot-md";
export type ChipClass =
  | "chip"
  | ChipVariant
  | ChipPart
  | ChipSize
  | ChipBg
  | "badge"
  | BadgeVariant
  | BadgeSize
  | BadgeBg
  | "dot"
  | DotVariant
  | DotSize
  | ChipState;

// Switch component classes
export type SwitchPart = "switch-input";
export type SwitchClass = "switch" | SwitchPart;

// Icon component classes
export type IconSize =
  | "icon-size-10"
  | "icon-size-11"
  | "icon-size-12"
  | "icon-size-13"
  | "icon-size-14"
  | "icon-size-15"
  | "icon-size-16"
  | "icon-size-18"
  | "icon-size-20"
  | "icon-size-22"
  | "icon-size-24";
export type IconState = "icon-ring";
export type IconClass = "icon" | IconSize | IconState;

// IconButton component classes
export type IconButtonSize =
  "icon-button-xs" | "icon-button-md" | "icon-button-lg";
export type IconButtonClass = "icon-button" | IconButtonSize | "icon-ring";

// Textarea component classes
export type TextareaBgVariant = "textarea-bg-neutral";
export type TextareaState = "textarea-error" | "textarea-disabled";
export type TextareaPart =
  | "textarea-container"
  | "textarea-label"
  | "textarea-field"
  | "textarea"
  | "textarea-error-message"
  | "textarea-counter";

// No size type: Figma defines no Size property and height is consumer-driven.
export type TextareaClass = TextareaPart | TextareaBgVariant | TextareaState;

// MenuItem component classes
export type MenuItemSize = "menu-item-sm" | "menu-item-md" | "menu-item-lg";
export type MenuItemVariant = "menu-item-combined";
export type MenuItemPart =
  | "menu-item"
  | "menu-item-text"
  | "menu-item-title"
  | "menu-item-subtitle"
  | "menu-item-right-text"
  | "menu-item-badge";

export type MenuItemClass = MenuItemPart | MenuItemSize | MenuItemVariant;

// DropdownMenu component classes
export type DropdownMenuPart =
  "dropdown-menu" | "dropdown-menu-divider" | "dropdown" | "dropdown-panel";

export type DropdownMenuClass = DropdownMenuPart;

// DropdownField component classes
export type DropdownFieldSize =
  "dropdown-field-sm" | "dropdown-field-md" | "dropdown-field-lg";
export type DropdownFieldBgVariant = "dropdown-field-bg-neutral";
export type DropdownFieldState = "dropdown-field-error";
export type DropdownFieldPart =
  | "dropdown-field-container"
  | "dropdown-field-label"
  | "dropdown-field"
  | "dropdown-field-value"
  | "dropdown-field-placeholder"
  | "dropdown-field-icon"
  | "dropdown-field-chevron"
  | "dropdown-field-error-message";

export type DropdownFieldClass =
  | DropdownFieldPart
  | DropdownFieldSize
  | DropdownFieldBgVariant
  | DropdownFieldState;

// Avatar component classes
export type AvatarSize = "avatar-xs" | "avatar-sm" | "avatar-md" | "avatar-lg";
export type AvatarState = "avatar-disabled" | "with-ring";
export type AvatarClass = "avatar" | AvatarSize | AvatarState;

// Pill component classes
export type PillPart = "pill" | "pill-chevron";
export type PillState = "with-ring";
export type PillClass = PillPart | PillState;

// Tag component classes
export type TagSize = "tag-sm" | "tag-md";
export type TagPart = "tag" | "tag-count";
export type TagState = "with-ring";
export type TagClass = TagPart | TagSize | TagState;

// Tabs component classes
export type TabsType = "tab-underline" | "tab-chip" | "tab-segment";
export type TabsSize = "tab-sm";
export type TabsPart = "tabs" | "tab" | "tab-subtitle";
export type TabsState = "with-ring";
export type TabsClass = TabsPart | TabsType | TabsSize | TabsState;

// SegmentSelector component classes
export type SegmentSelectorClass =
  | "segment-selector"
  /** Equal-width segments. Not from Figma — its segments hug their labels. */
  | "segment-selector-fill"
  | "with-ring";

// Tooltip component classes
export type TooltipPart =
  | "tooltip"
  | "tooltip-title"
  | "tooltip-content"
  | "tooltip-divider"
  | "tooltip-subtext";
export type TooltipClass = TooltipPart;

// Modal component classes
export type ModalAction =
  "modal-destructive" | "modal-positive" | "modal-neutral";
export type ModalPart =
  | "modal-header"
  | "modal-title-group"
  | "modal-icon"
  | "modal-title"
  | "modal-subtitles"
  | "modal-subtitle"
  | "modal-description"
  | "modal-context"
  | "modal-context-text"
  | "modal-footer";
export type ModalClass = "modal" | ModalAction | ModalPart;

// TextButton component classes
// Text Button is NOT a .btn variant — different Figma component (679:21601),
// different type scale, and it hugs its text instead of having a fixed height.
export type TextButtonType =
  "text-button-cell" | "text-button-text" | "text-button-primary";
export type TextButtonClass = "text-button" | TextButtonType | "with-ring";

// Toast component classes
// Style=Simple exists only for Type=info in Figma, so the type classes are
// inert on .toast-simple.
export type ToastType = "toast-success" | "toast-error" | "toast-info";
export type ToastStyle = "toast-simple";
export type ToastPart =
  | "toast-header"
  | "toast-main"
  | "toast-icon"
  | "toast-text"
  | "toast-title"
  | "toast-message"
  | "toast-footer"
  | "toast-timestamp";
export type ToastClass = "toast" | ToastType | ToastStyle | ToastPart;

// Alert component classes
// A type class is REQUIRED — .alert carries layout only and Figma's Type axis
// has no default. See src/components/alert.css.
export type AlertType =
  | "alert-critical"
  | "alert-warning"
  | "alert-success"
  | "alert-info"
  | "alert-neutral";
export type AlertPart =
  | "alert-body"
  | "alert-icon"
  | "alert-content"
  | "alert-title"
  | "alert-message";
export type AlertClass = "alert" | AlertType | AlertPart;

// SectionMarker component classes
// No "section-marker-na" — Figma's na variant draws nothing, so the class would
// carry no declarations. na is a bare .section-marker with no child.
export type SectionMarkerStatus =
  | "section-marker-approve"
  | "section-marker-mismatch"
  | "section-marker-unverified";
export type SectionMarkerClass =
  "section-marker" | SectionMarkerStatus | "section-marker-dot" | "with-ring";

// FieldVerification component classes
export type FieldVerificationState =
  | "field-verification-verified"
  | "field-verification-pending"
  | "field-verification-none"
  | "field-verification-mismatch";
export type FieldVerificationPart =
  | "field-verification-icon"
  | "field-verification-label"
  | "field-verification-details"
  | "field-verification-detail"
  | "field-verification-action";
export type FieldVerificationClass =
  | "field-verification"
  | FieldVerificationState
  | FieldVerificationPart
  | "with-ring";

// PaginationItem component classes
// No "pagination-item-default" — default is the bare base class, matching
// Figma's default variant.
export type PaginationItemKind =
  "pagination-item-active" | "pagination-item-ellipsis" | "pagination-item-nav";
export type PaginationItemClass = "pagination-item" | PaginationItemKind;

// Pagination component classes
// No "pagination-numbered" / "pagination-simple" — both Figma types share the
// same root and differ only in their children.
export type PaginationPart =
  | "pagination-pages"
  | "pagination-summary"
  | "pagination-status"
  | "pagination-status-current";
export type PaginationClass = "pagination" | PaginationPart;

// FilterSegment component classes
// Position is three separate yes/no booleans in Figma (First/Middle/Last) with
// exactly one ever set. Middle is the default, so it is the bare base class.
export type FilterSegmentPosition =
  "filter-segment-first" | "filter-segment-last";
export type FilterSegmentSize = "filter-segment-md";
export type FilterSegmentClass =
  | "filter-segment"
  | FilterSegmentPosition
  | FilterSegmentSize
  | "filter-segments"
  | "with-ring";

// Link component classes
// strong is the base. `link-inline` is NOT used with `.link` — it is a
// paragraph class whose anchors are styled as descendants.
export type LinkStyle =
  "link-strong" | "link-quiet" | "link-monospace" | "link-critical";
export type LinkClass = "link" | LinkStyle | "link-inline";

// Divider component classes
// The three Figma types are structurally incompatible, so `-labeled` and
// `-metadata` are standalone container classes rather than modifiers — they do
// NOT take `.divider`, which is itself the simple type.
export type DividerPart =
  | "divider-labeled"
  | "divider-label"
  | "divider-metadata"
  | "divider-metadata-item"
  | "divider-metadata-key"
  | "divider-metadata-value"
  | "divider-metadata-separator";
export type DividerClass = "divider" | DividerPart;

// LoadingIndicator component classes
// XS is the default, matching Figma's first variant — and the size Loading
// Inline embeds at every one of ITS sizes.
export type LoadingIndicatorSize =
  "loading-indicator-sm" | "loading-indicator-md" | "loading-indicator-lg";
export type LoadingIndicatorClass =
  | "loading-indicator"
  | LoadingIndicatorSize
  | "loading-indicator-dots"
  | "loading-indicator-dot";

// LoadingInline component classes
export type LoadingInlineSize =
  "loading-inline-sm" | "loading-inline-md" | "loading-inline-lg";
export type LoadingInlineClass = "loading-inline" | LoadingInlineSize;

// ProgressBar component classes
// Figma's variant axis is named "Has Legend" but actually swaps the COLOUR —
// both variants render a legend. Renamed here. See src/components/progress-bar.css.
export type ProgressBarScheme = "progress-bar-success";
export type ProgressBarPart =
  | "progress-bar-header"
  | "progress-bar-title"
  | "progress-bar-value"
  | "progress-bar-track"
  | "progress-bar-fill"
  | "progress-bar-legend"
  | "progress-bar-legend-item"
  | "progress-bar-legend-swatch"
  | "progress-bar-legend-swatch-neutral"
  | "progress-bar-legend-label";
export type ProgressBarClass =
  "progress-bar" | ProgressBarScheme | ProgressBarPart;

// Step component classes
// Completed is Figma's default variant, so it is the bare base class.
export type StepState = "step-active" | "step-upcoming";
export type StepPart = "step-marker" | "step-label";
export type StepClass = "step" | StepState | StepPart;

// Stepper component classes
export type StepperPart =
  | "stepper-title"
  | "stepper-steps"
  | "stepper-connector"
  | "stepper-connector-complete";
export type StepperClass = "stepper" | StepperPart;

// Breadcrumbs component classes
// `-mono` carries TYPE ONLY and composes with `-current`, which supplies the
// colour. Separators are text characters, not icons.
export type BreadcrumbsPart =
  | "breadcrumb"
  | "breadcrumb-current"
  | "breadcrumb-home"
  | "breadcrumb-separator"
  | "breadcrumb-separator-chevron"
  | "breadcrumb-separator-dot";
export type BreadcrumbsClass = "breadcrumbs" | BreadcrumbsPart;

// SensitiveData component classes
export type SensitiveDataPart = "sensitive-data-value";
export type SensitiveDataClass = "sensitive-data" | SensitiveDataPart;

// DataRow component classes
export type DataRowPart =
  | "data-row-field"
  | "data-row-value"
  /** Additive: stretches the Field Verification slot, like segment-selector-fill. */
  | "data-row-status"
  | "data-row-action";
export type DataRowClass = "data-row" | DataRowPart | "with-ring";

// Checkbox component classes
// The control is a native <input type="checkbox"> inside a real <label>; every
// state is native (:checked / :disabled), so there is no checked/disabled class.
export type CheckboxPart =
  | "checkbox-control"
  | "checkbox-input"
  | "checkbox-check"
  | "checkbox-label"
  | "checkbox-subtitle";
export type CheckboxClass = "checkbox" | CheckboxPart | "with-ring";

// Skeleton component classes
// Skeleton component classes
// Both axes are required — neither has a default in Figma, and the dimensions
// are a 5x3 matrix rather than one box with three scales.
export type SkeletonShape =
  | "skeleton-line"
  | "skeleton-heading"
  | "skeleton-circle"
  | "skeleton-rectangle"
  | "skeleton-button";
export type SkeletonSize = "skeleton-sm" | "skeleton-md" | "skeleton-lg";
export type SkeletonClass = "skeleton" | SkeletonShape | SkeletonSize;

// NavigationRail component classes
export type NavigationRailClass = "navigation-rail";

// Union of all component classes
export type ValiifyComponentClass =
  | InputClass
  | CardClass
  | RadioSelectClass
  | ButtonClass
  | ChipClass
  | SwitchClass
  | IconClass
  | IconButtonClass
  | TextareaClass
  | MenuItemClass
  | DropdownMenuClass
  | DropdownFieldClass
  | AvatarClass
  | PillClass
  | TagClass
  | TabsClass
  | SegmentSelectorClass
  | TooltipClass
  | ModalClass
  | TextButtonClass
  | ToastClass
  | AlertClass
  | SectionMarkerClass
  | FieldVerificationClass
  | PaginationItemClass
  | PaginationClass
  | FilterSegmentClass
  | LinkClass
  | DividerClass
  | LoadingIndicatorClass
  | LoadingInlineClass
  | ProgressBarClass
  | StepClass
  | StepperClass
  | BreadcrumbsClass
  | SensitiveDataClass
  | DataRowClass
  | CheckboxClass
  | SkeletonClass
  | NavigationRailClass;

// Helper type for combining classes
export type ComponentClassName = ValiifyComponentClass | string;

/**
 * Component variants for programmatic use
 */
export interface InputVariants {
  type?: "text" | "email" | "password" | "number" | "url" | "search";
  size?: "sm" | "md" | "lg";
  bgVariant?: "white" | "neutral";
  error?: boolean;
  disabled?: boolean;
  showLabel?: boolean;
  showHelp?: boolean;
  leftIcon?: boolean;
  rightIcon?: boolean;
}

export interface CardVariants {
  compact?: boolean;
  bordered?: boolean;
  hover?: boolean;
}

export interface RadioSelectVariants {
  name: string;
  checked?: boolean;
  disabled?: boolean;
}

export interface ButtonVariants {
  variant?: "primary" | "outline" | "empty";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  selected?: boolean;
}

export interface IconVariants {
  size?: 10 | 11 | 12 | 13 | 14 | 15 | 16 | 18 | 20 | 22 | 24;
  ring?: boolean;
}

export interface ChipVariants {
  type?: "chip" | "badge" | "dot";
  variant?: "warning" | "critical" | "success" | "neutral" | "primary";
  size?: "sm" | "md";
  /** Figma BG axis. Defaults to "yes" (filled). Ignored for type "dot". */
  bg?: "yes" | "no";
  withDot?: boolean;
  withRing?: boolean;
}

export interface SwitchVariants {
  checked?: boolean;
  disabled?: boolean;
}

export interface TextareaVariants {
  bgVariant?: "white" | "neutral";
  error?: boolean;
  disabled?: boolean;
  showLabel?: boolean;
  showHelp?: boolean;
  showCounter?: boolean;
}

export interface MenuItemVariants {
  size?: "sm" | "md" | "lg";
  combined?: boolean;
  selected?: boolean;
  disabled?: boolean;
  leftIcon?: boolean;
  rightIcon?: boolean;
  rightText?: boolean;
  subtitle?: boolean;
  avatar?: boolean;
  badge?: boolean;
}

export interface TooltipVariants {
  /** All parts are optional in markup; Figma models them as text properties. */
  title?: boolean;
  content?: boolean;
  subtext?: boolean;
}

export interface TabsVariants {
  type?: "underline" | "chip" | "segment";
  /** sm exists for underline only. */
  size?: "lg" | "sm";
  /** aria-selected for a tablist, aria-checked for a radiogroup. */
  active?: boolean;
  disabled?: boolean;
  subtitle?: boolean;
  /** Reuses `.badge badge-neutral`. */
  badge?: boolean;
}

export interface SegmentSelectorVariants {
  /** Distribute segments equally. Not from Figma. */
  fill?: boolean;
  withRing?: boolean;
}

export interface TagVariants {
  size?: "sm" | "md";
  /** Selected — solid primary fill. */
  active?: boolean;
  disabled?: boolean;
  withRing?: boolean;
  /** Leading Avatar (`.avatar avatar-xs`). md only. */
  avatar?: boolean;
  /** Trailing count (`.tag-count`). md only. */
  count?: boolean;
  /** Trailing 5px dot (`.dot dot-warning`). Both sizes. */
  statusDot?: boolean;
}

export interface PillVariants {
  /** Adds the trailing chevron (Figma's Dropdown axis). */
  dropdown?: boolean;
  /** Menu open when dropdown is true, selected when it is not. */
  active?: boolean;
  disabled?: boolean;
  withRing?: boolean;
}

export interface AvatarVariants {
  size?: "xs" | "sm" | "md" | "lg";
  disabled?: boolean;
  withRing?: boolean;
}

export interface DropdownFieldVariants {
  size?: "sm" | "md" | "lg";
  bgVariant?: "white" | "neutral";
  filled?: boolean;
  error?: boolean;
  disabled?: boolean;
  open?: boolean;
  showLabel?: boolean;
  showHelp?: boolean;
  leftIcon?: boolean;
  avatar?: boolean;
}
