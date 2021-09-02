<script context="module">
  let _prefix = 'flox-svg--'; 
  let _id = 0;
</script>

<script>
  import { onMount } from "svelte";
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
  export let width;
  export let height;
  export let id = `${_prefix}${_id++}`;
  setContext(id, store);

  onMount(() => {
  });
</script>

<svg {width} {height}>
  <slot></slot>
</svg>
