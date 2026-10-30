"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect prefers-reduced-motion media query.
 * Returns true if user prefers reduced motion.
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    // Check initial value
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mediaQuery.matches);

    // Listen for changes
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}

/**
 * Hook that returns animation config based on reduced motion preference.
 * Use this to conditionally disable animations.
 */
export function useAnimationConfig() {
  const prefersReduced = useReducedMotion();

  return {
    prefersReduced,
    // Returns empty transition for reduced motion, otherwise returns provided config
    getTransition: <T extends object>(config: T): T | { duration: 0 } =>
      prefersReduced ? { duration: 0 } : config,
    // Returns initial/animate values that skip animation for reduced motion
    getVariants: <T extends object>(
      variants: T,
    ): T | { initial: false; animate: false } =>
      prefersReduced ? { initial: false, animate: false } : variants,
  };
}
