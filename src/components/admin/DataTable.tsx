"use client";

import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, Minus, FileText } from "lucide-react";
import { useMemo } from "react";

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

// Standardized spacing constants for consistent rhythm
const CELL_PADDING_X = "px-4";
const CELL_PADDING_Y = "py-3.5";
const CHECKBOX_COL_WIDTH = "w-12";
const ACTIONS_COL_WIDTH = "w-24";
const SORT_ICON_SIZE = 12;
const ROW_TRANSITION_DURATION = 0.2;
const ROW_STAGGER_DELAY = 0.02;

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
    if (!sortConfig || sortConfig.key !== key) {
      return <Minus size={SORT_ICON_SIZE} className="text-slate-400 shrink-0" aria-hidden="true" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp size={SORT_ICON_SIZE} className="text-safety shrink-0" aria-hidden="true" />
    ) : (
      <ChevronDown size={SORT_ICON_SIZE} className="text-safety shrink-0" aria-hidden="true" />
    );
  };

  if (sortedData.length === 0) {
    return (
      <div className="py-12 text-center" role="status" aria-live="polite">
        {emptyIcon || (
          <FileText className="mx-auto mb-3 text-slate-500" size={40} aria-hidden="true" />
        )}
        <p className="text-sm leading-6 text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`bg-surface border border-white/10 rounded-2xl overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm leading-6 min-w-[720px]">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold bg-white/[0.02]">
              {onSelect && (
                <th scope="col" className={`${CELL_PADDING_X} ${CELL_PADDING_Y} ${CHECKBOX_COL_WIDTH} text-center`}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={onSelectAll}
                    className="w-4 h-4 rounded border-white/20 text-safety bg-white/5 focus:ring-2 focus:ring-safety/50 focus:ring-offset-2 focus:ring-offset-surface cursor-pointer"
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`${CELL_PADDING_X} ${CELL_PADDING_Y} ${column.sortable ? "cursor-pointer hover:text-safety transition-colors select-none" : ""} ${column.headerClassName || ""}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
              <th scope="col" className={`${CELL_PADDING_X} ${CELL_PADDING_Y} ${ACTIONS_COL_WIDTH} text-center`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedData.map((item, index) => (
              <motion.tr
                key={getRowId(item)}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * ROW_STAGGER_DELAY, duration: ROW_TRANSITION_DURATION, ease: "easeOut" }}
                className={`hover:bg-white/[0.03] transition-colors group ${rowClassName}`}
              >
                {onSelect && (
                  <td className={`${CELL_PADDING_X} ${CELL_PADDING_Y} ${CHECKBOX_COL_WIDTH} text-center`}>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(getRowId(item))}
                      onChange={() => onSelect?.(getRowId(item))}
                      className="w-4 h-4 rounded border-white/20 text-safety bg-white/5 focus:ring-2 focus:ring-safety/50 focus:ring-offset-2 focus:ring-offset-surface cursor-pointer"
                      aria-label={`Select row ${index + 1}`}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className={`${CELL_PADDING_X} ${CELL_PADDING_Y} ${column.className || ""}`}>
                    {column.render(item, index)}
                  </td>
                ))}
                <td className={`${CELL_PADDING_X} ${CELL_PADDING_Y} ${ACTIONS_COL_WIDTH} text-center`}>
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
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