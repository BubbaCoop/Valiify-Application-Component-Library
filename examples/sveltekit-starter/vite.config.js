import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

// No Tailwind in this host at all. The library's prebuilt bundle is a plain
// stylesheet, and the thing under test is what SvelteKit itself does to CSS.
export default defineConfig({ plugins: [sveltekit()] });
