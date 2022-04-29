<script>
  export let id = '';
  /**
   * @type {number}
   */
  export let col = 1;
  
  /**
   * @type {number}
   */
  export let row = 1;
  
  /**
   * @type {number}
   */
  export let colSpan = 1;
  
  /**
   * @type {number}
   */
  export let rowSpan = 1;
  $: style = `
    grid-column: ${col};
    grid-column-end: ${col + colSpan};
    grid-row: ${row};
    grid-row-end: ${row + rowSpan};
  `;
</script>

<div {style} data-testid={id}>
  <slot></slot>
</div>