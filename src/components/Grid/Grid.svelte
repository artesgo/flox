<script>
  export let rowTemplate = '1fr';
  export let colTemplate = '1fr';
  export let height = 'auto';
</script>

<section style="grid-template-rows: {rowTemplate}; grid-template-columns: {colTemplate}; height: {height};">
  <slot></slot>
</section>

<style>
  section {
    display: grid;
    display: -ms-grid;
  }
</style>