import { useState } from 'react';
import { ToggleButton } from './ToggleButton';
export function Pressed() {
  const [on, setOn] = useState(false);
  return (
    <ToggleButton pressed={on} onPressedChange={setOn}>
      {on ? 'On' : 'Off'}
    </ToggleButton>
  );
}
