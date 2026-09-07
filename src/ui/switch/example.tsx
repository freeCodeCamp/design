import { Switch } from './Switch';

export function Example() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%' }}>
      <Switch defaultChecked label='Keyboard shortcuts' />
      <Switch label='Sound effects' />
    </div>
  );
}
