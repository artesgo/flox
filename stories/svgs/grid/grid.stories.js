// import { action } from '@storybook/addon-actions';
import GridStory from './GridStory.svelte';

export default {
  title: 'Components/Grid',
  component: GridStory,
};

export const Grid = () => ({
  Component: GridStory,
  props: {
    height: "100vh",
    rowTemplate: "50px 1fr 50px",
    colTemplate: "50px 1fr 50px",
  },
});
