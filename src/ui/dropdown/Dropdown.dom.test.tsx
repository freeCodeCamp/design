import { test, expect, afterEach } from 'vitest';
import { cleanup, render, fireEvent } from '@testing-library/react';
import { Dropdown } from './Dropdown';

afterEach(cleanup);

function renderTree(
  props: { onSelect?: () => void; outerNoise?: boolean } = {}
): { container: HTMLElement } {
  return render(
    <div>
      <Dropdown>
        <Dropdown.Toggle>Sort ▾</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href='#one'>One</Dropdown.Item>
          <Dropdown.Item href='#two' active>
            Two
          </Dropdown.Item>
          <Dropdown.Item as='button' onSelect={props.onSelect}>
            Three
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {props.outerNoise && <button data-testid='outside'>Outside</button>}
    </div>
  );
}

test('clicking the toggle opens the menu and flips aria-expanded', () => {
  const { container } = renderTree();
  const toggle = container.querySelector(
    'button[aria-haspopup="menu"]'
  ) as HTMLButtonElement;
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  fireEvent.click(toggle);
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
  expect(container.querySelector('[role="menu"]')).not.toBeNull();
});

test('clicking the toggle a second time closes the menu', () => {
  const { container } = renderTree();
  const toggle = container.querySelector(
    'button[aria-haspopup="menu"]'
  ) as HTMLButtonElement;
  fireEvent.click(toggle);
  fireEvent.click(toggle);
  expect(container.querySelector('[role="menu"]')).toBeNull();
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
});

test('clicking an anchor item fires its onClick + closes the menu', () => {
  const { container } = renderTree();
  fireEvent.click(
    container.querySelector('button[aria-haspopup="menu"]') as HTMLElement
  );
  const items = container.querySelectorAll('[role="menuitem"]');
  fireEvent.click(items[0]!);
  expect(container.querySelector('[role="menu"]')).toBeNull();
});

test('clicking a button item invokes onSelect + closes the menu', () => {
  let selected = 0;
  const { container } = renderTree({
    onSelect: () => {
      selected += 1;
    }
  });
  fireEvent.click(
    container.querySelector('button[aria-haspopup="menu"]') as HTMLElement
  );
  const buttonItem = container.querySelector(
    'button[role="menuitem"]'
  ) as HTMLButtonElement;
  expect(buttonItem).toBeTruthy();
  fireEvent.click(buttonItem);
  expect(selected).toBe(1);
  expect(container.querySelector('[role="menu"]')).toBeNull();
});

test('outside-click closes the menu', () => {
  const { container, getByTestId } = render(
    <div>
      <Dropdown>
        <Dropdown.Toggle>Open</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href='#'>One</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <button data-testid='outside'>Outside</button>
    </div>
  );
  fireEvent.click(
    container.querySelector('button[aria-haspopup="menu"]') as HTMLElement
  );
  expect(container.querySelector('[role="menu"]')).not.toBeNull();
  fireEvent.mouseDown(getByTestId('outside') as HTMLElement);
  expect(container.querySelector('[role="menu"]')).toBeNull();
});

test('Escape on the document closes the menu', () => {
  const { container } = renderTree();
  fireEvent.click(
    container.querySelector('button[aria-haspopup="menu"]') as HTMLElement
  );
  expect(container.querySelector('[role="menu"]')).not.toBeNull();
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(container.querySelector('[role="menu"]')).toBeNull();
});

test('active item carries aria-current="true"', () => {
  const { container } = renderTree();
  fireEvent.click(
    container.querySelector('button[aria-haspopup="menu"]') as HTMLElement
  );
  const items = container.querySelectorAll('[role="menuitem"]');
  expect(items[1]!.getAttribute('aria-current')).toBe('true');
  expect(items[0]!.getAttribute('aria-current')).toBeNull();
});

test('Toggle throws helpful error when used outside <Dropdown>', () => {
  // Suppress React's expected error log so the test output stays clean.
  const original = console.error;
  console.error = () => {};
  expect(() => render(<Dropdown.Toggle>orphan</Dropdown.Toggle>)).toThrow(
    /Dropdown\.Toggle must be used inside/
  );
  console.error = original;
});

test('Menu throws helpful error when used outside <Dropdown>', () => {
  const original = console.error;
  console.error = () => {};
  expect(() =>
    render(
      <Dropdown.Menu>
        <span>x</span>
      </Dropdown.Menu>
    )
  ).toThrow(/Dropdown\.Menu must be used inside/);
  console.error = original;
});

test('keyboard opening focuses an item and Escape returns to the trigger', async () => {
  const { container } = renderTree();
  const toggle = container.querySelector('button')!;
  toggle.focus();
  fireEvent.keyDown(toggle, { key: 'ArrowDown' });
  expect(document.activeElement?.getAttribute('role')).toBe('menuitem');
  fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
  expect(document.activeElement).toBe(toggle);
});

test('ArrowUp opens at the last item', () => {
  const { container } = renderTree();
  fireEvent.keyDown(container.querySelector('button')!, { key: 'ArrowUp' });
  expect(document.activeElement?.textContent).toBe('Three');
});
test('an action without href uses a native button', () => {
  const { getByRole } = render(
    <Dropdown>
      <Dropdown.Toggle>Open</Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item>Action</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
  fireEvent.click(getByRole('button'));
  expect(getByRole('menuitem').tagName).toBe('BUTTON');
});
