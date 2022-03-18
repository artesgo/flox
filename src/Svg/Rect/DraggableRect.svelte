<script>
  import { createEventDispatcher } from "svelte";
  import { spring } from 'svelte/motion';
	import { pannable } from '../pannable';

  let update = createEventDispatcher();
  /**
   * @typedef {{width: number; height: number; x?: number; y?: number }} Rect2D
   */
  /** @type {Rect2D} */
  export let rect2D = {};
  /** @type {import("../Svg").Coord2D} */
  export let coord2D = {};
  /** @type {import("../Svg").NativeSvgProps} */
  export let svgProps = {};
  /** @type {boolean} */
  export let draggable;
  /** @type {number} */
  export let zoom;
  let dragging;

  let _coord = spring(coord2D);

  $: _coord.update($_coord => ({
    x: coord2D.x,
    y: coord2D.y
  }));

  function dragUpdate(e) {
    if (dragging) {
      _coord.update($_coord => ({
        x: $_coord.x + (e.detail.dx * zoom / 100),
        y: $_coord.y + (e.detail.dy * zoom / 100),
      }));
      update('drag', e.detail);
    }
  }

  function shouldUpdate() {
    if (draggable) {
      dragging = true;
    }
  }

  function finishUpdate() {
    if (draggable) {
      dragging = false;
      update('dragEnd', {
        coord2D: $_coord
      });
    }
  }

  // onMount(() => {
  //   _coord.set({ ...coord2D });
  // });

  // TODO: resizeable
</script>

<g
  tabindex=0
  on:mouseover
  on:focus
  on:mouseleave
  on:blur
  on:mousedown
  on:mouseup
  on:click
  on:dblclick
  on:contextmenu>
  <g 
    use:pannable
    on:panstart={shouldUpdate}
    on:panmove={dragUpdate}
    on:panend={finishUpdate}>
    <rect x={$_coord.x} y={$_coord.y} {...rect2D} {...svgProps} />
  </g>
  <slot />
</g>

<style>
  g:focus {
    outline: none;
  }
</style>