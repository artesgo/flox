<script>
  import { onMount } from "svelte";

  /**
   * @type {import("../Svg").Coord2D}
   */
  export let begin;

  /**
   * @type {import("../Svg").Coord2D}
   */
  export let end;

  /**
   * @type {import("../Svg").NativeSvgProps}
   */
  export let svgProps;

  /**
   * @type {boolean}
   */
  export let horizontal = true;
  // export let id;
  let path;

  $: if (horizontal) {
    let oneHalfX = (end.x - begin.x) / 2;
    path = `M${begin.x},${begin.y} L${begin.x + oneHalfX},${begin.y} L${begin.x + oneHalfX},${end.y} L${end.x},${end.y}`;    
  } else {
    let oneHalfY = (end.y - begin.y) / 2;
    path = `M${begin.x},${begin.y} L${begin.x},${begin.y + oneHalfY} L${end.x},${begin.y + oneHalfY} L${end.x},${end.y}`;    
  }
</script>

<path d={path} {...svgProps} />
<!-- TODO: create repositioning widget -->