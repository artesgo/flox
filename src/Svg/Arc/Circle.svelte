<script>
  import { onMount } from "svelte";
  import { spring } from 'svelte/motion';
  /**
   * @typedef {{ cx: number; cy: number; r: number; }} Circle2D
   */

  /**
   * @type {Circle2D}
   */
  export let circle2D;

  /**
   * @type {import("../Svg").NativeSvgProps}
   */
  export let svgProps;
  
  let _circle = spring({ cx: 0, cy: 0, r: 0 });
  
  onMount(() => {
    _circle.set({ ...circle2D });
  });
  
  $: _circle.update($_circle => (circle2D));
</script>

<circle 
  cx={$_circle.cx} cy={$_circle.cy} r={$_circle.r >= 0 ? $_circle.r : 0} {...svgProps} 
  on:mousedown
  on:mouseup
/>