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
export type RadioClass = "radio";

// IconButton component classes
export type IconButtonClass = "icon-button";

// Checkbox component classes
export type CheckboxClass = "checkbox";

// Switch component classes
export type SwitchClass = "switch";

// Button component classes
export type ButtonClass = "button";

// ListItem component classes
export type ListItemClass = "list-option";

// DropdownList component classes
export type DropdownListClass = "dropdown-list";

// TextSelector component classes
export type TextSelectorClass = "text-selector";

// SelectCard component classes
export type SelectCardClass = "select-card";

// Avatar component classes
export type AvatarClass = "avatar";

// Badge component classes
export type BadgeClass = "badge";

// BoxAction component classes
export type BoxActionClass = "box-action";

// Tabs component classes
export type TabsClass = "tabs";

// Header component classes
export type HeaderClass = "header";

// RadioField component classes
export type RadioFieldClass = "radio-field";

// Skeleton component classes
export type SkeletonClass = "skeleton";

// Owner component classes
export type OwnerClass = "owner";

// OwnerContainer component classes
export type OwnerContainerClass =
  | "owner-container"
  | "owner-container-info"
  | "owner-container-title"
  | "owner-container-name"
  | "owner-container-percent"
  | "owner-container-contact"
  | "owner-container-contact-text"
  | "owner-container-actions";

// TextField component classes
export type TextFieldClass =
  | "text-field"
  | "text-field-title-row"
  | "text-field-title"
  | "text-field-help"
  | "text-field-box"
  | "text-field-icon"
  | "text-field-input"
  | "text-field-hint";

// DropdownField component classes
export type DropdownFieldClass =
  | "dropdown-field"
  | "dropdown-field-title-row"
  | "dropdown-field-title"
  | "dropdown-field-optional"
  | "dropdown-field-help"
  | "dropdown-field-trigger"
  | "dropdown-field-value"
  | "dropdown-field-value-placeholder"
  | "dropdown-field-chevron"
  | "dropdown-field-hint";

// TextArea component classes
export type TextAreaClass =
  | "text-area"
  | "text-area-title-row"
  | "text-area-title"
  | "text-area-optional"
  | "text-area-help"
  | "text-area-input"
  | "text-area-hint";

// Modal component classes
export type ModalClass =
  | "modal"
  | "modal-header"
  | "modal-title"
  | "modal-description"
  | "modal-notice"
  | "modal-notice-destructive"
  | "modal-notice-success"
  | "modal-notice-label"
  | "modal-notice-body"
  | "modal-actions"
  | "modal-backdrop";

// Tooltip component classes
export type TooltipClass = "tooltip" | "tooltip-title" | "tooltip-body";

// Toast component classes
export type ToastClass =
  | "toast"
  | "toast-success"
  | "toast-error"
  | "toast-info"
  | "toast-icon"
  | "toast-content"
  | "toast-title"
  | "toast-body"
  | "toast-simple";

// StatusTracker component classes
export type StatusTrackerClass = "status-tracker" | "status-tracker-active";

// Action component classes
export type ActionClass =
  | "action"
  | "action-pending"
  | "action-done"
  | "action-icon"
  | "action-content"
  | "action-title"
  | "action-description"
  | "action-status"
  | "action-cta";

// UtilityButton component classes
export type UtilityButtonClass =
  | "utility-button"
  | "utility-button-empty"
  | "utility-button-filled"
  | "utility-button-rounded"
  | "utility-button-text"
  | "utility-button-md";

// Union of all component classes
export type ValiifyComponentClass = never | RadioClass | IconButtonClass | CheckboxClass | SwitchClass | ButtonClass | ListItemClass | DropdownListClass | TextSelectorClass | SelectCardClass | AvatarClass | BadgeClass | BoxActionClass | TabsClass | HeaderClass | RadioFieldClass | SkeletonClass | OwnerClass | OwnerContainerClass | TextFieldClass | DropdownFieldClass | TextAreaClass | ModalClass | TooltipClass | ToastClass | StatusTrackerClass | ActionClass | UtilityButtonClass;
