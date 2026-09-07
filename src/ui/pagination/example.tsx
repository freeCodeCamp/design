import { useState } from 'react';
import { Pagination } from './Pagination';

export function Example() {
  const [page, setPage] = useState(2);

  return (
    <Pagination
      count={120}
      pageSize={10}
      page={page}
      onPageChange={page => setPage(page)}
    />
  );
}
