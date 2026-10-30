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

/**
 * Parallax - Creates a parallax scrolling effect using GSAP ScrollTrigger.
 * The child element moves at a different speed than the scroll.
 */
export function Parallax({
  speed = 0.5,
  maxOffset = 100,
  direction = "vertical",
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
  /** Children to render */
  children: React.ReactNode;
}

export function ParallaxLayer({
  speed,
  yPercent = 0,
  xPercent = 0,
  scale = 1,
  rotate = 0,
  opacity = 1,
  zIndex = 0,
  children,
  className = "",
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

export function ParallaxContainer({
  height = "100vh",
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

export function MouseParallax({
  strength = 0.1,
  resetOnLeave = true,
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
        duration: 0.3,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      if (resetOnLeave) {
        animationRef.current = gsap.to(elementRef.current, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)",
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
