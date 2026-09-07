import { Breadcrumb } from './Breadcrumb';

export function Example() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href='/'>Docs</Breadcrumb.Item>
      <Breadcrumb.Item href='/playground#navbar'>Navigation</Breadcrumb.Item>
      <Breadcrumb.Item active>Breadcrumb</Breadcrumb.Item>
    </Breadcrumb>
  );
}
