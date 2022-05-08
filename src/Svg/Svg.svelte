<script>
	import { spring } from 'svelte/motion';
  /**
   * @typedef {{ x: number; y: number; }} Coord2D
   * @typedef { 'round' | 'butt' | 'square'} Linecap
   * @typedef {{ 
   * fill?: string; 
   * 'stroke-width'?: number; 
   * 'stroke-linecap'?: Linecap; 
   * stroke?: string;
   * }} NativeSvgProps
   */

  /** @type {number} */
  export let width = undefined;
  /** @type {number} */
  export let height = undefined;
  /** @type {number} */
  export let zoom;
  /** @type {Coord2D} */
  export let offset = {
    x: 0,
    y: 0,
  };

  let _offset = spring(offset);
  
  $: _offset.update(() => ({
    x: offset.x,
    y: offset.y
  }));
</script>

{#if width && zoom}
  <svg {width} {height} viewbox={`${$_offset.x} ${$_offset.y} ${zoom < 0 ? 0 : zoom} ${zoom < 0 ? 0 : zoom}`}>
    <slot></slot>
  </svg>
{/if}
