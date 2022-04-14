<script>
  import { spring } from 'svelte/motion';

  /** @type {import("./DraggableRect").Rect2D} */
  export let rect2D;
  /** @type {import("../Svg").NativeSvgProps} */
  export let svgProps;

  let _rect2D = spring({ coord2D: { x: 0, y: 0 }, width: 0, height: 0 });
  $: _rect2D.update($_rect2D => (rect2D));
</script>

<rect x={$_rect2D.coord2D.x} y={$_rect2D.coord2D.y} {...rect2D} {...svgProps} 
  on:mousedown
  on:mouseup />
