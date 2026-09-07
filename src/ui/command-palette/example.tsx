import { Button } from '../button/Button';
import { useState } from 'react';
import { CommandPalette } from './CommandPalette';

export function Example() {
  const GROUPS = [
    {
      label: 'Navigation',
      items: [
        { id: 'curriculum', label: 'Go to curriculum', shortcut: 'G C' },
        { id: 'settings', label: 'Open settings', shortcut: 'G S' }
      ]
    }
  ];

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open commands</Button>
      <p role='status'>{selected && `Selected: ${selected}`}</p>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        onSelect={id => {
          setSelected(id);
          setOpen(false);
        }}
        groups={GROUPS}
        placeholder='Type a command or search…'
      />
    </>
  );
}
