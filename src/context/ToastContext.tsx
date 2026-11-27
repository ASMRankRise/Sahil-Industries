"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X, Undo2 } from "lucide-react";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  action?: ToastAction;
}

interface ToastContextType {
  toast: {
    success: (message: string, duration?: number) => string;
    error: (message: string, duration?: number) => string;
    info: (message: string, duration?: number) => string;
    action: (
      message: string,
      options: {
        actionLabel: string;
        onAction: () => void;
        type?: "success" | "error" | "info";
        duration?: number;
      },
    ) => string;
    dismiss: (id: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (
      message: string,
      type: "success" | "error" | "info" = "info",
      duration = 4000,
      action?: ToastAction,
    ) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      setToasts((prev) => [...prev, { id, message, type, duration, action }]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
      return id;
    },
    [dismiss],
  );

  const toastMethods = {
    success: (message: string, duration = 4000) =>
      addToast(message, "success", duration),
    error: (message: string, duration = 5000) =>
      addToast(message, "error", duration),
    info: (message: string, duration = 4000) =>
      addToast(message, "info", duration),
    action: (
      message: string,
      options: {
        actionLabel: string;
        onAction: () => void;
        type?: "success" | "error" | "info";
        duration?: number;
      },
    ) =>
      addToast(
        message,
        options.type || "info",
        options.duration ?? 6000,
        {
          label: options.actionLabel,
          onClick: options.onAction,
        },
      ),
    dismiss,
  };

  return (
    <ToastContext.Provider value={{ toast: toastMethods }}>
      {children}
      {/* Toast floating container */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-2 sm:p-0">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: 15,
                scale: 0.9,
                transition: { duration: 0.15 },
              }}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-2xl backdrop-blur-md transition-colors ${
                t.type === "success"
                  ? "bg-slate-900/95 border-green-500/30 text-white"
                  : t.type === "error"
                    ? "bg-slate-900/95 border-red-500/30 text-white"
                    : "bg-slate-900/95 border-safety/30 text-white"
              }`}>
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {t.type === "success" ? (
                  <CheckCircle2
                    size={18}
                    className="text-green-400 shrink-0"
                  />
                ) : t.type === "error" ? (
                  <AlertCircle size={18} className="text-red-400 shrink-0" />
                ) : (
                  <Info size={18} className="text-safety shrink-0" />
                )}
                <span className="text-sm font-medium leading-snug break-words">
                  {t.message}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {t.action && (
                  <button
                    onClick={() => {
                      t.action?.onClick();
                      dismiss(t.id);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-safety text-ink hover:brightness-110 transition-all cursor-pointer shadow-sm">
                    <Undo2 size={12} strokeWidth={2.5} />
                    {t.action.label}
                  </button>
                )}
                <button
                  onClick={() => dismiss(t.id)}
                  className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
                  aria-label="Dismiss">
                  <X size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
