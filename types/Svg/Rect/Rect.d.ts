/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

export interface Rect2D {
  width: number;
  height: number;
  rx?: number;
  ry?: number;
}

export interface RectProps {
  /**
   * @default {}
   */
  rect2D?: Rect2D;

  /**
   * @default {}
   */
  coord2D?: import("../Svg").Coord2D;

  /**
   * @default {}
   */
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
    click: WindowEventMap["click"];
    dblclick: WindowEventMap["dblclick"];
    contextmenu: WindowEventMap["contextmenu"];
    drag: CustomEvent<any>;
    dragEnd: CustomEvent<any>;
  },
  { default: {} }
> {}
