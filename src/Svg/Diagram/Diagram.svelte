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
  import { createActionsStore } from './Actions.store.ts';
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
  const connections = createConnectionsStore($store);
  const actions = createActionsStore();
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
  let action;
  function dragStart(rect) {
    action = {
      before: {
        id: rect.id,
        coord2D: {...rect.coord2D }
      }
    }
  }

  function dragUpdate(rect, event, isDragging) {
    dragging = isDragging;
    store.moveRect(rect, event, zoom);
    connections.updateClosest($store);
    connections.updateConnection(rect, event, zoom);
  }

  function dragEnd(rect) {
    action = {
      ...action,
      after: {
        id: rect.id,
        coord2D: { ...rect.coord2D }
      }
    }
    if (action.before.coord2D.x !== action.after.coord2D.x || action.before.coord2D.y !== action.after.coord2D.y) {
      actions.add(action);
    }
    dragging = false;
  }

  // deprecated
  function dragEndTemplate(e, template) {
    dragging = false;
    const rect = {
      ...template,
      rect2D: {
        width: template.rect2D.width * 5,
        height: template.rect2D.height * 5,
        rx: template.rect2D.rx * 5,
        ry: template.rect2D.ry * 5,
      }
    }
    addAt(rect);
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
    const rect = {
      ...template,
      rect2D: {
        width: template.rect2D.width * 5,
        height: template.rect2D.height * 5,
        rx: template.rect2D.rx * 5,
        ry: template.rect2D.ry * 5,
      }
    }
    store.addRect(coord, rect);
    lastAddedShape()
  }

  function syncPosition(e) {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
  }

  //#region focus indicator
  function focusRect(rect) {
    if (!dragging) {
      $focused = rect;
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
    action = {
      before: {
        id: rect.id,
        text: rect.text ? rect.text : '',
      },
      after: {
        id: rect.id,
        text: detail ? detail : '',
      }
    }
    if (action.before !== action.after) {
      actions.add(action);
    }
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
    connections.markConnectionsDeleted(id);
    if (remove) {
      $focused = null;
    }
  }

  function deleteConnection(conn) {
    connections.markConnectionDeleted(conn);
    actions.add({
      connection: true,
      before: {
        conn,
        deleted: false,
      },
      after: {
        conn,
        deleted: true,
      }
    });
    stage.focus();
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
    action = {
      before: {
        id: resizeTarget.id,
        coord2D: { ...resizeTarget.coord2D },
        rect2D: { ...resizeTarget.rect2D }
      }
    }
    resizePoint = point;
  }

  function resizeEnd() {
    if (resizeTarget) {
      resizing = false;
      store.resetOversize();
      action = {
        ...action,
        after: {
          id: resizeTarget.id,
          coord2D: { ...resizeTarget.coord2D },
          rect2D: { ...resizeTarget.rect2D }
        }
      }
      if (action.before !== action.after) {
        actions.add(action);
      }
      resizeTarget = null;
    }
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
  function paste() {
    navigator.clipboard.readText()
      .then(data => {
        // check the copied text
        if (data.match(/\.(jpeg|jpg|gif|png|webp)$/)) {
          pasteImage(data);
        } else if (data !== '') {
          updateText({id: $focused.id}, {detail: data});
        } else if (!!copiedTemplate) {
          copiedTemplate.coord2D = getAdjustedCoords();
          copiedTemplate = cloneTemplate(copiedTemplate);
          store.addRect(copiedTemplate.coord2D, copiedTemplate);
          lastAddedShape();
        }
        navigator.clipboard.writeText('');
      });
  }

  function lastAddedShape() {
    const [last] = [...$store].reverse();
    actions.add({
      before: {
        id: last.id,
        deleted: true,
      },
      after: {
        id: last.id,
        deleted: false
      }
    });
  }

  function onKey(e) {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
      if (e.key === "v") {
        paste();
        return;
      }
      if (e.key === "c" && $focused) {
        // use selected shape as new template
        const found = $store.find(r => r.id === $focused.id);
        copiedTemplate = cloneTemplate(found);
        return;
      }
      if (e.key === "x" && $focused) {
        // use selected shape as new template
        const found = $store.find(r => r.id === $focused.id);
        copiedTemplate = cloneTemplate(found);
        deleteRect($focused.id, false);
        // refocus stage as deletions unfocus it
        stage.focus();
        return;
      }
      if (e.key === "z") {
        actions.undo();
        if ($actions.action) {
          if ($actions.action.connection) {
            connections.unmarkConnectionDeleted($actions.action.before.conn);
          } else {
            store.applyAction($actions.action.before);
            stage.focus();
            if ($actions.action.before.deleted) {
              connections.markConnectionsDeleted($actions.action.before.id);
            }
            dragUpdate($actions.action.before, {
              detail: {dx: 0, dy: 0}
            }, false)
          }
        }
        return;
      }
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
      if (e.key === "Z") {
        actions.redo();
        if ($actions.action) {
          if ($actions.action.connection) {
            connections.markConnectionDeleted($actions.action.before.conn)
          } else {
            store.applyAction($actions.action.after);
            stage.focus();
            if ($actions.action.before.deleted) {
              connections.unmarkConnectionsDeleted($actions.action.before.id);
            }
            dragUpdate($actions.action.after, {
              detail: {dx: 0, dy: 0}
            }, false)
          }
        }
        return;
      }
    }
    if (e.code === "Space" || e.key === ' ') {
      passThrough = true;
      return;
    }
    if (e.code === 'Backspace' || e.code === 'Delete') {
      action = {
        before: {
          id: $focused.id,
          deleted: false,
        },
        after: {
          id: $focused.id,
          deleted: true,
        }
      }
      connections.markConnectionsDeleted($focused.id);
      actions.add(action);
      store.applyAction(action.after);
      stage.focus();
      return;
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
      rect2D: {
        ...template.rect2D
      }
    }
  }

  function pasteImage(url) {
    if (!!$focused) {
      action = {
        before: {
          id: $focused.id,
          image: $focused.image,
        },
        after: {
          id: $focused.id,
          image: url
        }
      }
      actions.add(action);
      store.updateImage({id: $focused.id}, url)
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
      
      dragUpdate(resizeTarget, {
        detail: {dx: 0, dy: 0}
      });
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
    if ($focused && $focused.id === rect.id) {
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
        <div class:sr-only={!show.descriptions}>Toggle Templates</div></button>
      <button class:active={showResizing} on:click={setResize}><Expand />
        <div class:sr-only={!show.descriptions}>Resize</div></button>
      <button class:active={showConnections} on:click={setConnections}><Link />
        <div class:sr-only={!show.descriptions}>Connect</div></button>
      <button class:active={zoom === 100} on:click={resetZoom}><Magnifier />
        <div class:sr-only={!show.descriptions}>Reset Zoom</div></button>
      <button on:click={() => onWheel({ deltaY: -1})}><ZoomIn />
        <div class:sr-only={!show.descriptions}>Zoom In</div></button>
      <button on:click={() => onWheel({ deltaY: 1})}><ZoomOut />
        <div class:sr-only={!show.descriptions}>Zoom Out</div></button>
      <button class:active={show.layers} on:click={() => show.layers = !show.layers}><Layers />
        <div class:sr-only={!show.descriptions}>Toggle Layers {show.layers ? 'Off' : 'On'}</div></button>
      <!-- <button class:active={grid} on:click={() => updateGrid(25)}><Grid />
        <div class:sr-only={show.descriptions}>Toggle Grid</div></button> -->
      <button class:active={show.descriptions} on:click={() => show.descriptions = !show.descriptions}><Help />
        <div class:sr-only={!show.descriptions}>Toggle Descriptions</div></button>
    </div>
  {/if}
  <div class="diagram-wrapper">
    {#if show.template}
      <div class="diagram-templates" transition:fly={{duration: 300, y: -100}}>
        <Svg width={50} height={600}>
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
      on:mouseup={resizeEnd}
      on:wheel|preventDefault={onWheel}
      on:keydown={onKey}
      on:keyup={onRelease}
      tabindex="0">
      <Svg height={width} {width} zoom={($_zoom / 100) * width} {offset}>
        {#each $connections as connection (`${connection.begin.id}-${connection.end.id}`)}
          {#if !connection.deleted}
            <Connector on:contextmenu={() => deleteConnection(connection)} {...connection} svgProps={svgPathProps} />
          {/if}
        {/each}

        {#each $store as rect (rect.id)}
          {#if !rect.deleted}
            <DraggableRect {...rect} draggable={true} scale={rect.scale} {passThrough}
              on:contextmenu={(e) => createContextMenu(e, rect)}
              on:dblclick={(e) => preventDoubleClickThrough(e)}
              on:dragStart={() => dragStart(rect)}
              on:drag={(e) => dragUpdate(rect, e, true)}
              on:dragEnd={() => dragEnd(rect)}
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
          {/if}
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