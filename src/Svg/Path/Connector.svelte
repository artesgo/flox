<script>
  import { spring } from 'svelte/motion';

  /**
   * @type {import("../Svg").Coord2D}
   */
  export let begin;

  /**
   * @type {import("../Svg").Coord2D}
   */
  export let end;

  /**
   * @type {import("../Svg").NativeSvgProps}
   */
  export let svgProps;

  /**
   * @type {boolean}
   */
  export let horizontal = true;

  let path;
  let _begin = spring(begin);
  let _end = spring(end);

  // this listens on updates from outside component and animates changes
  $: _begin.update(($animatedBegin) => begin);
  $: _end.update(($animatedEnd) => end);

  $: if (horizontal) {
    let oneHalfX = ($_end.x - $_begin.x) / 2;
    path = `M${$_begin.x},${$_begin.y} L${$_begin.x + oneHalfX},${$_begin.y} L${$_begin.x + oneHalfX},${$_end.y} L${$_end.x},${$_end.y}`;    
  } else {
    let oneHalfY = ($_end.y - $_begin.y) / 2;
    path = `M${$_begin.x},${$_begin.y} L${$_begin.x},${$_begin.y + oneHalfY} L${$_end.x},${$_begin.y + oneHalfY} L${$_end.x},${$_end.y}`;    
  }
</script>

<path d={path} {...svgProps} />
<!-- <rect ></rect> -->