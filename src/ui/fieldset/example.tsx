import { Fieldset } from './Fieldset';
import { RadioGroup, Radio } from '../radio/Radio';

export function Example() {
  return (
    <Fieldset legend='Notification cadence'>
      <RadioGroup
        aria-label='Notification cadence'
        name='cadence'
        defaultValue='weekly'
      >
        <Radio value='weekly' label='Weekly digest' />
        <Radio value='per-cert' label='Per-cert' />
        <Radio value='never' label='Never' />
      </RadioGroup>
    </Fieldset>
  );
}
