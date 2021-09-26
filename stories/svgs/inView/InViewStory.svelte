<script>
	import InView from '../../../src/components/InView/InView.svelte';
  import { fade, fly, slide } from 'svelte/transition';
  let _fade;
  let _fly;
  let _slide;
  let _fade2;
  let _fly2;
  let _slide2;
</script>

<div>
  <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
</div>
<InView id="fader" bind:visible={_fade}>
  {#if _fade}
    <section transition:fade={{ duration: 2000 }}>
      Fade in
    </section>
  {/if}
</InView>
<div>
  <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
</div>

<InView id="flyer" bind:visible={_fly}>
  {#if _fly}
    <section transition:fly={{ duration: 2000, x: -500 }}>
      Fly in
    </section>
  {/if}
</InView>
<div>
  <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
</div>

<InView id="slider" bind:visible={_slide}>
  {#if _slide}
    <section transition:slide={{ duration: 500 }}>
      Slide in
    </section>
  {/if}
</InView>
<div>
  <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
</div>

<div class="grid">
  <InView id="flyer2" bind:visible={_fly2}>
    {#if _fly2}
      <section transition:fly={{ duration: 2000, x: -500 }}>
        Fly in
      </section>
    {/if}
  </InView>
  <InView id="slider2" bind:visible={_slide2}>
    {#if _slide2}
      <section transition:slide={{ duration: 500 }}>
        Slide in
      </section>
    {/if}
  </InView>
  <InView id="fader2" bind:visible={_fade2}>
    {#if _fade2}
      <section transition:fade={{ duration: 2000 }}>
        Fade in
      </section>
    {/if}
  </InView>
</div>

<div>
  <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
</div>

<style>
  section {
    padding: 3rem 2rem;
    background: #333;
    color: #FC0;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
</style>