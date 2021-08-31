/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

export interface Circle2D {
  cx: number;
  cy: number;
  r: number;
}

export interface CircleProps {
  circle2D?: Circle2D;

  svgProps?: import("../Svg").NativeSvgProps;
}

export default class Circle extends SvelteComponentTyped<CircleProps, {}, {}> {}
