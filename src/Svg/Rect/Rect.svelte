<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { spring } from 'svelte/motion';
	import { pannable } from '../pannable';

  let update = createEventDispatcher();
  /**
   * @typedef {{width: number; height: number; }} Rect2D
   */

  /**
   * @type {Rect2D}
   */
  export let rect2D;

  /**
   * @type {import("../Svg").Coord2D}
   */
  export let coord2D;

  /**
   * @type {import("../Svg").NativeSvgProps}
   */
  export let svgProps;

  /**
   * @type {boolean}
   */
  export let draggable;
  export let id;
  let contextStore;
  let dragging;

  let _coord = spring({ x: 0, y: 0 });

  function dragUpdate(e) {
    if (dragging) {
      _coord.update($_coord => ({
        x: $_coord.x + e.detail.dx,
        y: $_coord.y + e.detail.dy,
      }));
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
      update('update', {
        id,
        x: $_coord.x,
        y: $_coord.y
      });
    }
  }

  onMount(() => {
    // contextStore = getContext(id);
    _coord.set({ ...coord2D });
  });
</script>

<rect x={$_coord.x} y={$_coord.y} {...rect2D} {...svgProps}
  use:pannable
  on:panstart={shouldUpdate}
  on:panmove={dragUpdate}
  on:panend={finishUpdate}
/>