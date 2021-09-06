/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

export type DiagramProps = {
  connections: number[];
  id: number;
  text: string;
  image: string;
  rect2D: import("../Rect/Rect").Rect2D;
  coord2D: import("../Svg").Coord2D;
  svgPathProps: import("../Svg").NativeSvgProps;
}[];

export interface DiagramProps {
  /**
   * @default []
   */
  rects?: DiagramProps[];

  /**
   * @default 0
   */
  width?: number;

  /**
   * @default 0
   */
  height?: number;

  svgPathProps?: import("../Svg").NativeSvgProps;

  /**
   * @default { fill: '#FFCC00', stroke: '#333', 'stroke-width': 2, }
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
