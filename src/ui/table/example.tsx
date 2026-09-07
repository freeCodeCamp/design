import { Table } from './Table';
import { Badge } from '../badge/Badge';

export function Example() {
  return (
    <div
      role='region'
      aria-label='Certification progress'
      tabIndex={0}
      style={{ width: '100%', overflowX: 'auto' }}
    >
      <Table>
        <thead>
          <tr>
            <th>Certification</th>
            <th>Projects</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Responsive Web Design</td>
            <td>5 / 5</td>
            <td>
              <Badge variant='success'>Passed</Badge>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
