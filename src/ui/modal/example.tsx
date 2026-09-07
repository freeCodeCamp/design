import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '../button/Button';

export function Details() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>View details</Button>
      <Modal open={open} onClose={() => setOpen(false)} title='Your progress'>
        <Modal.Body>
          <p>Your work is saved.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpen(false)}>Continue learning</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
