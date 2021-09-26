<script>
	import { onMount } from 'svelte';

  /**
   * @type {string}
   */
  export let id = "";
  /**
   * @type {boolean}
   */
  export let visible = false;
  const observer = new window.IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      visible = true;
    } else {
      visible = false;
    }
  });

  onMount(() => {
    if (!!id) {
      const el = document.getElementById(id);
      observer.observe(el);
    }
  })
</script>

<div id={id}>
  <slot />
</div>