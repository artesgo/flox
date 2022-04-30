/// <reference types="svelte" />
import type { SvelteComponentTyped } from "svelte";

export interface PathProps {
  /**
   * @default {}
   */
  begin?: import("../Svg").Coord2D;

  /**
   * @default {}
   */
  end?: import("../Svg").Coord2D;

  /**
   * @default {}
   */
  svgProps?: import("../Svg").NativeSvgProps;
}

export default class Path extends SvelteComponentTyped<PathProps, {}, {}> {}
