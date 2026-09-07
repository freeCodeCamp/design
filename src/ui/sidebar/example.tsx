import { Sidebar, SidebarSection } from './Sidebar';

export function Example() {
  return (
    <Sidebar aria-label='Curriculum'>
      <SidebarSection label='Learn'>
        <a href='https://www.freecodecamp.org/learn/'>Curriculum</a>
      </SidebarSection>
    </Sidebar>
  );
}
