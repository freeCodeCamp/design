import { Alert } from './Alert';

export function Example() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%' }}>
      <Alert variant='success'>
        All 28 tests pass. Next challenge unlocked.
      </Alert>
      <Alert variant='warning'>You have one unsaved edit.</Alert>
      <Alert variant='danger'>Sign-in failed - check your email address.</Alert>
    </div>
  );
}
