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
  import Magnifier from '../../assets/mono-icons/svg/search.svelte';
  import ZoomIn from '../../assets/mono-icons/svg/zoom-in.svelte';
  import ZoomOut from '../../assets/mono-icons/svg/zoom-out.svelte';
  import Layers from '../../assets/mono-icons/svg/layers.svelte';
  import Link from '../../assets/mono-icons/svg/link.svelte';
  import Expand from '../../assets/mono-icons/svg/expand.svelte';
  import Grid from '../../assets/mono-icons/svg/grid.svelte';

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
  //#endregion

  //#region private props
  let selectedTemplate = 0;
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
  let showResizing = false;
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

  function createResizingPointOffsets(rect) {
    let ret = {
      'top-left': {x: 0, y: 0},
      'top-right': {x: 0, y: 0},
      'bottom-left': {x: 0, y: 0},
      'bottom-right': {x: 0, y: 0},
    };
    if (!(rect.coord2D && rect.rect2D)) {
      console.error('')
    } else {
      ret['top-left'] = { x: 0, y: 0};
      ret['top-right'] = { x: rect.rect2D.width, y: 0};
      ret['bottom-left'] = { x: 0, y: rect.rect2D.height};
      ret['bottom-right'] = { x: rect.rect2D.width, y: rect.rect2D.height};
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
  function dragUpdate(rect, event) {
    dragging = true;
    updateRectPosition(rect, event);
    updateClosest();
    updateConnection(rect, event);
  }

  function updateRectPosition(rect, event) {
    $store = [
      ...$store.map(r => {
        // this moves the rectangle being dragged
        if (rect.id === r.id) {
          r.coord2D.x += (event.detail.dx * zoom / 100);
          r.coord2D.y += (event.detail.dy * zoom / 100);
        }
        return r;
      })
    ];
  }
  function updateClosest() {
    $connections = [...$connections.map((conn) => {
      // get rects
      let startRect = $store.find(r => r.id === conn.begin.id);
      let endRect = $store.find(r => r.id === conn.end.id);
      let {begin, end} = findClosestConnection(startRect, endRect);
      begin.id = conn.begin.id;
      end.id = conn.end.id;
      return {begin, end};
    })];
  }
  function updateConnection(rect, event) {
    $connections = [
      ...$connections.map(conn => {
        if (conn.begin.id === rect.id) {
          conn.begin.x += (event.detail.dx * zoom / 100);
          conn.begin.y += (event.detail.dy * zoom / 100);
        } else if (conn.end.id === rect.id) {
          conn.end.x += (event.detail.dx * zoom / 100);
          conn.end.y += (event.detail.dy * zoom / 100);
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
    addAt(template);
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
      r.resizePoints = {
        ...r.connectionPoints,
        ...createResizingPointOffsets(r)
      };
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

  function getAdjustedCoords() {
    return {
      x: mouse.x * zoom / 100 + offset.x,
      y: mouse.y * zoom / 100 + offset.y,
    }
  }

  function addAt(template) {
    let coord = getAdjustedCoords();
    //#region prevents fuzzy connections
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
    newRect = {
      ...newRect,
      ...updatePoints(newRect)
    }
    newRect.coord2D = coord;
    newRect.id = _nextId++;
    // resets template back to origin;
    $store = [...$store, newRect];
  }

  function syncPosition(e) {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
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

  function dblOnRect(rect, event) {
    event.stopPropagation();
    event.preventDefault();
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

  //#region resize
  /**
   * @type {Rect2d}
   */
  let resizeTarget;
  let resizePoint;
  function startResize(e, rect, point) {
    resizing = true;
    resizeTarget = rect;
    resizePoint = point;
  }
  function endResize() {
    resizing = false;
    resizeTarget = null;
  }

  //#endregion

  //#region control toggles
  function setResize() {
    showResizing = true;
    showConnections = false;
  }

  function setConnections() {
    showResizing = false;
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
  /**
   * @type {Rect2D}
   */
  let copiedTemplate;
  function onKey(e) {
    if (e.ctrlKey) {
      if (e.key === "v") {
        if (!!copiedTemplate) {
          // TODO: get mouse position
          copiedTemplate.coord2D = getAdjustedCoords();
          copiedTemplate.id = _nextId++;
          $store = [
            ...$store,
            copiedTemplate
          ]
          copiedTemplate = cloneTemplate(copiedTemplate);
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
        const found = $store.find(r => r.id === $focused);
        copiedTemplate = cloneTemplate(found);
      }
    }
  }

  function cloneTemplate(template) {
    return {
      ...template,
      coord2D: {
        ...template.coord2D
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
          r = {
            ...r,
            ...updatePoints(r)
          }
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
    // apply offset 
    if (panning && !dragging && !newConnectionStartRect && !resizing) {
      offset = {
        x: (offset.x - (e.detail.dx * zoom / 100)),
        y: (offset.y - (e.detail.dy * zoom / 100)),
      }
    }

    monitorResizing(e);
  }

  // use mouse position and check for resizing event
  function monitorResizing(e) {
    if (resizing) {
      // resize needs to take zoom into account
      const coord = getAdjustedCoords();
      switch (resizePoint) {
        case 'top':
          // resize coord.y + height
          $store = [
            ...$store.map(rect => {
              if (rect.id === resizeTarget.id) {
                if (rect.rect2D.height - e.detail.dy > 100) {
                  rect.coord2D.y = coord.y;
                  rect.rect2D.height -= e.detail.dy * zoom / 100;
                }
                rect = {
                  ...rect,
                  ...updatePoints(rect)
                }
              }
              return rect;
            })
          ]
          break;
        case 'top-left':
          break;
        case 'top-right':
          break;
        case 'left':
          // resize coord.x + width
          $store = [
            ...$store.map(rect => {
              if (rect.id === resizeTarget.id) {
                if (rect.rect2D.width - e.detail.dx > 100) {
                  rect.coord2D.x = coord.x;
                  rect.rect2D.width -= e.detail.dx * zoom / 100;
                }
                rect = {
                  ...rect,
                  ...updatePoints(rect)
                }
              }
              return rect;
            })
          ]
          break;
        case 'bottom':
          // resize height only
          $store = [
            ...$store.map(rect => {
              if (rect.id === resizeTarget.id) {
                const height = coord.y - rect.coord2D.y;
                if (height > 100) {
                  rect.rect2D.height = height;
                } else {
                  rect.rect2D.height = 100;
                }
                rect = {
                  ...rect,
                  ...updatePoints(rect)
                }
              }
              return rect;
            })
          ]
          break;
        case 'bottom-left':
          break;
        case 'bottom-right':
          break;
        default:
          // resize width only
          $store = [
            ...$store.map(rect => {
              if (rect.id === resizeTarget.id) {
                const width = coord.x - resizeTarget.coord2D.x;
                if (width > 100) {
                  rect.rect2D.width = width;
                } else {
                  rect.rect2D.width = 100;
                }
                rect = {
                  ...rect,
                  ...updatePoints(rect)
                }
              }
              return rect;
            })
          ]
          break;
      }
      updateConnection(rect, e);
    }
  }

  function updatePoints(rect) {
    const connectionPoints = createConnectionPointOffsets(rect);
    const resizePoints = {
      ...connectionPoints,
      ...createResizingPointOffsets(rect)
    };
    return {
      connectionPoints,
      resizePoints
    }
  }

  function endPan() {
    panning = false;
  }
  //#endregion

</script>

<section on:mousemove={syncPosition}>
  {#if show.controls}
    <div class="diagram-controls" class:controls-hidden={!show.controls}>
      <button class:active={show.template} on:click={() => show.template =! show.template} aria-label="Toggle Templates">
        <Grid />
      </button>
      <button class:active={showResizing} on:click={setResize} aria-label="Resize"><Expand /></button>
      <button class:active={showConnections} on:click={setConnections} aria-label="Connections"><Link /></button>
      <button class:active={zoom === 100} on:click={resetZoom} aria-label="Reset Zoom"><Magnifier /></button>
      <button on:click={() => onWheel({ deltaY: -1})} aria-label="Zoom in"><ZoomIn /></button>
      <button on:click={() => onWheel({ deltaY: 1})} aria-label="Zoom out"><ZoomOut /></button>
      <button class:active={show.layers} on:click={() => show.layers =! show.layers} aria-label="Toggle Layers">
        <Layers />
      </button>
    </div>
  {/if}
  <div class="diagram-wrapper">
    {#if show.template}
      <div class="diagram-templates" transition:fly={{duration: 300, y: -100}}>
        <Svg width={50}>
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
      on:dblclick={() => addAt(templates[selectedTemplate])}
      on:contextmenu|preventDefault
      on:mousemove={checkNewConnection}
      on:mouseup={endNewConnection}
      on:mouseup={() => endResize()}
      on:wheel|preventDefault={onWheel}
      on:keydown={onKey}
      tabindex="0">
      <Svg height={width} {width} zoom={($_zoom / 100) * width} {offset}>
        {#each $connections as connection (`${connection.begin.id}${connection.end.id}`)}
          <Connector on:contextmenu={() => deleteConnection(connection)} {...connection} svgProps={svgPathProps} />
        {/each}
        {#each $store as rect (rect.id)}
          <DraggableRect {...rect} draggable={true}
            on:dblclick={(e) => dblOnRect(rect, e)}
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
              <Image {...rect} passThrough={true} trueSize={false} on:resize={(e) => resize(e, rect)} />
            {/if}
            
            {#if !!rect.connectionPoints}
              {#if showConnections}
                {#each Object.keys(rect.connectionPoints) as point}
                  {@const radius = getRadius(rect) * zoom / 125}}
                  {#if radius > 0}
                    <Circle
                      on:mousedown={(e) => {createNewConnection(e, rect, point)}}
                      svgProps={{fill: '#222222aa'}}
                      circle2D={{
                        cx: rect.connectionPoints[point].x + rect.coord2D.x,
                        cy: rect.connectionPoints[point].y + rect.coord2D.y,
                        r: radius 
                      }} />
                  {/if}
                {/each}
              {/if}
              {#if showResizing}
                {#each Object.keys(rect.resizePoints) as point}
                  {@const radius = getRadius(rect) * zoom / 125}}
                  {#if radius > 0}
                    <Circle
                      on:mousedown={(e) => startResize(e, rect, point)}
                      svgProps={{fill: '#222222aa'}}
                      circle2D={{
                        cx: rect.resizePoints[point].x + rect.coord2D.x,
                        cy: rect.resizePoints[point].y + rect.coord2D.y,
                        r: getRadius(rect) * zoom / 125,
                      }} />
                  {/if}
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
    position: relative;
  }
  .diagram-wrapper {
    display: flex;
    overflow: hidden;
  }
  .diagram-layers {
    position: absolute;
    overflow-y: scroll;
    overflow-x: hidden;
    top: 48px;
    max-height: calc(100% - 48px);
    right: 0;
  }
  .diagram-layers::-webkit-scrollbar {
    width: 4px !important;
  }
  .diagram-layers::-webkit-scrollbar-thumb {
    background: #ff3e00 !important;
  }

  .diagram-controls,
  .diagram-templates {
    position: absolute;
  }
  .diagram-controls {
    border-bottom: 1px solid black;
    border-right: 1px solid black;
  }
  .diagram-templates {
    top: 48px;
  }
  /* .controls-hidden.diagram-templates, */
  .controls-hidden.diagram-controls {
    top: 24px;
  }
  .diagram-controls button {
    background: none;
    border: none;
  }
  button.active {
    background: lightgrey;
  }
</style>