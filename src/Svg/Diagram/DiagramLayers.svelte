<script lang="ts">
  export let store;
  export let focused;
  let value;

  function up(rect) {
    store.moveRectUpLayer(rect);
  }

  function down(rect) {
    store.moveRectDownLayer(rect);
  }
</script>

<section>
  <div>Layers / Props Search:{value}</div>

  <div class="flex">
    <input bind:value />
    <button on:click={() => value = ''}>Clear</button>
  </div>
  
  {#each $store as rect (rect.id)}
    {#if !value || (rect.text && rect.text.indexOf(value) > -1)}
      <div class="rect" class:focused={$focused === rect.id} on:click={() => $focused = rect.id}>
        <div class="flex">
          ID: {rect.id || ''}
          <div>
            <button on:click={() => up(rect)}>Up</button>
            <button on:click={() => down(rect)}>Down</button>
          </div>
        </div>
        <div>Text: {rect.text || ''}</div>
        {#if rect.coord2D}
          <div>x: {Math.floor(rect.coord2D.x)} y: {Math.floor(rect.coord2D.y)}</div>
        {/if}
        <div>Image: {rect.image || ''}</div>
      </div>
    {/if}
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