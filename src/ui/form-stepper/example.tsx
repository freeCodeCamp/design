import { FormStepper } from './FormStepper';
import { Button } from '../button/Button';
import { useState } from 'react';

const steps = [
  { id: 'account', label: 'Account', description: 'Email + handle' },
  { id: 'goals', label: 'Goals', description: 'What to learn first' },
  { id: 'confirm', label: 'Confirm', description: 'Review + start' }
];
const content = [
  'Create your account.',
  'Choose your learning goals.',
  'Review your choices.'
];

export function Example() {
  const [index, setIndex] = useState(0);
  return (
    <FormStepper
      steps={steps}
      current={steps[index]!.id}
      onStepChange={id => setIndex(steps.findIndex(step => step.id === id))}
    >
      {() => (
        <div>
          <p role='status'>{content[index]}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Button disabled={index === 0} onClick={() => setIndex(index - 1)}>
              Back
            </Button>
            <Button
              variant='cta'
              onClick={() =>
                setIndex(index === steps.length - 1 ? 0 : index + 1)
              }
            >
              {index === steps.length - 1 ? 'Start again' : 'Next'}
            </Button>
          </div>
        </div>
      )}
    </FormStepper>
  );
}
