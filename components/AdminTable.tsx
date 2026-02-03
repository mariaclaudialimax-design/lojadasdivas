import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  width?: string;
  sortable?: boolean;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  sortColumn?: keyof T;
  sortOrder?: 'asc' | 'desc';
  onSort?: (column: keyof T) => void;
}

export function AdminTable<T extends { id: string }>({
  columns,
  data,
  loading = false,
  onRowClick,
  sortColumn,
  sortOrder = 'asc',
  onSort,
}: TableProps<T>) {
  const getCellContent = (row: T, column: TableColumn<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return String(row[column.accessor] || '');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Nenhum item encontrado
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.accessor)}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider ${
                  column.width
                }`}
              >
                <button
                  onClick={() => onSort && column.sortable && onSort(typeof column.accessor === 'string' ? column.accessor : 'id' as any)}
                  className={`flex items-center gap-1 ${column.sortable ? 'hover:text-gray-900 cursor-pointer' : ''}`}
                >
                  {column.header}
                  {column.sortable && sortColumn === column.accessor && (
                    sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={`${onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
            >
              {columns.map((column) => (
                <td
                  key={String(column.accessor)}
                  className={`px-6 py-4 text-sm text-gray-900 ${column.width}`}
                >
                  {getCellContent(row, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
