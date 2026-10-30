'use client';

import { useLayoutEffect, useRef, useCallback } from 'react';
import { gsap, type Context } from 'gsap';
import { useReducedMotion } from './useReducedMotion';

/**
 * Hook for managing GSAP Context with automatic cleanup.
 * Provides a scoped context for GSAP animations that automatically reverts on unmount.
 * Respects prefers-reduced-motion.
 * 
 * Usage:
 * ```tsx
 * function MyComponent() {
 *   const { rootRef, ctx } = useGSAPContext();
 *   
 *   useLayoutEffect(() => {
 *     if (!ctx) return;
 *     ctx.add(() => {
 *       gsap.to('.element', { x: 100 });
 *     });
 *   }, [ctx]);
 *   
 *   return <div ref={rootRef}>...</div>;
 * }
 * ```
 */
export function useGSAPContext(scope?: string) {
  const prefersReduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const ctxRef = useRef<Context | null>(null);

  useLayoutEffect(() => {
    if (prefersReduced) return;

    // Create GSAP context scoped to rootRef
    ctxRef.current = gsap.context(() => {}, rootRef);

    return () => {
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, [prefersReduced]);

  // Helper to add animations to context
  const add = useCallback((callback: () => void) => {
    if (prefersReduced || !ctxRef.current) return;
    ctxRef.current.add(callback);
  }, [prefersReduced]);

  // Helper to create scoped selector
  const select = useCallback(
    (selector: string) => {
      if (!rootRef.current) return null;
      return rootRef.current.querySelector(selector);
    },
    []
  );

  // Helper to create scoped selector all
  const selectAll = useCallback(
    (selector: string) => {
      if (!rootRef.current) return [];
      return Array.from(rootRef.current.querySelectorAll(selector));
    },
    []
  );

  return {
    rootRef,
    ctx: ctxRef.current,
    add,
    select,
    selectAll,
    isReady: !prefersReduced && !!ctxRef.current,
  };
}

/**
 * Hook for GSAP ScrollTrigger with automatic cleanup.
 * Registers ScrollTrigger plugin and provides create/destroy helpers.
 */
export function useScrollTrigger() {
  const prefersReduced = useReducedMotion();
  const { rootRef, add } = useGSAPContext();

  const createTrigger = useCallback(
    (config: gsap.ScrollTriggerInstanceVars) => {
      if (prefersReduced) return null;
      // ScrollTrigger.create returns the instance
      return ScrollTrigger.create(config);
    },
    [prefersReduced]
  );

  const batch = useCallback(
    (targets: gsap.TweenTarget, config: gsap.ScrollTriggerInstanceVars & { interval?: number }) => {
      if (prefersReduced) return;
      // ScrollTrigger.batch for staggered scroll animations
      return ScrollTrigger.batch(targets, config);
    },
    [prefersReduced]
  );

  return {
    rootRef,
    createTrigger,
    batch,
    isReady: !prefersReduced,
  };
}

// Need to import ScrollTrigger type
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);