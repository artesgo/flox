<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
  export let store;
  export let focused;
  let value = '';

  function up(rect) {
    store.moveRectUpLayer(rect);
  }

  function down(rect) {
    store.moveRectDownLayer(rect);
  }
  let undeleted = [];
  let unsub;
  onMount(() => {
    unsub = store.subscribe(rects => {
      if (rects && rects.length) {
        undeleted = rects.filter(rect => !rect.deleted);
      }
    });
  });

  onDestroy(() => unsub());
</script>

<section>
  <label for="search">Search: {value}</label>

  <div class="flex">
    <input bind:value id="search" />
    <button on:click={() => value = ''}>Clear</button>
  </div>
  {#each undeleted as rect, i (rect.id)}
    <div class="rect" class:focused={$focused === rect} on:click={() => $focused = rect}>
      <div class="flex">
        {#if i > 0}
          <button on:click={() => up(rect)}>Up</button>
        {:else}
          <div class="spacer"></div>
        {/if}
        {#if i < undeleted.length - 1}
          <button on:click={() => down(rect)}>Down</button>
        {/if}
      </div>
      {#if rect.text}
        <div>Text: {rect.text}</div>
      {/if}
      {#if rect.coord2D}
        <div>x: {Math.floor(rect.coord2D.x)} y: {Math.floor(rect.coord2D.y)}</div>
      {/if}
      {#if rect.image}
        <div>Image: {rect.image}</div>
      {/if}
    </div>
  {/each}
</section>

<style>
  .flex {
    display: flex;
    justify-content: space-between;
  }

  .rect {
    box-sizing: border-box;
    border: 1px solid black;
    padding: 1px;
    width: 200px;
    overflow: hidden;
  }

  .focused {
    border: 2px solid red;
    padding: 0px;
  }

  input {
    width: 80%;
  }

  section {
    width: 200px;
    background-color: #fefefe66;
  }
</style>