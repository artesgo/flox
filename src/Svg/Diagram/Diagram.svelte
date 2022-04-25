<script>
	import { fly } from 'svelte/transition';
	import DiagramLayers from './DiagramLayers.svelte';
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
  import Options from '../../assets/mono-icons/svg/options-vertical.svelte';
  import Help from '../../assets/mono-icons/svg/circle-help.svelte';

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
   * aspectRatio: Rect2D,
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
    descriptions: true,
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
  export let grid = 0;
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
  let stage;
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
      let { width, height } = updateGridPoints(rect);
      // connectionPointOffsets
      ret.left = { x: 0, y: height / 2};
      ret.right = { x: width, y: height / 2};
      ret.top = { x: width / 2, y: 0};
      ret.bottom = { x: width / 2, y: height};
    }
    return ret;
  }

  function createResizingPointOffsets(rect) {
    let ret = {
      // 'top-left': {x: 0, y: 0},
      // 'top-right': {x: 0, y: 0},
      // 'bottom-left': {x: 0, y: 0},
      // 'bottom-right': {x: 0, y: 0},
    };
    if (!(rect.coord2D && rect.rect2D)) {
      console.error('')
    } else {
      let { width, height } = updateGridPoints(rect);
      // TODO: find a way to allow top left resize that maps closer to actual cursor position
      ret['top-left'] = { x: 0, y: 0};
      ret['top-right'] = { x: width, y: 0};
      ret['bottom-left'] = { x: 0, y: height};
      ret['bottom-right'] = { x: width, y: height};
    }
    return ret;
  }

  function updateGridPoints(rect) {
    let width = rect.rect2D.width;
    let height = rect.rect2D.height;
    if (grid > 0) {
      width = Math.floor(width / grid) * grid;
      height = Math.floor(height / grid) * grid;
    }
    return {
      width, height
    }
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
        // ...r.connectionPoints,
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
    const coord = getAdjustedCoords();
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
    if (!dragging && !copiedTemplate) {
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
  function deleteRect(id, remove = true) {
    $store = [
      ...$store.filter(r => {
        return r.id !== id;
      })
    ];
    $connections = [
      ...$connections.filter(conn => {
        return conn.begin.id !== id && conn.end.id !== id;
      })
    ];
    if (remove) {
      $focused = null;
    }
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
    overSize = {
      x: 0,
      y: 0,
    }
    resizeTarget = null;
  }
  //#endregion

  //#region control toggles
  function setResize() {
    showResizing = !showResizing;
    showConnections = false;
  }

  function setConnections() {
    showResizing = false;
    showConnections = !showConnections;
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
      if (e.key === "v" && $focused) {
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
      if (e.key === "c" && $focused) {
        // use selected shape as new template
        const found = $store.find(r => r.id === $focused);
        copiedTemplate = cloneTemplate(found);
      }
      if (e.key === "x" && $focused) {
        // use selected shape as new template
        const found = $store.find(r => r.id === $focused);
        copiedTemplate = cloneTemplate(found);
        deleteRect($focused, false);
        // refocus stage as deletions unfocus it
        stage.focus();
      }
    }
    if (e.code === "Space" || e.key === ' ') {
      // console.log('space')
    }
    if (e.code === 'Backspace') {
      deleteRect($focused);
    }
  }

  function cloneTemplate(template) {
    return {
      ...template,
      coord2D: {
        ...template.coord2D
      },
      rect2D: {
        ...template.rect2D
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

  function loadImageAspectRatio(rect, e) {
    $store = [
      ...$store.map(r => {
        if (r.id === rect.id) {
          r.aspectRatio = e.detail;
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

  let overSize = {
    x: 0,
    y: 0,
  }
  function resizeTop(rect, coord) {
    if (rect.rect2D.height - overSize.y > 100) {
      rect.coord2D.y = coord.y;
      rect.rect2D.height -= e.detail.dy * zoom / 100;
    } else {
      overSize.y += e.detail.dy;
    }
  }
  // use mouse position and check for resizing event
  function monitorResizing(e) {
    if (resizing) {
      // resize needs to take zoom into account
      const coord = getAdjustedCoords();
      $store = [
        ...$store.map(rect => {
          if (rect.id === resizeTarget.id) {
            const stayAtX = rect.coord2D.x + rect.rect2D.width;
            const stayAtY = rect.coord2D.y + rect.rect2D.height;
            if (resizePoint.indexOf('top') > -1) {
              if (rect.rect2D.height - overSize.y > 100) {
                rect.coord2D.y = coord.y;
                rect.rect2D.height -= e.detail.dy * zoom / 100;
              } else {
                overSize.y += e.detail.dy;
              }
            }
            if (resizePoint.indexOf('left') > -1) {
              if (rect.rect2D.width - overSize.x > 100) {
                rect.coord2D.x = coord.x;
                rect.rect2D.width -= e.detail.dx * zoom / 100;
              } else {
                overSize.x += e.detail.dx;
              }
            }
            if (resizePoint.indexOf('right') > -1) {
              const width = coord.x - resizeTarget.coord2D.x;
              if (width > 100) {
                rect.rect2D.width = width;
              } else {
                rect.rect2D.width = 100;
              }
            }
            if (resizePoint.indexOf('bottom') > -1) {
              const height = coord.y - rect.coord2D.y;
              if (height > 100) {
                rect.rect2D.height = height;
              } else {
                rect.rect2D.height = 100;
              }
            }
            // get aspect ratio
            if (rect.aspectRatio) {
              rect.rect2D = calculateAspectRatioFit(rect.aspectRatio, {
                // 10k makes it so that we prioritize height
                width: rect.rect2D.width + 10000,
                height: rect.rect2D.height,
              });
              if (resizePoint.indexOf('top') > -1) {
                rect.coord2D = {
                  ...rect.coord2D,
                  y: stayAtY - rect.rect2D.height
                }
              }
              if (resizePoint.indexOf('left') > -1) {
                rect.coord2D = {
                  ...rect.coord2D,
                  x: stayAtX - rect.rect2D.width
                }
              }
            }
            rect = {
              ...rect,
              ...updatePoints(rect)
            }
          }
          return rect;
        })
      ];
    }
  }

  function calculateAspectRatioFit(src, max) {
    const ratio = Math.min(max.width / src.width, max.height / src.height);
    return { width: src.width * ratio, height: src.height * ratio };
  }

  function updatePoints(rect) {
    const connectionPoints = createConnectionPointOffsets(rect);
    const resizePoints = {
      // ...connectionPoints,
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

  function updateGrid(_grid) {
    grid = _grid;
  }
</script>

<section on:mousemove={syncPosition}>
  {#if show.controls}
    <div class="diagram-controls" class:controls-hidden={!show.controls}>
      <button class:active={show.template} on:click={() => show.template =! show.template}><Options />
        <div class:sr-only={show.descriptions}>Toggle Templates</div></button>
      <button class:active={showResizing} on:click={setResize}><Expand />
        <div class:sr-only={show.descriptions}>Resize</div></button>
      <button class:active={showConnections} on:click={setConnections}><Link />
        <div class:sr-only={show.descriptions}>Connect</div></button>
      <button class:active={zoom === 100} on:click={resetZoom}><Magnifier />
        <div class:sr-only={show.descriptions}>Reset Zoom</div></button>
      <button on:click={() => onWheel({ deltaY: -1})}><ZoomIn />
        <div class:sr-only={show.descriptions}>Zoom In</div></button>
      <button on:click={() => onWheel({ deltaY: 1})}><ZoomOut />
        <div class:sr-only={show.descriptions}>Zoom Out</div></button>
      <button class:active={show.layers} on:click={() => show.layers = !show.layers}><Layers />
        <div class:sr-only={show.descriptions}>Toggle Layers {show.layers ? 'Off' : 'On'}</div></button>
      <!-- <button class:active={grid} on:click={() => updateGrid(25)}><Grid />
        <div class:sr-only={show.descriptions}>Toggle Grid</div></button> -->
      <button class:active={!show.descriptions} on:click={() => show.descriptions = !show.descriptions}><Help />
        <div class:sr-only={show.descriptions}>Toggle Descriptions</div></button>
    </div>
  {/if}
  <div class="diagram-wrapper">
    {#if show.template}
      <div class="diagram-templates" transition:fly={{duration: 300, y: -100}}>
        <Svg width={50} height={'600'}>
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
            <DraggableRect
              rect2D={template.rect2D}
              coord2D={template.coord2D}
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
      bind:this={stage}
      on:panstart={startPan}
      on:panmove={monitorPan}
      on:panend={endPan}
      on:dblclick={() => addAt(templates[selectedTemplate])}
      on:contextmenu|preventDefault
      on:mousemove={checkNewConnection}
      on:mouseup={endNewConnection}
      on:mouseup={endResize}
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
            on:mouseup={() => endNewConnection(rect)}
            on:touchend={() => endNewConnection(rect)}
            on:updateText={(e) => updateText(rect, e)}
            {grid}
          >
            {#if !!rect.image}
              <Image {...rect} passThrough={true} trueSize={false} on:resize={(e) => resize(e, rect)} on:load={(e) => loadImageAspectRatio(rect, e)} />
            {/if}
            
            {#if !!rect.connectionPoints}
              {#if showConnections}
                {#each Object.keys(rect.connectionPoints) as point}
                  {@const radius = getRadius(rect) * zoom / 125}}
                  {#if radius > 0}
                    <Circle
                      {grid}
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
                      {grid}
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
    top: 60px;
    max-height: calc(100% - 60px);
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
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
  }
  .diagram-templates {
    top: 60px;
  }
  /* .controls-hidden.diagram-templates, */
  .controls-hidden.diagram-controls {
    top: 24px;
  }
  .diagram-controls button {
    background: none;
    border: none;
    width: 160px;
    background: white;
  }
  button.active {
    background: lightgrey;
  }
  .sr-only {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
    transition: 300ms;
  }
</style>