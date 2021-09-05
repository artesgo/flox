// import { action } from '@storybook/addon-actions';
import RectStory from './RectStory.svelte';

export default {
  title: 'Svg/Rects',
  component: RectStory,
};

export const Rects = () => ({
  Component: RectStory,
  props: {
    rect2D: {
      width: 20,
      height: 20,
    },
    svgProps: {
      fill: '#FC0',
      stroke: '#333',
      'stroke-width': 2,
    },
    coord2D: {
      x: 40,
      y: 20,
    }
  },
});

export const DraggableRects = () => ({
  Component: RectStory,
  props: {
    draggable: true,
    rect2D: {
      width: 20,
      height: 20,
    },
    svgProps: {
      fill: '#FC0',
      stroke: '#333',
      'stroke-width': 2,
    },
    coord2D: {
      x: 40,
      y: 20,
    }
  },
});