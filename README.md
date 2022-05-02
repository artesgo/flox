# Artesgo-flox

## Installation

 `npm install -D artesgo-flox`

## Usage

[flox svelte REPL](https://svelte.dev/repl/48a0334cd2d249b185e97f9fbbd19f40?version=3.48.0)

## Completed Features

### Rendering

* Shapes from data binding
* Display Images
* Display Text
* Edit Text
* Dynamic Connections
* Zoom in and out
* Layers
  * Display shape list
  * Reorder shapes in list
  * Display shape props
* Resize
  * Resize images keeps container aspect ratio

### Mouse / Clicks

* Navigate Canvas via Click and Drag
* Double Click to add shape at mouse position
* Resize
  * Hover over shapes to view resize points
  * Drag corners around to resize a shape
  * prioritize height when resizing container to img aspect ratio
* Connections
  * Hover over shapes to view connection points
  * Drag connection points to existing Rect
  * Drag connection point creates new connection preview
  * Right Click connections to delete
Minimum size for shapes

### Keyboard Events
* Deletes a selected shape and its connection with Delete/Backspace keys
* Double click, edit mode for item
* Copy and Paste Shapes
* Shapes are in tab order

## Fixes
* Resize Snap to Grid
  * move on grid
  * resize images keeps container aspect ratio (not working in firefox)
* Shapes are in tab order
  * Need to adjust what is read out by screen readers

## TODO:

## keyboard events
Ctrl Z
- keep reference to last item
- keep state list
Ctrl Shift Z

## Rendering

* Change Font Size
* Context Menu (Challenge, not to be affected by zoom)
  * Send to Back
  * Bring to Front
  * Paste Img Url
  * Paste Text
  * Delete

## Next Version
* Drag and adjust connection midpoints
* Right click context menu
* Touch Interaction (mobile)
* Select multiple shapes with selection box
  * Remove Click and Drag on background canvas
  * Pan canvas with Spacebar only

## Nice to have
Custom Svg Objects

## Nice Surprises
PNGs have transparency