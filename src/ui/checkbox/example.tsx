import { Checkbox } from './Checkbox';

export function Example() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%' }}>
      <Checkbox defaultChecked label='I accept the honor code' />
      <Checkbox label='Email me certificate alerts' />
    </div>
  );
}
