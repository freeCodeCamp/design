import { test, expect, afterEach } from 'vitest';
import { cleanup, render, fireEvent } from '@testing-library/react';
import { useState, type JSX } from 'react';
import { DataTable } from './DataTable';
import type { DataTableSort, DataTableColumn } from './DataTable';

afterEach(cleanup);

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
}

const ROWS: User[] = [
  { id: 'a', name: 'Ada', email: 'ada@x', status: 'active' },
  { id: 'b', name: 'Ben', email: 'ben@x', status: 'pending' },
  { id: 'c', name: 'Cas', email: 'cas@x', status: 'archived' }
];

const COLUMNS: DataTableColumn<User>[] = [
  { id: 'name', header: 'Name', accessor: 'name', sortable: true, width: 200 },
  { id: 'email', header: 'Email', accessor: (r: User) => r.email },
  { id: 'status', header: 'Status', accessor: 'status', align: 'right' }
];

test('clicking a sortable header cycles asc → desc → null', () => {
  function Probe(): JSX.Element {
    const [sort, setSort] = useState<DataTableSort | null>(null);
    return (
      <DataTable
        columns={COLUMNS}
        rows={ROWS}
        sortBy={sort}
        onSortChange={setSort}
      />
    );
  }
  const { container, rerender } = render(<Probe />);
  void rerender;
  const btn = container.querySelector(
    '.data-table__sort-btn'
  ) as HTMLButtonElement;
  expect(btn).toBeTruthy();
  // First click → asc.
  fireEvent.click(btn);
  expect(container.querySelector('th[aria-sort="ascending"]')).not.toBeNull();
  // Second click → desc.
  fireEvent.click(btn);
  expect(container.querySelector('th[aria-sort="descending"]')).not.toBeNull();
  // Third click → cleared back to none.
  fireEvent.click(btn);
  expect(container.querySelector('th[aria-sort="none"]')).not.toBeNull();
});

test('select-all checkbox toggles every row in/out of the selection', () => {
  function Probe(): JSX.Element {
    const [sel, setSel] = useState<Set<string>>(new Set());
    return (
      <DataTable
        columns={COLUMNS}
        rows={ROWS}
        selection={sel}
        onSelectionChange={setSel}
      />
    );
  }
  const { container } = render(<Probe />);
  const all = container.querySelector(
    'input[aria-label="Select all rows"]'
  ) as HTMLInputElement;
  expect(all).toBeTruthy();
  fireEvent.click(all);
  // After select-all, every data row carries data-selected="true".
  const selectedRows = container.querySelectorAll('tr[data-selected="true"]');
  expect(selectedRows.length).toBe(ROWS.length);
  // Click again clears.
  fireEvent.click(all);
  expect(container.querySelectorAll('tr[data-selected="true"]').length).toBe(0);
});

test('per-row checkbox flips a single row without disturbing others', () => {
  function Probe(): JSX.Element {
    const [sel, setSel] = useState<Set<string>>(new Set());
    return (
      <DataTable
        columns={COLUMNS}
        rows={ROWS}
        selection={sel}
        onSelectionChange={setSel}
      />
    );
  }
  const { container } = render(<Probe />);
  const benRow = container.querySelector(
    'input[aria-label="Select row b"]'
  ) as HTMLInputElement;
  expect(benRow).toBeTruthy();
  fireEvent.click(benRow);
  expect(
    container.querySelector('tr[data-row-id="b"][data-selected="true"]')
  ).not.toBeNull();
  expect(
    container.querySelector('tr[data-row-id="a"][data-selected="true"]')
  ).toBeNull();
  // Clicking the same checkbox again removes Ben from the set.
  fireEvent.click(benRow);
  expect(
    container.querySelector('tr[data-row-id="b"][data-selected="true"]')
  ).toBeNull();
});

test('select-all renders indeterminate when only some rows are selected', () => {
  const { container } = render(
    <DataTable
      columns={COLUMNS}
      rows={ROWS}
      selection={new Set(['a'])}
      onSelectionChange={() => {}}
    />
  );
  const all = container.querySelector(
    'input[aria-label="Select all rows"]'
  ) as HTMLInputElement;
  expect(all).toBeTruthy();
  expect(all.indeterminate).toBe(true);
  expect(all.checked).toBe(false);
});

test('column.width applies inline style on header + cells', () => {
  const { container } = render(<DataTable columns={COLUMNS} rows={ROWS} />);
  const nameHeader = container.querySelector(
    '.data-table__header'
  ) as HTMLElement;
  expect(nameHeader.style.width).toBe('200px');
  const nameCell = container.querySelector(
    'tr[data-row-id="a"] td.data-table__cell'
  ) as HTMLElement;
  expect(nameCell.style.width).toBe('200px');
});

test('caption renders inside <caption> when provided', () => {
  const { container } = render(
    <DataTable columns={COLUMNS} rows={ROWS} caption='Recent users' />
  );
  const cap = container.querySelector('caption');
  expect(cap?.textContent).toBe('Recent users');
});

test('rowId fallback reads `row.id` when no accessor passed', () => {
  const { container } = render(<DataTable columns={COLUMNS} rows={ROWS} />);
  expect(container.querySelector('tr[data-row-id="a"]')).not.toBeNull();
});

test('non-sortable column header renders the raw header content', () => {
  const { container } = render(
    <DataTable columns={COLUMNS} rows={ROWS} onSortChange={() => {}} />
  );
  // Email column is not sortable → no sort button.
  const emailHeader = Array.from(
    container.querySelectorAll('th.data-table__header')
  ).find(th => th.textContent?.includes('Email'));
  expect(emailHeader?.querySelector('.data-table__sort-btn')).toBeNull();
});
