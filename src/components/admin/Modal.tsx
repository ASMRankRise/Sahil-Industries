"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode, forwardRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, title, children, size = "md", showCloseButton = true, closeOnOverlayClick = true, className = "" }, ref) => {
    const sizeClasses = {
      sm: "max-w-md",
      md: "max-w-2xl",
      lg: "max-w-4xl",
      xl: "max-w-6xl",
      full: "max-w-[90vw]",
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={closeOnOverlayClick ? onClose : undefined}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <motion.div
              ref={ref}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`bg-surface border border-white/10 rounded-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden ${className}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <h3 id="modal-title" className="text-lg font-bold text-white">{title}</h3>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              <div className="p-5 max-h-[calc(90vh-80px)] overflow-y-auto">
                {children}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

Modal.displayName = "Modal";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", variant = "danger", isLoading = false }: ConfirmModalProps) {
  const variantStyles = {
    danger: { iconColor: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", buttonColor: "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30" },
    warning: { iconColor: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30", buttonColor: "bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30" },
    info: { iconColor: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/30", buttonColor: "bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30" },
  };

  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-surface border border-white/10 rounded-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <div className={`h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4 ${styles.bgColor} ${styles.iconColor} ${styles.borderColor}`}>
                {variant === "danger" && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                {variant === "warning" && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                {variant === "info" && <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              </div>
              <h3 id="confirm-modal-title" className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-slate-400 mb-6">{message}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${styles.buttonColor} disabled:opacity-50`}
                >
                  {isLoading ? "Processing..." : confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}