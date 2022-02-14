/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

export interface GridProps {
  /**
   * @default '1fr'
   */
  rowTemplate?: string;

  /**
   * @default '1fr'
   */
  colTemplate?: string;

  /**
   * @default 'auto'
   */
  height?: string;
}

export default class Grid extends SvelteComponentTyped<
  GridProps,
  {},
  { default: {} }
> {}
