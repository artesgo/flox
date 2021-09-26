// import { action } from '@storybook/addon-actions';
import InViewStory from './InViewStory.svelte';

export default {
  title: 'Components/InView',
  component: InViewStory,
};

export const InView = () => ({
  Component: InViewStory,
  props: {
    id: "id1",
  },
});
