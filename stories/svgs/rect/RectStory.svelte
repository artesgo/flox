<script>
	import DraggableRect from '../../../src/Svg/Rect/DraggableRect.svelte';
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

  export let draggable;
</script>

<Svg height={300} width={300}>
  <DraggableRect {rect2D} {svgProps} {coord2D} {draggable} />
</Svg>