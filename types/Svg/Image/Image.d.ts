/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

export interface ImageProps {
  coord2D?: import("../Svg").Coord2D;

  rect2D?: import("../Svg").Coord2D;

  image?: string;

  /**
   * @default false
   */
  passThrough?: boolean;
}

export default class Image extends SvelteComponentTyped<ImageProps, {}, {}> {}
