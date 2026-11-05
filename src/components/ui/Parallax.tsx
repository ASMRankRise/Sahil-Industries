"use client";

import { useEffect, useRef } from "react";
import {
  createParallax,
  prefersReducedMotion,
} from "@/components/animations/gsapUtils";

interface ParallaxProps {
  /** Speed of parallax (0.5 = half scroll speed, 1 = same speed, 2 = double) */
  speed?: number;
  /** Maximum offset in pixels */
  maxOffset?: number;
  /** Direction: 'vertical' | 'horizontal' */
  direction?: "vertical" | "horizontal";
  /** Element to use as trigger (default: self) */
  triggerRef?: React.RefObject<HTMLElement>;
  /** Additional CSS classes */
  className?: string;
  /** Children to render */
  children: React.ReactNode;
  /** Style overrides */
  style?: React.CSSProperties;
}

// Standardized constants for Parallax
const PARALLAX_DEFAULT_SPEED = 0.5;
const PARALLAX_DEFAULT_MAX_OFFSET = 100;
const PARALLAX_DEFAULT_DIRECTION = "vertical";

/**
 * Parallax - Creates a parallax scrolling effect using GSAP ScrollTrigger.
 * The child element moves at a different speed than the scroll.
 */
export function Parallax({
  speed = PARALLAX_DEFAULT_SPEED,
  maxOffset = PARALLAX_DEFAULT_MAX_OFFSET,
  direction = PARALLAX_DEFAULT_DIRECTION,
  triggerRef,
  children,
  className = "",
  style = {},
}: ParallaxProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<ReturnType<typeof createParallax> | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const target = triggerRef?.current || elementRef.current;
    if (!target) return;

    parallaxRef.current = createParallax(target, {
      speed,
      yPercent: maxOffset,
    });

    return () => {
      parallaxRef.current?.kill();
      parallaxRef.current = null;
    };
  }, [speed, maxOffset, direction, triggerRef]);

  return (
    <div
      ref={elementRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        willChange: "transform",
        ...style,
      }}>
      {children}
    </div>
  );
}

/**
 * ParallaxLayer - A single layer in a multi-layer parallax effect.
 */
interface ParallaxLayerProps {
  /** Speed multiplier (0 = fixed, 1 = normal scroll, >1 = faster) */
  speed: number;
  /** Vertical offset percentage */
  yPercent?: number;
  /** Horizontal offset percentage */
  xPercent?: number;
  /** Scale factor */
  scale?: number;
  /** Rotation in degrees */
  rotate?: number;
  /** Opacity (0-1) */
  opacity?: number;
  /** Z-index */
  zIndex?: number;
  /** Additional CSS classes */
  className?: string;
  /** Style overrides */
  style?: React.CSSProperties;
  /** Children to render */
  children?: React.ReactNode;
}

// Standardized constants for ParallaxLayer
const PARALLAX_LAYER_DEFAULT_Y_PERCENT = 0;
const PARALLAX_LAYER_DEFAULT_X_PERCENT = 0;
const PARALLAX_LAYER_DEFAULT_SCALE = 1;
const PARALLAX_LAYER_DEFAULT_ROTATE = 0;
const PARALLAX_LAYER_DEFAULT_OPACITY = 1;
const PARALLAX_LAYER_DEFAULT_Z_INDEX = 0;

