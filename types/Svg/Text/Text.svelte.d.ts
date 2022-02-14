/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

export interface TextProps {
  /**
   * @default {}
   */
  coord2D?: import("../Svg").Coord2D;

  /**
   * @default {}
   */
  rect2D?: import("../Svg").Coord2D;

  /**
   * @default ''
   */
  text?: string;

  /**
   * @default { x: 0, y: 0, }
   */
  padding?: import("../Svg").Coord2D;

  /**
   * @default false
   */
  passThrough?: boolean;
}

export default class Text extends SvelteComponentTyped<TextProps, {}, {}> {}