<script>
	import Diagram from '../../../src/Svg/Diagram/Diagram.svelte';
  export let rects;
  export let svgPathProps;
  let clientWidth;
  let clientHeight;

  $: max = Math.max(clientWidth, clientHeight);
</script>

<section bind:clientWidth bind:clientHeight>
  <!-- height / width need to be the same to scale correctly... -->
  <Diagram width={max} height={max} {rects} {svgPathProps} />
</section>


<style>
  section {
    display: flex;
    height: 90vh;
  }
</style>