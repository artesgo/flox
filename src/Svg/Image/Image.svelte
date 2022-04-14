<script context="module">
  let _prefix = 'flox-img--'; 
</script>

<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { spring } from 'svelte/motion';
  
  const resizeEvent = createEventDispatcher();
  
  /** @type {import("../Svg").Coord2D} */
  export let coord2D = {
    x: 0,
    y: 0,
  };
  /** @type {import("../Rect/DraggableRect").Rect2D} */
  export let rect2D;
  /** @type {string} */
  export let image = '';
  /** @type {string|number} */
  export let id = '';
  /** @type {boolean} */
  export let passThrough = false;
  /** @type {boolean} */
  export let trueSize = true;

  let _coord = spring({ x: 0, y: 0 });
  let _rect = spring({ width: 0, height: 0 });
  let hasImage = false;

  $: _coord.update($_coord => coord2D);
  
  $: _rect.update($_rect => ({
    width: rect2D.width,
    height: rect2D.height
  }));

  onMount(() => {
    _coord.set({...coord2D});

    // 
    if (trueSize) {
      resizeToTrueSize();
    }
  });

  function resizeToTrueSize() {
    const img = new Image();
    img.onload = (e) => {
      hasImage = true;
      let { width, height } = e.path[0];
      resizeEvent('resize', {
        width,
        height
      });
    }
    img.src = image;
  }
</script>

{#if hasImage || !trueSize}
  <image
    id={`${_prefix}${id}`}
    class:no-events={passThrough} href={image} 
    x={$_coord.x}
    y={$_coord.y}
    width={$_rect.width < 0 ? 0 : $_rect.width}
    height={$_rect.height < 0 ? 0: $_rect.height}
  ></image>
{/if}

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