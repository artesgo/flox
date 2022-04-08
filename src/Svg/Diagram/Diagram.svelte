<script>
	import { fly } from 'svelte/transition';
	import DiagramLayers from './DiagramLayers.svelte';
	import Rect from './../Rect/Rect.svelte';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { spring } from 'svelte/motion';
  import Svg from '../Svg.svelte';
  import Connector from '../Path/Connector.svelte';
  import DraggableRect from '../Rect/DraggableRect.svelte';
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
  /** @type {{template: boolean; controls: boolean; layers: boolean}} */
  export let show = {
    template: true,
    controls: true,
    layers: false,
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
      rx: 0,
      ry: 0,
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
  // creates a component instance store for each diagram
  const store = writable([
    ...rects
  ]);
  let connections = writable([]);
  let dragging = false;
  let focused = writable(null);
  let mouseover = writable(null);
  // showConnection / resizing
  let showConnections = true;
  let resizing = false;
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
  function dragUpdate(rect, e) {
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

  // deprecated
  function dragEndTemplate(e, template) {
    dragging = false;
    addAt(e, template);
    _templates = [...templates];
  }

  function selectTemplate(index) {
    selectedTemplate = index;
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
        // discard connections now that they are created and tracked via $connections;
        r.connections = [];
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
    //#region prevents fuzzy connections
    if (e.detail && e.detail.coord2D) {
      coord.x = Math.floor(e.detail.coord2D.x) + offset.x;
      coord.y = Math.floor(e.detail.coord2D.y) + offset.y;
    } else {
      coord.x = (e.offsetX * height / width * zoom / 100) + offset.x;
      coord.y = (e.offsetY * height / width * zoom / 100) + offset.y;
    }
    if (coord.x % 2 === 1) coord.x--;
    if (coord.y % 2 === 1) coord.y--;
    //#endregion
    let newRect = {
      ...template,
      rect2D: {
        width: template.rect2D.width * 5,
        height: template.rect2D.height * 5,
        rx: template.rect2D.rx * 5,
        ry: template.rect2D.ry * 5,
      },
    }
    newRect.connectionPoints = createConnectionPointOffsets(newRect);
    newRect.coord2D = coord;
    newRect.id = _nextId++;
    // resets template back to origin;
    $store = [...$store, newRect];
  }

  $: getRadius = (rect) => {
    if ($focused === rect.id) {
      return 10;
    }
    if ($mouseover === rect.id) {
      return 5;
    }
    return 0;
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
    }
  }
  //#endregion

  //#region text edit
  function updateText(rect, {detail}) {
    $store = [
      ...$store.map(r => {
        if (r.id === rect.id) {
          r.text = detail;
        }
        return r;
      })
    ];
  }

  function forwardEvent(rect, event) {
    event.stopPropagation();
    event.preventDefault();
    rect.editing = true;
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
    ];
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
  
  function endNewConnection(rect) {
    if (!!newConnectionStartRect) {
      $connections = [
        ...$connections.filter(conn => {
          return conn.end.id !== -999;
        })
      ];

      // check for existing connections to the same rects
      let found = $connections.find(conn => {
        if (
          (conn.begin.id === newConnectionStartRect.id && 
          conn.end.id === rect.id) ||
          (conn.begin.id === rect.id && 
          conn.end.id === newConnectionStartRect.id)
        ) {
          return conn;
        }
      });

      if (!!found) {
        newConnectionStartRect = null;
        return;
      }
  
      // cannot connect to self
      if (!!rect && rect.id !== newConnectionStartRect.id) {
        let connection = createConnector(newConnectionStartRect, rect);
        $connections = [
          ...$connections,
          connection
        ];
      }
      newConnectionStartRect = null;
    }
  }

  let mouse = {
    x: 0,
    y: 0,
  }
  function checkNewConnection(e) {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
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

  //#region control toggles
  function setResize() {
    resizing = true;
    showConnections = false;
  }

  function setConnections() {
    resizing = false;
    showConnections = true;
  }
  //#endregion

  //#region zooming
  /** @type {number} */
  export let zoom = 100;
  function onWheel(e) {
    // scale smallest to 50% largest to 200%
    if (e.deltaY < 0) {
      if (zoom > 40) {
        zoom -= 20;
      }
    } else {
      if (zoom < 600) {
        zoom += 20;
      }
    }
  }

  function resetZoom() {
    zoom = 100;
  }

  let _zoom = spring(0);
  $: _zoom.update($_zoom => zoom);
  //#endregion

  //#region copy / paste
  let copiedTemplate;
  function onKey(e) {
    if (e.ctrlKey) {
      if (e.key === "v") {
        if (!!copiedTemplate) {
          copiedTemplate = null;
          // TODO: get mouse position
          // addAt()
        } else {
          navigator.clipboard.readText()
            .then(data => {
              // check the copied text
              if (data.match(/\.(jpeg|jpg|gif|png)$/)) {
                pasteImage(data);
              } else {
                pasteText(data);
              }
            })
        }
      }
      if (e.key === "c") {
        // use selected shape as new template
        copiedTemplate = $store.findIndex(r => r.id === $focused);
      }
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
    }
  }

  function pasteText(text) {
    if (!!$focused) {
      $store = [
        ...$store.map(r => {
          if (r.id === $focused) {
            r.text = text;
          }
          return r;
        })
      ]
    }
  }

  // img resize listener
  function resize(size, rect) {
    $store = [
      ...$store.map(r => {
        if (r.id === rect.id) {
          r.rect2D = size.detail;
          r.connectionPoints = createConnectionPointOffsets(r);
        }
        return r;
      })
    ]
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
    if (panning && !dragging && !newConnectionStartRect) {
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

<section>
  {#if show.controls}
    <div class="diagram-controls">
      <button on:click={() => show.template =! show.template}>Templates</button>
      <button on:click={setResize}>Resize</button>
      <button on:click={setConnections}>Connection</button>
      <button on:click={resetZoom}>Reset Zoom</button>
      <button on:click={() => onWheel({ deltaY: -1})}>Zoom In</button>
      <button on:click={() => onWheel({ deltaY: 1})}>Zoom Out</button>
      <button>Copy</button>
      <button>Paste</button>
      <button on:click={() => show.layers =! show.layers}>Layers</button>
    </div>
  {/if}
  <div class="diagram-wrapper">
    {#if show.template}
      <div class="diagram-templates" transition:fly={{duration: 300, y: -100}}>
        <Svg {height} width={50}>
          {#each _templates as template, index}
            {#if selectedTemplate === index}
              <DraggableRect {...template}
                draggable={false}
                editable={false}
                on:mousedown={() => selectTemplate(index)}
                {zoom}
                svgProps={{
                ...template.svgProps,
                'stroke-width': template.svgProps['stroke-width'] + 4,
                stroke: '#F00'
              }}></DraggableRect>
            {/if}
            <DraggableRect rect2D={template.rect2D} coord2D={template.coord2D}
              svgProps={template.svgProps}
              draggable={false}
              editable={false}
              {zoom}
              on:mousedown={() => selectTemplate(index)}
            />
          {/each}
        </Svg>
      </div>
    {/if}
    <span
      use:pannable
      on:panstart={startPan}
      on:panmove={monitorPan}
      on:panend={endPan}
      on:dblclick={(e) => addAt(e, templates[selectedTemplate])}
      on:contextmenu|preventDefault
      on:mousemove={checkNewConnection}
      on:mouseup={endNewConnection}
      on:wheel|preventDefault={onWheel}
      on:keydown={onKey}
      tabindex="0">
      <Svg {height} {width} zoom={($_zoom / 100) * height} {offset}>
        {#each $connections as connection (`${connection.begin.id}${connection.end.id}`)}
          <Connector on:contextmenu={() => deleteConnection(connection)} {...connection} svgProps={svgPathProps} />
        {/each}
        {#each $store as rect (rect.id)}
          <DraggableRect {...rect} draggable={true}
            on:dblclick={(e) => forwardEvent(rect, e)}
            on:drag={(e) => dragUpdate(rect, e)}
            on:dragEnd={dragEnd}
            on:mouseover={() => over(rect)}
            on:mouseleave={() => out(rect)}
            on:focus={() => focusRect(rect)}
            on:blur={() => blurRect(rect)}
            on:contextmenu={(e) => deleteRect(rect, e)}
            on:mouseup={() => endNewConnection(rect)}
            on:updateText={(e) => updateText(rect, e)}
          >
            {#if !!rect.image}
              <Image {...rect} passThrough={true} on:resize={(e) => resize(e, rect)} />
            {/if}
            
            {#if !!rect.connectionPoints}
              {#if showConnections}
                {#each Object.keys(rect.connectionPoints) as point}
                  <Circle
                    on:mousedown={(e) => {createNewConnection(e, rect, point)}}
                    svgProps={{fill: '#222222aa'}}
                    circle2D={{
                      cx: rect.connectionPoints[point].x + rect.coord2D.x,
                      cy: rect.connectionPoints[point].y + rect.coord2D.y,
                      r: getRadius(rect) * zoom / 125}} />
                {/each}
              {/if}
              {#if resizing}
                {#each Object.keys(rect.connectionPoints) as point}
                  {@const radius = getRadius(rect) * zoom / 125}
                  <Rect
                    svgProps={{fill: '#222222aa'}}
                    rect2D={{
                      coord2D: {
                        x: rect.connectionPoints[point].x + rect.coord2D.x - (radius / 2),
                        y: rect.connectionPoints[point].y + rect.coord2D.y - (radius / 2),
                      },
                      height: radius,
                      width: radius
                    }} />
                {/each}
              {/if}
            {/if}
          </DraggableRect>
        {/each}
      </Svg>
    </span>
    {#if show.layers}
    <div class="diagram-layers" transition:fly={{duration: 300, y: -100}}>
      <!-- <div>Offset: X: {offset.x} Y: {offset.y}</div>
      <div>Mouse: X: {mouse.x} Y: {mouse.y}</div> -->
      <DiagramLayers {store} bind:focused />
    </div>
    {/if}
  </div>
</section>

<style>
  section {
    overflow: hidden;
    width: 100%;
  }
  .diagram-wrapper {
    display: flex;
    height: 100%;
  }
  .diagram-layers {
    position: absolute;
    overflow: scroll;
    right: 0;
  }
  .diagram-templates {
    position: absolute;
  }
</style>