import { expect, test, describe, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import GridComponent from '../components/Grid/Grid.svelte';
import { createSlots } from './slot-utils';

describe('Grid Component', () => {
  let comp;
  let getText;
  beforeEach(() => {
    const element = document.createElement('div');
    const text = document.createTextNode("toaster");
    element.appendChild(text);
    const { getByText, component } = render(GridComponent, {
      rowTemplate: '1fr',
      colTemplate: '1fr',
      height: 'auto',
      $$slots: createSlots({ default: element }),
      $$scope: {},
    });

    comp = component;
    getText = getByText;
  })

  test('should render', () => {
    expect(comp).toBeTruthy();
  })

  test('should have projected content', () => {
    expect(getText('toaster')).toBeTruthy();
  })
})