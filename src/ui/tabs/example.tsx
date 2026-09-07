import { Tabs, Tab } from './Tabs';

export function Example() {
  return (
    <Tabs defaultActiveKey='instructions'>
      <Tab eventKey='instructions' title='Instructions'>
        Build a page with a heading and a paragraph.
      </Tab>
      <Tab eventKey='tests' title='Tests'>
        Your heading and paragraph tests pass.
      </Tab>
      <Tab eventKey='console' title='Console'>
        Ready. Run your code to see its output.
      </Tab>
    </Tabs>
  );
}
