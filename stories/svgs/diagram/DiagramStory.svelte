<script>
	import Diagram from '../../../src/Svg/Diagram/Diagram.svelte';
  export let rects;
  export let svgPathProps;
</script>

<Diagram width={600} height={600} id={'diagramStory'} {rects} {svgPathProps}/>