'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

/** A single, isolated GSAP treatment for the homepage hero artwork. */
export function HeroMotion() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !root.current) return;
    const context = gsap.context(() => {
      gsap.fromTo('.hero-motion__orb', { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.25, ease: 'power3.out' });
      gsap.to('.hero-motion__line', { xPercent: 125, duration: 2.8, ease: 'power1.inOut', repeat: -1, yoyo: true, stagger: 0.18 });
    }, root);
    return () => context.revert();
  }, []);

  return <div ref={root} className="hero-motion" aria-hidden="true"><span className="hero-motion__orb" /><i className="hero-motion__line" /><i className="hero-motion__line" /><i className="hero-motion__line" /></div>;
}
