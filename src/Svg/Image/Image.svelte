<script>
  import { onMount } from 'svelte';
  import { spring } from 'svelte/motion';
  
  /** @type {import("../Svg").Coord2D} */
  export let coord2D = {
    x: 0,
    y: 0,
  };
  /** @type {import("../Svg").Coord2D} */
  export let rect2D = {};
  /** @type {string} */
  export let image = '';
  /** @type {boolean} */
  export let passThrough = false;

  let _coord = spring({ x: 0, y: 0 });
  let _rect = spring({ width: 0, height: 0 });

  $: _coord.update($_coord => coord2D);
  
  $: _rect.update($_rect => ({
    width: rect2D.width,
    height: rect2D.height
  }));

  onMount(() => {
    _coord.set({...coord2D});
  });
</script>

<image class:no-events={passThrough} href={image} 
  x={isNaN($_coord.x) ? 0 : $_coord.x}
  y={isNaN($_coord.y) ? 0 : $_coord.y}
  width={$_rect.width < 0 ? 0 : $_rect.width}
  height={$_rect.height < 0 ? 0: $_rect.height}
  on:click={console.log($_coord)}
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