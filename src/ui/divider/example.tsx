import { Divider } from './Divider';

export function Example() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%' }}>
      <Divider />
      <Divider variant='dashed' />
      <div style={{ display: 'flex', alignItems: 'center', height: 48 }}>
        <span>Before</span>
        <Divider orientation='vertical' />
        <span>After</span>
      </div>
    </div>
  );
}
