<script>
	import Diagram from '../../../src/Svg/Diagram/Diagram.svelte';
  export let rects;
  export let svgPathProps;
  let clientWidth;
</script>

<section bind:clientWidth>
  <!-- height / width need to be the same to scale correctly... -->
  <Diagram width={clientWidth} height={clientWidth} {rects} {svgPathProps} />
</section>


<style>
  section {
    display: flex;
    height: 90vh;
  }
</style>