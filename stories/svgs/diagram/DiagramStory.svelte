<script>
	import Diagram from '../../../src/Svg/Diagram/Diagram.svelte';
  export let rects;
  export let svgPathProps;
  let clientWidth;
  let clientHeight;
  let show = {
    template: true,
    controls: true,
    layers: false,
    descriptions: true,
  }

  $: max = Math.max(clientWidth, clientHeight);
</script>

<section bind:clientWidth bind:clientHeight>
  <!-- height / width need to be the same to scale correctly... -->
  <Diagram width={max} height={max} {rects} {svgPathProps} {show}/>
</section>


<style>
  section {
    display: flex;
    height: 90vh;
  }
</style>