export function ParallaxLayer({
  speed,
  yPercent = PARALLAX_LAYER_DEFAULT_Y_PERCENT,
  xPercent = PARALLAX_LAYER_DEFAULT_X_PERCENT,
  scale = PARALLAX_LAYER_DEFAULT_SCALE,
  rotate = PARALLAX_LAYER_DEFAULT_ROTATE,
  opacity = PARALLAX_LAYER_DEFAULT_OPACITY,
  zIndex = PARALLAX_LAYER_DEFAULT_Z_INDEX,
  children,
  className = "",
  style = {},
}: ParallaxLayerProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<ReturnType<typeof createParallax> | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    if (!elementRef.current) return;

    parallaxRef.current = createParallax(elementRef.current, {
      speed,
      yPercent,
    });

    return () => {
      parallaxRef.current?.kill();
      parallaxRef.current = null;
    };
  }, [speed, yPercent]);

  return (
    <div
      ref={elementRef}
      className={`absolute inset-0 ${className}`}
      style={{
        zIndex,
        opacity,
        transform: `translate3d(${xPercent}%, ${yPercent}%, 0) scale(${scale}) rotate(${rotate}deg)`,
        willChange: "transform, opacity",
        ...style,
        ...style,
      }}>
      {children}
    </div>
  );
}

/**
 * ParallaxContainer - Wrapper for multiple ParallaxLayer components.
 */
interface ParallaxContainerProps {
  /** Height of the parallax container */
  height?: string | number;
  /** Additional CSS classes */
  className?: string;
  /** Children (should be ParallaxLayer components) */
  children: React.ReactNode;
  /** Style overrides */
  style?: React.CSSProperties;
}

// Standardized constants for ParallaxContainer
const PARALLAX_CONTAINER_DEFAULT_HEIGHT = "100vh";

export function ParallaxContainer({
  height = PARALLAX_CONTAINER_DEFAULT_HEIGHT,
  className = "",
  children,
  style = {},
}: ParallaxContainerProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        height,
        position: "relative",
        ...style,
      }}>
      {children}
    </div>
  );
}

/**
 * MouseParallax - Parallax effect that follows mouse movement.
 */
interface MouseParallaxProps {
  /** Strength of the effect (0-1) */
  strength?: number;
  /** Whether to reset on mouse leave */
  resetOnLeave?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Children to render */
  children: React.ReactNode;
}

// Standardized constants for MouseParallax
const MOUSE_PARALLAX_DEFAULT_STRENGTH = 0.1;
const MOUSE_PARALLAX_DEFAULT_RESET = true;
const MOUSE_PARALLAX_ANIMATION_DURATION = 0.3;
const MOUSE_PARALLAX_ANIMATION_EASE = "power3.out";
const MOUSE_PARALLAX_LEAVE_DURATION = 0.5;
const MOUSE_PARALLAX_LEAVE_EASE = "elastic.out(1, 0.5)";

export function MouseParallax({
  strength = MOUSE_PARALLAX_DEFAULT_STRENGTH,
  resetOnLeave = MOUSE_PARALLAX_DEFAULT_RESET,
  children,
  className = "",
}: MouseParallaxProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  // Need to import gsap
  const gsap = typeof window !== "undefined" ? require("gsap").gsap : null;

  useEffect(() => {
    if (prefersReducedMotion() || !gsap || !elementRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = elementRef.current!.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      animationRef.current = gsap.to(elementRef.current, {
        x: deltaX,
        y: deltaY,
        duration: MOUSE_PARALLAX_ANIMATION_DURATION,
        ease: MOUSE_PARALLAX_ANIMATION_EASE,
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      if (resetOnLeave) {
        animationRef.current = gsap.to(elementRef.current, {
          x: 0,
          y: 0,
          duration: MOUSE_PARALLAX_LEAVE_DURATION,
          ease: MOUSE_PARALLAX_LEAVE_EASE,
          overwrite: "auto",
        });
      }
    };

    elementRef.current.addEventListener("mousemove", handleMouseMove);
    elementRef.current.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      elementRef.current?.removeEventListener("mousemove", handleMouseMove);
      elementRef.current?.removeEventListener("mouseleave", handleMouseLeave);
      animationRef.current?.kill();
    };
  }, [strength, resetOnLeave]);

  return (
    <div
      ref={elementRef}
      className={`relative ${className}`}
      style={{
        willChange: "transform",
        transformStyle: "preserve-3d",
      }}>
      {children}
    </div>
  );
}
