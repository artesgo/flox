<script>
	import Circle from '../../../src/Svg/Arc/Circle.svelte';
  import Svg from '../../../src/Svg/Svg.svelte';

  export let circle2D = {
    cx: 20,
    cy: 20,
    r: 20,
  }

  export let svgProps = {
    x: 0,
    y: 0,
    fill: '#FC0',
    stroke: '#333',
    'stroke-width': 3,
  }

  export let draggable;
</script>

<Svg height={300} width={300}>
  <Circle {circle2D} {svgProps} {draggable} />
</Svg>