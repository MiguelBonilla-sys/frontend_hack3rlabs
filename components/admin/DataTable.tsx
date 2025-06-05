'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  key: string;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, item: T) => React.ReactNode;
}

interface PaginationProps {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading: boolean;
  pagination?: PaginationProps;
}

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  isLoading,
  pagination,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="p-6 text-center">
          <p className="text-gray-500">No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => {
                // Anchos específicos para diferentes tipos de columnas
                let width = '';
                if (column.key === 'imagen_conferencia' || column.key === 'imagen') {
                  width = 'w-16';
                } else if (column.key === 'actions') {
                  width = 'w-24';
                } else if (column.key === 'estado') {
                  width = 'w-28';
                } else if (column.key === 'fecha_conferencia') {
                  width = 'w-32';
                } else if (column.key === 'descripcion_conferencia') {
                  width = 'w-48';
                }
                
                return (
                  <th
                    key={column.key}
                    className={`px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${width}`}
                  >
                    {column.title}
                  </th>
                );
              })}
            </tr>
          </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((column) => {
                // Anchos específicos para diferentes tipos de columnas
                let width = '';
                if (column.key === 'imagen_conferencia' || column.key === 'imagen') {
                  width = 'w-16';
                } else if (column.key === 'actions') {
                  width = 'w-24';
                } else if (column.key === 'estado') {
                  width = 'w-28';
                } else if (column.key === 'fecha_conferencia') {
                  width = 'w-32';
                } else if (column.key === 'descripcion_conferencia') {
                  width = 'w-48';
                }
                
                return (
                  <td key={column.key} className={`px-3 py-3 text-sm ${width}`}>
                    {column.render
                      ? column.render(item[column.key], item)
                      : (() => {
                          const value = item[column.key];
                          if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
                            return '';
                          }
                          return String(value);
                        })()}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {pagination && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => pagination.onPageChange(pagination.current - 1)}
              disabled={pagination.current <= 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.current + 1)}
              disabled={pagination.current >= pagination.total}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Página <span className="font-medium">{pagination.current || 1}</span> de{' '}
                <span className="font-medium">{pagination.total || 1}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => pagination.onPageChange(pagination.current - 1)}
                  disabled={pagination.current <= 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  onClick={() => pagination.onPageChange(pagination.current + 1)}
                  disabled={pagination.current >= pagination.total}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
