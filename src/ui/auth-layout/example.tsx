import { useState } from 'react';
import { Link } from '../link/Link';
import { AuthLayout } from './AuthLayout';
import { Input } from '../input/Input';
import { FormGroup } from '../form-group/FormGroup';
import { Button } from '../button/Button';

export function Example() {
  const [message, setMessage] = useState('');
  return (
    <AuthLayout
      pattern
      brand='freeCodeCamp'
      footer={
        <Link href='https://www.freecodecamp.org/signin'>
          Sign in to freeCodeCamp
        </Link>
      }
    >
      <form
        onSubmit={event => {
          event.preventDefault();
          const fields = new FormData(event.currentTarget);
          setMessage(`Ready to continue with ${fields.get('email')}.`);
        }}
      >
        <FormGroup>
          <label htmlFor='auth-email'>Email</label>
          <Input
            id='auth-email'
            name='email'
            type='email'
            autoComplete='email'
            required
          />
        </FormGroup>
        <Button type='submit' variant='cta' block>
          Continue
        </Button>
        <p role='status' style={{ margin: message ? '16px 0 0' : 0 }}>
          {message}
        </p>
      </form>
    </AuthLayout>
  );
}
