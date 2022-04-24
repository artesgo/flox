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
   * @default 100
   */
  scale?: number;

  /**
   * @default undefined
   */
  editing?: boolean;
}

export default class Text extends SvelteComponentTyped<
  TextProps,
  {
    keydown: WindowEventMap["keydown"];
    keyup: WindowEventMap["keyup"];
    keypress: WindowEventMap["keypress"];
    updateText: CustomEvent<any>;
  },
  {}
> {}
