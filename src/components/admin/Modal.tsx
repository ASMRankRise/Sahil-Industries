"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, AlertTriangle, Info as InfoIcon } from "lucide-react";
import { ReactNode, forwardRef, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

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
  (
    {
      isOpen,
      onClose,
      title,
      children,
      size = "md",
      showCloseButton = true,
      closeOnOverlayClick = true,
      className = "",
    },
    ref,
  ) => {
    const [mounted, setMounted] = useState(false);
    const titleId = useId();

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      if (!isOpen) return;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
      if (isOpen) {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = originalOverflow;
        };
      }
    }, [isOpen]);

    const sizeClasses = {
      sm: "max-w-md",
      md: "max-w-2xl",
      lg: "max-w-4xl",
      xl: "max-w-6xl",
      full: "max-w-[90vw]",
    };

    if (!mounted) return null;

    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="admin-dashboard fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-4"
            onClick={closeOnOverlayClick ? onClose : undefined}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}>
            <motion.div
              ref={ref}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`flex max-h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-white/20 bg-surface w-full shadow-2xl ${sizeClasses[size]} ${className}`}
              onClick={(e) => e.stopPropagation()}>
              <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/20 p-3 sm:p-5">
                <h3
                  id={titleId}
                  className="min-w-0 break-words text-lg font-bold text-white">
                  {title}
                </h3>
                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="grid size-11 shrink-0 place-items-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety"
                    aria-label="Close modal">
                    <X size={20} className="text-white" strokeWidth={2.5} />
                  </button>
                )}
              </div>
              <div className="min-h-0 overflow-y-auto overscroll-contain p-3 text-white sm:p-5">
                {children}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
    );
  },
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

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const variantStyles = {
    danger: {
      iconColor: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      buttonColor:
        "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30",
    },
    warning: {
      iconColor: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      buttonColor:
        "bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30",
    },
    info: {
      iconColor: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      buttonColor:
        "bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30",
    },
  };

  const styles = variantStyles[variant];

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="admin-dashboard fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={isLoading ? undefined : onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="max-h-full w-full max-w-md overflow-hidden rounded-2xl border border-white/15 bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div
                className={`h-14 w-14 rounded-full border flex items-center justify-center mx-auto mb-4 ${styles.bgColor} ${styles.iconColor} ${styles.borderColor}`}>
                {variant === "danger" || variant === "warning" ? (
                  <AlertTriangle className="w-7 h-7" strokeWidth={2.2} />
                ) : (
                  <InfoIcon className="w-7 h-7" strokeWidth={2.2} />
                )}
              </div>
              <h3
                id="confirm-modal-title"
                className="text-lg font-bold text-white mb-2">
                {title}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {message}
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2.5 border border-white/20 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${styles.buttonColor} disabled:opacity-50 disabled:cursor-not-allowed shadow-md`}>
                  {isLoading && (
                    <Loader2 size={16} className="animate-spin" />
                  )}
                  <span>{isLoading ? "Processing..." : confirmLabel}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
