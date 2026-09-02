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

// Union of all component classes
export type ValiifyComponentClass = never | RadioClass | IconButtonClass | CheckboxClass | SwitchClass | ButtonClass | ListItemClass | DropdownListClass | TextSelectorClass | SelectCardClass | AvatarClass | BadgeClass | BoxActionClass;
