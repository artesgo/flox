<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import Svg from '../Svg.svelte';
  import Connector from '../Path/Connector.svelte';
  import Rect from '../Rect/Rect.svelte';
  import Text from '../Text/Text.svelte';
  import Image from '../Image/Image.svelte';
  import Circle from '../Arc/Circle.svelte';

  /**
   * @typedef {{
   * connections: number[],
   * id: number,
   * text: string,
   * image: string,
   * rect2D: import("../Rect/Rect").Rect2D,
   * coord2D: import("../Svg").Coord2D,
   * svgPathProps: import("../Svg").NativeSvgProps,
   * }[]} DiagramProps
   */

  //#region props
  /**
   * @type {DiagramProps[]}
   */
  export let rects = [];
  /** @type {number} */
  export let width = 0;
  /** @type {number} */
  export let height = 0;
  /** @type {import("../Svg").NativeSvgProps} */
  export let svgPathProps;
  /** @type {import("../Svg").NativeSvgProps} */
  export let svgPropTemplate = {
    fill: '#FFCC00',
    stroke: '#333',
    'stroke-width': 2,
  };

  export let templates = [{
    connections: [],
    rect2D: {
      width: 20,
      height: 20,
      rx: 40,
      ry: 40
    },
    coord2D: {
      x: 10,
      y: 10,
    },
    svgProps: svgPropTemplate
  }, {
    connections: [],
    rect2D: {
      width: 20,
      height: 20,
      rx: 4,
      ry: 4,
    },
    coord2D: {
      x: 10,
      y: 40,
    },
    svgProps: svgPropTemplate
  }, {
    connections: [],
    rect2D: {
      width: 20,
      height: 20,
    },
    coord2D: {
      x: 10,
      y: 70,
    },
    svgProps: svgPropTemplate
  }];

  let selectedTemplate = 0;
  //#endregion

  //#region private props
  let _templates = [];
  let store = writable([
    ...rects
  ]);
  let connections = writable([]);
  let dragging = false;
  let focused = writable(null);
  let mouseover = writable(null);
  //#endregion

  //#region initialization
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
  //#endregion

  //#region dragging
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

  function dragEndTemplate(e, template) {
    dragging = false;
    addAt(e, template);
    _templates = [...templates];
  }
  //#endregion

  let _nextId = 0;
  onMount(() => {
    $store = [...rects.map(r => {
      // create connection points for rects
      if (r.id >= _nextId) {
        _nextId = r.id;
        _nextId++;
      }
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

    _templates = [...templates];
  });

  function addAt(e, template) {
    let coord = {
      x: 0,
      y: 0,
    }
    template.connectionPoints = createConnectionPointOffsets(template);
    //#region prevents fuzzy connections
    if (e.detail && e.detail.coord2D) {
      coord.x = Math.floor(e.detail.coord2D.x);
      coord.y = Math.floor(e.detail.coord2D.y);
    } else {
      coord.x = e.offsetX;
      coord.y = e.offsetY;
    }
    if (coord.x % 2 === 1) coord.x--;
    if (coord.y % 2 === 1) coord.y--;
    //#endregion
    if (coord.x > 40) {
      let newRect = {
        ...template
      }
      newRect.coord2D = coord;
      newRect.id = _nextId++;
      // resets template back to origin;
      $store = [...$store, newRect];
    }
  }

  //#region focus indicator
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
  //#endregion

  //#region text edit
  function updateText(rect, event) {
    event.stopPropagation();
    rect.text = 'a';
  }

  //#endregion

  //#region shape deletion
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
  //#endregion

  //#region new connection via drag
  let newConnectionStartRect;
  function createNewConnection(e, rect, point) {
    newConnectionStartRect = rect;
    let connectionPreview = {
      begin: {
        ...addCoord2D(rect.connectionPoints[point], rect.coord2D),
        id: rect.id
      },
      end: {
        x: e.offsetX,
        y: e.offsetY,
        id: -999,
      }
    }
    $connections = [
      ...$connections,
      connectionPreview
    ]
  }
  
  function endNewConnection(e, rect) {
    $connections = [
      ...$connections.filter(conn => {
        return conn.end.id !== -999;
      })
    ];
    if (!!newConnectionStartRect && !!rect && rect.id !== newConnectionStartRect.id) {
      let connection = createConnector(newConnectionStartRect, rect);
      $connections = [
        ...$connections,
        connection
      ];
    }
    newConnectionStartRect = null;
  }

  function checkNewConnection(e) {
    if (!!newConnectionStartRect) {
      // find the preview connection and update it
      $connections = [
        ...$connections.map(conn => {
          if (conn.end.id === -999) {
            conn.end.x = e.offsetX
            conn.end.y = e.offsetY
          }
          return conn;
        })
      ]
    }
  }
  //#endregion
</script>

<div on:dblclick={(e) => addAt(e, templates[selectedTemplate])}
  on:contextmenu|preventDefault
  on:mousemove={checkNewConnection}
  on:mouseup={endNewConnection}
>
  <Svg {height} {width}>
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
          on:mouseup={(e) => {endNewConnection(e, rect)}}
        >
          {#if !!rect.connectionPoints}
            {#each Object.keys(rect.connectionPoints) as point}
              <Circle
                on:mousedown={(e) => {createNewConnection(e, rect, point)}}
                circle2D={{
                  cx: rect.connectionPoints[point].x + rect.coord2D.x,
                  cy: rect.connectionPoints[point].y + rect.coord2D.y,
                  r: $focused === rect.id ? 5 : 
                    $mouseover === rect.id ? 3 : 0}} />
            {/each}
          {/if}
          {#if !!rect.image}
            <Image {...rect} passThrough={true} />
          {/if}
          {#if !!rect.text}
            <Text {...rect} passThrough={true} />
          {/if}
        </Rect>
      </g>
    {/each}
  
    <!-- template container -->
    <g class="no-events">
      <Rect coord2D={{x: 1, y: 1}} rect2D={{width: 39, height: height - 2}} svgProps={{ fill: '#ffffffaa', stroke: '#333'}}></Rect>
    </g>
    {#each _templates as template, index}
      {#if selectedTemplate === index}
        <Rect {...template} draggable={false} svgProps={{
          ...template.svgProps,
          'stroke-width': template.svgProps['stroke-width'] + 2
        }}></Rect>
      {/if}
      <Rect rect2D={template.rect2D} coord2D={template.coord2D} 
        svgProps={template.svgProps}
        draggable={true}
        on:mousedown={() => selectedTemplate = index}
        on:dragEnd={(e) => dragEndTemplate(e, template)}
      />
    {/each}

    <!-- Done -->
    <!-- Render Shapes from data binding -->
    <!-- Render Connections -->
    <!-- dynamically update connection points -->
    <!-- double click to add at mouse position -->
    <!-- hover Rect to view attachment points -->
    <!-- right click rect to delete -->
    <!-- right click connections to delete -->
    <!-- drag attachment points to existing Rect -->
    <!-- drag attachment point creates new connection preview -->
    <!-- create drag and drop template for new objects -->
    <!-- drag and drop new objects from template -->
    <!-- Svg Images -->

    <!-- WIP -->
    <!-- double click to edit text entry -->
    <!-- fix type definitions -->

    <!-- keyboard events -->
    <!-- delete key, deletes shape / connection -->
    <!-- enter key, edit mode for item -->

    <!-- MVP -->
    <!-- Edit Text Resizes Rect -->
    <!-- Edit Text Constrain Width: Multiline -->
    <!-- Edit Text Constrain Height: Single Line -->
    <!-- child elements: uml line item -->
    <!-- Add Resize Handles -->
    <!-- Resize Snap to Grid -->
    <!-- Redo / Undo -->
    <!-- Reorder Elements -->
    
    <!-- Next Version -->
    <!-- navigate canvas click and drag -->
    <!-- drag and adjust connection midpoints -->
    <!-- right click context menu -->
    <!-- right click context menu settings -->
    <!-- settings menu -->
    <!-- settings menu radius, text entry -->
    <!-- snap to grid -->

    <!-- Nice to have -->
    <!-- Custom Svg Objects -->
  </Svg>
</div>

<style>
  .no-events {
    pointer-events: none; /* prevent capturing clicks */
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
  }
</style>