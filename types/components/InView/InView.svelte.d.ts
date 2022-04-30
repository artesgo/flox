/// <reference types="svelte" />
import type { SvelteComponentTyped } from "svelte";

export interface InViewProps {
  /**
   * @default ""
   */
  id?: string;

  /**
   * @default false
   */
  visible?: boolean;
}

export default class InView extends SvelteComponentTyped<
  InViewProps,
  {},
  { default: {} }
> {}
