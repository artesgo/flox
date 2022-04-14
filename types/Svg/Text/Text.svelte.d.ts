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
  rect2D?: import("../Rect/DraggableRect").Rect2D;

  /**
   * @default ''
   */
  text?: string;

  /**
   * @default { x: 5, y: 5, }
   */
  padding?: import("../Svg").Coord2D;

  /**
   * @default undefined
   */
  editing?: boolean;
}

export default class Text extends SvelteComponentTyped<
  TextProps,
  { updateText: CustomEvent<any> },
  {}
> {}
