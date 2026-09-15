/**
 * Component class-name types for @valiify/shortapp-ui.
 *
 * Short App component types are added here as components are extracted from
 * the Short App Figma file — `npm run new:component <Name>` inserts each
 * component's string-literal type above the anchor comment below and extends
 * the union automatically.
 *
 * The dashboard library's full type file is preserved at
 * _dashboard-archive/components.d.ts for reference on the pattern.
 */

// Radio component classes
export type RadioClass = "va-radio";

// IconButton component classes
export type IconButtonClass = "va-icon-button";

// Checkbox component classes
export type CheckboxClass = "checkbox";

// Switch component classes
export type SwitchClass = "va-switch";

// Button component classes
export type ButtonClass = "button";

// ListItem component classes
export type ListItemClass = "va-list-option";

// DropdownList component classes
export type DropdownListClass = "va-dropdown-list";

// TextSelector component classes
export type TextSelectorClass = "va-text-selector";

// SelectCard component classes
export type SelectCardClass = "va-select-card";

// Avatar component classes
export type AvatarClass = "va-avatar";

// Badge component classes
export type BadgeClass = "va-badge";

// BoxAction component classes
export type BoxActionClass = "va-box-action";

// Tabs component classes
export type TabsClass = "va-tabs";

// Header component classes
export type HeaderClass = "va-header";

// RadioField component classes
export type RadioFieldClass = "va-radio-field";

// Skeleton component classes
export type SkeletonClass = "va-skeleton";

// Owner component classes
export type OwnerClass = "va-owner";

// OwnerContainer component classes
export type OwnerContainerClass =
  | "va-owner-container"
  | "va-owner-container-info"
  | "va-owner-container-title"
  | "va-owner-container-name"
  | "va-owner-container-percent"
  | "va-owner-container-contact"
  | "va-owner-container-contact-text"
  | "va-owner-container-actions";

// TextField component classes
export type TextFieldClass =
  | "va-text-field"
  | "va-text-field-title-row"
  | "va-text-field-title"
  | "va-text-field-help"
  | "va-text-field-box"
  | "va-text-field-icon"
  | "va-text-field-input"
  | "va-text-field-hint";

// DropdownField component classes
export type DropdownFieldClass =
  | "va-dropdown-field"
  | "va-dropdown-field-title-row"
  | "va-dropdown-field-title"
  | "va-dropdown-field-optional"
  | "va-dropdown-field-help"
  | "va-dropdown-field-trigger"
  | "va-dropdown-field-value"
  | "va-dropdown-field-value-placeholder"
  | "va-dropdown-field-chevron"
  | "va-dropdown-field-hint";

// TextArea component classes
export type TextAreaClass =
  | "va-text-area"
  | "va-text-area-title-row"
  | "va-text-area-title"
  | "va-text-area-optional"
  | "va-text-area-help"
  | "va-text-area-input"
  | "va-text-area-hint";

// Modal component classes
export type ModalClass =
  | "va-modal"
  | "va-modal-header"
  | "va-modal-title"
  | "va-modal-description"
  | "va-modal-notice"
  | "va-modal-notice-destructive"
  | "va-modal-notice-success"
  | "va-modal-notice-label"
  | "va-modal-notice-body"
  | "va-modal-actions"
  | "va-modal-backdrop";

// Tooltip component classes
export type TooltipClass = "va-tooltip" | "va-tooltip-title" | "va-tooltip-body";

// Toast component classes
export type ToastClass =
  | "va-toast"
  | "va-toast-success"
  | "va-toast-error"
  | "va-toast-info"
  | "va-toast-icon"
  | "va-toast-content"
  | "va-toast-title"
  | "va-toast-body"
  | "va-toast-simple";

// StatusTracker component classes
export type StatusTrackerClass = "va-status-tracker" | "va-status-tracker-active";

// Action component classes
export type ActionClass =
  | "va-action"
  | "va-action-pending"
  | "va-action-done"
  | "va-action-icon"
  | "va-action-content"
  | "va-action-title"
  | "va-action-description"
  | "va-action-status"
  | "va-action-cta";

// UtilityButton component classes
export type UtilityButtonClass =
  | "va-utility-button"
  | "va-utility-button-empty"
  | "va-utility-button-filled"
  | "va-utility-button-rounded"
  | "va-utility-button-text"
  | "va-utility-button-md";

// Union of all component classes
export type ValiifyComponentClass = never | RadioClass | IconButtonClass | CheckboxClass | SwitchClass | ButtonClass | ListItemClass | DropdownListClass | TextSelectorClass | SelectCardClass | AvatarClass | BadgeClass | BoxActionClass | TabsClass | HeaderClass | RadioFieldClass | SkeletonClass | OwnerClass | OwnerContainerClass | TextFieldClass | DropdownFieldClass | TextAreaClass | ModalClass | TooltipClass | ToastClass | StatusTrackerClass | ActionClass | UtilityButtonClass;
