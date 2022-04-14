/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

export interface ImageProps {
  /**
   * @default { x: 0, y: 0, }
   */
  coord2D?: import("../Svg").Coord2D;

  /**
   * @default undefined
   */
  rect2D?: import("../Rect/DraggableRect").Rect2D;

  /**
   * @default ''
   */
  image?: string;

  /**
   * @default ''
   */
  id?: string | number;

  /**
   * @default false
   */
  passThrough?: boolean;

  /**
   * @default true
   */
  trueSize?: boolean;
}

export default class Image extends SvelteComponentTyped<
  ImageProps,
  { resize: CustomEvent<any> },
  {}
> {}
