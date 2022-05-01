<script>
	import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { spring } from 'svelte/motion';
  import Svg from '../Svg.svelte';
  import Circle from '../Arc/Circle.svelte';
  import Image from '../Image/Image.svelte';
  import Connector from '../Path/Connector.svelte';
	import DiagramLayers from './DiagramLayers.svelte';
  import DraggableRect from '../Rect/DraggableRect.svelte';
  import { createDiagramStore } from './Diagram.store.ts';
  import { createConnectionsStore } from './Connections.store.ts';
	import { pannable } from '../pannable';
  import Magnifier from '../../assets/mono-icons/svg/search.svelte';
  import ZoomIn from '../../assets/mono-icons/svg/zoom-in.svelte';
  import ZoomOut from '../../assets/mono-icons/svg/zoom-out.svelte';
  import Layers from '../../assets/mono-icons/svg/layers.svelte';
  import Link from '../../assets/mono-icons/svg/link.svelte';
  import Expand from '../../assets/mono-icons/svg/expand.svelte';
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
  const store = createDiagramStore(rects);
  let connections = createConnectionsStore($store);
  let dragging = false;
  let focused = writable(null);
  let mouseover = writable(null);
  // showConnection / resizing
  let showConnections = true;
  let showResizing = false;
  let resizing = false;
  let stage;
  let mouse = {
    x: 0,
    y: 0,
  }
  let passThrough;
  //#endregion

  //#region dragging
  function dragUpdate(rect, event) {
    dragging = true;
    store.moveRect(rect, event, zoom);
    connections.updateClosest($store);
    connections.updateConnection(rect, event, zoom);
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

  onMount(() => {
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
    // resets template back to origin;
    store.addRect(coord, template);
  }

  function syncPosition(e) {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
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
    store.updateText(rect, detail);
  }

  function preventDoubleClickThrough(event) {
    event.stopPropagation();
    event.preventDefault();
  }
  //#endregion

  //#region shape deletion
  function deleteRect(id, remove = true) {
    store.deleteRect(id);
    connections.deleteConnections(id);
    if (remove) {
      $focused = null;
    }
  }

  function deleteConnection(conn) {
    connections.deleteConnection(conn);
  }
  //#endregion

  //#region new connection via drag
  let newConnectionStartRect;
  function createNewConnection(e, rect, point) {
    newConnectionStartRect = rect;
    connections.createPreview(rect, point, zoom, offset, e);
  }
  
  function endNewConnection(rect) {
    if (!!newConnectionStartRect) {
      connections.removePlaceholder();
      connections.createConnection(newConnectionStartRect, rect);
      newConnectionStartRect = null;
    }
  }

  function updateConnectionPreview(e) {
    // checks that a newConnectionStart exists before updating preview
    if (!!newConnectionStartRect) {
      connections.updatePreview(e, zoom, offset);
    }
  }
  //#endregion

  //#region resize
  /**
   * @type {Rect2d}
   */
  let resizeTarget;
  let resizePoint;
  function startResize(rect, point) {
    resizing = true;
    resizeTarget = rect;
    resizePoint = point;
  }

  function endResize() {
    resizing = false;
    store.resetOversize();
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
    let coord = getAdjustedCoords();
    let _unscaled = {
      x: Math.floor(offset.x + coord.x),
      y: Math.floor(offset.y + coord.y),
    }
    if (e.deltaY < 0) {
      if (zoom > 40) {
        zoom -= 20;
      }
    } else {
      if (zoom < 600) {
        zoom += 20;
      }
    }
    scaleToNewOffset(_unscaled);
  }

  function scaleToNewOffset(_unscaled) {
    let _scaled = {
      x: Math.floor(offset.x + (mouse.x * zoom / 100)),
      y: Math.floor(offset.y + (mouse.y * zoom / 100)),
    }
    offset = {
      x: _unscaled.x - _scaled.x,
      y: _unscaled.y - _scaled.y,
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
          store.addRect(copiedTemplate);
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
      passThrough = true;
    }
    if (e.code === 'Backspace') {
      deleteRect($focused);
    }
  }

  function onRelease(e) {
    if (e.code === "Space" || e.key === ' ') {
      passThrough = false;
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
      store.updateImage({id: $focused}, url)
    }
  }

  function pasteText(text) {
    if (!!$focused) {
      store.updateText({id: $focused}, text)
    }
  }

  // img resize listener
  function loadImageAspectRatio(rect, e) {
    store.setRectAspectRatio(rect, e.detail);
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
      store.resizeRect(resizeTarget, resizePoint, coord, zoom, e);
    }
  }

  function endPan() {
    panning = false;
  }
  //#endregion

  function updateGrid(_grid) {
    grid = _grid;
  }

  /**
   * 
   * @param e
   * @param rect
   */
  function createContextMenu(e, rect) {
    if (rect.rect2D) {

    }
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
</script>

<section on:mousemove={syncPosition} class:passThrough>
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
    <!-- main stage span -->
    <span
      use:pannable
      bind:this={stage}
      on:panstart={startPan}
      on:panmove={monitorPan}
      on:panend={endPan}
      on:dblclick={() => addAt(templates[selectedTemplate])}
      on:contextmenu|preventDefault={(e) => createContextMenu(e, {})}
      on:mousemove={updateConnectionPreview}
      on:mouseup={endNewConnection}
      on:mouseup={endResize}
      on:wheel|preventDefault={onWheel}
      on:keydown={onKey}
      on:keyup={onRelease}
      tabindex="0">
      <Svg height={width} {width} zoom={($_zoom / 100) * width} {offset}>
        {#each $connections as connection (`${connection.begin.id}${connection.end.id}`)}
          <Connector on:contextmenu={() => deleteConnection(connection)} {...connection} svgProps={svgPathProps} />
        {/each}

        {#each $store as rect (rect.id)}
          <DraggableRect {...rect} draggable={true} scale={rect.scale} {passThrough}
            on:contextmenu={(e) => createContextMenu(e, rect)}
            on:dblclick={(e) => preventDoubleClickThrough(e)}
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
              <Image {...rect} passThrough={true} trueSize={false} on:load={(e) => loadImageAspectRatio(rect, e)} />
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
                      on:mousedown={(e) => startResize(rect, point)}
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
      <!-- <div>Offset: X: {offset.x} Y: {offset.y}</div> -->
      <!-- <div>Mouse: X: {mouse.x} Y: {mouse.y}</div> -->
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
  .passThrough {
    cursor: pointer;
  }
</style>