<script>
  // b03 — title block. §11 "Title block" recipe, verbatim:
  // type-eyebrow row (text-content-tertiary run + text-primary-text section)
  // › text-display text-content-primary › text-input text-content-secondary, gap-2.
  // Casing is the transform: type-eyebrow renders STEP 3 OF 10 / PRIMARY CONTACT
  // from the sentence-case strings below (§8, skill §10.10).
  /** @type {{ step: string, section: string, title: string, description: string }} */
  let { step, section, title, description } = $props();
</script>

<div class="flex flex-col gap-2" data-block="b03">
  <p class="type-eyebrow text-content-tertiary">
    {step} / <span class="text-primary-text">{section}</span>
  </p>
  <h1 class="text-display text-content-primary">{title}</h1>
  <p class="text-input text-content-secondary">{description}</p>
</div>
