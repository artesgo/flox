// import { action } from '@storybook/addon-actions';
import DiagramStory from './DiagramStory.svelte';

export default {
  title: 'Svg/Diagram',
  component: DiagramStory,
};

function get50(startId, connection) {
  let newRects = [];
  for (let i = 0; i < 50; i++) {
    newRects.push(i);
  }
  newRects = newRects.map((i) => {
    return {
      connections: [connection],
      id: i+startId,
      rect2D: {
        width: 100,
        height: 100,
      },
      coord2D: {
        x: 140 + startId,
        y: i * 20,
      },
      svgProps: {
        fill: '#FC0',
        stroke: '#333',
        'stroke-width': 2,
      }
    }
  })
  return newRects;
}

export const Diagram = () => ({
  Component: DiagramStory,
  props: {
    rects: [
      {
        connections: [2, 3],
        id: 1,
        rect2D: {
          width: 100,
          height: 100,
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
          width: 100,
          height: 100,
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
          width: 100,
          height: 100,
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
          height: 100,
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

export const DiagramPerformanceSingle = () => ({
  Component: DiagramStory,
  props: {
    rects: [
      {
        connections: [],
        id: 1,
        rect2D: {
          width: 100,
          height: 100,
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
      ...get50(2, 1)
    ],
    svgPathProps: {
      fill: 'none',
      stroke: '#333',
      'stroke-width': 2,
    },
  },
});

export const DiagramPerformanceMulti = () => ({
  Component: DiagramStory,
  props: {
    rects: [
      {
        connections: [],
        id: 1,
        rect2D: {
          width: 100,
          height: 100,
        },
        coord2D: {
          x: 50,
          y: 20,
        },
        svgProps: {
          fill: '#FC0',
          stroke: '#333',
          'stroke-width': 2,
        }
      },
      {
        connections: [],
        id: 2,
        rect2D: {
          width: 100,
          height: 100,
        },
        coord2D: {
          x: 50,
          y: 50,
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
          width: 100,
          height: 100,
        },
        coord2D: {
          x: 50,
          y: 80,
        },
        svgProps: {
          fill: '#FC0',
          stroke: '#333',
          'stroke-width': 2,
        }
      },
      ...get50(4, 1),
      ...get50(54, 2),
      ...get50(104, 3),
    ],
    svgPathProps: {
      fill: 'none',
      stroke: '#333',
      'stroke-width': 2,
      'stroke-linecap': 'square'
    },
  },
});

export const ShortestConnection = () => ({
  Component: DiagramStory,
  props: {
    rects: [
      {
        connections: [],
        id: 1,
        rect2D: {
          width: 100,
          height: 100,
          rx: 4,
          ry: 4,
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
        connections: [1],
        id: 2,
        rect2D: {
          width: 100,
          height: 100,
          rx: 50,
          ry: 50,
        },
        coord2D: {
          x: 120,
          y: 100,
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
      'stroke-linecap': 'square'
    },
  },
});

export const Images = () => ({
  Component: DiagramStory,
  props: {
    rects: [
      {
        connections: [],
        id: 1,
        rect2D: {
          width: 100,
          height: 100,
          rx: 4,
          ry: 4,
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
        connections: [1],
        id: 2,
        rect2D: {
          width: 400,
          height: 240,
        },
        coord2D: {
          x: 120,
          y: 100,
        },
        trueSize: true,
        image: "/sun-and-moon.jpg",
        svgProps: {
          fill: '#FC0',
          stroke: '#333',
          'stroke-width': 2,
        }
      },
      {
        connections: [1],
        id: 3,
        rect2D: {
          width: 749,
          height: 999,
        },
        coord2D: {
          x: 120,
          y: 100,
        },
        image: "https://i.redd.it/yju708hygml71.jpg",
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
      'stroke-linecap': 'square'
    },
  },
});