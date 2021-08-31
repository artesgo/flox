/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

export interface PathProps {
  begin?: import("../Svg").Coord2D;

  end?: import("../Svg").Coord2D;

  svgProps?: import("../Svg").NativeSvgProps;
}

export default class Path extends SvelteComponentTyped<PathProps, {}, {}> {}
