/// <reference types="svelte" />
import type { SvelteComponentTyped } from "svelte";

export interface RectProps {
  /**
   * @default undefined
   */
  rect2D?: import("./DraggableRect").Rect2D;

  /**
   * @default undefined
   */
  svgProps?: import("../Svg").NativeSvgProps;
}

export default class Rect extends SvelteComponentTyped<
  RectProps,
  {
    mousedown: WindowEventMap["mousedown"];
    mouseup: WindowEventMap["mouseup"];
  },
  {}
> {}
