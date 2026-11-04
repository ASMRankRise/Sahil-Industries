"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe2, Mail, MapPin, Phone, Share2 } from "lucide-react";
import { primaryNavigation, siteContact } from "@/data/site";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { useReducedMotion } from "@/components/animations/hooks/useReducedMotion";

const MotionLink = motion(Link);

// Standardized spacing constants for footer
const FOOTER_GRID_COLS = "grid-cols-[1.15fr_.75fr_1fr_1.4fr]";
const FOOTER_GAP = "gap-12";
const FOOTER_PY = "py-20";
const FOOTER_MAX_WIDTH = "w-[min(1240px,calc(100%-64px))]";
const FOOTER_MD_GRID = "max-md:grid-cols-2";
const FOOTER_SM_WIDTH = "max-sm:w-[calc(100%-36px)]";
const FOOTER_SM_GRID = "max-sm:grid-cols-1";
const HEADING_STYLE = "mb-5 text-base font-bold text-white";
const LINK_STYLE = "block py-1.5 text-sm text-slate-300 transition-colors hover:text-safety";
const ICON_SIZE = 17;
const SOCIAL_ICON_SIZE = 17;
const CONTACT_ICON_SIZE = 17;
const COPYRIGHT_PY = "py-5";
const COPYRIGHT_TEXT = "text-center text-xs text-slate-500";

