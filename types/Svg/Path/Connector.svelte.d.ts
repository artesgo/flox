/// <reference types="svelte" />
import type { SvelteComponentTyped } from "svelte";

export interface ConnectorProps {
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

  /**
   * @default true
   */
  horizontal?: boolean;
}

export default class Connector extends SvelteComponentTyped<
  ConnectorProps,
  {
    contextmenu: WindowEventMap["contextmenu"];
    focus: WindowEventMap["focus"];
  },
  {}
> {}
