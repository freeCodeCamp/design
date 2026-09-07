import { test, expect, afterEach } from 'vitest';
import { cleanup, render, fireEvent } from '@testing-library/react';
import { Combobox } from './Combobox';

afterEach(cleanup);

const ITEMS = [
  { value: 'a', label: 'Apple' },
  { value: 'b', label: 'Banana', disabled: true },
  { value: 'c', label: 'Cherry' }
];

test('typing in the input fires onInputValueChange with current value', () => {
  let typed = '';
  const { container } = render(
    <Combobox
      items={ITEMS}
      onInputValueChange={v => (typed = v)}
      aria-label='Pick fruit'
    />
  );
  const input = container.querySelector(
    'input[role="combobox"]'
  ) as HTMLInputElement;
  fireEvent.change(input, { target: { value: 'app' } });
  expect(typed).toBe('app');
});

test('clicking an enabled option fires onValueChange with that value', () => {
  let last = '';
  const { container } = render(
    <Combobox items={ITEMS} onValueChange={v => (last = v)} aria-label='x' />
  );
  const options = container.querySelectorAll('[role="option"]');
  fireEvent.click(options[0]!);
  expect(last).toBe('a');
});

test('clicking a disabled option is a no-op', () => {
  let calls = 0;
  const { container } = render(
    <Combobox items={ITEMS} onValueChange={() => (calls += 1)} aria-label='x' />
  );
  const options = container.querySelectorAll('[role="option"]');
  fireEvent.click(options[1]!);
  expect(calls).toBe(0);
});

test('selected option has aria-selected=true', () => {
  const { container } = render(
    <Combobox items={ITEMS} value='c' aria-label='x' />
  );
  const options = container.querySelectorAll('[role="option"]');
  expect(options[2]!.getAttribute('aria-selected')).toBe('true');
  expect(options[0]!.getAttribute('aria-selected')).toBe('false');
});

test('input with inputValue but no onInputValueChange is readOnly', () => {
  const { container } = render(
    <Combobox items={ITEMS} inputValue='locked' aria-label='x' />
  );
  const input = container.querySelector('input') as HTMLInputElement;
  expect(input.readOnly).toBe(true);
});

test('loading mode renders the loading row', () => {
  const { container } = render(
    <Combobox items={[]} loading loadingMessage='Fetching…' aria-label='x' />
  );
  const loading = container.querySelector('[data-part="loading"]');
  expect(loading?.textContent).toBe('Fetching…');
  expect(
    container.querySelector('[role="listbox"]')?.getAttribute('aria-busy')
  ).toBe('true');
});

test('error message takes precedence over empty state', () => {
  const { container } = render(
    <Combobox items={[]} error='Network error' aria-label='x' />
  );
  expect(container.querySelector('[data-part="error"]')?.textContent).toBe(
    'Network error'
  );
  expect(container.querySelector('[data-part="empty"]')).toBeNull();
});

test('empty state renders when there are no items + no loading + no error', () => {
  const { container } = render(<Combobox items={[]} aria-label='x' />);
  expect(container.querySelector('[data-part="empty"]')).not.toBeNull();
});

test('keyboard selection skips disabled items and updates the input', () => {
  let last = '';
  const { getByRole } = render(
    <Combobox
      items={ITEMS}
      onValueChange={v => (last = v)}
      aria-label='Fruit'
    />
  );
  const input = getByRole('combobox') as HTMLInputElement;
  fireEvent.focus(input);
  expect(input.getAttribute('aria-expanded')).toBe('true');
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  expect(
    document.getElementById(input.getAttribute('aria-activedescendant')!)
      ?.textContent
  ).toBe('Cherry');
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(last).toBe('c');
  expect(input.value).toBe('Cherry');
  expect(input.getAttribute('aria-expanded')).toBe('false');
});

test('a disabled combobox cannot select any option', () => {
  let calls = 0;
  const { container } = render(
    <Combobox disabled items={ITEMS} onValueChange={() => calls++} />
  );
  fireEvent.click(container.querySelector('[role="option"]')!);
  expect(calls).toBe(0);
});

test('loading removes the active descendant and clicking reopens after Escape', () => {
  const { getByRole, rerender } = render(<Combobox items={ITEMS} />);
  const input = getByRole('combobox');
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  expect(input.hasAttribute('aria-activedescendant')).toBe(true);
  rerender(<Combobox items={ITEMS} loading />);
  expect(input.hasAttribute('aria-activedescendant')).toBe(false);
  fireEvent.keyDown(input, { key: 'Escape' });
  fireEvent.click(input);
  expect(input.getAttribute('aria-expanded')).toBe('true');
});
