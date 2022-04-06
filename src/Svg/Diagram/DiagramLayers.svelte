<script lang="ts">
  export let store;
  export let focused;

  function up(rect) {
    const index = $store.findIndex(r => r.id === rect.id);
    if (index > 0) {
      const end = $store.splice(index + 1, $store.length - 1);
      const front = $store.splice(0, index);
      const swap = front.pop();
      $store = [
        ...front,
        rect,
        swap,
        ...end,
      ]
    }
  }

  function down(rect) {
    const index = $store.findIndex(r => r.id === rect.id);
    if (index < $store.length) {
      const end = $store.splice(index + 1, $store.length - 1);
      const front = $store.splice(0, index);
      const swap = end.shift();
      $store = [
        ...front,
        swap,
        rect,
        ...end,
      ]
    }
  }
</script>

<div>
  Layers / Props
  {#each $store as rect (rect.id)}
    <div class="rect" class:focused={$focused === rect.id} on:click={() => $focused = rect.id}>
      <div class="flex">
        ID: {rect.id || ''}
        <div>
          <button on:click={() => up(rect)}>Up</button>
          <button on:click={() => down(rect)}>Down</button>
        </div>
      </div>
      <div>Text: {rect.text || ''}</div>
      <div>Coords: x{rect.coord2D.x} y{rect.coord2D.y}</div>
      <div>Image: {rect.image || ''}</div>
    </div>
  {/each}
</div>

<style>
  .flex {
    display: flex;
    justify-content: space-between;
  }
  .rect {
    border: 1px solid black;
    padding: 1px;
    width: 200px;
    overflow: hidden;
  }
  .focused {
    border: 2px solid red;
    padding: 0px;
  }
</style>