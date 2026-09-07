import { Card } from './Card';
import { Link } from '../link/Link';

export function Example() {
  return (
    <Card>
      <Card.Header>
        <span className='card__dot card__dot--purple' aria-hidden='true' />
        <p className='card__hours'>300 HOURS</p>
      </Card.Header>
      <Card.Title>Responsive Web Design</Card.Title>
      <Card.Body>Build five certification projects...</Card.Body>
      <Card.Footer>
        <span>62% complete</span>
        <Link href='https://www.freecodecamp.org/learn/2022/responsive-web-design/'>
          Resume →
        </Link>
      </Card.Footer>
    </Card>
  );
}
