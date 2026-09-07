import { StackedLayout } from './StackedLayout';
import { Navbar } from '../navbar/Navbar';

export function Example() {
  return (
    <StackedLayout
      header={<Navbar start='freeCodeCamp' />}
      footer={<footer>…</footer>}
    >
      <h1>Curriculum</h1>
    </StackedLayout>
  );
}
