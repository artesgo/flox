<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import Svg from '../Svg.svelte';
  import Connector from '../Path/Connector.svelte';
  import Rect from '../Rect/Rect.svelte';
  import Text from '../Text/Text.svelte';

  export let id;
  export let rects;
  export let width;
  export let height;
  export let svgPathProps;

  let store = writable([
    ...rects
  ]);
  let connections = writable([]);

  // onMount > init > 1
  function getEndRect(connectorId) {
    return rects.find(r => r.id === connectorId);
  }

  // onMount > init > 2
  function createConnector(startRect, endRect) {
    let { begin, end } = findClosestConnection(startRect, endRect);
    return {
      begin: { ...begin, id: startRect.id},
      end: { ...end, id: endRect.id},
    }
  }

  // onMount > init > createConnector
  function findClosestConnection(startRect, endRect) {
    let shortest;
    for (let key of Object.keys(startRect.connectionPoints)) {
      for (let otherKey of Object.keys(endRect.connectionPoints)) {
        let begin = addCoord2D(startRect.coord2D, startRect.connectionPoints[key]);
        let end = addCoord2D(endRect.coord2D, endRect.connectionPoints[otherKey]);
        let distance = getDistance(begin, end);
        if (!shortest || distance < shortest.distance) {
          shortest = {
            begin,
            end,
            distance,
          }
        }
      }
    }
    delete shortest.distance;
    return shortest;
  }

  // onMount > init > createConnector > findClosestConnection
  function addCoord2D(coordA, coordB) {
    return {
      x: coordA.x + coordB.x,
      y: coordA.y + coordB.y
    }
  }

  // onMount > 1
  function createConnectionPointOffsets(rect) {
    let ret = {
      left: {x: 0, y: 0},
      right: {x: 0, y: 0},
      top: {x: 0, y: 0},
      bottom: {x: 0, y: 0},
    };
    if (!(rect.coord2D && rect.rect2D)) {
      console.error('')
    } else {
      // connectionPointOffsets
      ret.left = { x: 0, y: rect.rect2D.height / 2};
      ret.right = { x: rect.rect2D.width, y: rect.rect2D.height / 2};
      ret.top = { x: rect.rect2D.width / 2, y: 0};
      ret.bottom = { x: rect.rect2D.width / 2, y: rect.rect2D.height};
    }
    return ret;
  }

  // onMount > init > createConnector > findClosestConnection
  function getDistance(coordA, coordB) {
    let xDiff = Math.abs(coordA.x - coordB.x);
    let yDiff = Math.abs(coordA.y - coordB.y);
    return xDiff + yDiff;
  }

  // onMount > 2
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
        // this moves the rectangle being dragged
        if (rect.id === r.id) {
          r.coord2D.x += e.detail.dx;
          r.coord2D.y += e.detail.dy;
        }
        return r;
      })
    ];

    // get the connections and update closest
    $connections = [...$connections.map((conn) => {
      // get rects
      let startRect = $store.find(r => r.id === conn.begin.id);
      let endRect = $store.find(r => r.id === conn.end.id);
      let {begin, end} = findClosestConnection(startRect, endRect);
      begin.id = conn.begin.id;
      end.id = conn.end.id;
      return {begin, end};
    })];

    // check if closest has changed
    
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
      // create connection points for rects
      r.connectionPoints = createConnectionPointOffsets(r);
    })];
    $store = [...rects.map(r => {
      // connect the connections
      if (r.connections && r.connections.length > 0) {
        $connections = [
          ...$connections,
          ...r.connections.map(connection => initConnectors(r, connection))
        ];
        console.log($connections);
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
    <Rect {...rect} draggable={true}
      on:drag={(e) => dragUpdate(e, rect)}
    />
    {#if !!rect.text}
      <Text {...rect} />
    {/if}
  {/each}
</Svg> 