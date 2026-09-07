import { afterEach, expect, test, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import { Details } from '../ui/modal/example';
import { Certifications } from '../ui/data-table/example';
import { Example as CardExample } from '../ui/card/example';
import { Drill } from '../ui/tile-matcher/example';
import { Example as SelectExample } from '../ui/select/example';
import { Example as TextareaExample } from '../ui/textarea/example';
import { renderComponentPage } from './registry-md';

afterEach(cleanup);

test('the tile example uses stable order across independent renders', () => {
  const random = vi.spyOn(Math, 'random');
  try {
    random.mockReturnValue(0.1);
    const first = renderToString(<Drill />);
    random.mockReturnValue(0.9);
    expect(renderToString(<Drill />)).toBe(first);
  } finally {
    random.mockRestore();
  }
});

test('form examples keep visible labels', () => {
  render(
    <>
      <SelectExample />
      <TextareaExample />
    </>
  );
  expect(screen.getByRole('combobox', { name: 'Difficulty' })).toBeTruthy();
  expect(screen.getByRole('textbox', { name: 'Bio' })).toBeTruthy();
});

test('the copied modal example opens and closes its dialog', async () => {
  render(<Details />);
  fireEvent.click(screen.getByRole('button', { name: 'View details' }));
  expect(await screen.findByRole('dialog')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Continue learning' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
});

test('the copied table example sorts its rows', () => {
  render(<Certifications />);
  const rows = () =>
    screen
      .getAllByRole('row')
      .slice(1)
      .map(row => row.textContent);
  expect(rows()[0]).toContain('Responsive Web Design');
  fireEvent.click(screen.getByRole('button', { name: /Certification/ }));
  expect(rows()[0]).toContain('JavaScript');
});

test('the Card reference includes CSS for its rendered classes', () => {
  const { container } = render(<CardExample />);
  const page = renderComponentPage({
    slug: 'card',
    title: 'Card',
    summary: '',
    category: 'data-display'
  });
  const css = [...page.matchAll(/```css\n([\s\S]*?)\n```/g)]
    .map(match => match[1])
    .join('\n');
  for (const element of container.querySelectorAll('[class]')) {
    for (const name of element.classList)
      expect(css, name).toContain(`.${name}`);
  }
});

test('form stepper advances and can restart', async () => {
  const { Example } = await import('../ui/form-stepper/example');
  render(<Example />);
  fireEvent.click(screen.getByRole('button', { name: 'Next' }));
  expect(screen.getByText('Choose your learning goals.')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Next' }));
  fireEvent.click(screen.getByRole('button', { name: 'Start again' }));
  expect(screen.getByText('Create your account.')).toBeTruthy();
});

test('dropdown example displays the selected sort order', async () => {
  const { Example } = await import('../ui/dropdown/example');
  render(<Example />);
  fireEvent.click(screen.getByRole('button', { name: /Sort/ }));
  fireEvent.click(screen.getByRole('menuitem', { name: 'Alphabetical' }));
  expect(screen.getByRole('status').textContent).toContain('Alphabetical');
});
