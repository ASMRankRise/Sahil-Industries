'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Standardized constants for HeroSliderBackdrop
const SLIDES = ['/media/slider/slider-01.jpg', '/media/slider/slider-02.jpg'];
const SLIDE_CLASS = "absolute inset-0 bg-cover bg-center opacity-50 saturate-[.72] contrast-110";
const SLIDE_INITIAL = { opacity: 0, scale: 1.04 };
const SLIDE_ANIMATE = { opacity: 0.5, scale: 1 };
const SLIDE_EXIT = { opacity: 0 };
const SLIDE_TRANSITION_OPACITY = { duration: 0.75 };
const SLIDE_TRANSITION_SCALE = { duration: 6.2, ease: 'linear' };
const DOTS_BOTTOM = "bottom-[150px]";
const DOTS_RIGHT = "right-[clamp(22px,4vw,65px)]";
const DOTS_GAP = "gap-2.5";
const DOT_SIZE = "h-2.5 w-2.5";
const DOT_BASE = "rounded-full border border-white/80 transition";
const DOT_ACTIVE = "scale-125 border-safety bg-safety";
const DOT_INACTIVE = "bg-transparent";

export function HeroSliderBackdrop() {
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();
  
  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % SLIDES.length), 6200);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  return (
    <>
      <div className="absolute inset-0" aria-hidden="true">
        <AnimatePresence initial={false}>
          {SLIDES.map((src, index) => index === active && (
            <motion.div
              key={src}
              className={SLIDE_CLASS}
              style={{ backgroundImage: `url(${src})` }}
              initial={SLIDE_INITIAL}
              animate={SLIDE_ANIMATE}
              exit={SLIDE_EXIT}
              transition={{
                opacity: { duration: reducedMotion ? 0 : SLIDE_TRANSITION_OPACITY.duration },
                scale: { duration: reducedMotion ? 0 : SLIDE_TRANSITION_SCALE.duration, ease: SLIDE_TRANSITION_SCALE.ease },
              }}
            />
          ))}
        </AnimatePresence>
      </div>
      <div className={`absolute ${DOTS_BOTTOM} ${DOTS_RIGHT} z-10 grid ${DOTS_GAP}`} aria-label="Hero slides">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActive(index)}
            className={`${DOT_SIZE} ${DOT_BASE} ${index === active ? DOT_ACTIVE : DOT_INACTIVE}`}
            aria-label={`Show slide ${index + 1}`}
            aria-current={index === active}
          />
        ))}
      </div>
    </>
  );
}
