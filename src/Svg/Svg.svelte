<script context="module">
  let _prefix = 'flox-svg--'; 
  let _id = 0;
</script>

<script>
  import { writable } from "svelte/store";
	import { setContext } from 'svelte';

  /**
   * @typedef {{ x: number; y: number; }} Coord2D
   * @typedef { 'round' | 'butt' | 'square'} Linecap
   * @typedef {{ 
   * fill: string; 
   * 'stroke-width': number; 
   * 'stroke-linecap': Linecap; 
   * stroke: string;
   * }} NativeSvgProps
   */

  let store = writable({x: 0, y: 0});
  /** @type {number} */
  export let width = undefined;
  /** @type {number} */
  export let height = undefined;
  /** @type {string} */
  export let id = `${_prefix}${_id++}`;
  setContext(id, store);
</script>

<svg {width} {height}>
  <slot></slot>
</svg>
