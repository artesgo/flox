<script>
	import Rect from '../../../src/Svg/Rect/Rect.svelte';
  import Svg from '../../../src/Svg/Svg.svelte';

  export let rect2D = {
    width: 20,
    height: 20,
  }

  export let coord2D = {
    x: 20,
    y: 20,
  }

  export let svgProps = {
    fill: '#FC0',
    stroke: '#333',
    'stroke-width': 3,
  }
</script>

<Svg height={300} width={300}>
  <Rect {rect2D} {svgProps} {coord2D} />
</Svg>