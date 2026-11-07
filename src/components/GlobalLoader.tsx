"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function GlobalLoader() {
  const [visible, setVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 850);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Loading Sahil Industries"
          role="status">
          <motion.div
            className="relative flex h-32 w-40 items-center justify-center"
            initial={{ scale: 0.78, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
            <motion.span
              className="absolute h-28 w-28 rounded-full border border-safety/70"
              animate={{ scale: [0.82, 1.08, 0.82], opacity: [0.35, 0.9, 0.35] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <img src="/media/logo/hero-center.svg?v=4" alt="Sahil Industries" className="relative z-10 h-24 w-32 object-contain" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
