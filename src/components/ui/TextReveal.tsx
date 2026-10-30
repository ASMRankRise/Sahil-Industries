"use client";

import { useEffect, useRef, useState } from "react";
import {
  splitText,
  animateSplitText,
  prefersReducedMotion,
} from "@/components/animations/gsapUtils";
import { SplitText } from "gsap/SplitText";

interface TextRevealProps {
  /** Text content to animate */
  children: React.ReactNode;
  /** Split type: 'lines' | 'words' | 'chars' | 'lines,words' | 'lines,words,chars' */
  split?: "lines" | "words" | "chars" | "lines,words" | "lines,words,chars";
  /** Animation target: 'lines' | 'words' | 'chars' */
  animate?: "lines" | "words" | "chars";
  /** Stagger delay between elements (seconds) */
  stagger?: number;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Animation duration (seconds) */
  duration?: number;
  /** Easing function */
  ease?: string;
  /** Initial state (from) */
  from?: {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
    rotateX?: number;
    rotateY?: number;
  };
  /** Final state (to) */
  to?: {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
    rotateX?: number;
    rotateY?: number;
  };
  /** Trigger on scroll into view */
  scrollTrigger?: boolean;
  /** Scroll trigger options */
  scrollTriggerOptions?: {
    trigger?: HTMLElement | string;
    start?: string;
    once?: boolean;
  };
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** HTML tag to render */
  tag?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div";
  /** Custom line class */
  linesClass?: string;
  /** Custom word class */
  wordsClass?: string;
  /** Custom char class */
  charsClass?: string;
}

/**
 * TextReveal - GSAP SplitText powered text animations.
 * Splits text into lines/words/chars and animates them with stagger.
 */
export function TextReveal({
  children,
  split = "lines,words,chars",
  animate = "lines",
  stagger = 0.05,
  delay = 0,
  duration = 0.6,
  ease = "power3.out",
  from = { opacity: 0, y: 20 },
  to = { opacity: 1, y: 0 },
  scrollTrigger = false,
  scrollTriggerOptions = {},
  onComplete,
  className = "",
  tag: Tag = "p",
  linesClass = "split-line",
  wordsClass = "split-word",
  charsClass = "split-char",
}: TextRevealProps) {
  const elementRef = useRef<HTMLElement>(null);
  const splitRef = useRef<{ split: SplitText; revert: () => void } | null>(
    null,
  );
  const [isVisible, setIsVisible] = useState(!scrollTrigger);
  const [hasAnimated, setHasAnimated] = useState(false);

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
        rootMargin: "0px",
        threshold: 0.1,
        ...scrollTriggerOptions,
      },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [scrollTrigger, isVisible, hasAnimated, scrollTriggerOptions]);

  // Split text on mount
  useEffect(() => {
    if (!elementRef.current) return;

    splitRef.current = splitText(elementRef.current, {
      type: split as any,
      linesClass,
      wordsClass,
      charsClass,
    });

    return () => {
      splitRef.current?.revert();
      splitRef.current = null;
    };
  }, [split, linesClass, wordsClass, charsClass]);

  // Animate when visible
  useEffect(() => {
    if (!isVisible || hasAnimated || !splitRef.current || !elementRef.current)
      return;

    setHasAnimated(true);

    if (prefersReducedMotion()) {
      // Set final state immediately
      const targets = splitRef.current.split[animate];
      if (targets) {
        gsap.set(targets, to);
      }
      // Show the container
      gsap.set(elementRef.current, { opacity: 1 });
      onComplete?.();
      return;
    }

    // Initially hide the container
    gsap.set(elementRef.current, { opacity: 0 });

    // Show container and animate split elements
    const tl = gsap.timeline({
      onComplete,
    });

    // First show the container
    tl.to(elementRef.current, { opacity: 1, duration: 0, ease: "none" });

    // Then animate the split elements
    const targets = splitRef.current.split[animate];
    if (targets && targets.length > 0) {
      tl.fromTo(
        targets,
        from,
        {
          ...to,
          stagger,
          delay,
          ease,
          duration,
        },
        0,
      );
    }

    return () => {
      tl?.kill();
    };
  }, [
    isVisible,
    hasAnimated,
    animate,
    stagger,
    delay,
    duration,
    ease,
    from,
    to,
    onComplete,
  ]);

  // Need to import gsap
  const gsap = typeof window !== "undefined" ? require("gsap").gsap : null;

  return (
    <Tag ref={elementRef} className={className} style={{ opacity: 0 }}>
      {children}
    </Tag>
  );
}

