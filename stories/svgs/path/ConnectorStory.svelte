<script>
	import Connector from '../../../src/Svg/Path/Connector.svelte';
  import Svg from '../../../src/Svg/Svg.svelte';

  let begin = { x: 20, y: 20 };
  let end = { x: 200, y: 200 };
  let begin2 = { x: 40, y: 40 };
  let end2 = { x: 100, y: 100 };
  let svgProps = {
      stroke: '#333',
      fill: 'none',
      'stroke-width': '8px',
      'stroke-linecap': 'round',
  };
  let svgProps2 = {
      stroke: '#FC0',
      fill: 'none',
      'stroke-width': '4px',
      'stroke-linecap': 'round',
  };
</script>

<Svg height={300} width={300}>
  <Connector {begin} {end} {svgProps} />
  <Connector {begin} {end} svgProps={svgProps2} />
  <Connector begin={begin2} end={end2} {svgProps} horizontal={false} />
  <Connector begin={begin2} end={end2} svgProps={svgProps2} horizontal={false} />
</Svg>