<script>
  import { createEventDispatcher } from "svelte";
  import { spring } from 'svelte/motion';
	import { pannable } from '../pannable';
  import Text from "../Text/Text.svelte";

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
  /** @type {boolean} */
  export let editable = true;
  /** @type {number} */
  export let zoom;
  /** @type {string}*/
  export let text;

  let dragging;
  let editing;
  let _coord = spring(coord2D);
  let _rect = spring(rect2D);

  $: _coord.update($_coord => ({
    x: coord2D.x,
    y: coord2D.y
  }));
  $: _rect.update($_rect => ({
    width: rect2D.width,
    height: rect2D.height
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
  on:dblclick={() => {
    if (editable) {
      editing = true;
    }
  }}
  on:keydown
  on:keyup
  on:keypress
  on:contextmenu>
  <g 
    use:pannable
    on:panstart={shouldUpdate}
    on:panmove={dragUpdate}
    on:panend={finishUpdate}>
    <rect {...rect2D} x={$_coord.x} y={$_coord.y} width={$_rect.width} height={$_rect.height} {...svgProps} />
  </g>
  <slot />
  <Text {rect2D} {coord2D} bind:editing={editing} text={text} on:updateText/>
</g>

<style>
  g:focus {
    outline: none;
  }
</style>