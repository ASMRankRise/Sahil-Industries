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

export function GalleryLightbox({ image, onClose, onNext, onPrev, images = [] }: GalleryLightboxProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize incoming image prop to handle both object and string inputs safely
  const isObj = Boolean(image && typeof image === "object");
  const rawSrc = isObj ? image.src : typeof image === "string" ? image : "";
  const imageSrc = (typeof rawSrc === "string" && rawSrc.trim() !== "") ? rawSrc.trim() : null;
  const imageAlt = (isObj ? (image.alt || image.title) : "") || "Gallery Image";
  const imageTitle = (isObj ? image.title : "") || "Image Preview";
  const imageCategory = (isObj ? image.category : "") || "products";
  const imageDescription = isObj ? image.description : "";
  const imageTags = (isObj && Array.isArray(image.tags)) ? image.tags : [];
  const imageId = isObj ? image.id : (imageSrc || "current");

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
    if (!imageSrc) return;
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = `${imageTitle.replace(/\s+/g, "-").toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Share image
  const handleShare = async () => {
    if (!imageSrc) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: imageTitle,
          text: imageDescription,
          url: window.location.origin + imageSrc,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.origin + imageSrc);
      alert("Image link copied to clipboard!");
    }
  };

  const currentIndex = Math.max(
    0,
    images.findIndex(
      (img) => (isObj && img.id === image.id) || (imageSrc && img.src === imageSrc)
    )
  );
  const totalCount = Math.max(images.length, 1);
  const isFirst = currentIndex === 0;
  const isLast = images.length <= 1 || currentIndex === images.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[99999] backdrop-blur-md flex items-center justify-center select-none"
      style={{ backgroundColor: "rgba(7, 11, 20, 0.96)" }}
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${currentIndex + 1} of ${totalCount}: ${imageTitle}`}
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
      {isLoading && imageSrc && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/60">
          <Loader2 className="w-12 h-12 text-safety animate-spin" />
        </div>
      )}

      {/* Navigation - Previous */}
      {!isFirst && (
        <motion.button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          whileHover={{ scale: 1.08, x: -2 }}
          whileTap={{ scale: 0.92 }}
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-3.5 bg-slate-900/90 hover:bg-safety border border-white/20 rounded-full text-white shadow-2xl transition-all cursor-pointer group"
          aria-label="Previous image"
          title="Previous (?)"
        >
          <ChevronLeft size={26} className="text-white group-hover:text-ink transition-colors" strokeWidth={2.5} />
        </motion.button>
      )}

      {/* Navigation - Next */}
      {!isLast && (
        <motion.button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          whileHover={{ scale: 1.08, x: 2 }}
          whileTap={{ scale: 0.92 }}
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-3.5 bg-slate-900/90 hover:bg-safety border border-white/20 rounded-full text-white shadow-2xl transition-all cursor-pointer group"
          aria-label="Next image"
          title="Next (?)"
        >
          <ChevronRight size={26} className="text-white group-hover:text-ink transition-colors" strokeWidth={2.5} />
        </motion.button>
      )}

      {/* Close Button */}
      <motion.button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="absolute top-5 right-5 sm:top-6 sm:right-6 z-30 p-3 bg-slate-900/90 hover:bg-red-500 border border-white/20 rounded-full text-white shadow-2xl transition-all cursor-pointer group"
        aria-label="Close lightbox"
        title="Close (Esc)"
      >
        <X size={22} className="text-white group-hover:rotate-90 transition-transform duration-200" strokeWidth={2.5} />
      </motion.button>

      {/* Image Counter */}
      <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-30 px-4 py-2 bg-slate-900/90 border border-white/20 rounded-full text-white text-xs sm:text-sm font-semibold tracking-wider shadow-2xl flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-safety animate-pulse" />
        <span>{currentIndex + 1} / {totalCount}</span>
      </div>

      {/* Image Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={String(imageId)}
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
          {imageSrc ? (
            <Image
              ref={imgRef}
              src={imageSrc}
              alt={imageAlt}
              width={1920}
              height={1080}
              onLoad={handleLoad}
              className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain select-none rounded-lg shadow-2xl"
              priority
              sizes="90vw"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-300 bg-slate-900/90 rounded-2xl border border-white/20 shadow-2xl">
              <Info size={40} className="mb-3 text-safety" />
              <p className="text-base font-semibold text-white">No Image Available</p>
              <p className="text-xs text-slate-400 mt-1">Image source is empty or could not be loaded.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2.5 bg-slate-900/95 border border-white/20 rounded-2xl px-4 py-2 sm:px-5 sm:py-2.5 shadow-2xl backdrop-blur-lg"
      >
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          disabled={isFirst}
          className="p-2.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer disabled:opacity-25 disabled:pointer-events-none"
          aria-label="Previous"
          title="Previous image"
        >
          <ChevronLeft size={20} strokeWidth={2.2} />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
          className="p-2.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          title={isFullscreen ? "Exit fullscreen (F)" : "Enter fullscreen (F)"}
        >
          {isFullscreen ? <Minimize2 size={20} strokeWidth={2.2} /> : <Maximize2 size={20} strokeWidth={2.2} />}
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); handleDownload(); }}
          className="p-2.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          aria-label="Download"
          title="Download image"
        >
          <Download size={20} strokeWidth={2.2} />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); handleShare(); }}
          className="p-2.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          aria-label="Share"
          title="Share image"
        >
          <Share2 size={20} strokeWidth={2.2} />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); setShowInfo((prev) => !prev); }}
          className={`p-2.5 rounded-xl transition-all cursor-pointer ${
            showInfo
              ? "bg-safety text-ink font-bold shadow-md shadow-safety/25"
              : "text-slate-300 hover:text-white hover:bg-white/10"
          }`}
          aria-label="Toggle info"
          title="Toggle image details (I)"
        >
          <Info size={20} strokeWidth={2.2} />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          disabled={isLast}
          className="p-2.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer disabled:opacity-25 disabled:pointer-events-none"
          aria-label="Next"
          title="Next image"
        >
          <ChevronRight size={20} strokeWidth={2.2} />
        </button>
      </motion.div>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-20 sm:bottom-24 left-4 right-4 sm:left-6 sm:right-auto sm:w-96 z-30 border border-white/20 rounded-2xl p-6 shadow-2xl backdrop-blur-xl max-h-[70vh] overflow-y-auto"
            style={{ backgroundColor: "rgba(15, 23, 42, 0.98)" }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <span className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-md bg-safety text-ink inline-block mb-3 shadow-sm">
                  {imageCategory ? imageCategory.charAt(0).toUpperCase() + imageCategory.slice(1) : 'Product'}
                </span>
                <h3 className="text-xl font-bold text-white mb-2 leading-snug">{imageTitle}</h3>
                {imageDescription && <p className="text-slate-300 text-sm leading-relaxed">{imageDescription}</p>}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setShowInfo(false); }}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                aria-label="Close info"
                title="Close details (I)"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tags */}
            {imageTags && imageTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {imageTags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-md bg-slate-800 text-slate-200 border border-white/15"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-safety text-ink font-bold rounded-xl hover:brightness-110 shadow-lg shadow-safety/20 transition-all text-sm cursor-pointer"
              >
                <Download size={16} strokeWidth={2.5} />
                Download
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleShare(); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 text-white font-semibold border border-white/20 rounded-xl hover:bg-slate-700 transition-all text-sm cursor-pointer"
              >
                <Share2 size={16} strokeWidth={2.2} />
                Share
              </button>
            </div>

            {/* Keyboard Shortcuts Hint */}
            <div className="mt-5 pt-4 border-t border-white/15">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Keyboard Shortcuts</p>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div className="flex justify-between items-center bg-slate-800/60 px-2 py-1 rounded border border-white/5"><kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-safety font-bold font-mono">?</kbd><span>Previous</span></div>
                <div className="flex justify-between items-center bg-slate-800/60 px-2 py-1 rounded border border-white/5"><kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-safety font-bold font-mono">?</kbd><span>Next</span></div>
                <div className="flex justify-between items-center bg-slate-800/60 px-2 py-1 rounded border border-white/5"><kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-safety font-bold font-mono">Esc</kbd><span>Close</span></div>
                <div className="flex justify-between items-center bg-slate-800/60 px-2 py-1 rounded border border-white/5"><kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-safety font-bold font-mono">I</kbd><span>Info</span></div>
                <div className="flex justify-between items-center bg-slate-800/60 px-2 py-1 rounded border border-white/5"><kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-safety font-bold font-mono">F</kbd><span>Fullscreen</span></div>
                <div className="flex justify-between items-center bg-slate-800/60 px-2 py-1 rounded border border-white/5"><kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-safety font-bold font-mono">Space</kbd><span>Next</span></div>
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
          className="absolute bottom-20 sm:bottom-24 right-5 sm:right-6 z-30 px-3.5 py-1.5 bg-slate-900/95 border border-white/20 rounded-full text-safety font-bold text-sm font-mono shadow-2xl"
        >
          {Math.round(zoom * 100)}%
        </motion.div>
      )}

      {/* Drag Hint */}
      {zoom > 1 && !isDragging && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 bg-slate-900/90 border border-white/20 rounded-full text-white text-xs sm:text-sm font-medium shadow-2xl"
        >
          Drag to pan
        </motion.div>
      )}
    </motion.div>
  );
}

