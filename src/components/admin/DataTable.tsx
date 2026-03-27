import React from 'react';
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  onRowClick?: (row: any) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  onSort?: (key: string) => void;
}

export default function DataTable({ 
  columns, 
  data, 
  loading, 
  onRowClick, 
  pagination,
  onSort 
}: DataTableProps) {
  return (
    <div className="w-full space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2A2A2A] bg-[#0D0D0D]">
              {columns.map((col) => (
                <th 
                  key={col.key}
                  className={cn(
                    "px-6 py-4 text-xs font-bold tracking-widest uppercase text-gray-500",
                    col.sortable && "cursor-pointer hover:text-white transition-colors"
                  )}
                  onClick={() => col.sortable && onSort?.(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {col.sortable && <ArrowUpDown size={12} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4">
                      <div className="h-4 bg-[#2A2A2A] rounded w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500 font-dm">
                  No data found.
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr 
                  key={i} 
                  className={cn(
                    "hover:bg-[#252525] transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-gray-300 font-dm">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between px-2">
          <p className="text-xs text-gray-500 font-dm uppercase tracking-widest">
            PAGE {pagination.currentPage} OF {pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={pagination.currentPage === 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              className="p-2 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              className="p-2 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
