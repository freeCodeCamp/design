import { Button } from '../button/Button';
import { useState } from 'react';
import { CloseButton } from './CloseButton';

export function DismissibleNotice() {
  const [visible, setVisible] = useState(true);
  return visible ? (
    <div>
      Changes saved.{' '}
      <CloseButton
        onClick={() => setVisible(false)}
        aria-label='Dismiss notice'
      />
    </div>
  ) : (
    <Button onClick={() => setVisible(true)}>Show notice again</Button>
  );
}
