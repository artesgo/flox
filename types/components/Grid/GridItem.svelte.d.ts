/// <reference types="svelte" />
import type { SvelteComponentTyped } from "svelte";

export interface GridItemProps {
  /**
   * @default ''
   */
  id?: string;

  /**
   * @default 1
   */
  col?: number;

  /**
   * @default 1
   */
  row?: number;

  /**
   * @default 1
   */
  colSpan?: number;

  /**
   * @default 1
   */
  rowSpan?: number;
}

export default class GridItem extends SvelteComponentTyped<
  GridItemProps,
  {},
  { default: {} }
> {}
