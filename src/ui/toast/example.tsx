import { Button } from '../button/Button';
import { Toaster, createToaster } from './Toast';
const toaster = createToaster({});
export function SaveNotice() {
  return (
    <>
      <Button
        onClick={() => toaster.create({ title: 'Saved', type: 'success' })}
      >
        Save
      </Button>
      <Toaster toaster={toaster} />
    </>
  );
}
