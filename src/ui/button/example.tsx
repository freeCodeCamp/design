import { useState } from 'react';
import { Button } from './Button';

export function Actions() {
  const [action, setAction] = useState('');
  return (
    <div
      onClick={event => {
        const target = (event.target as Element).closest('button');
        if (target && !target.disabled) setAction(target.textContent ?? '');
      }}
      style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}
    >
      <Button variant='cta'>Start curriculum</Button>
      <Button variant='default'>Secondary</Button>
      <Button variant='danger'>Dangerous</Button>
      <Button variant='ghost'>Ghost</Button>
      <Button size='sm'>Small</Button>
      <Button size='lg'>Large</Button>
      <Button disabled>Disabled</Button>
      <p role='status' style={{ flexBasis: '100%', margin: 0 }}>
        {action && `Selected: ${action}`}
      </p>
    </div>
  );
}
