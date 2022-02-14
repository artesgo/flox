<script>
  import { onMount } from "svelte";
  export let loading = true;
  let panel = 0;

  onMount(() => {
    setInterval(() => {
      panel++;
      if (panel === 4) {
        panel = 0;
      }
    }, 300);
  });
</script>

{#if loading}
  <section>
    <div class="ab">
      <span class="panel panel--A" class:panel--hidden={panel === 0 || panel === 1}></span>
      <span class="panel panel--B" class:panel--hidden={panel === 1 || panel === 2}></span>
    </div>
    <div class="cd">
      <span class="panel panel--D" class:panel--hidden={panel === 3 || panel === 0}></span>
      <span class="panel panel--C" class:panel--hidden={panel === 2 || panel === 3}></span>
    </div>
  </section>
{/if}

<style lang="scss">
  section {
    display: flex;
    flex-direction: column;
  }
  span {
    display: inline-block;
    height: 24px;
    width: 24px;
    border: 2px solid #333;
  }

  .panel {
    transition: 900ms;
    &--hidden {
      opacity: 0;
    }
    &--A {
      background-color: #FC0;
    }
    &--B {
      background-color: #CF0;
    }
    &--C {
      background-color: #C0F;
    }
    &--D {
      background-color: #0FC;
    }
  }
</style>