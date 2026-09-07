import { afterEach, expect, test, vi } from 'vitest';
import { wireCopy } from './copy';

afterEach(() => vi.unstubAllGlobals());

function setup() {
  const doc = document.implementation.createHTMLDocument();
  doc.body.innerHTML =
    '<div data-copy-group><button data-copy-url="/components/button.md">Copy as Markdown</button><span role="status" data-copy-status></span></div>';
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal('navigator', { clipboard: { writeText } });
  wireCopy(doc);
  return {
    doc,
    writeText,
    button: doc.querySelector('button')!,
    status: doc.querySelector('[role="status"]')!
  };
}

test('copies the complete fetched Markdown without changing its content', async () => {
  const { button, status, writeText } = setup();
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(new Response('# Button\n\n```tsx\nsource\n```'))
  );
  button.click();
  await vi.waitFor(() =>
    expect(writeText).toHaveBeenCalledWith('# Button\n\n```tsx\nsource\n```')
  );
  expect(status.textContent).toBe('Copied.');
});

test('reports a failed fetch without copying an error response', async () => {
  const { button, status, writeText } = setup();
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(new Response('Not found', { status: 404 }))
  );
  button.click();
  await vi.waitFor(() =>
    expect(status.textContent).toContain('Could not copy')
  );
  expect(writeText).not.toHaveBeenCalled();
  expect(button.disabled).toBe(false);
});

test('copies a usage example from its code block', async () => {
  const { doc, button, writeText } = setup();
  button.removeAttribute('data-copy-url');
  button.dataset.copyTarget = 'example';
  const pre = doc.createElement('pre');
  pre.id = 'example';
  pre.textContent = 'const x = 1;\n';
  doc.body.append(pre);
  button.click();
  await vi.waitFor(() =>
    expect(writeText).toHaveBeenCalledWith('const x = 1;\n')
  );
});
