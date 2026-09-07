import { test, expect, afterEach } from 'vitest';
import { cleanup, render, fireEvent } from '@testing-library/react';
import { Toast, createToaster, Toaster } from './Toast';

afterEach(cleanup);

test('dismissible toast renders a close button with aria-label', () => {
  const { container } = render(
    <Toast variant='success' title='Saved' onDismiss={() => {}} />
  );
  const close = container.querySelector('button.toast__close');
  expect(close).not.toBeNull();
  expect(close?.getAttribute('aria-label')).toBe('Dismiss');
});

test('clicking the close button fires onDismiss', () => {
  let calls = 0;
  const { container } = render(
    <Toast
      variant='info'
      title='X'
      onDismiss={() => {
        calls += 1;
      }}
    />
  );
  fireEvent.click(container.querySelector('button.toast__close')!);
  expect(calls).toBe(1);
});

test('dismissible={false} omits the close button', () => {
  const { container } = render(
    <Toast variant='info' title='No close' dismissible={false} />
  );
  expect(container.querySelector('.toast__close')).toBeNull();
});

test('danger variant upgrades role to alert (interrupts AT)', () => {
  const { container } = render(<Toast variant='danger' title='Boom' />);
  expect(container.querySelector('[role="alert"]')).not.toBeNull();
});

test('non-danger variants stay polite (role=status)', () => {
  const { container } = render(<Toast variant='success' title='OK' />);
  expect(container.querySelector('[role="status"]')).not.toBeNull();
});

test('createToaster returns an object with create() (Ark factory contract)', () => {
  const t = createToaster({});
  expect(typeof t.create).toBe('function');
});

test('<Toaster> renders the wrapping div with toaster class', () => {
  const t = createToaster({});
  const { container } = render(<Toaster toaster={t} />);
  expect(container.querySelector('.toaster')).not.toBeNull();
});
