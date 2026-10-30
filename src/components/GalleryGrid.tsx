"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Maximize2, Heart, Download, Share2 } from "lucide-react";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
}

interface GalleryGridProps {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage) => void;
  activeCategory: string;
}

export function GalleryGrid({ images, onImageClick, activeCategory }: GalleryGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      {images.length === 0 ? (
        <div className="text-center py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex flex-col items-center gap-4 text-slate-400"
          >
            <svg className="w-16 h-16 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg font-medium">No images in this category</p>
            <p className="text-sm">Try selecting a different category</p>
          </motion.div>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5"
          role="list"
          aria-label="Gallery images"
        >
          {images.map((image, index) => (
            <motion.article
              key={image.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="group relative bg-slate-900/50 rounded-2xl overflow-hidden border border-white/5 hover:border-safety/30 transition-all duration-500 cursor-pointer"
              role="listitem"
              onClick={() => onImageClick(image)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onImageClick(image);
                }
              }}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-safety/90 text-ink backdrop-blur-sm">
                    {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
                  </span>
                </div>

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="w-full flex items-center justify-between transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl text-white/90 hover:bg-white/20 hover:text-white transition-all"
                        aria-label="View fullscreen"
                        onClick={(e) => { e.stopPropagation(); onImageClick(image); }}
                      >
                        <Maximize2 size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl text-white/90 hover:bg-white/20 hover:text-white transition-all"
                        aria-label="Download"
                      >
                        <Download size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl text-white/90 hover:bg-white/20 hover:text-white transition-all"
                        aria-label="Share"
                      >
                        <Share2 size={18} />
                      </motion.button>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl text-white/90 hover:bg-red-500/20 hover:text-red-400 transition-all"
                      aria-label="Add to favorites"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Heart size={18} className="fill-current" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Image Info */}
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-1 group-hover:text-safety transition-colors">
                  {image.title}
                </h3>
                <p className="text-sm text-slate-400 line-clamp-2 mb-3">{image.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {image.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded bg-white/5 text-slate-400 hover:bg-safety/20 hover:text-safety transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                  {image.tags.length > 3 && (
                    <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded bg-white/5 text-slate-400">
                      +{image.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* Load More / End Message */}
      {images.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-slate-500 text-sm">
            Showing {images.length} of {images.length} images in{" "}
            <span className="text-safety font-medium">
              {activeCategory === "all" ? "All Categories" : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
            </span>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}