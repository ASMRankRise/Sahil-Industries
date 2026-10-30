"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * GSAP utility functions for common animation patterns.
 * All functions respect prefers-reduced-motion.
 */

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Animate a counter/number from 0 to target value.
 * Uses GSAP for smooth counting with formatting.
 */
export function animateCounter(
  element: HTMLElement | null,
  end: number,
  options: {
    duration?: number;
    ease?: string;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    separator?: string;
    onComplete?: () => void;
  } = {},
): gsap.core.Tween | null {
  if (!element || prefersReducedMotion()) {
    if (element) {
      element.textContent = `${options.prefix || ""}${formatNumber(end, options.decimals, options.separator)}${options.suffix || ""}`;
    }
    options.onComplete?.();
    return null;
  }

  const obj = { value: 0 };
  return gsap.to(obj, {
    value: end,
    duration: options.duration || 2,
    ease: options.ease || "power2.out",
    onUpdate: function () {
      if (element) {
        element.textContent = `${options.prefix || ""}${formatNumber(obj.value, options.decimals, options.separator)}${options.suffix || ""}`;
      }
    },
    onComplete: options.onComplete,
  });
}

/**
 * Format number with decimals and thousands separator
 */
function formatNumber(value: number, decimals = 0, separator = ","): string {
  const fixed = value.toFixed(decimals);
  const parts = fixed.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return parts.join(".");
}

/**
 * Create a scroll-triggered animation timeline for a section.
 * Handles common patterns: fade up, stagger children, parallax.
 */
export function createSectionTimeline(
  sectionRef: HTMLElement | null,
  options: {
    trigger?: HTMLElement | string;
    start?: string;
    end?: string;
    scrub?: number | boolean;
    stagger?: number;
    childrenSelector?: string;
    onEnter?: () => void;
    onLeave?: () => void;
    onEnterBack?: () => void;
    onLeaveBack?: () => void;
  } = {},
): gsap.core.Timeline | null {
  if (!sectionRef || prefersReducedMotion()) {
    options.onEnter?.();
    return null;
  }

  const trigger = options.trigger || sectionRef;
  const children = options.childrenSelector
    ? sectionRef.querySelectorAll(options.childrenSelector)
    : sectionRef.children;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: options.start || "top 75%",
      end: options.end || "bottom 25%",
      scrub: options.scrub,
      toggleActions: options.scrub ? undefined : "play none none reverse",
      onEnter: options.onEnter,
      onLeave: options.onLeave,
      onEnterBack: options.onEnterBack,
      onLeaveBack: options.onLeaveBack,
    },
  });

  // Animate section itself
  tl.fromTo(
    sectionRef,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
    0,
  );

  // Stagger children if they exist
  if (children.length > 0 && options.stagger) {
    tl.fromTo(
      children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: options.stagger,
      },
      0.1,
    );
  }

  return tl;
}

/**
 * Create parallax effect on scroll.
 */
export function createParallax(
  element: HTMLElement | null,
  options: {
    speed?: number; // 0.5 = half speed, 2 = double speed
    yPercent?: number;
    ease?: string;
    scrub?: boolean | number;
  } = {},
): ScrollTrigger | null {
  if (!element || prefersReducedMotion()) return null;

  return ScrollTrigger.create({
    trigger: element,
    start: "top bottom",
    end: "bottom top",
    scrub: options.scrub ?? 1,
    onUpdate: (self) => {
      const progress = self.progress;
      const y =
        (progress - 0.5) *
        2 *
        (options.yPercent || 100) *
        (options.speed || 0.5);
      gsap.set(element, { yPercent: y, ease: options.ease || "none" });
    },
  });
}

/**
 * Magnetic button effect - element follows cursor nearby.
 */
export function createMagnetic(
  element: HTMLElement | null,
  options: {
    strength?: number; // 0-1, how strong the pull
    area?: number; // pixels around element to activate
    ease?: string;
  } = {},
): (() => void) | null {
  if (!element || prefersReducedMotion()) return null;

  const { strength = 0.3, area = 100, ease = "power3.out" } = options;

  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

    if (distance < area) {
      gsap.to(element, { x: deltaX, y: deltaY, duration: 0.3, ease });
    }
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
    });
  };

  element.addEventListener("mousemove", handleMouseMove);
  element.addEventListener("mouseleave", handleMouseLeave);

  // Return cleanup function
  return () => {
    element.removeEventListener("mousemove", handleMouseMove);
    element.removeEventListener("mouseleave", handleMouseLeave);
    gsap.set(element, { x: 0, y: 0 });
  };
}

/**
 * Split text into lines/words/chars for staggered reveals.
 * Returns cleanup function.
 */
export function splitText(
  element: HTMLElement | null,
  options: {
    type?: "lines" | "words" | "chars";
    linesClass?: string;
    wordsClass?: string;
    charsClass?: string;
    onSplit?: (split: SplitText) => void;
  } = {},
): { split: SplitText; revert: () => void } | null {
  if (!element || prefersReducedMotion()) return null;

  const split = new SplitText(element, {
    type: options.type || "lines,words,chars",
    linesClass: options.linesClass || "split-line",
    wordsClass: options.wordsClass || "split-word",
    charsClass: options.charsClass || "split-char",
  });

  options.onSplit?.(split);

  return {
    split,
    revert: () => split.revert(),
  };
}

/**
 * Animate split text lines/words/chars.
 */
