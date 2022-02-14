<script>
  import { onMount } from 'svelte';
  import { spring } from 'svelte/motion';
  
  /** @type {import("../Svg").Coord2D} */
  export let coord2D = {};
  /** @type {import("../Svg").Coord2D} */
  export let rect2D = {};
  /** @type {string} */
  export let text = '';
  /** @type {import("../Svg").Coord2D} */
  export let padding = {
    x: 0,
    y: 0,
  };
  /** @type {boolean} */
  export let passThrough = false;

  let _coord = spring({ x: 0, y: 0 });

  $: _coord.update($_coord => ({
    x: coord2D.x + padding.x,
    y: coord2D.y + (rect2D.height / 2) + padding.y
  }));
</script>

<text class:no-events={passThrough} x={$_coord.x} y={$_coord.y}>
  {text}
</text>

<style>
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