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
  <main class="mx-auto flex max-w-md flex-col gap-6 p-8">
    <div>
      <h1 class="text-display text-content-primary">Open an account</h1>
      <p class="text-body text-content-secondary">
        A sampler of @valiify/shortapp-ui components.
        <span class="badge">v0.1</span>
      </p>
    </div>

    <div class="toast toast-success" role="status">
      <svg class="toast-icon" aria-hidden="true"><use href="#circle-check" /></svg>
      <div class="toast-content">
        <span class="toast-title">Setup complete</span>
        <span class="toast-body">The stylesheet compiled and the sprite loaded.</span>
      </div>
      <button class="icon-button" aria-label="Dismiss">
        <svg aria-hidden="true"><use href="#x" /></svg>
      </button>
    </div>

    <div class="text-field">
      <div class="text-field-title-row">
        <label class="text-field-title" for="fname">First name</label>
      </div>
      <div class="text-field-box">
        <input id="fname" class="text-field-input" type="text" placeholder="Jane" />
      </div>
    </div>

    <fieldset class="radio-field">
      <legend class="radio-field-title">Do you have an existing account?</legend>
      <div class="radio-field-options">
        <label class="radio-field-option">
          <input type="radio" name="existing" class="radio" checked /> Yes
        </label>
        <label class="radio-field-option">
          <input type="radio" name="existing" class="radio" /> No
        </label>
      </div>
    </fieldset>

    <label class="flex items-center justify-between">
      <span class="text-label text-content-secondary">Email notifications</span>
      <input type="checkbox" role="switch" class="switch" checked />
    </label>

    <div class="flex justify-end gap-4">
      <button class="btn btn-secondary">
        <svg aria-hidden="true"><use href="#arrow-left" /></svg>
        Back
      </button>
      <button class="btn btn-primary">
        Continue
        <svg aria-hidden="true"><use href="#arrow-right" /></svg>
      </button>
    </div>
  </main>
`;
