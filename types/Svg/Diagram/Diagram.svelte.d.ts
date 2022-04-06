/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

export type Rect2D = import("../Rect/Rect").Rect2D;

export type Coord2D = import("../Svg").Coord2D;

export type NativeSvgProps = import("../Svg").NativeSvgProps;

export interface DiagramRect {
  connections?: number[];
  id: number;
  text?: string;
  image?: string;
  rect2D: Rect2D;
  coord2D: Coord2D;
  svgProps?: NativeSvgProps;
}

export interface DiagramProps {
  /**
   * @default []
   */
  rects?: DiagramRect[];

  /**
   * @default 0
   */
  width?: number;

  /**
   * @default 0
   */
  height?: number;

  /**
   * @default undefined
   */
  svgPathProps?: NativeSvgProps;

  /**
   * @default { template: true, controls: true, layers: true, }
   */
  show?: { template: boolean; controls: boolean; layers: boolean };

  /**
   * @default [{ connections: [], rect2D: { width: 20, height: 20, rx: 40, ry: 40 }, coord2D: { x: 10, y: 10, }, svgProps: { fill: '#FFCC00', stroke: '#333', 'stroke-width': 2, } }, { connections: [], rect2D: { width: 20, height: 20, rx: 4, ry: 4, }, coord2D: { x: 10, y: 40, }, svgProps: { fill: '#FFCC00', stroke: '#333', 'stroke-width': 2, } }, { connections: [], rect2D: { width: 20, height: 20, rx: 0, ry: 0, }, coord2D: { x: 10, y: 70, }, svgProps: { fill: '#FFCC00', stroke: '#333', 'stroke-width': 2, } }]
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
      svgProps: {
        fill: "#FFCC00";
        stroke: "#333";
        "stroke-width": 2;
      };
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
      svgProps: {
        fill: "#FFCC00";
        stroke: "#333";
        "stroke-width": 2;
      };
    },
    {
      connections: [];
      rect2D: {
        width: 20;
        height: 20;
        rx: 0;
        ry: 0;
      };
      coord2D: {
        x: 10;
        y: 70;
      };
      svgProps: {
        fill: "#FFCC00";
        stroke: "#333";
        "stroke-width": 2;
      };
    }
  ];

  /**
   * @default 100
   */
  zoom?: number;
}

export default class Diagram extends SvelteComponentTyped<
  DiagramProps,
  { contextmenu: WindowEventMap["contextmenu"] },
  {}
> {}
