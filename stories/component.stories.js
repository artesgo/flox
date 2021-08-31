import { action } from '@storybook/addon-actions';
import { Componenta } from '../src';

export default {
  title: 'Component',
  component: Componenta,
};

export const Text = () => ({
  Component: Componenta,
  props: { name: 'World', buttonText: 'Hello Button' },
  on: { click: action('clicked') },
});

export const Emoji = () => ({
  Component: Componenta,
  props: { name: '😀 😎', buttonText: '👍 💯' },
  on: { click: action('clicked') },
});
