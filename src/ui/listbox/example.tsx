import { Listbox } from './Listbox';
import { useState } from 'react';

export function Example() {
  const ITEMS = [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' }
  ];

  const [value, setValue] = useState<string | string[]>('frontend');

  return (
    <Listbox
      aria-label='Learning track'
      items={ITEMS}
      value={value}
      onValueChange={setValue}
    />
  );
}
