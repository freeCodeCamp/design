import { useState } from 'react';
import { Dropdown } from './Dropdown';

export function Example() {
  const [sort, setSort] = useState('Most recent');
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Dropdown>
        <Dropdown.Toggle>Sort</Dropdown.Toggle>
        <Dropdown.Menu>
          {['Most recent', 'Alphabetical', 'Hardest first'].map(option => (
            <Dropdown.Item
              key={option}
              as='button'
              active={sort === option}
              onSelect={() => setSort(option)}
            >
              {option}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <p role='status' style={{ margin: 0 }}>
        Sort order: {sort}
      </p>
    </div>
  );
}
