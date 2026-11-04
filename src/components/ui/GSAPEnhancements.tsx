"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/components/animations/gsapUtils";

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP Enhancements - Adds subtle, professional GSAP animations throughout the website
 * without changing any UI or functionality.
 * 
 * This component adds:
 * 1. Smooth scroll-triggered fade-up animations for sections
 * 2. Parallax effects on hero backgrounds
 * 3. Staggered animations for grid items
 * 4. Magnetic hover effects on interactive elements
 * 5. Smooth counter animations
 * 6. Text reveal animations
 * 7. Image reveal animations
 * 8. Scroll progress indicator
 */

export function GSAPEnhancements() {
  const contextRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    contextRef.current = gsap.context(() => {
      // 1. Section fade-up animations with ScrollTrigger
      const sections = document.querySelectorAll("section:not(.hero-section)");
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
              once: true,
            },
          }
        );
      });

      // 2. Parallax effect for hero background elements
      const heroBackgrounds = document.querySelectorAll(".hero-bg-parallax, [data-parallax]");
      heroBackgrounds.forEach((bg) => {
        const speed = parseFloat(bg.getAttribute("data-parallax-speed") || "0.3");
        gsap.to(bg, {
          yPercent: 50 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: bg,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      // 3. Staggered animations for grid items
      const grids = document.querySelectorAll(".stagger-grid, .products-grid, .clients-grid, .why-choose-grid");
      grids.forEach((grid) => {
        const items = grid.querySelectorAll(":scope > *");
        if (items.length > 0) {
          gsap.fromTo(
            items,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.08,
              scrollTrigger: {
                trigger: grid,
                start: "top 80%",
                toggleActions: "play none none reverse",
                once: true,
              },
            }
          );
        }
      });

      // 4. Magnetic hover effect for buttons and links
      const magneticElements = document.querySelectorAll("[data-magnetic], .magnetic-btn, .magnetic-link");
      magneticElements.forEach((el) => {
        const strength = parseFloat(el.getAttribute("data-magnetic-strength") || "0.3");
        const area = parseFloat(el.getAttribute("data-magnetic-area") || "100");
        
        const handleMouseMove = (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const deltaX = (e.clientX - centerX) * strength;
          const deltaY = (e.clientY - centerY) * strength;
          const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

          if (distance < area) {
            gsap.to(el, { x: deltaX, y: deltaY, duration: 0.3, ease: "power3.out" });
          }
        };

        const handleMouseLeave = () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
        };

        el.addEventListener("mousemove", handleMouseMove);
        el.addEventListener("mouseleave", handleMouseLeave);
      });

      // 5. Counter animations for stat numbers
      const counters = document.querySelectorAll("[data-counter]");
      counters.forEach((counter) => {
        const end = parseFloat(counter.getAttribute("data-counter-end") || "0");
        const duration = parseFloat(counter.getAttribute("data-counter-duration") || "2");
        const decimals = parseInt(counter.getAttribute("data-counter-decimals") || "0", 10);
        const prefix = counter.getAttribute("data-counter-prefix") || "";
        const suffix = counter.getAttribute("data-counter-suffix") || "";
        const separator = counter.getAttribute("data-counter-separator") || ",";

        const formatNumber = (value: number) => {
          const fixed = value.toFixed(decimals);
          const parts = fixed.split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
          return parts.join(".");
        };

        ScrollTrigger.create({
          trigger: counter,
          start: "top 85%",
          once: true,
          onEnter: () => {
            const obj = { value: 0 };
            gsap.to(obj, {
              value: end,
              duration,
              ease: "power2.out",
              onUpdate: () => {
                counter.textContent = `${prefix}${formatNumber(obj.value)}${suffix}`;
              },
              onComplete: () => {
                counter.textContent = `${prefix}${formatNumber(end)}${suffix}`;
              },
            });
          },
        });
      });

      // 6. Text reveal animations (split text lines)
      const textReveals = document.querySelectorAll("[data-text-reveal], .text-reveal");
      textReveals.forEach((el) => {
        const lines = el.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span");
        if (lines.length > 0) {
          gsap.fromTo(
            lines,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.1,
              scrollTrigger: {
                trigger: el,
                start: "top 80%",
                toggleActions: "play none none reverse",
                once: true,
              },
            }
          );
        }
      });

      // 7. Image reveal with clip-path
      const imageReveals = document.querySelectorAll("[data-image-reveal], .image-reveal");
      imageReveals.forEach((img) => {
        gsap.set(img, { clipPath: "inset(100% 0 0 0)", opacity: 0 });
        ScrollTrigger.create({
          trigger: img,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(img, {
              clipPath: "inset(0 0 0 0)",
              opacity: 1,
              duration: 1,
              ease: "power3.out",
            });
          },
        });
      });

      // 8. Smooth scroll progress indicator
      const progressBar = document.querySelector("[data-scroll-progress]");
      if (progressBar) {
        gsap.to(progressBar, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.1,
          },
        });
      }

      // 9. Floating animation for decorative elements
      const floatingElements = document.querySelectorAll("[data-float], .float-element");
      floatingElements.forEach((el, index) => {
        const duration = parseFloat(el.getAttribute("data-float-duration") || "3");
        const distance = parseFloat(el.getAttribute("data-float-distance") || "10");
        
        gsap.to(el, {
          y: distance,
          duration,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: index * 0.2,
        });
      });

      // 10. Rotate animation for decorative elements
      const rotateElements = document.querySelectorAll("[data-rotate], .rotate-element");
      rotateElements.forEach((el, index) => {
        const duration = parseFloat(el.getAttribute("data-rotate-duration") || "20");
        const direction = el.getAttribute("data-rotate-direction") === "reverse" ? -1 : 1;
        
        gsap.to(el, {
          rotation: 360 * direction,
          duration,
          ease: "none",
          repeat: -1,
          delay: index * 0.5,
        });
      });

      // 11. Pulse animation for CTA buttons
      const pulseButtons = document.querySelectorAll("[data-pulse], .pulse-btn");
      pulseButtons.forEach((btn) => {
        gsap.to(btn, {
          boxShadow: "0 0 20px rgba(246, 197, 21, 0.5)",
          duration: 1.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      // 12. Reveal on scroll for cards with stagger
      const cardGroups = document.querySelectorAll("[data-card-group], .card-group");
      cardGroups.forEach((group) => {
        const cards = group.querySelectorAll(":scope > *");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: group,
              start: "top 80%",
              toggleActions: "play none none reverse",
              once: true,
            },
          }
        );
      });

      // 13. Horizontal scroll animation for carousels
      const horizontalScrolls = document.querySelectorAll("[data-horizontal-scroll], .horizontal-scroll");
      horizontalScrolls.forEach((container) => {
        const content = container.firstElementChild as HTMLElement;
        if (content) {
          const scrollWidth = content.scrollWidth - container.clientWidth;
          gsap.to(content, {
            x: -scrollWidth,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        }
      });

      // 14. Navbar scroll effect enhancement
      const navbar = document.querySelector("header, nav[role='navigation']");
      if (navbar) {
        ScrollTrigger.create({
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            const progress = self.progress;
            if (progress > 0.01) {
              navbar.classList.add("scrolled");
            } else {
              navbar.classList.remove("scrolled");
            }
          },
        });
      }

      // 15. Smooth anchor link scrolling
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          const targetId = this.getAttribute("href");
          if (targetId && targetId !== "#") {
            const target = document.querySelector(targetId);
            if (target) {
              e.preventDefault();
              gsap.to(window, {
                scrollTo: { y: target, offsetY: 80 },
                duration: 1,
                ease: "power3.inOut",
              });
            }
          }
        });
      });

    }, document.body);

    return () => {
      contextRef.current?.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return null; // This component doesn't render anything
}

/**
 * Hook to add GSAP animations to specific elements
 */
export function useGSAPAnimation(
  selector: string,
  animation: gsap.TweenVars,
  scrollTrigger?: ScrollTrigger.Vars
) {
  const elementRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const elements = elementRef.current?.querySelectorAll(selector);
      if (elements) {
        elements.forEach((el) => {
          gsap.fromTo(el, { opacity: 0, y: 20 }, {
            ...animation,
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none reverse",
              once: true,
              ...scrollTrigger,
            },
          });
        });
      }
    });

    return () => ctx.revert();
  }, [selector, animation, scrollTrigger]);

  return elementRef;
}

export default GSAPEnhancements;