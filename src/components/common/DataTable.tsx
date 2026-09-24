import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, AlertCircle } from 'lucide-react';

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  selectedRowKey?: string;
  isLoading?: boolean;
  emptyMessage?: string;
  pageSize?: number;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  selectedRowKey,
  isLoading = false,
  emptyMessage = 'No industrial records match query.',
  pageSize = 10,
  className = ''
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      return sortDirection === 'asc' 
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [data, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  return (
    <div className={`w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm font-sans border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950/80 font-mono-tech text-xs text-zinc-400">
              {columns.map(col => {
                const isSorted = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`px-4 py-3 font-semibold uppercase tracking-wider ${
                      col.sortable ? 'cursor-pointer hover:text-white select-none' : ''
                    } ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                  >
                    <div className={`flex items-center gap-1.5 ${
                      col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'
                    }`}>
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-zinc-500">
                          {isSorted ? (
                            sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-emerald-400" /> : <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <ChevronsUpDown className="w-3 h-3 text-zinc-600" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800/60">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-zinc-400 font-mono-tech text-xs">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Querying edge telemetry bus...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-zinc-400">
                  <div className="flex flex-col items-center justify-center gap-2 font-mono-tech text-xs">
                    <AlertCircle className="w-5 h-5 text-zinc-600" />
                    <span>{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => {
                const key = keyExtractor(item);
                const isSelected = selectedRowKey === key;

                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`transition-colors ${
                      isSelected 
                        ? 'bg-emerald-950/20 text-white font-medium' 
                        : 'hover:bg-zinc-800/40 text-zinc-300'
                    } ${onRowClick ? 'cursor-pointer' : ''}`}
                  >
                    {columns.map(col => (
                      <td
                        key={col.key}
                        className={`px-4 py-3.5 ${
                          col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                        }`}
                      >
                        {col.render ? col.render(item, index) : item[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800 bg-zinc-950/60 font-mono-tech text-xs text-zinc-400">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 disabled:opacity-40 disabled:pointer-events-none hover:bg-zinc-700 text-zinc-200"
            >
              Previous
            </button>
            <span className="px-2 py-1 text-zinc-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 disabled:opacity-40 disabled:pointer-events-none hover:bg-zinc-700 text-zinc-200"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
