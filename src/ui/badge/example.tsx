import { Badge } from './Badge';

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
      <Badge>Default</Badge>
      <Badge variant='success'>Passed</Badge>
      <Badge variant='warning'>In review</Badge>
      <Badge variant='danger'>Failed</Badge>
    </div>
  );
}
