import { expect, test } from 'vitest';
import { wireTheme } from './theme';
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

test('preview theme buttons select an explicit palette independently', () => {
  document.documentElement.className = 'light-palette';
  document.body.innerHTML =
    '<div data-theme-options><button data-theme="light" aria-controls="first"></button><button data-theme="dark" aria-controls="first"></button></div><div id="first"></div><div id="second"></div>';
  wireTheme(document);
  const light = document.querySelector<HTMLButtonElement>(
    '[data-theme="light"]'
  )!;
  const dark = document.querySelector<HTMLButtonElement>(
    '[data-theme="dark"]'
  )!;
  expect(light.getAttribute('aria-pressed')).toBe('true');
  dark.click();
  expect(document.getElementById('first')!.className).toBe('dark-palette');
  expect(document.getElementById('second')!.className).toBe('');
  expect(dark.getAttribute('aria-pressed')).toBe('true');
  expect(light.getAttribute('aria-pressed')).toBe('false');
  light.click();
  expect(document.getElementById('first')!.className).toBe('light-palette');
});

test('page theme buttons persist the palette without changing an explicit preview', () => {
  document.documentElement.className = 'dark-palette';
  document.body.innerHTML =
    '<div data-theme-options><button data-theme="light"></button><button data-theme="dark"></button></div><div id="preview" class="dark-palette"></div>';
  wireTheme(document);
  document.querySelector('button')!.click();
  expect(document.documentElement.className).toBe('light-palette');
  expect(localStorage.getItem('fcc-palette')).toBe('light');
  expect(document.getElementById('preview')!.className).toBe('dark-palette');
});
