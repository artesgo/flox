<script>
  import { createEventDispatcher } from 'svelte';
  import { spring } from 'svelte/motion';

  /** @type {import("../Svg").Coord2D} */
  export let coord2D = {};
  /** @type {import("../Svg").Coord2D} */
  export let rect2D = {};
  /** @type {string} */
  export let text = '';
  /** @type {import("../Svg").Coord2D} */
  export let padding = {
    x: 5,
    y: 5,
  };
  /** @type {boolean} */
  export let editing;
  $: if (editing) {
    setTimeout(() => {
      if (theInput) {
        theInput.focus();
      }
    }, 0);
  }

  let theInput;
  let _coord = spring({ x: 0, y: 0 });

  $: _coord.update($_coord => ({
    x: coord2D.x + padding.x,
    y: coord2D.y + (rect2D.height / 2) + padding.y
  }));

  const dispatch = createEventDispatcher();
  function blur() {
    dispatch('updateText', text)
    editing = false;
  }
</script>

<foreignObject 
  x={$_coord.x} y={$_coord.y - (rect2D.height / 2)} 
  width={rect2D.width - (padding.x * 2)} height={rect2D.height - (padding.y * 2)}>
  {#if editing}
     <!-- content here -->
    <textarea type="text" bind:value={text} bind:this={theInput} on:blur={blur}/>
  {:else}
    <p>{text}</p>
  {/if}
</foreignObject>

<style>
  foreignObject {
    padding: 0;
    margin: 0;
    pointer-events: none; /* prevent capturing clicks */
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
  }
  p {
    height: 100%;
    width: 100%;
  }
  textarea {
    pointer-events: all;
  }
</style>