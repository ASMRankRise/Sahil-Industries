"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Download,
  Share2,
  Heart,
  Loader2,
} from "lucide-react";
import { GalleryGrid } from "@/components/GalleryGrid";
import { GalleryLightbox } from "@/components/GalleryLightbox";

export type GalleryImage = {
  id: string | number;
  src: string;
  alt: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
};

type GalleryClientProps = { images: GalleryImage[] };

export default function GalleryClient({ images: galleryImages }: GalleryClientProps) {
  const categoryIds = Array.from(new Set(galleryImages.map((image) => image.category).filter(Boolean)));
  const galleryCategories = [
    { id: "all", label: "All", count: galleryImages.length },
    ...categoryIds.map((id) => ({
      id,
      label: id.charAt(0).toUpperCase() + id.slice(1),
      count: galleryImages.filter((image) => image.category === id).length,
    })),
  ];
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const filteredImages = activeCategory === "all"
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeCategory);

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
  };

  const handleNextImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex((img) => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
  };

  const handlePrevImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex((img) => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[prevIndex]);
  };

  return (
    <div className="min-h-screen bg-ink text-white">
      {/* Page Hero */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-slate-900 to-ink z-0" />
        <div className="absolute inset-0 bg-[url('/media/theme-images/pattern/thm-pattern-7.png')] opacity-5 z-10" />
        
        <div className="relative z-20 mx-auto max-w-7xl px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-safety/10 text-safety text-xs font-bold uppercase tracking-widest mb-4">
              Our Gallery
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-safety to-yellow-400 bg-clip-text text-transparent">
              Gallery
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Explore our comprehensive collection of crane products, manufacturing facilities, 
              and successful project installations across industries.
            </p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Category Filter */}
      <section className="py-12 px-6 bg-ink border-b border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {galleryCategories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: galleryCategories.indexOf(category) * 0.05, duration: 0.3 }}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold uppercase tracking-wide transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-safety to-yellow-400 text-ink shadow-lg shadow-safety/25"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {category.label}
                <span className="ml-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-white/20">
                  {category.count}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <GalleryGrid
            images={filteredImages}
            onImageClick={handleImageClick}
            activeCategory={activeCategory}
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-slate-950/50 border-y border-white/5">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Products Showcased", value: "7", icon: "🏭" },
            { label: "Facility Images", value: "2", icon: "🏢" },
            { label: "Project Installations", value: "2", icon: "🚢" },
            { label: "Total Gallery Items", value: "11", icon: "📸" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="text-center p-6"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-extrabold text-safety mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm uppercase tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Looking for Something Specific?
            </h2>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto">
              Can't find what you're looking for? Our team can provide detailed specifications, 
              custom solutions, and project references tailored to your requirements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/enquiry"
                className="px-8 py-3.5 bg-gradient-to-r from-safety to-yellow-400 text-ink font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-300 transition-all shadow-lg shadow-safety/25"
              >
                Submit an Enquiry
              </a>
              <a
                href="/products/single-girder-eot-crane"
                className="px-8 py-3.5 border border-white/10 text-white font-bold rounded-lg hover:bg-white/5 hover:border-safety/50 transition-all"
              >
                Browse Products
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && selectedImage && (
          <GalleryLightbox
            image={selectedImage}
            onClose={handleCloseLightbox}
            onNext={handleNextImage}
            onPrev={handlePrevImage}
            images={filteredImages}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
