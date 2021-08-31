<script>
	import Path from '../../../src/Svg/Path/Path.svelte';
  import Svg from '../../../src/Svg/Svg.svelte';

  let begin = { x: 20, y: 20 };
  let end = { x: 200, y: 200 };
  let svgProps = {
      stroke: '#333',
      'stroke-width': 3,
  };
</script>

<Svg height={300} width={300}>
  <Path {begin} {end} {svgProps} />
</Svg>