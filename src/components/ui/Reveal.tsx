"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { useReducedMotion } from "@/components/animations/hooks/useReducedMotion";
import { variants, type VariantsMap } from "@/components/animations/variants";

type RevealVariant = keyof typeof variants;

interface RevealProps extends HTMLMotionProps<"div"> {
  /** Animation variant to use */
  variant?: RevealVariant;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Viewport threshold to trigger animation (0-1) */
  amount?: number;
  /** Only animate once */
  once?: boolean;
  /** Custom variants object */
  customVariants?: Variants;
  /** Children to render */
  children: React.ReactNode;
}

/**
 * Enhanced Reveal component with variant support, reduced-motion safety,
 * and flexible configuration for entrance animations.
 */
export function Reveal({
  variant = "pageEnter",
  delay = 0,
  amount = 0.15,
  once = true,
  customVariants,
  children,
  className,
  style,
  ...props
}: RevealProps) {
  const prefersReduced = useReducedMotion();
  const resolvedVariants = customVariants || variants[variant];

  if (prefersReduced) {
    return (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={resolvedVariants.initial}
      animate={resolvedVariants.animate}
      exit={resolvedVariants.exit}
      transition={{
        ...resolvedVariants.transition,
        delay,
      }}
      whileInView={resolvedVariants.animate}
      viewport={{ once, amount }}
      className={className}
      style={style}
      {...props}>
      {children}
    </motion.div>
  );
}

/**
 * RevealGroup - wraps multiple Reveal components for staggered animations.
 * Use with Framer Motion's staggerChildren transition.
 */
interface RevealGroupProps extends HTMLMotionProps<"div"> {
  /** Stagger delay between children (seconds) */
  staggerChildren?: number;
  /** Delay before first child animates (seconds) */
  delayChildren?: number;
  children: React.ReactNode;
}

export function RevealGroup({
  staggerChildren = 0.08,
  delayChildren = 0.1,
  children,
  className,
  ...props
}: RevealGroupProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 1 },
        visible: {
          transition: {
            staggerChildren,
            delayChildren,
          },
        },
      }}
      className={className}
      {...props}>
      {children}
    </motion.div>
  );
}

/**
 * RevealItem - child component for RevealGroup.
 * Automatically gets staggered animation from parent RevealGroup.
 */
interface RevealItemProps extends HTMLMotionProps<"div"> {
  /** Animation variant for this item */
  variant?: RevealVariant;
  children: React.ReactNode;
}

export function RevealItem({
  variant = "itemReveal",
  children,
  className,
  ...props
}: RevealItemProps) {
  const prefersReduced = useReducedMotion();
  const resolvedVariants = variants[variant];

  if (prefersReduced) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div variants={resolvedVariants} className={className} {...props}>
      {children}
    </motion.div>
  );
}
