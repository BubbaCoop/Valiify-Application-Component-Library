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

// A small application-form sampler built from real library components.
// Every class below ships in @valiify/shortapp-ui; the layout utilities
// (flex, gap-*, max-w-*) come from YOUR Tailwind build via the /source entry.
const app = document.getElementById("app");
app.innerHTML = `
  <main class="va:mx-auto va:flex max-w-md va:flex-col va:gap-6 p-8">
    <div>
      <h1 class="va:text-display va:text-content-primary">Open an account</h1>
      <p class="text-body va:text-content-secondary">
        A sampler of @valiify/shortapp-ui components.
        <span class="va-badge">v0.1</span>
      </p>
    </div>

    <div class="va-toast va-toast-success" role="status">
      <svg class="va-toast-icon" aria-hidden="true"><use href="#circle-check" /></svg>
      <div class="va-toast-content">
        <span class="va-toast-title">Setup complete</span>
        <span class="va-toast-body">The stylesheet compiled and the sprite loaded.</span>
      </div>
      <button class="va-icon-button" aria-label="Dismiss">
        <svg aria-hidden="true"><use href="#x" /></svg>
      </button>
    </div>

    <div class="va-text-field">
      <div class="va-text-field-title-row">
        <label class="va-text-field-title" for="fname">First name</label>
      </div>
      <div class="va-text-field-box">
        <input id="fname" class="va-text-field-input" type="text" placeholder="Jane" />
      </div>
    </div>

    <fieldset class="va-radio-field">
      <legend class="va-radio-field-title">Do you have an existing account?</legend>
      <div class="va-radio-field-options">
        <label class="va-radio-field-option">
          <input type="radio" name="existing" class="va-radio" checked /> Yes
        </label>
        <label class="va-radio-field-option">
          <input type="radio" name="existing" class="va-radio" /> No
        </label>
      </div>
    </fieldset>

    <label class="va:flex va:items-center va:justify-between">
      <span class="va:text-label va:text-content-secondary">Email notifications</span>
      <input type="checkbox" role="switch" class="va-switch" checked />
    </label>

    <div class="va:flex justify-end va:gap-4">
      <button class="va-btn va-btn-secondary">
        <svg aria-hidden="true"><use href="#arrow-left" /></svg>
        Back
      </button>
      <button class="va-btn va-btn-primary">
        Continue
        <svg aria-hidden="true"><use href="#arrow-right" /></svg>
      </button>
    </div>
  </main>
`;
