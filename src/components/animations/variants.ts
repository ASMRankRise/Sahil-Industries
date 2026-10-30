"use client";

import type { Variants } from "framer-motion";

/**
 * Shared Framer Motion variants for consistent animations across the site.
 * All variants respect prefers-reduced-motion via the Reveal component.
 */

export const variants: Record<string, Variants> = {
  // Page/Section entrance - main content reveal
  pageEnter: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },

  // Faster entrance for smaller elements
  quickEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },

  // Staggered children container
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  },

  // Tighter stagger for dense grids
  staggerContainerTight: {
    animate: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05,
      },
    },
  },

  // Card/item reveal
  itemReveal: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },

  // Fade only (for overlays, modals)
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: "easeOut" },
  },

  // Slide from right (sidebars, mobile menu)
  slideInRight: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    transition: { type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },

  // Slide from left
  slideInLeft: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
    transition: { type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },

  // Slide from bottom (toasts, notifications)
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },

  // Scale entrance (buttons, cards)
  scaleEnter: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },

  // Button interactions
  button: {
    whileHover: { y: -2, scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.15, ease: "easeOut" },
  },

  // Ghost button (lighter hover)
  buttonGhost: {
    whileHover: { y: -1 },
    whileTap: { scale: 0.99 },
    transition: { duration: 0.1, ease: "easeOut" },
  },

  // Form field focus
  field: {
    whileFocus: {
      borderColor: "#F6C515",
      boxShadow: "0 0 0 3px rgba(246,197,21,0.2)",
      transition: { duration: 0.2, ease: "easeOut" },
    },
  },

  // Input with label float
  inputLabel: {
    initial: { y: 0, scale: 1, opacity: 0.6 },
    animate: { y: -24, scale: 0.85, opacity: 1 },
    transition: { duration: 0.2, ease: "easeOut" },
  },

  // Card hover lift
  cardHover: {
    whileHover: {
      y: -4,
      boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
      transition: { duration: 0.2, ease: "easeOut" },
    },
  },

  // Image reveal with clip-path
  imageReveal: {
    initial: { clipPath: "inset(100% 0 0 0)", opacity: 0 },
    animate: { clipPath: "inset(0 0 0 0)", opacity: 1 },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },

  // Text line reveal (for headlines)
  textLine: {
    initial: { opacity: 0, y: "100%" },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },

  // Word-by-word reveal
  textWord: {
    initial: { opacity: 0, y: "50%" },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },

  // List item stagger
  listItem: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },

  // Modal/Dialog
  modalOverlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
  modalContent: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },

  // Tooltip
  tooltip: {
    initial: { opacity: 0, scale: 0.8, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 10 },
    transition: { duration: 0.15, ease: "easeOut" },
  },

  // Accordion
  accordion: {
    open: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  },

  // Tab content
  tabContent: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },

  // Navigation dropdown
  dropdown: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.15, ease: "easeOut" },
  },

  // Logo/brand animation
  logo: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },

  // Counter number
  counter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },

  // Stat item
  statItem: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

// Helper to get variant with custom delay
export function withDelay(variant: Variants, delay: number): Variants {
  const result: Variants = {};
  for (const [key, value] of Object.entries(variant)) {
    if (typeof value === "object" && value !== null && "transition" in value) {
      result[key] = {
        ...value,
        transition: { ...value.transition, delay },
      };
    } else {
      result[key] = value;
    }
  }
  return result;
}

// Helper to create staggered variant
export function createStaggerVariant(
  baseVariant: Variants,
  staggerChildren: number = 0.08,
  delayChildren: number = 0.1,
): Variants {
  return {
    ...baseVariant,
    animate: {
      ...baseVariant.animate,
      transition: {
        ...(baseVariant.animate?.transition as object),
        staggerChildren,
        delayChildren,
      },
    },
  };
}
