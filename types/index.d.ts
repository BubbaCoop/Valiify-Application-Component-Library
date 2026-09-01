/**
 * Type definitions for @valiify/shortapp-ui
 *
 * This package is CSS-only — it ships no JavaScript runtime and no Tailwind
 * plugin. These types exist purely to give editors autocomplete over the
 * component class names.
 *
 * Usage:
 *   import type { ButtonClass } from '@valiify/shortapp-ui/types';
 */

export * from "./components";

/** Allow `@import '@valiify/shortapp-ui'` in TS-checked CSS-in-JS setups. */
declare module "@valiify/shortapp-ui/index.css";
