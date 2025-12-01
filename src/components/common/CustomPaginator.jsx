import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CustomPaginator = ({
  first,
  rows,
  totalRecords,
  onPageChange,
  className,
}) => {
  const pageCount = Math.ceil(totalRecords / rows);
  const currentPage = Math.floor(first / rows) + 1;

  if (pageCount <= 1) return null;

  return (
    <div className={`custom-paginator ${className}`}>
      <button
        className='btn btn-secondary btn-sm'
        disabled={currentPage === 1}
        onClick={() => onPageChange({ first: (currentPage - 2) * rows })}
      >
        <ChevronLeft size={16} />
      </button>
      <span className='paginator-info'>
        Trang {currentPage} / {pageCount}
      </span>
      <button
        className='btn btn-secondary btn-sm'
        disabled={currentPage === pageCount}
        onClick={() => onPageChange({ first: currentPage * rows })}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default CustomPaginator;
