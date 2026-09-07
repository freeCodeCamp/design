import { FormGroup } from './FormGroup';
import { Input } from '../input/Input';
import { HelpBlock } from '../help-block/HelpBlock';

export function Example() {
  return (
    <FormGroup>
      <label htmlFor='username'>Username</label>
      <Input id='username' defaultValue='camper-42' />
      <HelpBlock>Letters, numbers, and dashes. Public.</HelpBlock>
    </FormGroup>
  );
}
