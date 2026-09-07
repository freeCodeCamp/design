import { Spacer } from './Spacer';

export function Example() {
  return (
    <div style={{ display: 'flex' }}>
      <span>start</span>
      <Spacer size={6} />
      <span>end</span>
    </div>
  );
}
