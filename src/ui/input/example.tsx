import { FormGroup } from '../form-group/FormGroup';
import { Input } from './Input';
import { HelpBlock } from '../help-block/HelpBlock';

export function Example() {
  return (
    <FormGroup>
      <label htmlFor='email'>Email address</label>
      <Input id='email' type='email' placeholder='camper@example.com' />
      <HelpBlock>We send one curriculum update per week.</HelpBlock>
    </FormGroup>
  );
}
