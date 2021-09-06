/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

export interface ImageProps {
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
  image?: string;

  /**
   * @default false
   */
  passThrough?: boolean;
}

export default class Image extends SvelteComponentTyped<ImageProps, {}, {}> {}
