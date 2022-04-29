import { expect, test, describe, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import GridItemComponent from '../components/Grid/GridItem.svelte';

describe('Grid Component', () => {
  let comp;
  let getTestId;
  beforeEach(() => {
    const { getByText, component, getByTestId } = render(GridItemComponent, {
      id: 'toaster',
      row: 1,
      col: 1,
      rowSpan: 1,
      colSpan: 1
    });

    comp = component;
    getTestId = getByTestId;
  })

  test('should render', () => {
    expect(comp).toBeTruthy();
  })

  test('should get by testid', () => {
    const element = getTestId('toaster');
    expect(element).toBeTruthy();
  })
})