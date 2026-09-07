import { Skeleton } from './Skeleton';

export function Example() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%' }}>
      <Skeleton variant='circle' width={48} height={48} />
      <Skeleton variant='text' width='80%' />
      <Skeleton variant='text' width='60%' />
    </div>
  );
}
