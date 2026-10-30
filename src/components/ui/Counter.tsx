'use client';

import { useEffect, useRef, useState } from 'react';
import { animateCounter, prefersReducedMotion } from '@/components/animations/gsapUtils';

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
  tag?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
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
  start = 0,
  duration = 2,
  ease = 'power2.out',
  decimals = 0,
  separator = ',',
  prefix = '',
  suffix = '',
  onComplete,
  className = '',
  tag: Tag = 'span',
  scrollTrigger = false,
  scrollTriggerOptions = {},
}: CounterProps) {
  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(!scrollTrigger);
  const [hasAnimated, setHasAnimated] = useState(false);
  const scrollTriggerRef = useRef<ReturnType<typeof animateCounter> | null>(null);

  // Handle scroll-triggered animation
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
      {
        rootMargin: '0px',
        threshold: 0.1,
        ...scrollTriggerOptions,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [scrollTrigger, isVisible, hasAnimated, scrollTriggerOptions]);

  // Animate when visible
  useEffect(() => {
    if (!isVisible || hasAnimated || !elementRef.current) return;

    setHasAnimated(true);

    if (prefersReducedMotion()) {
      elementRef.current.textContent = `${prefix}${formatNumber(end, decimals, separator)}${suffix}`;
      onComplete?.();
      return;
    }

    const obj = { value: start };
    scrollTriggerRef.current = gsap.to(obj, {
      value: end,
      duration,
      ease,
      onUpdate: function () {
        if (elementRef.current) {
          elementRef.current.textContent = `${prefix}${formatNumber(obj.value, decimals, separator)}${suffix}`;
        }
      },
      onComplete: () => {
        onComplete?.();
      },
    });

    return () => {
      scrollTriggerRef.current?.kill();
    };
  }, [isVisible, hasAnimated, end, start, duration, ease, decimals, separator, prefix, suffix, onComplete]);

  // Need to import gsap
  const gsap = typeof window !== 'undefined' ? require('gsap').gsap : null;

  function formatNumber(value: number, decimals: number, separator: string): string {
    const fixed = value.toFixed(decimals);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return parts.join('.');
  }

  return (
    <Tag
      ref={elementRef}
      className={className}
      aria-live="polite"
      aria-atomic="true"
    >
      {prefix}{formatNumber(isVisible && !prefersReducedMotion() ? start : end, decimals, separator)}{suffix}
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

export function CounterGroup({
  counters,
  stagger = 0.1,
  className = '',
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
      { rootMargin: '0px', threshold: 0.1 }
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
        const element = containerRef.current?.querySelector(`[data-counter-index="${index}"]`) as HTMLElement;
        if (element) {
          animateCounter(element, counter.end, {
            duration: counter.duration || 2,
            decimals: counter.decimals || 0,
            prefix: counter.prefix || '',
            suffix: counter.suffix || '',
            separator: ',',
            delay: index * stagger,
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isVisible, hasAnimated, counters, stagger]);

  const gsap = typeof window !== 'undefined' ? require('gsap').gsap : null;

  return (
    <div ref={containerRef} className={className} role="list" aria-label="Statistics">
      {counters.map((counter, index) => (
        <div key={index} className="flex flex-col items-center" data-counter-index={index}>
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
            <span className="mt-1 text-sm text-steel text-center max-w-[120px]">{counter.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}