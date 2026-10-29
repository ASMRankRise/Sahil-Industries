'use client';

import { motion, useReducedMotion } from 'framer-motion';

/** Motion wrapper for preserved legacy markup. It does not alter child DOM or form behavior. */
export function LegacyMotionRegion({ html }: { html: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
