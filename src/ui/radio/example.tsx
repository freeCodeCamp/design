import { Radio, RadioGroup } from './Radio';

export function Example() {
  return (
    <RadioGroup name='theme' defaultValue='dark' aria-label='Theme'>
      <Radio value='dark' label='Dark - default' />
      <Radio value='light' label='Light' />
      <Radio value='system' label='System' />
    </RadioGroup>
  );
}
