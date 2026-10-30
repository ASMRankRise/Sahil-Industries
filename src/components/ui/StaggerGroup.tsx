"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { useReducedMotion } from "@/components/animations/hooks/useReducedMotion";

interface StaggerGroupProps extends HTMLMotionProps<"div"> {
  /** Stagger delay between children (seconds) */
  stagger?: number;
  /** Delay before first child animates (seconds) */
  delayChildren?: number;
  /** Direction of stagger: 'forward' | 'reverse' | 'random' */
  staggerDirection?: "forward" | "reverse" | "random";
  /** Custom variants for the container */
  variants?: Record<string, any>;
  children: React.ReactNode;
}

/**
 * StaggerGroup - A container that applies staggered animations to its children.
 * Children should be motion components or use the `variants` prop.
 */
export function StaggerGroup({
  stagger = 0.08,
  delayChildren = 0.1,
  staggerDirection = "forward",
  variants,
  children,
  className,
  ...props
}: StaggerGroupProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren,
        staggerDirection,
      },
      ...variants?.visible,
    },
    ...variants,
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
      {...props}>
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem - A child component for StaggerGroup with predefined variants.
 */
interface StaggerItemProps extends HTMLMotionProps<"div"> {
  /** Predefined animation style */
  style?:
    | "fadeUp"
    | "fadeDown"
    | "fadeLeft"
    | "fadeRight"
    | "scale"
    | "flipX"
    | "flipY";
  /** Custom delay for this specific item (overrides stagger) */
  itemDelay?: number;
  children: React.ReactNode;
}

const itemVariants: Record<string, any> = {
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  },
  fadeRight: {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  },
  flipX: {
    hidden: { opacity: 0, rotateX: -90 },
    visible: {
      opacity: 1,
      rotateX: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  },
  flipY: {
    hidden: { opacity: 0, rotateY: -90 },
    visible: {
      opacity: 1,
      rotateY: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  },
};

export function StaggerItem({
  style = "fadeUp",
  itemDelay,
  children,
  className,
  ...props
}: StaggerItemProps) {
  const prefersReduced = useReducedMotion();
  const resolvedVariants = itemVariants[style];

  if (prefersReduced) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      variants={resolvedVariants}
      transition={{ delay: itemDelay }}
      className={className}
      {...props}>
      {children}
    </motion.div>
  );
}

/**
 * Simple hook to create stagger variants for manual use.
 */
export function createStaggerVariants(
  staggerChildren = 0.08,
  delayChildren = 0.1,
  staggerDirection: "forward" | "reverse" | "random" = "forward",
) {
  return {
    hidden: { opacity: 1 },
    visible: {
      transition: {
        staggerChildren,
        delayChildren,
        staggerDirection,
      },
    },
  };
}
