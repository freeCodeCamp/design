import { Combobox, filterItemsByLabel } from './Combobox';
import { useState } from 'react';

export function Example() {
  const ALL = [
    { value: 'rwd', label: 'Responsive Web Design' },
    { value: 'js', label: 'JavaScript Algorithms' }
  ];

  const [query, setQuery] = useState('');
  const [value, setValue] = useState<string | null>(null);
  const items = filterItemsByLabel(ALL, query);

  return (
    <Combobox
      inputValue={query}
      onInputValueChange={setQuery}
      value={value}
      onValueChange={setValue}
      items={items}
      aria-label='Certification'
      placeholder='Pick a certification'
    />
  );
}
