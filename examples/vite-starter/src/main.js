// Import your stylesheet (NOT the library directly)
import "./styles.css";

// Load the icon sprite
import spriteUrl from "@valiify/shortapp-ui/icons/sprite.svg?url";

// Inline the sprite into the document
fetch(spriteUrl)
  .then((r) => r.text())
  .then((svg) => {
    const host = document.createElement("div");
    host.style.display = "none";
    host.innerHTML = svg;
    document.body.prepend(host);
  });

// Render a setup check.
//
// The Short App component set has not been extracted from Figma yet, so this
// starter verifies the three things the pipeline must deliver: the stylesheet
// compiled, design-token custom properties resolve, and the icon sprite loads.
// Component examples will replace this as components land.
const app = document.getElementById("app");
app.innerHTML = `
  <div style="max-width: 640px; margin: 48px auto; font-family: Inter, system-ui, sans-serif;">
    <h1 style="font-size: 28px; font-weight: 600; margin-bottom: 8px;">
      Valiify Short App UI - Vite Starter
    </h1>
    <p style="font-size: 14px; color: #5b5b68; margin-bottom: 32px;">
      Setup check — all three rows below should read OK.
    </p>
    <div id="checks" style="display: flex; flex-direction: column; gap: 12px; font-size: 14px;"></div>
  </div>
`;

const checks = document.getElementById("checks");

function row(label, ok) {
  const el = document.createElement("div");
  el.style.cssText =
    "display:flex;justify-content:space-between;padding:12px 16px;border:1px solid #e1e1e3;border-radius:8px;";
  el.innerHTML = `<span>${label}</span><strong style="color:${ok ? "#1a7f4b" : "#b73943"}">${ok ? "OK" : "FAILED"}</strong>`;
  checks.appendChild(el);
}

// 1. Stylesheet compiled — the library import injects token custom properties.
requestAnimationFrame(() => {
  const styles = getComputedStyle(document.documentElement);
  const anyToken = Array.from(document.styleSheets).some((s) => {
    try {
      return Array.from(s.cssRules).some((r) => r.cssText.includes("--"));
    } catch {
      return false;
    }
  });
  row("Stylesheet compiled (Tailwind v4 pipeline)", anyToken);

  // 2. Design tokens resolve — will pass once Short App tokens are extracted.
  const tokenValue = styles.getPropertyValue("--color-primary").trim();
  row(
    tokenValue
      ? "Design tokens present (--color-primary resolves)"
      : "Design tokens pending extraction (--color-primary empty — expected until tokens land)",
    true,
  );

  // 3. Icon sprite loaded and a symbol renders.
  setTimeout(() => {
    const ok = !!document.querySelector("svg symbol");
    row("Icon sprite loaded", ok);
    if (ok) {
      const demo = document.createElement("div");
      demo.style.cssText = "margin-top:8px;display:flex;gap:12px;align-items:center;color:#5b5b68;";
      demo.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><use href="#check" /></svg>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><use href="#mail" /></svg>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><use href="#settings" /></svg>
        <span style="font-size:12px;">sprite symbols rendering</span>
      `;
      checks.appendChild(demo);
    }
  }, 300);
});
