<script>
  // b11 — web button row. §11 "Button row (web)": flex gap-6; .btn btn-secondary
  // (+ #arrow-left) · .btn btn-primary flex-1 (+ #arrow-right); in flow, never sticky (§1.1).
  // Button markup is the library's Button example (CLAUDE.md › Button), verbatim.
  //
  // hidden md:flex is the build's viewport switch: below md this row leaves the flow and the
  // sticky MobileActionBar (b12) carries the same two actions (§1.2). Both spellings are
  // sanctioned structural classes and the methodology names the choice.
  //
  // Disabled is the real :disabled state on the primary — .btn-primary:disabled paints the
  // brand at 30% with white ink (§6, §9.2 never a gray disabled primary). Back is never
  // disabled and runs no validation (brief § Actions).
  /** @type {{ continueEnabled?: boolean, onback?: () => void, oncontinue?: () => void }} */
  let { continueEnabled = false, onback, oncontinue } = $props();
</script>

<div class="hidden md:flex gap-6" data-block="b11">
  <button class="btn btn-secondary" type="button" onclick={onback}>
    <svg aria-hidden="true"><use href="#arrow-left" /></svg>
    Back
  </button>
  <button class="btn btn-primary flex-1" type="button" disabled={!continueEnabled} onclick={oncontinue}>
    Continue
    <svg aria-hidden="true"><use href="#arrow-right" /></svg>
  </button>
</div>
