/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

export interface Ellipse2D {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export interface EllipseProps {
  ellipse2D?: Ellipse2D;

  svgProps?: import("../Svg").NativeSvgProps;
}

export default class Ellipse extends SvelteComponentTyped<
  EllipseProps,
  {},
  {}
> {}
