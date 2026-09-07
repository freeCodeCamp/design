import { expect, test } from 'vitest';
import { wirePlayground } from './playground';

test('filters previews and navigation, reports no matches, and reveals a linked component', () => {
  const doc = document;
  doc.body.innerHTML =
    '<input data-component-filter><p data-filter-status></p><div data-nav-group><a data-component-link="button" href="#button">Button</a></div><section data-component-group><div id="button" data-component="button" data-search="Button actions"></div></section>';
  wirePlayground(doc);
  const input = doc.querySelector('input')!;
  input.value = '  ACTIONS  ';
  input.dispatchEvent(new window.Event('input'));
  expect(doc.querySelector<HTMLElement>('[data-component]')!.hidden).toBe(
    false
  );
  input.value = 'missing';
  input.dispatchEvent(new window.Event('input'));
  expect(doc.querySelector<HTMLElement>('[data-component-group]')!.hidden).toBe(
    true
  );
  expect(doc.querySelector<HTMLElement>('[data-nav-group]')!.hidden).toBe(true);
  expect(doc.querySelector('[data-filter-status]')!.textContent).toContain(
    'No components'
  );
  window.history.replaceState(null, '', '#button');
  window.dispatchEvent(new window.HashChangeEvent('hashchange'));
  expect(input.value).toBe('');
  expect(doc.querySelector<HTMLElement>('[data-component]')!.hidden).toBe(
    false
  );
});

test('preview themes are independent and can return to the page theme', () => {
  document.body.innerHTML =
    '<input data-component-filter><select data-preview-theme aria-controls="first"><option value="">Page theme</option><option value="light">Light</option><option value="dark">Dark</option></select><div id="first"></div><div id="second"></div>';
  wirePlayground(document);
  const select = document.querySelector('select')!;
  select.value = 'light';
  select.dispatchEvent(new Event('change', { bubbles: true }));
  expect(
    document.getElementById('first')!.classList.contains('light-palette')
  ).toBe(true);
  expect(document.getElementById('second')!.className).toBe('');
  select.value = 'dark';
  select.dispatchEvent(new Event('change', { bubbles: true }));
  expect(document.getElementById('first')!.className).toBe('dark-palette');
  select.value = '';
  select.dispatchEvent(new Event('change', { bubbles: true }));
  expect(document.getElementById('first')!.className).toBe('');
});
