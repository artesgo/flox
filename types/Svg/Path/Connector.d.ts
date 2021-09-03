/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

export interface ConnectorProps {
  begin?: import("../Svg").Coord2D;

  end?: import("../Svg").Coord2D;

  svgProps?: import("../Svg").NativeSvgProps;

  /**
   * @default true
   */
  horizontal?: boolean;
}

export default class Connector extends SvelteComponentTyped<
  ConnectorProps,
  { contextmenu: WindowEventMap["contextmenu"] },
  {}
> {}
