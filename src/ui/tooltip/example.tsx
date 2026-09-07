import { useState } from 'react';
import { Tooltip } from './Tooltip';
import { Button } from '../button/Button';

export function Example() {
  const [complete, setComplete] = useState(false);
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Tooltip content='Runs the public test suite against your code.'>
        <Button onClick={() => setComplete(true)}>Run tests</Button>
      </Tooltip>
      {complete && <p role='status'>Example tests passed.</p>}
    </div>
  );
}
