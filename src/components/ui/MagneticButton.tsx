'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createMagnetic, prefersReducedMotion } from '@/components/animations/gsapUtils';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface MagneticButtonProps extends HTMLMotionProps<'button'> {
  /** Strength of magnetic pull (0-1) */
  strength?: number;
  /** Activation area around button (pixels) */
  area?: number;
  /** Whether to show visual indicator */
  showIndicator?: boolean;
  /** Children to render */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Variant for Framer Motion hover/tap */
  variant?: 'primary' | 'secondary' | 'ghost';
}

const buttonVariants = {
  primary: {
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.15, ease: 'easeOut' },
  },
  secondary: {
    whileHover: { scale: 1.01, y: -1 },
    whileTap: { scale: 0.99 },
    transition: { duration: 0.1, ease: 'easeOut' },
  },
  ghost: {
    whileHover: { scale: 1.01 },
    whileTap: { scale: 0.99 },
    transition: { duration: 0.1, ease: 'easeOut' },
  },
};

/**
 * MagneticButton - Button with magnetic cursor attraction effect.
 * Uses GSAP for smooth magnetic follow, Framer Motion for press/hover.
 */
export function MagneticButton({
  strength = 0.3,
  area = 100,
  showIndicator = false,
  children,
  className = '',
  variant = 'primary',
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion() || !buttonRef.current) return;

    cleanupRef.current = createMagnetic(buttonRef.current, { strength, area });

    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [strength, area]);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <motion.button
      ref={buttonRef}
      variants={buttonVariants[variant]}
      initial={false}
      animate={isHovering ? 'hover' : 'idle'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        relative inline-flex items-center justify-center
        font-bold uppercase tracking-industrial
        transition-colors duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-safety/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink
        ${className}
      `}
      {...props}
    >
      {showIndicator && (
        <span
          className="absolute inset-0 border border-safety/50 rounded-[inherit] pointer-events-none transition-opacity duration-300"
          style={{ opacity: isHovering ? 1 : 0 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

/**
 * MagneticLink - Link version of MagneticButton.
 */
interface MagneticLinkProps extends HTMLMotionProps<'a'> {
  strength?: number;
  area?: number;
  showIndicator?: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function MagneticLink({
  strength = 0.3,
  area = 100,
  showIndicator = false,
  children,
  className = '',
  variant = 'primary',
  ...props
}: MagneticLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion() || !linkRef.current) return;

    cleanupRef.current = createMagnetic(linkRef.current, { strength, area });

    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [strength, area]);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <motion.a
      ref={linkRef}
      variants={buttonVariants[variant]}
      initial={false}
      animate={isHovering ? 'hover' : 'idle'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        relative inline-flex items-center justify-center
        font-bold uppercase tracking-industrial
        transition-colors duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-safety/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink
        ${className}
      `}
      {...props}
    >
      {showIndicator && (
        <span
          className="absolute inset-0 border border-safety/50 rounded-[inherit] pointer-events-none transition-opacity duration-300"
          style={{ opacity: isHovering ? 1 : 0 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.a>
  );
}

/**
 * MagneticElement - Wrapper to add magnetic effect to any element.
 */
interface MagneticElementProps {
  strength?: number;
  area?: number;
  children: React.ReactElement;
  className?: string;
}

export function MagneticElement({
  strength = 0.2,
  area = 150,
  children,
  className = '',
}: MagneticElementProps) {
  const elementRef = useRef<HTMLElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !elementRef.current) return;

    cleanupRef.current = createMagnetic(elementRef.current, { strength, area });

    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [strength, area]);

  // Clone the child and add ref
  const child = React.Children.only(children) as React.ReactElement;
  
  return (
    <div
      ref={elementRef}
      className={`inline-block ${className}`}
      style={{ willChange: 'transform' }}
    >
      {React.cloneElement(child, { ref: elementRef })}
    </div>
  );
}

/**
 * RippleButton - Button with material-style ripple effect on click.
 */
interface RippleButtonProps extends HTMLMotionProps<'button'> {
  /** Ripple color */
  rippleColor?: string;
  children: React.ReactNode;
  className?: string;
}

export function RippleButton({
  rippleColor = 'rgba(246,197,21,0.4)',
  children,
  className = '',
  ...props
}: RippleButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion()) return;

    const rect = buttonRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`
        relative overflow-hidden
        inline-flex items-center justify-center
        font-bold uppercase tracking-industrial
        focus:outline-none focus-visible:ring-2 focus-visible:ring-safety/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink
        ${className}
      `}
      {...props}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            backgroundColor: rippleColor,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      <span className="relative z-10">{children}</span>
      <style jsx>{`
        @keyframes ripple {
          to {
            width: 300px;
            height: 300px;
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 0.6s ease-out forwards;
        }
      `}</style>
    </button>
  );
}