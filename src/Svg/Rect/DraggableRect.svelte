<script>
  import { createEventDispatcher } from "svelte";
  import { spring } from 'svelte/motion';
	import { pannable } from '../pannable';
  import Text from "../Text/Text.svelte";

  let update = createEventDispatcher();
  /**
   * @typedef {{width: number; height: number;}} Rect2D
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
  export let passThrough = false;
  /** @type {boolean} */
  export let editable = true;
  /** @type {number} */
  export let zoom;
  /** @type {string}*/
  export let text;
  /** @type {number}*/
  export let grid = 0;
  /** @type {number}*/
  export let scale = 100;

  let dragging;
  let editing;
  let _coord = spring({x: 0, y: 0});;
  let _rect = spring({ width: 0, height: 0});

  $: _coord.update($_coord => {
    if (grid > 0) {
      return {
        x: Math.floor(coord2D.x / grid) * grid,
        y: Math.floor(coord2D.y / grid) * grid
      }
    }
    return {
      x: coord2D.x,
      y: coord2D.y
    }
  });
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
      update('dragStart');
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
</script>

<g
  tabindex=0
  class:no-events={passThrough}
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
  on:touchstart
  on:touchend
  on:contextmenu>
  <g
    use:pannable
    on:panstart={shouldUpdate}
    on:panmove={dragUpdate}
    on:panend={finishUpdate}>
    <rect {...rect2D} x={$_coord.x} y={$_coord.y} {...svgProps}
      width={$_rect.width > 0 ? $_rect.width : 0} height={$_rect.height > 0 ? $_rect.height : 0} />
  </g>
  <slot />
  <Text {rect2D} {coord2D} bind:editing={editing} text={text} on:updateText {scale}/>
</g>

<style>
  g:focus {
    outline: none;
  }
  .no-events {
    pointer-events: none; /* prevent capturing clicks */
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
  }
</style>