import { Avatar } from './Avatar';

export function Example() {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 16
      }}
    >
      <Avatar size='sm' name='Rosie Wilson' />
      <Avatar size='md' name='Quincy Larson' status='online' />
      <Avatar size='lg' name='Quincy Larson' status='away' />
    </div>
  );
}
