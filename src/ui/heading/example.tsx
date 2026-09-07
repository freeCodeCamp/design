import { Heading } from './Heading';

export function Example() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%' }}>
      <Heading level={1} size='display'>
        Command-line Chic.
      </Heading>
      <Heading level={2} size='xl'>
        Ship interfaces.
      </Heading>
      <Heading level={3} size='lg'>
        Composable primitives.
      </Heading>
      <Heading level={4} size='md'>
        Flat surfaces.
      </Heading>
      <Heading level={5} size='sm'>
        Square corners.
      </Heading>
    </div>
  );
}
