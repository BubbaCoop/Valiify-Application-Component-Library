<!--
  Case 3 — the remedy for case 2. Exclude library controls from the scoped element
  selector: `button:not([class*="va-"])`. The dev's own plain button still gets the
  reset; ours is never matched, so specificity never enters into it. (Scoping the
  reset by class — `.plain { }` — works the same way and reads better; this form
  is shown because it is the mechanical edit to an existing element reset.)
-->
<div class="row">
  <button id="remedy-trigger" class="va-dropdown-field-trigger" type="button" aria-haspopup="listbox" aria-expanded="false">
    <span class="va-dropdown-field-value va-dropdown-field-value-placeholder">scoped reset that excludes [class*="va-"]</span>
  </button>
  <button id="remedy-plain" type="button">the component's own plain button</button>
  <button id="remedy-primary" class="va-btn va-btn-primary" type="button">Continue</button>
</div>

<style>
  button:not([class*="va-"]) {
    border: 0;
    padding: 0;
  }
  .row {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
</style>
