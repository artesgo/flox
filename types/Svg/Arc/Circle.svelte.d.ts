/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

export interface Circle2D {
  cx: number;
  cy: number;
  r: number;
}

export interface CircleProps {
  /**
   * @default undefined
   */
  circle2D?: Circle2D;

  /**
   * @default undefined
   */
  svgProps?: import("../Svg").NativeSvgProps;

  /**
   * @default 0
   */
  grid?: number;
}

export default class Circle extends SvelteComponentTyped<
  CircleProps,
  {
    mousedown: WindowEventMap["mousedown"];
    mouseup: WindowEventMap["mouseup"];
  },
  {}
> {}