export function SiteFooter() {
  const prefersReduced = useReducedMotion();
  const productItem = primaryNavigation.find(
    (item) => item.label === "Products",
  );
  const links = primaryNavigation.filter(
    (item) => item.label !== "Home" && item.label !== "Products",
  );

  if (prefersReduced) {
    return (
      <footer className="bg-[#0c131a] text-slate-300">
        <div className={`mx-auto grid ${FOOTER_MAX_WIDTH} ${FOOTER_GRID_COLS} ${FOOTER_GAP} ${FOOTER_PY} ${FOOTER_MD_GRID} ${FOOTER_SM_WIDTH} ${FOOTER_SM_GRID}`}>
          <div>
            <Image
              src="/media/logo/logo-footer.png"
              alt="Sahil Industries"
              width={165}
              height={65}
              className="h-auto"
            />
            <h4 className="mb-3 mt-7 text-sm font-bold text-white">
              Working Time
            </h4>
            <p className="text-sm leading-6">
              <b>Tuesday - Sunday :</b>
              <br />
              09:00 AM - 05:30 PM
            </p>
            <p className="text-sm leading-6">
              <b>Monday - Closed</b>
            </p>
            <div className="mt-5 flex gap-4 text-safety">
              <Globe2 size={SOCIAL_ICON_SIZE} aria-hidden="true" />
              <span>G+</span>
              <Share2 size={SOCIAL_ICON_SIZE} aria-hidden="true" />
            </div>
          </div>
          <div>
            <h3 className={HEADING_STYLE}>Quick Links</h3>
            {links.map((item) => (
              <Link href={item.href} key={item.href} className={LINK_STYLE}>
                {item.label}
              </Link>
            ))}
          </div>
          <div>
            <h3 className={HEADING_STYLE}>Products</h3>
            {productItem?.children?.map((item) => (
              <Link href={item.href} key={item.href} className={LINK_STYLE}>
                {item.label}
              </Link>
            ))}
          </div>
          <div>
            <h3 className={HEADING_STYLE}>Get In Touch</h3>
            <p className="mb-4 flex gap-3 text-sm leading-6">
              <MapPin className="mt-1 shrink-0 text-safety" size={CONTACT_ICON_SIZE} aria-hidden="true" />
              {siteContact.address}
            </p>
            <p className="mb-3 flex gap-3 text-sm leading-6">
              <Phone className="shrink-0 text-safety" size={CONTACT_ICON_SIZE} aria-hidden="true" />
              <a href={siteContact.phoneHref} className="hover:text-safety">
                {siteContact.phone}
              </a>
            </p>
            <p className="flex gap-3 text-sm leading-6">
              <Mail className="shrink-0 text-safety" size={CONTACT_ICON_SIZE} aria-hidden="true" />
              <a
                href={"mailto:" + siteContact.email}
                className="hover:text-safety">
                {siteContact.email}
              </a>
            </p>
          </div>
        </div>
        <div className={'border-t border-white/10 bg-[#080d12] ' + COPYRIGHT_PY + ' ' + COPYRIGHT_TEXT}>
          Copyright © 2023 <b>Sahil Industries.</b> All Rights Reserved.
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#0c131a] text-slate-300">
      <RevealGroup
        staggerChildren={0.1}
        delayChildren={0.1}
        className={`mx-auto grid ${FOOTER_MAX_WIDTH} ${FOOTER_GRID_COLS} ${FOOTER_GAP} ${FOOTER_PY} ${FOOTER_MD_GRID} ${FOOTER_SM_WIDTH} ${FOOTER_SM_GRID}`}>
        {/* Column 1 - Company Info */}
        <RevealItem variant="itemReveal">
          <div>
            <Image
              src="/media/logo/logo-footer.png"
              alt="Sahil Industries"
              width={165}
              height={65}
              className="h-auto"
            />
            <h4 className="mb-3 mt-7 text-sm font-bold text-white">
              Working Time
            </h4>
            <p className="text-sm leading-6">
              <b>Tuesday - Sunday :</b>
              <br />
              09:00 AM - 05:30 PM
            </p>
            <p className="text-sm leading-6">
              <b>Monday - Closed</b>
            </p>
            <div className="mt-5 flex gap-4 text-safety">
              <motion.span
                whileHover={{ scale: 1.2, rotate: 15 }}
                transition={{ duration: 0.2 }}>
                <Globe2 size={SOCIAL_ICON_SIZE} aria-hidden="true" />
              </motion.span>
              <span>G+</span>
              <motion.span
                whileHover={{ scale: 1.2, rotate: -15 }}
                transition={{ duration: 0.2 }}>
                <Share2 size={SOCIAL_ICON_SIZE} aria-hidden="true" />
              </motion.span>
            </div>
          </div>
        </RevealItem>

        {/* Column 2 - Quick Links */}
        <RevealItem variant="itemReveal">
          <div>
            <h3 className={HEADING_STYLE}>Quick Links</h3>
            {links.map((item, index) => (
              <MotionLink
                href={item.href}
                key={item.href}
                className={LINK_STYLE}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.15 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}>
                {item.label}
              </MotionLink>
            ))}
          </div>
        </RevealItem>

        {/* Column 3 - Products */}
        <RevealItem variant="itemReveal">
          <div>
            <h3 className={HEADING_STYLE}>Products</h3>
            {productItem?.children?.map((item, index) => (
              <MotionLink
                href={item.href}
                key={item.href}
                className={LINK_STYLE}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.15 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}>
                {item.label}
              </MotionLink>
            ))}
          </div>
        </RevealItem>

        {/* Column 4 - Contact */}
        <RevealItem variant="itemReveal">
          <div>
            <h3 className={HEADING_STYLE}>Get In Touch</h3>
            <motion.p
              className="mb-4 flex gap-3 text-sm leading-6"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}>
              <MapPin className="mt-1 shrink-0 text-safety" size={CONTACT_ICON_SIZE} aria-hidden="true" />
              {siteContact.address}
            </motion.p>
            <motion.p
              className="mb-3 flex gap-3 text-sm leading-6"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}>
              <Phone className="shrink-0 text-safety" size={CONTACT_ICON_SIZE} aria-hidden="true" />
              <motion.a
                href={siteContact.phoneHref}
                className="hover:text-safety"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.15 }}>
                {siteContact.phone}
              </motion.a>
            </motion.p>
            <motion.p
              className="flex gap-3 text-sm leading-6"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}>
              <Mail className="shrink-0 text-safety" size={CONTACT_ICON_SIZE} aria-hidden="true" />
              <motion.a
                href={"mailto:" + siteContact.email}
                className="hover:text-safety"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.15 }}>
                {siteContact.email}
              </motion.a>
            </motion.p>
          </div>
        </RevealItem>
      </RevealGroup>

      <motion.div
        className={'border-t border-white/10 bg-[#080d12] ' + COPYRIGHT_PY + ' ' + COPYRIGHT_TEXT}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ delay: 0.5, duration: 0.4 }}>
        Copyright © 2023 <b>Sahil Industries.</b> All Rights Reserved.
      </motion.div>
    </footer>
  );
}

