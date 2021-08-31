<script>
  import { writable } from 'svelte/store';
  import Svg from '../Svg.svelte';
  import Connector from '../Path/Connector.svelte';
	import { pannable } from '../pannable';
  import { onMount } from 'svelte';

  export let id;
  export let rects;
  export let width;
  export let height;
  export let svgPathProps;

  let store = writable([
    ...rects
  ]);
  let connections = writable([]);

  function getEndRect(connectorId) {
    return rects.find(r => r.id === connectorId);
  }

  function createConnector(startRect, endRect) {
    let horizontal;
    horizontal = startRect.coord2D.x + startRect.rect2D.width < endRect.coord2D.x;
    return {
      begin: {x: startRect.coord2D.x, y: startRect.coord2D.y, id: startRect.id},
      end: {x: endRect.coord2D.x, y: endRect.coord2D.y, id: endRect.id},
      horizontal,
    }
  }

  function initConnectors(rect, connectionId) {
    let endRect = getEndRect(connectionId);
    return createConnector(rect, endRect);
  }

  /**
   * 
   * @param e { x, y, dx, dy }
   * @param rect that is being dragged
   */
  function dragUpdate(e, rect) {
    $store = [
      ...$store.map(r => {
        if (rect.id === r.id) {
          r.coord2D.x += e.detail.dx;
          r.coord2D.y += e.detail.dy;
        }
        return r;
      })
    ];

    $connections = [
      ...$connections.map(conn => {
        if (conn.begin.id === rect.id) {
          conn.begin.x += e.detail.dx;
          conn.begin.y += e.detail.dy;
        } else if (conn.end.id === rect.id) {
          conn.end.x += e.detail.dx;
          conn.end.y += e.detail.dy;
        }
        return conn;
      })
    ];
  }
  onMount(() => {
    $store = [...rects.map(r => {
      if (r.connections && r.connections.length > 0) {
        $connections = [
          ...$connections,
          ...r.connections.map(connection => initConnectors(r, connection))
        ];
      }
      return r;
    })];
  });
</script>

<Svg {height} {width} {id}>
  {#each $connections as connection}
    <Connector {...connection} svgProps={svgPathProps} />
  {/each}
  {#each $store as rect}
    <rect x={rect.coord2D.x} y={rect.coord2D.y} {...rect.rect2D} {...rect.svgProps}
      use:pannable
      on:panmove={(e) => dragUpdate(e, rect)}
    />
      <!-- on:panend={() => finishUpdate()} -->
      <!-- on:panstart={() => shouldUpdate()} -->
  {/each}
</Svg> 