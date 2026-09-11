<script>
  // b06–b10 — labelled text input. Markup is the library's TextField example
  // (CLAUDE.md › TextField), verbatim, including the error example's aria-invalid /
  // aria-describedby wiring and the .text-field-hint paragraph.
  //
  // States: empty is the default (the native ::placeholder paints it — §6, so no branch);
  // error is aria-invalid="true" on the input, which is what the library CSS selects on
  // (amber .text-field-box border, amber hint). No error CLASS is written (skill §10.2).
  //
  // widthClass carries the §11 two-up width at the call site (md:w-67 on b06 / b07, nothing
  // on b08–b10). The .text-field-help "?" slot is omitted: the brief asks for no help
  // affordance (skill §10.8 — component kept whole minus that optional part).
  /**
   * @type {{ id: string, label: string, type?: string, placeholder?: string,
   *          value?: string, error?: string, touched?: boolean, widthClass?: string,
   *          onblur?: (e: FocusEvent) => void }}
   */
  let {
    id,
    label,
    type = "text",
    placeholder = "",
    value = $bindable(""),
    error = "",
    touched = false,
    widthClass = "",
    onblur,
    ...rest
  } = $props();

  // `bind:value` cannot ride a dynamic `type`, so the input writes back explicitly;
  // the parent still binds with bind:value through $bindable.
  const invalid = $derived(touched && error !== "");
</script>

<div class="text-field {widthClass}" {...rest}>
  <div class="text-field-title-row">
    <label class="text-field-title" for={id}>{label}</label>
  </div>
  <div class="text-field-box">
    <input
      {id}
      class="text-field-input"
      {type}
      {placeholder}
      {value}
      oninput={(e) => (value = e.currentTarget.value)}
      {onblur}
      aria-invalid={invalid ? "true" : undefined}
      aria-describedby={invalid ? `${id}-hint` : undefined}
    />
  </div>
  {#if invalid}
    <p id="{id}-hint" class="text-field-hint">{error}</p>
  {/if}
</div>
