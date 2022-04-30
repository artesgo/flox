/// <reference types="svelte" />
import type { SvelteComponentTyped } from "svelte";

export interface Ellipse2D {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export interface EllipseProps {
  /**
   * @default {}
   */
  ellipse2D?: Ellipse2D;

  /**
   * @default {}
   */
  svgProps?: import("../Svg").NativeSvgProps;
}

export default class Ellipse extends SvelteComponentTyped<
  EllipseProps,
  {},
  {}
> {}
