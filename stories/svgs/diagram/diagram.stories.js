// import { action } from '@storybook/addon-actions';
import DiagramStory from './DiagramStory.svelte';

export default {
  title: 'Svg/Diagram',
  component: DiagramStory,
};

let _rects = [];

for (let i = 0; i < 100; i++) {
  _rects.push(i);
}

_rects = _rects.map((i) => {
  return {
    connections: [1],
    id: i+5,
    rect2D: {
      width: 20,
      height: 20,
    },
    coord2D: {
      x: 140,
      y: i * 20,
    },
    svgProps: {
      fill: '#FC0',
      stroke: '#333',
      'stroke-width': 2,
    }
  }
})

export const Diagram = () => ({
  Component: DiagramStory,
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
          x: 20,
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

export const DiagramPerformance = () => ({
  Component: DiagramStory,
  props: {
    rects: [
      {
        connections: [],
        id: 1,
        rect2D: {
          width: 20,
          height: 20,
        },
        coord2D: {
          x: 20,
          y: 20,
        },
        svgProps: {
          fill: '#FC0',
          stroke: '#333',
          'stroke-width': 2,
        }
      },
      ..._rects
    ],
    svgPathProps: {
      fill: 'none',
      stroke: '#333',
      'stroke-width': 2,
    },
  },
});