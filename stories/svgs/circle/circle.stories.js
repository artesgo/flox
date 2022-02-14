// import { action } from '@storybook/addon-actions';
import CircleStory from './CircleStory.svelte';

export default {
  title: 'Svg/Circle',
  component: CircleStory,
};

export const Circle = () => ({
  Component: CircleStory,
  props: {
    circle2D: {
      cx: 22,
      cy: 22,
      r: 20,
    }, svgProps: {
      x: 30,
      y: 40,
      fill: '#FC0',
      stroke: '#333',
      'stroke-width': 2,
    }
  },
});

export const DraggableCircle = () => ({
  Component: CircleStory,
  props: {
    draggable: true,
    circle2D: {
      cx: 22,
      cy: 22,
      r: 20,
    }, svgProps: {
      x: 30,
      y: 40,
      fill: '#FC0',
      stroke: '#333',
      'stroke-width': 2,
    }
  },
});