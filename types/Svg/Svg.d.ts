/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

export interface Coord2D {
  x: number;
  y: number;
}

export type Linecap = "round" | "butt" | "square";

export interface NativeSvgProps {
  fill: string;
  "stroke-width": number;
  "stroke-linecap": Linecap;
  stroke: string;
}

export interface SvgProps {
  width?: undefined;

  height?: undefined;

  id?: undefined;
}

export default class Svg extends SvelteComponentTyped<
  SvgProps,
  {},
  { default: {} }
> {}
