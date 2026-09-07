import { FormGroup } from '../form-group/FormGroup';
import { Select } from './Select';

export function Example() {
  return (
    <FormGroup>
      <label htmlFor='difficulty'>Difficulty</label>
      <Select id='difficulty' defaultValue='intermediate'>
        <option value='beginner'>Beginner</option>
        <option value='intermediate'>Intermediate</option>
        <option value='advanced'>Advanced</option>
      </Select>
    </FormGroup>
  );
}
