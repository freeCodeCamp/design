import { useState } from 'react';
import { EmptyState } from './EmptyState';
import { Button } from '../button/Button';

export function Example() {
  const [started, setStarted] = useState(false);
  if (started)
    return (
      <div>
        <p role='status'>Your first learning goal is ready.</p>
        <Button onClick={() => setStarted(false)}>Reset example</Button>
      </div>
    );
  return (
    <EmptyState
      title='No learning goals yet'
      description='Add a goal to start planning your next project.'
      action={
        <Button variant='cta' onClick={() => setStarted(true)}>
          Add learning goal
        </Button>
      }
    />
  );
}
