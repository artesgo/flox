<script>
  import { onMount } from 'svelte';
  import { spring } from 'svelte/motion';
  
  /**
   * @type {import("../Svg").Coord2D}
   */
  export let coord2D;

  /**
   * @type {import("../Svg").Coord2D}
   */
  export let rect2D;

  /**
   * @type {string}
   */
  export let image;

  /**
   * @type {boolean}
   */
  export let passThrough = false;

  let _coord = spring({ x: 0, y: 0 });
  let _rect = spring({ width: 0, height: 0 });

  $: _coord.update($_coord => ({
    x: coord2D.x,
    y: coord2D.y
  }));
  
  $: _rect.update($_rect => ({
    width: rect2D.width,
    height: rect2D.height
  }));

  onMount(() => {
    _coord.set($_coord => coord2D);
  });
</script>

<image class:no-events={passThrough} href={image} x={$_coord.x} y={$_coord.y}
  width={$_rect.width}
  height={$_rect.height}
></image>

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