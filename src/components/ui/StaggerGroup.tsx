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

// Standardized constants for StaggerGroup
const STAGGER_GROUP_DEFAULT_STAGGER = 0.08;
const STAGGER_GROUP_DEFAULT_DELAY = 0.1;
const STAGGER_GROUP_DEFAULT_DIRECTION = "forward";

/**
 * StaggerGroup - A container that applies staggered animations to its children.
 * Children should be motion components or use the `variants` prop.
 */
export function StaggerGroup({
  stagger = STAGGER_GROUP_DEFAULT_STAGGER,
  delayChildren = STAGGER_GROUP_DEFAULT_DELAY,
  staggerDirection = STAGGER_GROUP_DEFAULT_DIRECTION,
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

// Standardized constants for StaggerItem
const STAGGER_ITEM_DEFAULT_STYLE = "fadeUp";
const STAGGER_ITEM_TRANSITION_DURATION = 0.5;
const STAGGER_ITEM_TRANSITION_EASE = [0.22, 1, 0.36, 1];
const STAGGER_ITEM_SCALE_DURATION = 0.4;
const STAGGER_ITEM_FLIP_DURATION = 0.6;

const itemVariants: Record<string, any> = {
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: STAGGER_ITEM_TRANSITION_DURATION, ease: STAGGER_ITEM_TRANSITION_EASE },
    },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: STAGGER_ITEM_TRANSITION_DURATION, ease: STAGGER_ITEM_TRANSITION_EASE },
    },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: STAGGER_ITEM_TRANSITION_DURATION, ease: STAGGER_ITEM_TRANSITION_EASE },
    },
  },
  fadeRight: {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: STAGGER_ITEM_TRANSITION_DURATION, ease: STAGGER_ITEM_TRANSITION_EASE },
    },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: STAGGER_ITEM_SCALE_DURATION, ease: STAGGER_ITEM_TRANSITION_EASE },
    },
  },
  flipX: {
    hidden: { opacity: 0, rotateX: -90 },
    visible: {
      opacity: 1,
      rotateX: 0,
      transition: { duration: STAGGER_ITEM_FLIP_DURATION, ease: STAGGER_ITEM_TRANSITION_EASE },
    },
  },
  flipY: {
    hidden: { opacity: 0, rotateY: -90 },
    visible: {
      opacity: 1,
      rotateY: 0,
      transition: { duration: STAGGER_ITEM_FLIP_DURATION, ease: STAGGER_ITEM_TRANSITION_EASE },
    },
  },
};

export function StaggerItem({
  style = STAGGER_ITEM_DEFAULT_STYLE,
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
  staggerChildren = STAGGER_GROUP_DEFAULT_STAGGER,
  delayChildren = STAGGER_GROUP_DEFAULT_DELAY,
  staggerDirection: "forward" | "reverse" | "random" = STAGGER_GROUP_DEFAULT_DIRECTION,
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
