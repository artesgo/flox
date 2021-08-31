// import { action } from '@storybook/addon-actions';
import PathStory from './PathStory.svelte';
import ConnectorStory from './ConnectorStory.svelte'

export default {
  title: 'Svg/Path',
  component: PathStory,
};

export const Path = () => ({
  Component: PathStory,
});
export const Connector = () => ({
  Component: ConnectorStory,
});