/**
 * TextRevealLine - Convenience component for line-by-line reveal.
 */
interface TextRevealLineProps extends Omit<
  TextRevealProps,
  "split" | "animate"
> {
  /** Stagger between lines */
  stagger?: number;
}

export function TextRevealLine({
  stagger = 0.08,
  ...props
}: TextRevealLineProps) {
  return (
    <TextReveal split="lines" animate="lines" stagger={stagger} {...props} />
  );
}

/**
 * TextRevealWord - Convenience component for word-by-word reveal.
 */
interface TextRevealWordProps extends Omit<
  TextRevealProps,
  "split" | "animate"
> {
  /** Stagger between words */
  stagger?: number;
}

export function TextRevealWord({
  stagger = 0.03,
  ...props
}: TextRevealWordProps) {
  return (
    <TextReveal split="words" animate="words" stagger={stagger} {...props} />
  );
}

/**
 * TextRevealChar - Convenience component for character-by-character reveal.
 */
interface TextRevealCharProps extends Omit<
  TextRevealProps,
  "split" | "animate"
> {
  /** Stagger between chars */
  stagger?: number;
}

export function TextRevealChar({
  stagger = 0.01,
  ...props
}: TextRevealCharProps) {
  return (
    <TextReveal split="chars" animate="chars" stagger={stagger} {...props} />
  );
}

/**
 * HeadingReveal - Pre-configured for headings with line-by-line animation.
 */
interface HeadingRevealProps extends Omit<
  TextRevealProps,
  "split" | "animate" | "tag"
> {
  /** Heading level */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Stagger between lines */
  stagger?: number;
}

export function HeadingReveal({
  level = 2,
  stagger = 0.1,
  ...props
}: HeadingRevealProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <TextReveal
      split="lines"
      animate="lines"
      stagger={stagger}
      tag={Tag}
      {...props}
    />
  );
}

/**
 * SplitTextOnly - Just splits text without animation (for custom GSAP).
 * Returns the SplitText instance via render prop.
 */
interface SplitTextOnlyProps {
  children: React.ReactNode;
  split?: "lines" | "words" | "chars" | "lines,words" | "lines,words,chars";
  linesClass?: string;
  wordsClass?: string;
  charsClass?: string;
  render: (split: SplitText | null, revert: () => void) => React.ReactNode;
}

export function SplitTextOnly({
  children,
  split = "lines,words,chars",
  linesClass = "split-line",
  wordsClass = "split-word",
  charsClass = "split-char",
  render,
}: SplitTextOnlyProps) {
  const elementRef = useRef<HTMLElement>(null);
  const splitRef = useRef<{ split: SplitText; revert: () => void } | null>(
    null,
  );

  useEffect(() => {
    if (!elementRef.current) return;

    splitRef.current = splitText(elementRef.current, {
      type: split as any,
      linesClass,
      wordsClass,
      charsClass,
    });

    return () => {
      splitRef.current?.revert();
      splitRef.current = null;
    };
  }, [split, linesClass, wordsClass, charsClass]);

  return (
    <div ref={elementRef} style={{ display: "contents" }}>
      {render(splitRef.current?.split || null, () =>
        splitRef.current?.revert(),
      )}
      {children}
    </div>
  );
}
