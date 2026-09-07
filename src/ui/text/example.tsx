import { Text } from './Text';

export function Example() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%' }}>
      <Text size='lg'>Large body - section ledes and emphasis.</Text>
      <Text>Default body - eighteen pixels minimum.</Text>
      <Text size='sm' tone='muted'>
        Caption - annotations, metadata, footnotes.
      </Text>
    </div>
  );
}
