/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

export interface DiagramProps {
  /**
   * @default []
   */
  rects?: {
    connections: number[];
    id: number;
    rect2D: import("../Rect/Rect").Rect2D;
    coord2D: import("../Svg").Coord2D;
    svgPathProps: import("../Svg").NativeSvgProps;
  }[];

  width?: number;

  height?: number;

  svgPathProps?: import("../Svg").NativeSvgProps;

  /**
   * @default { fill: '#FC0', stroke: '#333', 'stroke-width': 2, }
   */
  svgPropTemplate?: import("../Svg").NativeSvgProps;

  /**
   * @default [{ connections: [], rect2D: { width: 20, height: 20, rx: 40, ry: 40 }, coord2D: { x: 10, y: 10, }, svgProps: svgPropTemplate }, { connections: [], rect2D: { width: 20, height: 20, rx: 4, ry: 4, }, coord2D: { x: 10, y: 40, }, svgProps: svgPropTemplate }, { connections: [], rect2D: { width: 20, height: 20, }, coord2D: { x: 10, y: 70, }, svgProps: svgPropTemplate }]
   */
  templates?: [
    {
      connections: [];
      rect2D: {
        width: 20;
        height: 20;
        rx: 40;
        ry: 40;
      };
      coord2D: {
        x: 10;
        y: 10;
      };
      svgProps: svgPropTemplate;
    },
    {
      connections: [];
      rect2D: {
        width: 20;
        height: 20;
        rx: 4;
        ry: 4;
      };
      coord2D: {
        x: 10;
        y: 40;
      };
      svgProps: svgPropTemplate;
    },
    {
      connections: [];
      rect2D: {
        width: 20;
        height: 20;
      };
      coord2D: {
        x: 10;
        y: 70;
      };
      svgProps: svgPropTemplate;
    }
  ];
}

export default class Diagram extends SvelteComponentTyped<
  DiagramProps,
  { contextmenu: WindowEventMap["contextmenu"] },
  {}
> {}
