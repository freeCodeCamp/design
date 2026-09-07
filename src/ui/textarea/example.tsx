import { FormGroup } from '../form-group/FormGroup';
import { Textarea } from './Textarea';

export function Example() {
  return (
    <FormGroup>
      <label htmlFor='bio'>Bio</label>
      <Textarea
        id='bio'
        rows={3}
        placeholder='What are you learning right now?'
      />
    </FormGroup>
  );
}
