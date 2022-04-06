<script>
	import Diagram from '../../../src/Svg/Diagram/Diagram.svelte';
  export let rects;
  export let svgPathProps;
  let clientHeight;
  let clientWidth;
</script>

<section bind:clientHeight bind:clientWidth>
  <Diagram width={clientWidth - 250} height={clientHeight} {rects} {svgPathProps} />
</section>


<style>
  section {
    display: flex;
    height: 90vh;
  }
</style>