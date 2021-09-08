<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { spring } from 'svelte/motion';
  import Svg from '../Svg.svelte';
  import Connector from '../Path/Connector.svelte';
  import Rect from '../Rect/Rect.svelte';
  import Text from '../Text/Text.svelte';
  import Image from '../Image/Image.svelte';
  import Circle from '../Arc/Circle.svelte';
	import { pannable } from '../pannable';

  /** @typedef {import("../Rect/Rect").Rect2D} Rect2D*/
  /** @typedef {import("../Svg").Coord2D} Coord2D*/
  /** @typedef {import("../Svg").NativeSvgProps} NativeSvgProps*/

  /**
   * @typedef {{
   * connections?: number[],
   * id: number,
   * text?: string,
   * image?: string,
   * rect2D: Rect2D,
   * coord2D: Coord2D,
   * svgProps?: NativeSvgProps,
   * }} DiagramRect
   */

  //#region props
  /**
   * @type {DiagramRect[]}
   */
  export let rects = [];
  /** @type {number} */
  export let width = 0;
  /** @type {number} */
  export let height = 0;
  /** @type {NativeSvgProps} */
  export let svgPathProps;

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
    svgProps: {
      fill: '#FFCC00',
      stroke: '#333',
      'stroke-width': 2,
    }
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
    svgProps: {
      fill: '#FFCC00',
      stroke: '#333',
      'stroke-width': 2,
    }
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
    svgProps: {
      fill: '#FFCC00',
      stroke: '#333',
      'stroke-width': 2,
    }
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
  let creatingFromTemplate = false;

  function dragUpdate(e, rect) {
    dragging = true;

    $store = [
      ...$store.map(r => {
        // this moves the rectangle being dragged
        if (rect.id === r.id) {
          r.coord2D.x += (e.detail.dx * zoom / 100);
          r.coord2D.y += (e.detail.dy * zoom / 100);
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
          conn.begin.x += (e.detail.dx * zoom / 100);
          conn.begin.y += (e.detail.dy * zoom / 100);
        } else if (conn.end.id === rect.id) {
          conn.end.x += (e.detail.dx * zoom / 100);
          conn.end.y += (e.detail.dy * zoom / 100);
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
    creatingFromTemplate = false;
  }

  function selectTemplate(index) {
    selectedTemplate = index;
    creatingFromTemplate = true;
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
      coord.x = Math.floor(e.detail.coord2D.x) + offset.x;
      coord.y = Math.floor(e.detail.coord2D.y) + offset.y;
    } else {
      coord.x = (e.offsetX * zoom / 100) + offset.x;
      coord.y = (e.offsetY * zoom / 100) + offset.y;
    }
    if (coord.x % 2 === 1) coord.x--;
    if (coord.y % 2 === 1) coord.y--;
    //#endregion
    let newRect = {
      ...template
    }
    newRect.coord2D = coord;
    newRect.id = _nextId++;
    // resets template back to origin;
    $store = [...$store, newRect];
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
        x: (e.offsetX * zoom / 100) + offset.x,
        y: (e.offsetY * zoom / 100) + offset.y,
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
            conn.end.x = ((e.offsetX) * zoom / 100) + offset.x
            conn.end.y = ((e.offsetY) * zoom / 100) + offset.y
          }
          return conn;
        })
      ]
    }
  }
  //#endregion

  //#region zooming
  /** @type {number} */
  export let zoom = 100;
  function onWheel(e) {
    // scale smallest to 50% largest to 200%
    if (e.deltaY < 0) {
      if (zoom > 20) {
        zoom -= 20;
      }
    } else {
      zoom += 20;
    }
  }

  function resetZoom() {
    zoom = 100;
  }

  let _zoom = spring(0);
  $: _zoom.update($_zoom => zoom);
  //#endregion

  //#region copy / paste
  function onKey(e) {
    if (e.ctrlKey && e.key === "v") {
      navigator.clipboard.readText().then(data => {
        pasteImage(data);
      })
    }
  }

  function pasteImage(url) {
    if (!!$focused) {
      $store = [
        ...$store.map(r => {
          if (r.id === $focused) {
            r.image = url;
          }
          return r;
        })
      ]
    } else {
      // paste at center of current coord
    }
  }
  //#endregion

  //#region panning workspace
  let panning = false;
  let offset = {
    x: 0,
    y: 0,
  }

  function startPan() {
    panning = true;
  }

  function monitorPan(e) {
    if (panning && !creatingFromTemplate && !dragging && !newConnectionStartRect) {
      offset = {
        x: offset.x - e.detail.dx,
        y: offset.y - e.detail.dy,
      }
    }
  }

  function endPan() {
    panning = false;
  }
  //#endregion
</script>

<span on:dblclick={(e) => addAt(e, templates[selectedTemplate])}
  use:pannable
  on:panstart={startPan}
  on:panmove={monitorPan}
  on:panend={endPan}
  on:contextmenu|preventDefault
  on:mousemove={checkNewConnection}
  on:mouseup={endNewConnection}
  on:wheel|preventDefault={onWheel}
  on:keydown={onKey}
  tabindex="0"
>
  <Svg {height} {width} zoom={($_zoom / 100) * height} {offset}>
    {#each $connections as connection (`${connection.begin.id}${connection.end.id}`)}
      <Connector on:contextmenu={() => deleteConnection(connection)} {...connection} svgProps={svgPathProps} />
    {/each}
    {#each $store as rect (rect.id)}
      <g>
        <Rect {...rect} draggable={true}
          on:drag={(e) => dragUpdate(e, rect)}
          on:dragEnd={dragEnd}
          on:mouseover={() => over(rect)}
          on:mouseleave={() => out(rect)}
          on:focus={() => focusRect(rect)}
          on:blur={() => blurRect(rect)}
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
    <g transform={`translate(${offset.x},${offset.y})`}>
      <g class="no-events">
        <Rect coord2D={{x: 1, y: 1}}
          rect2D={{width: 39, height: height - 2}}
          svgProps={{ fill: '#ffffffaa', stroke: '#333'}}>
        </Rect>
      </g>
      {#each _templates as template, index}
        {#if selectedTemplate === index}
          <Rect {...template} draggable={false}
            {zoom}
            svgProps={{
            ...template.svgProps,
            'stroke-width': template.svgProps['stroke-width'] + 4,
            stroke: '#F00'
          }}></Rect>
        {/if}
        <Rect rect2D={template.rect2D} coord2D={template.coord2D}
          svgProps={template.svgProps}
          draggable={true}
          {zoom}
          on:mousedown={() => selectTemplate(index)}
          on:dragEnd={(e) => dragEndTemplate(e, template)}
        />
      {/each}
    </g>

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
    <!-- zoom in and out -->

    <!-- WIP -->
    <!-- double click to edit text entry -->
    <!-- fix type definitions - reimported optionals -->
    <!-- fix zoom should not alter templates -->

    <!-- keyboard events -->
    <!-- delete key, deletes shape / connection -->
    <!-- enter key, edit mode for item -->

    <!-- MVP -->
    <!-- Edit Text Resizes Rect -->
    <!-- Edit Text Constrain Width: Multiline -->
    <!-- Edit Text Constrain Height: Single Line -->
    <!-- child elements: uml line item -->
    <!-- paste image urls -->
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
</span>

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