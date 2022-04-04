/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

export interface RectProps {
  /**
   * @default {}
   */
  rect2D?: import("./").Rect2D;

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
