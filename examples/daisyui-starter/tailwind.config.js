/**
 * Tailwind 3 + daisyUI 4 — the host app's stack (shortapp-web), not ours.
 *
 * The library ships dist/shortapp-ui.css, compiled by Tailwind 4 and imported here
 * as a plain stylesheet; this config never sees it. That is the point: a consumer's
 * Tailwind major is irrelevant to a prebuilt bundle. What this config DOES do is
 * emit Tailwind 3's preflight — `@tailwind base` — unlayered and after our import,
 * which is exactly the host reset check-no-bleed.mjs measures our components under.
 */
export default {
  content: ["./index.html", "./src/**/*.{js,ts}"],
  plugins: [require("daisyui")],
};
