"use client";

import { motion } from "framer-motion";
import { Trash2, Archive, Edit, Download, Flag, Filter, ChevronDown } from "lucide-react";
import { forwardRef } from "react";

interface BulkAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger" | "warning" | "primary";
  disabled?: boolean;
}

interface BulkActionsBarProps {
  count: number;
  label: string;
  onClear: () => void;
  actions: BulkAction[];
  statusOptions?: { value: string; label: string }[];
  categoryOptions?: { value: string; label: string }[];
  onStatusChange?: (status: string) => void;
  onCategoryChange?: (category: string) => void;
  showStatusFilter?: boolean;
  showCategoryFilter?: boolean;
}

export const BulkActionsBar = forwardRef<HTMLDivElement, BulkActionsBarProps>(
  ({ count, label, onClear, actions, statusOptions, categoryOptions, onStatusChange, onCategoryChange, showStatusFilter = false, showCategoryFilter = false }, ref) => {
    if (count === 0) return null;

    const getVariantClasses = (variant: string) => {
      switch (variant) {
        case "danger":
          return "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20";
        case "warning":
          return "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20";
        case "primary":
          return "bg-safety/20 border border-safety/30 text-safety hover:bg-safety/30";
        default:
          return "bg-white/5 border border-white/10 text-white hover:bg-white/10";
      }
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        className="bg-surface border border-safety/30 rounded-2xl p-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-safety">
              {count} {label}{count > 1 ? "s" : ""} selected
            </span>
            <button
              onClick={onClear}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Clear selection
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {showStatusFilter && statusOptions && (
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <select
                  defaultValue=""
                  onChange={(e) => e.target.value && onStatusChange?.(e.target.value)}
                  className="h-9 pl-9 pr-8 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-safety/50 appearance-none cursor-pointer"
                >
                  <option value="" disabled>Change Status</option>
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              </div>
            )}
            {showCategoryFilter && categoryOptions && (
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <select
                  defaultValue=""
                  onChange={(e) => e.target.value && onCategoryChange?.(e.target.value)}
                  className="h-9 pl-9 pr-8 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-safety/50 appearance-none cursor-pointer"
                >
                  <option value="" disabled>Change Category</option>
                  {categoryOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              </div>
            )}
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                disabled={action.disabled}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${getVariantClasses(action.variant || "default")} ${action.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }
);

BulkActionsBar.displayName = "BulkActionsBar";