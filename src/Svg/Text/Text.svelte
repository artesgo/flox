<script>
  import { createEventDispatcher } from 'svelte';
  import { spring } from 'svelte/motion';

  /** @type {import("../Svg").Coord2D} */
  export let coord2D = {};
  /** @type {import("../Rect/DraggableRect").Rect2D} */
  export let rect2D = {};
  /** @type {string} */
  export let text = '';
  /** @type {import("../Svg").Coord2D} */
  export let padding = {
    x: 5,
    y: 5,
  };
  /** @type {number} */
  export let scale = 100;
  /** @type {boolean} */
  export let editing;
  $: if (editing) {
    setTimeout(() => {
      if (_input) {
        _input.focus();
      }
    }, 0);
  }

  let _input;
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
    <textarea style="font-size: {scale}%;"
      on:keydown|stopPropagation
      on:keyup|stopPropagation
      on:keypress|stopPropagation
      type="text" bind:value={text} bind:this={_input} on:blur={blur} />
  {:else}
    <pre style="font-size: {scale}%;">{text}</pre>
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
  pre {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    background: none;
    white-space: pre-wrap;
    text-overflow: ellipsis;
  }
  textarea {
    pointer-events: all;
    background: none;
    outline: none;
    border: none;
    height: 100%;
    width: 100%;
    resize: none;
  }
</style>