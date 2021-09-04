
import DuplicateDiagramStory from './DuplicateDiagramStory.svelte';

export default {
  title: 'Svg/Diagram',
  component: DuplicateDiagramStory,
};

export const MultipleDiagrams = () => ({
  Component: DuplicateDiagramStory,
  props: {
    rects: [
      {
        connections: [2, 3],
        id: 1,
        rect2D: {
          width: 20,
          height: 20,
        },
        coord2D: {
          x: 40,
          y: 20,
        },
        svgProps: {
          fill: '#FC0',
          stroke: '#333',
          'stroke-width': 2,
        }
      },
      {
        connections: [3],
        id: 2,
        rect2D: {
          width: 20,
          height: 20,
        },
        coord2D: {
          x: 120,
          y: 120,
        },
        svgProps: {
          fill: '#FC0',
          stroke: '#333',
          'stroke-width': 2,
        }
      },
      {
        connections: [],
        id: 3,
        rect2D: {
          width: 20,
          height: 20,
        },
        coord2D: {
          x: 40,
          y: 80,
        },
        svgProps: {
          fill: '#FC0',
          stroke: '#333',
          'stroke-width': 2,
        }
      },
      {
        connections: [],
        id: 4,
        rect2D: {
          width: 50,
          height: 20,
        },
        coord2D: {
          x: 140,
          y: 80,
        },
        text: 'test',
        padding: {
          x: 4,
          y: 4,
        },
        svgProps: {
          fill: '#FC0',
          stroke: '#333',
          'stroke-width': 2,
        }
      },
    ],
    svgPathProps: {
      fill: 'none',
      stroke: '#333',
      'stroke-width': 2,
    },
  },
});