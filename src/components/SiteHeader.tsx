"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Globe2,
  Mail,
  Menu,
  Phone,
  Share2,
  X,
  MessageCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { primaryNavigation, siteContact } from "@/data/site";
import { MagneticElement } from "@/components/ui/MagneticButton";
import { useReducedMotion } from "@/components/animations/hooks/useReducedMotion";

// Standardized spacing constants for header
const HEADER_HEIGHT_DESKTOP = "min-h-[88px]";
const HEADER_HEIGHT_MOBILE = "min-h-[74px]";
const LOGO_PADDING_X = "px-[34px]";
const TOP_BAR_HEIGHT = "h-[31px]";
const NAV_HEIGHT = "h-[57px]";
const NAV_GAP_DESKTOP = "gap-7";
const NAV_GAP_LG = "max-lg:gap-4";
const NAV_PR_DESKTOP = "pr-[38px]";
const NAV_PR_LG = "max-lg:pr-5";
const CONTACT_ICON_SIZE = 20;
const CONTACT_ICON_SIZE_MOBILE = 22;
const TOOLTIP_OFFSET = "mb-2";
const TOOLTIP_PADDING = "px-3 py-2";
const MOBILE_MENU_BUTTON_SIZE = "h-[42px]";
const DIVIDER_WIDTH = "w-px";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prefersReduced = useReducedMotion();

  // Track scroll position for header effects
  useEffect(() => {
    if (prefersReduced) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prefersReduced]);

  const productItem = primaryNavigation.find(
    (item) => item.label === "Products",
  );
  const primaryItems = primaryNavigation.filter((item) => !item.children);
  const navClass =
    "text-xs font-bold uppercase tracking-industrial text-slate-200 transition-colors hover:text-safety";

  return (
    <>
      <header
        className={`relative z-30 border-b border-white/10 bg-ink text-white transition-all duration-300 ${
          scrolled ? "shadow-xl bg-ink/95 backdrop-blur-sm" : ""
        }`}>
        <div className={`mx-auto grid max-w-[1440px] grid-cols-[252px_1fr_auto] ${HEADER_HEIGHT_DESKTOP} max-lg:grid-cols-[220px_1fr] max-md:flex ${HEADER_HEIGHT_MOBILE} max-md:items-center max-md:justify-between max-md:px-[18px]`}>
          {/* Logo with magnetic effect */}
          <MagneticElement strength={0.15} area={120}>
            <Link
              href="/"
              className="flex items-center bg-safety px-[34px] [clip-path:polygon(0_0,100%_0,88%_100%,0_100%)] max-md:bg-transparent max-md:px-0 max-md:[clip-path:none] transition-transform duration-300"
              aria-label="Sahil Industries - Home">
              <Image
                src="/media/logo/logo.png"
                alt="Sahil Industries"
                width={183}
                height={72}
                priority
                className="h-auto w-[164px] max-md:w-[148px]"
              />
            </Link>
          </MagneticElement>

          <div className="min-w-0 max-md:hidden">
            <div className={`flex items-center justify-between border-b border-white/10 ${TOP_BAR_HEIGHT} ${LOGO_PADDING_X} text-[10px] uppercase tracking-industrial text-slate-400`}>
              <span>An ISO 9001:2008 Certified Company</span>
              <div className="flex items-center gap-3">
                <motion.a
                  href={`mailto:${siteContact.email}`}
                  className="flex items-center gap-2 text-white"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15 }}>
                  <Mail size={14} aria-hidden="true" />
                  {siteContact.email}
                </motion.a>
                <Globe2 size={15} aria-hidden="true" />
                <span className="font-extrabold text-safety">G+</span>
                <Share2 size={15} aria-hidden="true" />
              </div>
            </div>
            <nav
              className={`flex items-center justify-end ${NAV_GAP_DESKTOP} ${NAV_PR_DESKTOP} ${NAV_GAP_LG} ${NAV_PR_LG} ${NAV_HEIGHT}`}
              aria-label="Primary navigation">
              {primaryItems.slice(0, 2).map((item) => (
                <motion.a
                  href={item.href}
                  key={item.href}
                  className={`${navClass}${item.href === "/" ? " text-safety" : ""}`}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}>
                  {item.label}
                </motion.a>
              ))}
              <div className="relative">
                <motion.button
                  type="button"
                  onClick={() => setProductsOpen(!productsOpen)}
                  aria-expanded={productsOpen}
                  aria-haspopup="true"
                  className={`${navClass} flex items-center gap-1`}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}>
                  Products{" "}
                  <motion.span
                    animate={{ rotate: productsOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}>
                    <ChevronDown size={14} aria-hidden="true" />
                  </motion.span>
                </motion.button>
                <AnimatePresence>
                  {productsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scaleY: 0.9 }}
                      animate={{ opacity: 1, y: 0, scaleY: 1 }}
                      exit={{ opacity: 0, y: -10, scaleY: 0.9 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute left-[-24px] top-[34px] z-40 w-[285px] border border-safety/40 bg-surface p-2.5 shadow-2xl"
                      role="menu">
                      {productItem?.children?.map((item, index) => (
                        <motion.a
                          href={item.href}
                          key={item.href}
                          onClick={() => setProductsOpen(false)}
                          className="block px-3 py-2.5 text-xs text-white hover:bg-safety/10 hover:text-safety"
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03, duration: 0.2 }}
                          role="menuitem">
                          {item.label}
                        </motion.a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {primaryItems.slice(2).map((item) => (
                <motion.a
                  href={item.href}
                  key={item.href}
                  className={navClass}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}>
                  {item.label}
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Contact section - Phone & WhatsApp */}
          <div className="flex items-center h-[57px] max-lg:hidden">
            <motion.a
              className={`flex items-center gap-3 border-l border-white/10 ${LOGO_PADDING_X} py-2 group relative h-full`}
              href={siteContact.phoneHref}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}>
              <Phone className="text-safety group-hover:scale-110 transition-transform duration-300" size={CONTACT_ICON_SIZE} aria-hidden="true" />
              <span className={`absolute bottom-full left-1/2 -translate-x-1/2 ${TOOLTIP_OFFSET} opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out whitespace-nowrap pointer-events-none bg-ink/95 backdrop-blur-sm border border-white/10 rounded-lg ${TOOLTIP_PADDING} shadow-xl z-10`}>
                <small className="block text-xs text-slate-400">Make a Call</small>
                <b className="block text-[15px] text-safety">{siteContact.phone}</b>
              </span>
            </motion.a>

            <div className={`h-[42px] ${DIVIDER_WIDTH} bg-white/10`} aria-hidden="true" />

            <motion.a
              className={`flex items-center gap-2 border-l border-white/10 ${LOGO_PADDING_X} py-2 group relative h-full`}
              href={siteContact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 4, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}>
              <MessageCircle className="text-green-500 group-hover:scale-110 transition-transform duration-300" size={CONTACT_ICON_SIZE_MOBILE} aria-hidden="true" />
              <span className={`absolute bottom-full left-1/2 -translate-x-1/2 ${TOOLTIP_OFFSET} opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out whitespace-nowrap pointer-events-none bg-ink/95 backdrop-blur-sm border border-white/10 rounded-lg ${TOOLTIP_PADDING} shadow-xl z-10`}>
                <small className="block text-xs text-slate-400">Chat on WhatsApp</small>
                <b className="block text-[13px] text-green-500 font-medium">WhatsApp</b>
              </span>
            </motion.a>
          </div>

          <motion.button
            className={`hidden ${MOBILE_MENU_BUTTON_SIZE} border-0 bg-safety p-2.5 text-ink max-md:block`}
            aria-label="Open navigation"
            onClick={() => setMenuOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}>
            <Menu aria-hidden="true" />
          </motion.button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed inset-y-0 right-0 z-50 flex w-[min(88vw,360px)] flex-col gap-1 bg-ink p-7 text-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu">
            <motion.button
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation"
              className="ml-auto text-safety"
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}>
              <X />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}>
              <Image
                src="/media/logo/logo-footer.png"
                alt="Sahil Industries"
                width={160}
                height={64}
                className="my-3 h-auto"
              />
            </motion.div>

            <motion.nav
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}>
              {primaryItems.map((item, index) => (
                <motion.a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  key={item.href}
                  className="border-b border-white/10 py-3 text-sm font-bold uppercase tracking-industrial"
                  whileHover={{ x: 8, color: "#F6C515" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}>
                  {item.label}
                </motion.a>
              ))}

              <motion.a
                href={siteContact.phoneHref}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 border-b border-white/10 py-3 text-sm font-bold uppercase tracking-industrial"
                whileHover={{ x: 8, color: "#F6C515" }}
                whileTap={{ scale: 0.98 }}
                transition={{ delay: 0.15 + primaryItems.length * 0.05, duration: 0.2 }}>
                <Phone className="text-safety" size={20} />
                <span>Call: {siteContact.phone}</span>
              </motion.a>

              <motion.a
                href={siteContact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 py-3 text-sm font-bold uppercase tracking-industrial"
                whileHover={{ x: 8, color: "#25D366" }}
                whileTap={{ scale: 0.98 }}
                transition={{ delay: 0.15 + (primaryItems.length + 1) * 0.05, duration: 0.2 }}>
                <MessageCircle className="text-green-500" size={20} />
                <span>WhatsApp</span>
              </motion.a>

              <motion.details
                className="border-b border-white/10 py-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.15 + primaryItems.length * 0.05,
                  duration: 0.3,
                }}>
                <motion.summary
                  className="cursor-pointer text-sm font-bold uppercase tracking-industrial"
                  whileHover={{ color: "#F6C515" }}>
                  Products
                </motion.summary>
                <motion.div
                  className="mt-3 grid gap-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}>
                  {productItem?.children?.map((item, index) => (
                    <motion.a
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      key={item.href}
                      className="text-sm text-slate-300"
                      whileHover={{ x: 4, color: "#F6C515" }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.2 }}>
                      {item.label}
                    </motion.a>
                  ))}
                </motion.div>
              </motion.details>
            </motion.nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