export function animateSplitText(
  split: SplitText,
  options: {
    target?: "lines" | "words" | "chars";
    from?: gsap.TweenVars;
    to?: gsap.TweenVars;
    stagger?: number;
    delay?: number;
    ease?: string;
    duration?: number;
  } = {},
): gsap.core.Timeline | null {
  if (prefersReducedMotion()) {
    // Set final state immediately
    const targets = split[options.target || "lines"];
    if (targets && options.to) {
      gsap.set(targets, options.to);
    }
    return null;
  }

  const targets = split[options.target || "lines"];
  if (!targets || targets.length === 0) return null;

  return gsap.fromTo(targets, options.from || { opacity: 0, y: 20 }, {
    ...(options.to || { opacity: 1, y: 0 }),
    stagger: options.stagger || 0.05,
    delay: options.delay || 0,
    ease: options.ease || "power3.out",
    duration: options.duration || 0.6,
  });
}

/**
 * Create a scroll-triggered counter animation.
 */
export function createScrollCounter(
  element: HTMLElement | null,
  end: number,
  options: {
    trigger?: HTMLElement | string;
    start?: string;
    duration?: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    separator?: string;
  } = {},
): ScrollTrigger | null {
  if (!element || prefersReducedMotion()) {
    if (element) {
      element.textContent = `${options.prefix || ""}${formatNumber(end, options.decimals, options.separator)}${options.suffix || ""}`;
    }
    return null;
  }

  const trigger = options.trigger || element;

  return ScrollTrigger.create({
    trigger,
    start: options.start || "top 80%",
    once: true,
    onEnter: () => {
      animateCounter(element, end, {
        duration: options.duration,
        decimals: options.decimals,
        prefix: options.prefix,
        suffix: options.suffix,
        separator: options.separator,
      });
    },
  });
}

/**
 * Horizontal scroll animation (for carousels, galleries).
 */
export function createHorizontalScroll(
  container: HTMLElement | null,
  options: {
    trigger?: HTMLElement | string;
    start?: string;
    end?: string;
    scrub?: number | boolean;
    ease?: string;
  } = {},
): ScrollTrigger | null {
  if (!container || prefersReducedMotion()) return null;

  const trigger = options.trigger || container;
  const content = container.firstElementChild as HTMLElement;

  if (!content) return null;

  const scrollWidth = content.scrollWidth - container.clientWidth;

  return ScrollTrigger.create({
    trigger,
    start: options.start || "top bottom",
    end: options.end || "bottom top",
    scrub: options.scrub ?? 1,
    animation: gsap.to(content, {
      x: -scrollWidth,
      ease: options.ease || "none",
    }),
  });
}

/**
 * Reveal element on scroll with clip-path.
 */
export function createClipReveal(
  element: HTMLElement | null,
  options: {
    trigger?: HTMLElement | string;
    start?: string;
    direction?: "top" | "bottom" | "left" | "right";
    duration?: number;
    ease?: string;
  } = {},
): ScrollTrigger | null {
  if (!element || prefersReducedMotion()) {
    if (element) element.style.clipPath = "inset(0 0 0 0)";
    return null;
  }

  const trigger = options.trigger || element;
  const direction = options.direction || "top";

  const clipPaths = {
    top: "inset(100% 0 0 0)",
    bottom: "inset(0 0 100% 0)",
    left: "inset(0 100% 0 0)",
    right: "inset(0 0 0 100%)",
  };

  gsap.set(element, { clipPath: clipPaths[direction] });

  return ScrollTrigger.create({
    trigger,
    start: options.start || "top 80%",
    once: true,
    onEnter: () => {
      gsap.to(element, {
        clipPath: "inset(0 0 0 0)",
        duration: options.duration || 1,
        ease: options.ease || "power3.out",
      });
    },
  });
}

/**
 * Batch animate multiple elements with ScrollTrigger.
 */
export function batchAnimate(
  targets: gsap.TweenTarget,
  options: {
    trigger?: HTMLElement | string;
    start?: string;
    end?: string;
    interval?: number;
    batchMax?: number;
    onEnter?: (elements: Element[], triggers: ScrollTrigger[]) => void;
    onLeave?: (elements: Element[], triggers: ScrollTrigger[]) => void;
    onEnterBack?: (elements: Element[], triggers: ScrollTrigger[]) => void;
    onLeaveBack?: (elements: Element[], triggers: ScrollTrigger[]) => void;
  } = {},
): ScrollTrigger | null {
  if (prefersReducedMotion()) {
    // Set all to final state
    gsap.set(targets, { opacity: 1, y: 0 });
    return null;
  }

  return ScrollTrigger.batch(targets, {
    trigger: options.trigger,
    start: options.start || "top 85%",
    end: options.end || "bottom 15%",
    interval: options.interval || 0.1,
    batchMax: options.batchMax || 10,
    onEnter: (elements) =>
      gsap.to(elements, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.08,
        ...options.onEnter?.(elements, []),
      }),
    onLeave: (elements) =>
      gsap.to(elements, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power3.in",
        ...options.onLeave?.(elements, []),
      }),
    onEnterBack: (elements) =>
      gsap.to(elements, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.08,
        ...options.onEnterBack?.(elements, []),
      }),
    onLeaveBack: (elements) =>
      gsap.to(elements, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: "power3.in",
        ...options.onLeaveBack?.(elements, []),
      }),
  });
}

/**
 * Kill all ScrollTriggers in a context (cleanup).
 */
export function killAllScrollTriggers(context?: gsap.Context): void {
  if (context) {
    context.revert();
  } else {
    ScrollTrigger.getAll().forEach((st) => st.kill());
  }
}

/**
 * Refresh all ScrollTriggers (call after layout changes).
 */
export function refreshScrollTriggers(): void {
  ScrollTrigger.refresh();
}
