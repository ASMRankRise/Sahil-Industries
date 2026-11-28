"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ArrowUp, Mail, Menu, Phone, X } from "lucide-react";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { primaryNavigation, siteContact } from "@/data/site";
import { MagneticElement } from "@/components/ui/MagneticButton";
import { useReducedMotion } from "@/components/animations/hooks/useReducedMotion";

const MotionLink = motion.create(Link);

// Standardized spacing constants for header
const HEADER_HEIGHT = "min-h-[74px] lg:min-h-[88px]";
const LOGO_PADDING_X = "px-[34px]";
const TOP_BAR_HEIGHT = "h-[31px]";
const NAV_HEIGHT = "h-[57px]";
const NAV_SPACING = "gap-5 px-5 xl:gap-7 xl:px-[38px]";
const CONTACT_ICON_SIZE = 20;
const CONTACT_ICON_SIZE_MOBILE = 22;
const TOOLTIP_OFFSET = "mb-2";
const TOOLTIP_PADDING = "px-3 py-2";
const DIVIDER_WIDTH = "w-px";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
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

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!menuOpen || !drawer) return;
    drawer.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      drawer.close();
      document.body.style.overflow = overflow;
    };
  }, [menuOpen]);

  const productItem = primaryNavigation.find(
    (item) => item.label === "Products",
  );
  const primaryItems = primaryNavigation.filter((item) => !item.children);
  const navClass =
    "text-xs font-bold uppercase tracking-industrial text-slate-200 transition-colors hover:text-safety";

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-surface text-white transition-all duration-300",
          scrolled ? "shadow-xl bg-surface/95 backdrop-blur-sm" : "",
        ]
          .filter(Boolean)
          .join(" ")}>
        <div
          className={`mx-auto flex max-w-[1440px] items-center justify-between px-[18px] lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:items-stretch lg:px-0 xl:grid-cols-[252px_minmax(0,1fr)_auto] ${HEADER_HEIGHT}`}>
          {/* Logo with magnetic effect */}
          <MagneticElement strength={0.15} area={120}>
            <Link
              href="/"
              className="flex items-center transition-transform duration-300 lg:bg-safety lg:px-[26px] lg:[clip-path:polygon(0_0,100%_0,88%_100%,0_100%)] xl:px-[34px]"
              aria-label="Sahil Industries - Home">
              <Image
                src="/media/logo/logo.png"
                alt="Sahil Industries"
                width={183}
                height={72}
                priority
                className="hidden h-auto w-[164px] lg:block"
              />
              <Image
                src="/media/logo/logo-footer.png"
                alt="Sahil Industries"
                width={183}
                height={72}
                priority
                className="h-auto w-[148px] lg:hidden"
              />
            </Link>
          </MagneticElement>

          <div className="hidden min-w-0 lg:block">
            <div
              className={`flex items-center justify-between border-b border-white/10 ${TOP_BAR_HEIGHT} ${LOGO_PADDING_X} text-[10px] uppercase tracking-industrial text-white`}>
              <span>An ISO 9001:2008 Certified Company</span>
              <div className="flex items-center gap-3">
                <a
                  href={siteContact.phoneHref}
                  className="xl:hidden"
                  aria-label={`Call ${siteContact.phone}`}>
                  <Phone size={15} className="text-safety" aria-hidden="true" />
                </a>
                <motion.a
                  href={`mailto:${siteContact.email}`}
                  className="flex items-center gap-2 text-white"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15 }}>
                  <Mail size={14} aria-hidden="true" />
                  {siteContact.email}
                </motion.a>
                <FaInstagram
                  size={15}
                  aria-label="Instagram"
                  className="text-safety"
                />
                <FaFacebookF
                  size={15}
                  aria-label="Facebook"
                  className="text-safety"
                />
                <a
                  href={siteContact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp">
                  <FaWhatsapp size={15} className="text-safety" />
                </a>
              </div>
            </div>
            <nav
              className={`flex items-center justify-center ${NAV_SPACING} ${NAV_HEIGHT}`}
              aria-label="Primary navigation">
              {primaryItems.slice(0, 2).map((item) => (
                <MotionLink
                  href={item.href}
                  key={item.href}
                  className={`${navClass}${pathname === item.href ? " !text-safety" : ""}`}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}>
                  {item.label}
                </MotionLink>
              ))}
              <div
                className="relative"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}>
                <motion.button
                  type="button"
                  onClick={() => setProductsOpen(!productsOpen)}
                  aria-expanded={productsOpen}
                  aria-haspopup="true"
                  className={`${navClass} flex items-center gap-1${pathname.startsWith("/products") ? " !text-safety" : ""}`}
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
                      className="absolute left-[-24px] top-[24px] z-40 w-[285px] border border-safety/40 bg-surface p-2.5 shadow-2xl"
                      role="menu">
                      <MotionLink
                        href="/products"
                        onClick={() => setProductsOpen(false)}
                        className={`flex items-center justify-between border-b border-white/10 px-3 pb-2.5 mb-1.5 text-xs font-bold uppercase tracking-wider text-safety hover:bg-safety/10${pathname === "/products" ? " !bg-safety/20" : ""}`}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        role="menuitem">
                        <span>All Products Catalog</span>
                        <span>&rarr;</span>
                      </MotionLink>
                      {productItem?.children?.map((item, index) => (
                        <MotionLink
                          href={item.href}
                          key={item.href}
                          onClick={() => setProductsOpen(false)}
                          className={`block px-3 py-2.5 text-xs hover:bg-safety/10 hover:text-safety${pathname === item.href ? " !text-safety" : " text-white"}`}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03, duration: 0.2 }}
                          role="menuitem">
                          {item.label}
                        </MotionLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {primaryItems.slice(2).map((item) => (
                <MotionLink
                  href={item.href}
                  key={item.href}
                  className={`${navClass}${pathname === item.href ? " !text-safety" : ""}`}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}>
                  {item.label}
                </MotionLink>
              ))}
            </nav>
          </div>

          {/* Contact section - Phone & WhatsApp */}
          <div className="hidden h-[57px] items-center xl:flex">
            <motion.a
              className={`flex items-center gap-3 border-l border-white/10 ${LOGO_PADDING_X} py-2 group relative h-full`}
              href={siteContact.phoneHref}
              aria-label={`Call ${siteContact.phone}`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}>
              <Phone
                className="text-safety group-hover:scale-110 transition-transform duration-300"
                size={CONTACT_ICON_SIZE}
                aria-hidden="true"
              />
              <span
                className={`absolute top-full right-0 ${TOOLTIP_OFFSET} opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out whitespace-nowrap pointer-events-none bg-ink/95 backdrop-blur-sm border border-white/10 rounded-lg ${TOOLTIP_PADDING} shadow-xl z-10`}>
                <small className="block text-xs text-slate-400">
                  Make a Call
                </small>
                <b className="block text-[15px] text-safety">
                  {siteContact.phone}
                </b>
              </span>
            </motion.a>

            <div
              className={`h-[42px] ${DIVIDER_WIDTH} bg-white/10`}
              aria-hidden="true"
            />

            <motion.a
              className={`flex items-center gap-2 border-l border-white/10 ${LOGO_PADDING_X} py-2 group relative h-full`}
              href={siteContact.whatsappHref}
              aria-label="Chat on WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 4, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}>
              <FaWhatsapp
                className="text-green-500 group-hover:scale-110 transition-transform duration-300"
                size={CONTACT_ICON_SIZE_MOBILE}
                aria-hidden="true"
              />
              <span
                className={`absolute top-full right-0 ${TOOLTIP_OFFSET} opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out whitespace-nowrap pointer-events-none bg-ink/95 backdrop-blur-sm border border-white/10 rounded-lg ${TOOLTIP_PADDING} shadow-xl z-10`}>
                <small className="block text-xs text-slate-400">
                  Chat on WhatsApp
                </small>
                <b className="block text-[13px] text-green-500 font-medium">
                  WhatsApp
                </b>
              </span>
            </motion.a>
          </div>

          <motion.button
            type="button"
            className="grid size-11 place-items-center border-0 bg-safety text-ink lg:hidden"
            aria-label="Open navigation"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-haspopup="dialog"
            onClick={() => setMenuOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}>
            <Menu aria-hidden="true" />
          </motion.button>
        </div>
      </header>
      {/* Reserve the fixed header's space so page content never sits underneath it. */}
      <div className={HEADER_HEIGHT} aria-hidden="true" />

      <dialog
        id="mobile-navigation"
        ref={drawerRef}
        onCancel={(event) => {
          event.preventDefault();
          setMenuOpen(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setMenuOpen(false);
        }}
        className="fixed inset-0 m-0 ml-auto h-dvh max-h-none w-[min(88vw,360px)] max-w-none overflow-y-auto overscroll-contain bg-ink text-white shadow-2xl backdrop:bg-black/60"
        aria-label="Navigation menu">
        <div className="flex min-h-full flex-col gap-1 p-5 sm:p-7">
          <motion.button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation"
            className="ml-auto grid size-11 place-items-center text-safety"
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
            aria-label="Primary navigation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}>
            {primaryItems.slice(0, 2).map((item, index) => (
              <MotionLink
                href={item.href}
                onClick={() => setMenuOpen(false)}
                key={item.href}
                className={`block w-full border-b border-white/10 py-3 text-sm font-bold uppercase tracking-industrial${pathname === item.href ? " !text-safety" : " text-white"}`}
                whileHover={{ x: 8, color: "#F6C515" }}
                whileTap={{ scale: 0.98 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}>
                {item.label}
              </MotionLink>
            ))}

            {/* Keep Products in the same position as the desktop navigation. */}
            <motion.details
              className="border-b border-white/10 py-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}>
              <motion.summary
                className="cursor-pointer text-sm font-bold uppercase tracking-industrial"
                whileHover={{ color: "#F6C515" }}>
                Products
              </motion.summary>
              <motion.div className="mt-3 grid gap-2">
                <MotionLink
                  href="/products"
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-11 items-center justify-between border-b border-white/10 pb-2 mb-1 text-sm font-bold text-safety"
                  whileHover={{ x: 4, color: "#F6C515" }}>
                  <span>All Products Catalog</span>
                  <span>&rarr;</span>
                </MotionLink>
                {productItem?.children?.map((item) => (
                  <MotionLink
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    key={item.href}
                    className="flex min-h-11 items-center text-sm text-slate-300"
                    whileHover={{ x: 4, color: "#F6C515" }}>
                    {item.label}
                  </MotionLink>
                ))}
              </motion.div>
            </motion.details>

            {primaryItems.slice(2).map((item) => (
              <MotionLink
                href={item.href}
                onClick={() => setMenuOpen(false)}
                key={item.href}
                className={`block w-full border-b border-white/10 py-3 text-sm font-bold uppercase tracking-industrial${pathname === item.href ? " !text-safety" : " text-white"}`}
                whileHover={{ x: 8, color: "#F6C515" }}>
                {item.label}
              </MotionLink>
            ))}

            <motion.a
              href={siteContact.phoneHref}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 border-b border-white/10 py-3 text-sm font-bold uppercase tracking-industrial"
              whileHover={{ x: 8, color: "#F6C515" }}
              whileTap={{ scale: 0.98 }}
              transition={{
                delay: 0.15 + primaryItems.length * 0.05,
                duration: 0.2,
              }}>
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
              transition={{
                delay: 0.15 + (primaryItems.length + 1) * 0.05,
                duration: 0.2,
              }}>
              <FaWhatsapp className="text-green-500" size={20} />
              <span>WhatsApp</span>
            </motion.a>
          </motion.nav>
        </div>
      </dialog>
      <AnimatePresence>
        {scrolled && (
          <motion.button
            type="button"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-safety text-ink shadow-lg transition hover:bg-yellow-300 max-md:bottom-4 max-md:right-4">
            <ArrowUp size={19} aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
