/// <reference types="vite/client" />

/**
 * Type declarations for Vite-specific import patterns
 */

// SVG imports with ?url suffix return the file URL as a string
declare module "*.svg?url" {
  const url: string;
  export default url;
}

// Raw SVG imports return the SVG content as a string
declare module "*.svg" {
  const content: string;
  export default content;
}
