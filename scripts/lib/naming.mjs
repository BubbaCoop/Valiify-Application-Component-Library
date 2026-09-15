/**
 * Component naming — the ONE definition of how a PascalCase component name maps
 * to a file slug and to a CSS class name.
 *
 * These two used to be the same string, and `kebab()` was copy-pasted into
 * new-component.mjs, verify-component.mjs and audit-components.mjs with a
 * "must match new-component.mjs:52" comment holding them together. The `va-`
 * namespace split them apart: the file stays `badge.css`, the class becomes
 * `.va-badge`. Three copies of that distinction would drift, and the drift
 * would only show up as a future component born unprefixed — which is how the
 * daisyUI collision happened in the first place.
 *
 * Why the namespace exists: daisyUI 4 (and Tailwind's own utilities) define
 * .btn, .badge, .modal, .avatar, .radio, .skeleton, .tab(s), .toast, .tooltip.
 * Our rules live in @layer components; daisyUI's are unlayered, and unlayered
 * wins before specificity is even consulted. Namespacing is the only fix that
 * works — see CLAUDE.md "Library Contracts".
 */

/** The library's class identity. Utilities use `va:`; component classes use `va-`. */
export const CLASS_PREFIX = "va";
export const CLASS_NAMESPACE = `${CLASS_PREFIX}-`;

/** IconButton -> icon-button. The FILE slug: src/components/<slug>.css. Never prefixed. */
export function slug(pascal) {
  return pascal.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * IconButton -> va-icon-button. The CSS class, with no leading dot.
 *
 * This is only the DEFAULT spelling a scaffold emits. Several components
 * deliberately diverge from their file slug (Button defines .va-btn, ListItem
 * defines .va-list-option because .list-item collided with Tailwind's own
 * display utility), so a generated class name is a starting point that the
 * extraction may rename — not a contract.
 */
export function className(pascal) {
  return CLASS_NAMESPACE + slug(pascal);
}
