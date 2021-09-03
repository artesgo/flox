<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import Svg from '../Svg.svelte';
  import Connector from '../Path/Connector.svelte';
  import Rect from '../Rect/Rect.svelte';
  import Text from '../Text/Text.svelte';
  import Circle from '../Arc/Circle.svelte';

  export let id;
  export let rects;
  export let width;
  export let height;
  export let svgPathProps;

  let store = writable([
    ...rects
  ]);
  let connections = writable([]);
  let dragging = false;
  let focused = writable(null);
  let mouseover = writable(null);

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
    dragging = true;
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

  function dragEnd() {
    dragging = false;
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
      }
      return r;
    })];
  });

  function addAt(e) {
    let s = [...$store];
    let [sample, ...rest] = s.reverse();
    let newRect = {
      ...sample
    }
    newRect.coord2D = {
      x: e.offsetX,
      y: e.offsetY,
    }
    newRect.id = sample.id + 1;
    $store = [...$store, newRect];
  }

  function focusRect(rect) {
    if (!dragging) {
      $focused = rect.id;
    }
  }
  
  function blurRect() {
    if (!dragging) {
      $focused = null;
    }
  }

  function over(rect) {
    if (!dragging) {
      $mouseover = rect.id;
    }
  }

  function out() {
    if (!dragging) {
      $mouseover = null;
      $focused = null;
    }
  }

  function updateText(rect, event) {
    event.stopPropagation();
    rect.text = 'a';
  }

  function deleteRect(rect, event) {
    $store = [
      ...$store.filter(r => {
        return r.id !== rect.id;
      })
    ];
    $connections = [
      ...$connections.filter(conn => {
        return conn.begin.id !== rect.id && conn.end.id !== rect.id;
      })
    ]
  }

  function deleteConnection(conn) {
    $connections = [
      ...$connections.filter(c => {
        return !(c.begin.id === conn.begin.id &&
          c.end.id === conn.end.id)
      })
    ]
  }

  function createNewConnection(e) {
    console.log('start', e);
  }
  
  function endNewConnection(e) {
    console.log('end', e);
  }

  function setMousePos(e) {
    console.log('setMousePos', e);
  }
</script>

<div on:dblclick={addAt} on:contextmenu|preventDefault on:mousemove={setMousePos}>
  <Svg {height} {width} {id}>
    {#each $connections as connection (`${connection.begin.id}${connection.end.id}`)}
      <Connector on:contextmenu={() => deleteConnection(connection)} {...connection} svgProps={svgPathProps} />
    {/each}
    {#each $store as rect (rect.id)}
      <g>
        <Rect {...rect} draggable={true}
          on:drag={(e) => dragUpdate(e, rect)}
          on:dragEnd={dragEnd}
          on:mouseover={() => focusRect(rect)}
          on:mouseleave={() => blurRect(rect)}
          on:focus={() => over(rect)}
          on:blur={() => out(rect)}
          on:dblclick={(e) => updateText(rect, e)}
          on:contextmenu={(e) => deleteRect(rect, e)}
        >
          {#if !!rect.connectionPoints}
            {#each Object.keys(rect.connectionPoints) as point}
              <Circle
                on:mousedown={(e) => {createNewConnection(e)}}
                on:mouseup={(e) => {endNewConnection(e)}}
                circle2D={{
                  cx: rect.connectionPoints[point].x + rect.coord2D.x,
                  cy: rect.connectionPoints[point].y + rect.coord2D.y,
                  r: $focused === rect.id ? 5 : 
                    $mouseover === rect.id ? 2 : 0}} />
            {/each}
          {/if}
        </Rect>
        {#if !!rect.text}
          <Text {...rect} />
        {/if}
      </g>
    {/each}
  
    <!-- Done -->
    <!-- Render Shapes from data binding -->
    <!-- Render Connections -->
    <!-- dynamically update connection points -->
    <!-- double click to add at mouse position -->
    <!-- hover Rect to view attachment points -->
    <!-- right click rect to delete -->
    <!-- right click connections to delete -->

    <!-- WIP -->
    <!-- drag attachment points to create new Rect -->
    <!-- drag attachment points to existing Rect -->
    <!-- double click to edit text entry -->

    <!-- MVP -->
    <!-- create drag and drop template for new objects -->
    <!-- Edit Text Resizes Rect -->
    <!-- Edit Text Constrain Width: Multiline -->
    <!-- Edit Text Constrain Height: Single Line -->
    
    <!-- Next Version -->
    <!-- navigate canvas click and drag -->
    <!-- drag and adjust connection midpoints -->
    <!-- right click context menu -->
    <!-- right click context menu settings -->
    <!-- settings menu -->
    <!-- settings menu radius, text entry -->
    <!-- snap to grid -->
  </Svg>
</div>