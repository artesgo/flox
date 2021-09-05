/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

export interface Rect2D {
  width: number;
  height: number;
  rx: number;
  ry: number;
}

export interface RectProps {
  rect2D?: Rect2D;

  coord2D?: import("../Svg").Coord2D;

  svgProps?: import("../Svg").NativeSvgProps;

  draggable?: boolean;
}

export default class Rect extends SvelteComponentTyped<
  RectProps,
  {
    mouseover: WindowEventMap["mouseover"];
    focus: WindowEventMap["focus"];
    mouseleave: WindowEventMap["mouseleave"];
    blur: WindowEventMap["blur"];
    mousedown: WindowEventMap["mousedown"];
    mouseup: WindowEventMap["mouseup"];
    dblclick: WindowEventMap["dblclick"];
    contextmenu: WindowEventMap["contextmenu"];
    drag: CustomEvent<any>;
    dragEnd: CustomEvent<any>;
  },
  { default: {} }
> {}
