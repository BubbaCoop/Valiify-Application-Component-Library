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

// Union of all component classes
export type ValiifyComponentClass = never | RadioClass | IconButtonClass | CheckboxClass | SwitchClass | ButtonClass | ListItemClass | DropdownListClass | TextSelectorClass | SelectCardClass | AvatarClass | BadgeClass | BoxActionClass | TabsClass | HeaderClass | RadioFieldClass | SkeletonClass | OwnerClass | OwnerContainerClass;
