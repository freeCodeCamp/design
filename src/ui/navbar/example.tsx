import { Navbar } from './Navbar';
import { Button } from '../button/Button';
import { Link } from '../link/Link';

export function Example() {
  return (
    <Navbar
      start={<strong>freeCodeCamp</strong>}
      center={
        <>
          <Link href='https://www.freecodecamp.org/learn/'>Curriculum</Link>
          <Link href='https://forum.freecodecamp.org/'>Forum</Link>
          <Link href='https://www.freecodecamp.org/news/'>News</Link>
        </>
      }
      end={
        <Button
          variant='cta'
          onClick={() =>
            window.location.assign('https://www.freecodecamp.org/signin')
          }
        >
          Sign in
        </Button>
      }
    />
  );
}
