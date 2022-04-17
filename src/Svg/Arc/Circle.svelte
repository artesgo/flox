<script>
  import { spring } from 'svelte/motion';
  /**
   * @typedef {{ cx: number; cy: number; r: number; }} Circle2D
   */

  /** @type {Circle2D} */
  export let circle2D;
  /** @type {import("../Svg").NativeSvgProps} */
  export let svgProps;
  /** @type {number}*/
  export let grid = 0;
  
  let _circle = spring({ cx: circle2D.cx, cy: circle2D.cy, r: 0 });
  $: _circle.update($_circle => {
    if (grid > 0) {
      return {
        cx: Math.floor(circle2D.cx / grid) * grid,
        cy: Math.floor(circle2D.cy / grid) * grid,
        r: circle2D.r
      }
    }
    return {
      ...circle2D
    }
  });
</script>

<circle 
  cx={$_circle.cx} cy={$_circle.cy} r={$_circle.r >= 0 ? $_circle.r : 0} {...svgProps} 
  on:mousedown
  on:mouseup
/>