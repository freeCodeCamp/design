import { FormGroup } from '../form-group/FormGroup';
import { FormControl } from './FormControl';

export function Example() {
  return (
    <FormGroup>
      <label htmlFor='curriculum-search'>Search curriculum</label>
      <FormControl id='curriculum-search' placeholder='Search the curriculum' />
    </FormGroup>
  );
}
