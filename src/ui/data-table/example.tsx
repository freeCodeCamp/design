import { DataTable, type DataTableSort } from './DataTable';
import { useState } from 'react';

const rows = [
  { id: 'rwd', cert: 'Responsive Web Design', hours: 300 },
  { id: 'js', cert: 'JavaScript', hours: 300 }
];

export function Certifications() {
  const [sortBy, setSortBy] = useState<DataTableSort | null>(null);
  const sorted = [...rows].sort((a, b) =>
    sortBy
      ? a.cert.localeCompare(b.cert) * (sortBy.direction === 'asc' ? 1 : -1)
      : 0
  );
  return (
    <DataTable
      columns={[
        {
          id: 'cert',
          accessor: 'cert',
          header: 'Certification',
          sortable: true
        },
        { id: 'hours', accessor: 'hours', header: 'Hours', align: 'right' }
      ]}
      rows={sorted}
      sortBy={sortBy}
      onSortChange={setSortBy}
    />
  );
}
