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

  let path;
  onMount(() => {
    path = `M${begin.x},${begin.y} L${end.x},${end.y}`;    
  });
</script>

<path d={path} {...svgProps}/>