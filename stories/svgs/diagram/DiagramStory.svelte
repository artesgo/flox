<script>
	import Diagram from '../../../src/Svg/Diagram/Diagram.svelte';
  export let rects;
  export let svgPathProps;
</script>

<section>
  <div>
    <Diagram width={600} height={600} {rects} {svgPathProps} />
  </div>
</section>


<style>
  section {
    display: flex;
  }
  div {
    border: 1px solid black;
  }
</style>