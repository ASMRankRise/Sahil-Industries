"use client";

import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, Minus } from "lucide-react";
import { forwardRef, useMemo } from "react";

interface Column<T> {
  key: string;
  header: string;
  render: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  sortConfig?: { key: string; direction: "asc" | "desc" };
  onSort?: (key: string) => void;
  selectedItems?: string[];
  onSelect?: (id: string) => void;
  onSelectAll?: () => void;
  getRowId: (item: T) => string;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  rowClassName?: string;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  sortConfig,
  onSort,
  selectedItems = [],
  onSelect,
  onSelectAll,
  getRowId,
  emptyMessage = "No data found",
  emptyIcon,
  rowClassName = "",
  className = "",
}: DataTableProps<T>) {
  const sortedData = useMemo(() => {
    if (!sortConfig || !onSort) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key as keyof T];
      const bVal = b[sortConfig.key as keyof T];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig, onSort]);

  const isAllSelected = sortedData.length > 0 && selectedItems.length === sortedData.length;

  const handleSort = (key: string) => {
    if (onSort) onSort(key);
  };

  const renderSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return <Minus size={12} className="text-slate-400" />;
    return sortConfig.direction === "asc" ? <ChevronUp size={12} className="text-safety" /> : <ChevronDown size={12} className="text-safety" />;
  };

  if (sortedData.length === 0) {
    return (
      <div className="py-16 text-center">
        {emptyIcon || (
          <svg className="mx-auto mb-4 text-slate-500" size={48} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
        <p className="text-sm text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`bg-surface border border-white/10 rounded-2xl overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[800px]">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold bg-white/[0.02]">
              {onSelect && (
                <th className="px-4 py-3.5 w-12">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={onSelectAll}
                    className="w-4 h-4 rounded border-white/20 text-safety bg-white/5 focus:ring-safety/50 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3.5 ${column.sortable ? "cursor-pointer hover:text-safety transition-colors" : ""} ${column.headerClassName || ""}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {column.header}
                    {column.sortable && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3.5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedData.map((item, index) => (
              <motion.tr
                key={getRowId(item)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
                className={`hover:bg-white/[0.03] transition-colors group ${rowClassName}`}
              >
                {onSelect && (
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(getRowId(item))}
                      onChange={() => onSelect?.(getRowId(item))}
                      className="w-4 h-4 rounded border-white/20 text-safety bg-white/5 focus:ring-safety/50 cursor-pointer"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className={`px-4 py-3.5 ${column.className || ""}`}>
                    {column.render(item, index)}
                  </td>
                ))}
                <td className="px-4 py-3.5 text-center">
                  <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Actions will be rendered by parent via render prop or children */}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}