'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

const slides = ['/media/slider/slider-01.jpg', '/media/slider/slider-02.jpg'];

export function HeroSliderBackdrop() {
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();
  useEffect(() => { if (reducedMotion) return; const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 6200); return () => window.clearInterval(timer); }, [reducedMotion]);
  return <><div className="modern-hero__slides" aria-hidden="true"><AnimatePresence initial={false}>{slides.map((src, index) => index === active && <motion.div key={src} className="modern-hero__image" style={{ backgroundImage: `url(${src})` }} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ opacity: { duration: reducedMotion ? 0 : .75 }, scale: { duration: reducedMotion ? 0 : 6.2, ease: 'linear' } }} />)}</AnimatePresence></div><div className="modern-hero__dots" aria-label="Hero slides">{slides.map((_, index) => <button key={index} type="button" onClick={() => setActive(index)} className={index === active ? 'is-active' : ''} aria-label={`Show slide ${index + 1}`} aria-current={index === active} />)}</div></>;
}
