import { test, expect, afterEach } from 'vitest';
import { cleanup, render, fireEvent } from '@testing-library/react';
import { Tooltip } from './Tooltip';
afterEach(cleanup);
test('Escape dismisses a hover tooltip with focus elsewhere', () => {
  const { container } = render(
    <Tooltip content='Help'>
      <button>Info</button>
    </Tooltip>
  );
  const tip = container.querySelector('.tip')!;
  fireEvent.mouseEnter(tip);
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(tip.hasAttribute('data-dismissed')).toBe(true);
});
