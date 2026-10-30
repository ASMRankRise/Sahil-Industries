"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2, Download, Share2, Heart, Loader2, Info } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
}

interface GalleryLightboxProps {
  image: GalleryImage;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  images: GalleryImage[];
}

export function GalleryLightbox({ image, onClose, onNext, onPrev, images }: GalleryLightboxProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          onNext();
          break;
        case "ArrowLeft":
          onPrev();
          break;
        case " ":
          e.preventDefault();
          onNext();
          break;
        case "i":
        case "I":
          setShowInfo((prev) => !prev);
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Handle wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.min(Math.max(prev * delta, 0.5), 5));
  }, []);

  // Handle drag pan
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = pan;
    e.preventDefault();
  }, [zoom, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  }, [isDragging, zoom, pan]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error("Fullscreen error:", err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error("Exit fullscreen error:", err);
      }
    }
  };

  // Download image
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image.src;
    link.download = `${image.title.replace(/\s+/g, "-").toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Share image
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title,
          text: image.description,
          url: window.location.origin + image.src,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin + image.src);
      alert("Image link copied to clipboard!");
    }
  };

  const currentIndex = images.findIndex((img) => img.id === image.id);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === images.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/98 backdrop-blur-sm flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${currentIndex + 1} of ${images.length}: ${image.title}`}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Background click to close */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Loader2 className="w-12 h-12 text-safety animate-spin" />
        </div>
      )}

      {/* Navigation - Previous */}
      {!isFirst && (
        <motion.button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </motion.button>
      )}

      {/* Navigation - Next */}
      {!isLast && (
        <motion.button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </motion.button>
      )}

      {/* Close Button */}
      <motion.button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-6 right-6 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 hover:text-red-400 transition-all"
        aria-label="Close lightbox"
      >
        <X size={24} />
      </motion.button>

      {/* Image Counter */}
      <div className="absolute top-6 left-6 z-20 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Image Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={image.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            cursor: zoom > 1 ? "grabbing" : isDragging ? "grabbing" : "default",
          }}
        >
          <Image
            ref={imgRef}
            src={image.src}
            alt={image.alt}
            onLoad={handleLoad}
            className="max-w-[90vw] max-h-[85vh] object-contain"
            priority
            sizes="90vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10"
      >
        <motion.button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          disabled={isFirst}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 text-white/70 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </motion.button>

        <motion.button
          onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 text-white/70 hover:text-white transition-colors"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </motion.button>

        <motion.button
          onClick={(e) => { e.stopPropagation(); handleDownload(); }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 text-white/70 hover:text-white transition-colors"
          aria-label="Download"
        >
          <Download size={20} />
        </motion.button>

        <motion.button
          onClick={(e) => { e.stopPropagation(); handleShare(); }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 text-white/70 hover:text-white transition-colors"
          aria-label="Share"
        >
          <Share2 size={20} />
        </motion.button>

        <motion.button
          onClick={(e) => { e.stopPropagation(); setShowInfo((prev) => !prev); }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-2 transition-colors ${showInfo ? "text-safety" : "text-white/70 hover:text-white"}`}
          aria-label="Toggle info"
        >
          <Info size={20} />
        </motion.button>

        <motion.button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          disabled={isLast}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 text-white/70 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </motion.button>
      </motion.div>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-6 left-6 right-6 md:left-6 md:right-auto md:w-80 z-20 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-h-[60vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-safety/20 text-safety mb-3 inline-block">
                  {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
                </span>
                <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{image.description}</p>
              </div>
              <motion.button
                onClick={(e) => { e.stopPropagation(); setShowInfo(false); }}
                whileHover={{ scale: 1.1 }}
                className="p-1 text-slate-400 hover:text-white transition-colors"
                aria-label="Close info"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {image.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-[11px] font-medium uppercase tracking-wider rounded-full bg-white/10 text-slate-300 hover:bg-safety/20 hover:text-safety transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                className="flex items-center gap-2 px-4 py-2 bg-safety/10 text-safety rounded-lg hover:bg-safety/20 transition-colors text-sm font-medium"
              >
                <Download size={16} />
                Download
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleShare(); }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
              >
                <Share2 size={16} />
                Share
              </button>
            </div>

            {/* Keyboard Shortcuts Hint */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-[11px] text-slate-500 mb-2 font-medium uppercase tracking-wider">Keyboard Shortcuts</p>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div className="flex justify-between"><kbd className="px-2 py-0.5 bg-white/5 rounded">←</kbd><span>Previous</span></div>
                <div className="flex justify-between"><kbd className="px-2 py-0.5 bg-white/5 rounded">→</kbd><span>Next</span></div>
                <div className="flex justify-between"><kbd className="px-2 py-0.5 bg-white/5 rounded">Esc</kbd><span>Close</span></div>
                <div className="flex justify-between"><kbd className="px-2 py-0.5 bg-white/5 rounded">I</kbd><span>Toggle Info</span></div>
                <div className="flex justify-between"><kbd className="px-2 py-0.5 bg-white/5 rounded">F</kbd><span>Fullscreen</span></div>
                <div className="flex justify-between"><kbd className="px-2 py-0.5 bg-white/5 rounded">Space</kbd><span>Next</span></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zoom Indicator */}
      {zoom !== 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-24 right-6 z-20 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-mono"
        >
          {Math.round(zoom * 100)}%
        </motion.div>
      )}

      {/* Drag Hint */}
      {zoom > 1 && !isDragging && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/70 text-sm"
        >
          Drag to pan
        </motion.div>
      )}
    </motion.div>
  );
}