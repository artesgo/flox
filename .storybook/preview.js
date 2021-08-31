import { configure } from '@storybook/svelte';

// import '../global.scss';

configure(require.context('../stories', true, /\.stories\.[jt]s$/), module);