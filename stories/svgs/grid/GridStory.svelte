<script>
	import GridItem from './../../../src/components/Grid/GridItem.svelte';
	import Grid from '../../../src/components/Grid/Grid.svelte';
  export let height;
  export let colTemplate;
  export let rowTemplate;
</script>

<Grid {height} {colTemplate} {rowTemplate}>
  <GridItem col={1} row={1}>1</GridItem>
  <GridItem col={2} row={1}>2</GridItem>
  <GridItem col={3} row={1}>3</GridItem>
  <GridItem col={1} row={2} colSpan={2}>
    <div>col span 2</div>
  </GridItem>
  <GridItem col={3} row={2}>3</GridItem>
  <GridItem col={1} row={3}>1</GridItem>
  <GridItem col={2} row={3}>2</GridItem>
  <GridItem col={3} row={3}>3</GridItem>
</Grid>

<style>
div {
  background: red;
  width: 100%;
  height: 100%;
}
</style>