import { SidebarLayout } from './SidebarLayout';
import { Sidebar } from '../sidebar/Sidebar';
import { Navbar } from '../navbar/Navbar';

export function Example() {
  return (
    <SidebarLayout
      header={<Navbar start='freeCodeCamp' />}
      sidebar={
        <Sidebar aria-label='Curriculum'>
          <a href='https://www.freecodecamp.org/learn/'>Learn</a>
        </Sidebar>
      }
    >
      <h1>Curriculum</h1>
    </SidebarLayout>
  );
}
