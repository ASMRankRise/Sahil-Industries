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

// Standardized constants for TextReveal
const TEXT_REVEAL_DEFAULT_SPLIT = "lines,words,chars";
const TEXT_REVEAL_DEFAULT_ANIMATE = "lines";
const TEXT_REVEAL_DEFAULT_STAGGER = 0.05;
const TEXT_REVEAL_DEFAULT_DELAY = 0;
const TEXT_REVEAL_DEFAULT_DURATION = 0.6;
const TEXT_REVEAL_DEFAULT_EASE = "power3.out";
const TEXT_REVEAL_DEFAULT_FROM = { opacity: 0, y: 20 };
const TEXT_REVEAL_DEFAULT_TO = { opacity: 1, y: 0 };
const TEXT_REVEAL_DEFAULT_TAG = "p";
const TEXT_REVEAL_DEFAULT_LINES_CLASS = "split-line";
const TEXT_REVEAL_DEFAULT_WORDS_CLASS = "split-word";
const TEXT_REVEAL_DEFAULT_CHARS_CLASS = "split-char";
const TEXT_REVEAL_OBSERVER_THRESHOLD = 0.1;
const TEXT_REVEAL_OBSERVER_ROOT_MARGIN = "0px";

/**
 * TextReveal - GSAP SplitText powered text animations.
 * Splits text into lines/words/chars and animates them with stagger.
 */
export function TextReveal({
  children,
  split = TEXT_REVEAL_DEFAULT_SPLIT,
  animate = TEXT_REVEAL_DEFAULT_ANIMATE,
  stagger = TEXT_REVEAL_DEFAULT_STAGGER,
  delay = TEXT_REVEAL_DEFAULT_DELAY,
  duration = TEXT_REVEAL_DEFAULT_DURATION,
  ease = TEXT_REVEAL_DEFAULT_EASE,
  from = TEXT_REVEAL_DEFAULT_FROM,
  to = TEXT_REVEAL_DEFAULT_TO,
  scrollTrigger = false,
  scrollTriggerOptions = {},
  onComplete,
  className = "",
  tag: Tag = TEXT_REVEAL_DEFAULT_TAG,
  linesClass = TEXT_REVEAL_DEFAULT_LINES_CLASS,
  wordsClass = TEXT_REVEAL_DEFAULT_WORDS_CLASS,
  charsClass = TEXT_REVEAL_DEFAULT_CHARS_CLASS,
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
        rootMargin: TEXT_REVEAL_OBSERVER_ROOT_MARGIN,
        threshold: TEXT_REVEAL_OBSERVER_THRESHOLD,
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

// Standardized constants for TextRevealLine
const TEXT_REVEAL_LINE_DEFAULT_STAGGER = 0.08;

export function TextRevealLine({
  stagger = TEXT_REVEAL_LINE_DEFAULT_STAGGER,
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

// Standardized constants for TextRevealWord
const TEXT_REVEAL_WORD_DEFAULT_STAGGER = 0.03;

export function TextRevealWord({
  stagger = TEXT_REVEAL_WORD_DEFAULT_STAGGER,
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

// Standardized constants for TextRevealChar
const TEXT_REVEAL_CHAR_DEFAULT_STAGGER = 0.01;

export function TextRevealChar({
  stagger = TEXT_REVEAL_CHAR_DEFAULT_STAGGER,
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

// Standardized constants for HeadingReveal
const HEADING_REVEAL_DEFAULT_LEVEL = 2;
const HEADING_REVEAL_DEFAULT_STAGGER = 0.1;

export function HeadingReveal({
  level = HEADING_REVEAL_DEFAULT_LEVEL,
  stagger = HEADING_REVEAL_DEFAULT_STAGGER,
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

// Standardized constants for SplitTextOnly
const SPLIT_TEXT_ONLY_DEFAULT_SPLIT = "lines,words,chars";
const SPLIT_TEXT_ONLY_DEFAULT_LINES_CLASS = "split-line";
const SPLIT_TEXT_ONLY_DEFAULT_WORDS_CLASS = "split-word";
const SPLIT_TEXT_ONLY_DEFAULT_CHARS_CLASS = "split-char";

export function SplitTextOnly({
  children,
  split = SPLIT_TEXT_ONLY_DEFAULT_SPLIT,
  linesClass = SPLIT_TEXT_ONLY_DEFAULT_LINES_CLASS,
  wordsClass = SPLIT_TEXT_ONLY_DEFAULT_WORDS_CLASS,
  charsClass = SPLIT_TEXT_ONLY_DEFAULT_CHARS_CLASS,
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
