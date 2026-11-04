"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/components/animations/gsapUtils";

// Standardized constants for Counter
const COUNTER_DEFAULT_START = 0;
const COUNTER_DEFAULT_DURATION = 2;
const COUNTER_DEFAULT_EASE = "power2.out";
const COUNTER_DEFAULT_DECIMALS = 0;
const COUNTER_DEFAULT_SEPARATOR = ",";
const COUNTER_DEFAULT_TAG = "span";
const COUNTER_OBSERVER_THRESHOLD = 0.1;
const COUNTER_OBSERVER_ROOT_MARGIN = "0px";

interface CounterProps {
  /** Target number to count to */
  end: number;
  /** Starting number (default: 0) */
  start?: number;
  /** Animation duration in seconds (default: 2) */
  duration?: number;
  /** Easing function (default: 'power2.out') */
  ease?: string;
  /** Number of decimal places (default: 0) */
  decimals?: number;
  /** Thousands separator (default: ',') */
  separator?: string;
  /** Prefix string (e.g., '$', '+') */
  prefix?: string;
  /** Suffix string (e.g., '+', '%', 'K') */
  suffix?: string;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** HTML tag to render (default: 'span') */
  tag?: "span" | "div" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /** Trigger animation on scroll into view */
  scrollTrigger?: boolean;
  /** Scroll trigger options */
  scrollTriggerOptions?: {
    trigger?: HTMLElement | string;
    start?: string;
    once?: boolean;
  };
}

/**
 * Counter - Animated number counter with GSAP.
 * Supports scroll-triggered animation, formatting, and reduced motion.
 */
export function Counter({
  end,
  start = COUNTER_DEFAULT_START,
  duration = COUNTER_DEFAULT_DURATION,
  ease = COUNTER_DEFAULT_EASE,
  decimals = COUNTER_DEFAULT_DECIMALS,
  separator = COUNTER_DEFAULT_SEPARATOR,
  prefix = "",
  suffix = "",
  onComplete,
  className = "",
  tag: Tag = COUNTER_DEFAULT_TAG,
  scrollTrigger = false,
  scrollTriggerOptions: _scrollTriggerOptions,
}: CounterProps) {
  const elementRef = useRef<Element>(null);
  const [isVisible, setIsVisible] = useState(!scrollTrigger);
  const [displayValue, setDisplayValue] = useState(start);
  const hasAnimatedRef = useRef(false);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  // Handle scroll-triggered animation
    useEffect(() => {
      if (!scrollTrigger || isVisible || hasAnimatedRef.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: COUNTER_OBSERVER_ROOT_MARGIN,
          threshold: COUNTER_OBSERVER_THRESHOLD,
        },
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      
        // Check if element is already in viewport (for refresh scenarios)
        // Use requestAnimationFrame to ensure layout is complete
        const checkViewport = () => {
          if (elementRef.current) {
            const rect = elementRef.current.getBoundingClientRect();
            const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
            if (isInViewport) {
              setIsVisible(true);
              observer.disconnect();
            }
          }
        };
      
        // Immediate check
        checkViewport();
      
        // Check after layout is complete
        requestAnimationFrame(checkViewport);
      
        // Fallback: check again after a short delay in case layout isn't ready
        const timeoutId = setTimeout(checkViewport, 100);
      
        return () => {
          observer.disconnect();
          clearTimeout(timeoutId);
        };
      }

      return () => observer.disconnect();
    }, [scrollTrigger, isVisible]);

  // Animate when visible
  useEffect(() => {
    if (!isVisible || hasAnimatedRef.current) return;

    hasAnimatedRef.current = true;
    setDisplayValue(start);

    if (prefersReducedMotion()) {
      setDisplayValue(end);
      onComplete?.();
      return;
    }

    const obj = { value: start };
    animationRef.current = gsap.to(obj, {
      value: end,
      duration,
      ease,
      onUpdate: function () {
        setDisplayValue(obj.value);
      },
      onComplete: () => {
        setDisplayValue(end);
        onComplete?.();
      },
    });

    return () => {
      animationRef.current?.kill();
      animationRef.current = null;
    };
  }, [
    isVisible,
    end,
    start,
    duration,
    ease,
    decimals,
    separator,
    prefix,
    suffix,
    onComplete,
  ]);

  function formatNumber(
    value: number,
    decimals: number,
    separator: string,
  ): string {
    const fixed = value.toFixed(decimals);
    const parts = fixed.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return parts.join(".");
  }

  return (
    <Tag
      ref={elementRef as React.Ref<HTMLElement>}
      className={className}
      aria-live="polite"
      aria-atomic="true">
      {prefix}
      {formatNumber(displayValue, decimals, separator)}
      {suffix}
    </Tag>
  );
}

/**
 * CounterGroup - Multiple counters that animate together with stagger.
 */
interface CounterGroupProps {
  /** Array of counter configurations */
  counters: Array<{
    end: number;
    label?: string;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    duration?: number;
    className?: string;
  }>;
  /** Stagger delay between counters (seconds) */
  stagger?: number;
  /** Container className */
  className?: string;
  /** Scroll trigger for the group */
  scrollTrigger?: boolean;
}

const COUNTER_GROUP_DEFAULT_STAGGER = 0.1;
const COUNTER_GROUP_OBSERVER_THRESHOLD = 0.1;
const COUNTER_GROUP_OBSERVER_ROOT_MARGIN = "0px";
const COUNTER_GROUP_DEFAULT_DURATION = 2;
const COUNTER_GROUP_DEFAULT_DECIMALS = 0;
const COUNTER_GROUP_DEFAULT_SEPARATOR = ",";

export function CounterGroup({
  counters,
  stagger = COUNTER_GROUP_DEFAULT_STAGGER,
  className = "",
  scrollTrigger = false,
}: CounterGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!scrollTrigger);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!scrollTrigger || isVisible || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: COUNTER_GROUP_OBSERVER_ROOT_MARGIN, threshold: COUNTER_GROUP_OBSERVER_THRESHOLD },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [scrollTrigger, isVisible, hasAnimated]);

  useEffect(() => {
    if (!isVisible || hasAnimated || prefersReducedMotion()) {
      setHasAnimated(true);
      return;
    }

    setHasAnimated(true);

    const ctx = gsap.context(() => {
      counters.forEach((counter, index) => {
        const element = containerRef.current?.querySelector(
          `[data-counter-index="${index}"]`,
        ) as HTMLElement;
        if (element) {
          const obj = { value: 0 };
          gsap.to(obj, {
            value: counter.end,
            duration: counter.duration || COUNTER_GROUP_DEFAULT_DURATION,
            ease: COUNTER_DEFAULT_EASE,
            delay: index * stagger,
            onUpdate: function () {
              element.textContent = `${counter.prefix || ""}${obj.value.toFixed(counter.decimals || COUNTER_GROUP_DEFAULT_DECIMALS).replace(/\B(?=(\d{3})+(?!\d))/g, COUNTER_GROUP_DEFAULT_SEPARATOR)}${counter.suffix || ""}`;
            },
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isVisible, hasAnimated, counters, stagger]);

  return (
    <div
      ref={containerRef}
      className={className}
      role="list"
      aria-label="Statistics">
      {counters.map((counter, index) => (
        <div
          key={index}
          className="flex flex-col items-center"
          data-counter-index={index}>
          <Counter
            end={counter.end}
            prefix={counter.prefix}
            suffix={counter.suffix}
            decimals={counter.decimals}
            duration={counter.duration}
            className={counter.className}
            tag="span"
          />
          {counter.label && (
            <span className="mt-1 text-sm text-steel text-center max-w-[120px]">
              {counter.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
