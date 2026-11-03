"use client";

import { ModernPageShell } from '@/components/ModernPageShell';
import { ProductDetailLayout } from '@/components/ProductDetailLayout';
import { GalleryLightbox } from '@/components/GalleryLightbox';
import { useState } from 'react';

type Cell = { type: string; colSpan: number; rowSpan: number; value: string };
type SourceProduct = { breadcrumb: string; title: string; description: readonly string[]; gallery: readonly string[]; brochure?: string; specificationTables: readonly Cell[][][]; standardFeatures?: readonly string[] };

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
}

export function SourceProductPage({ product }: { product: SourceProduct }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const galleryImages: GalleryImage[] = product.gallery.map((src, index) => ({
    id: index + 1,
    src,
    alt: `${product.title} ${index + 1}`,
    title: product.title,
    category: 'products',
    description: product.title,
    tags: ['Product'],
  }));

  const handleImageClick = (srcOrImage: GalleryImage | string, index?: number) => {
    if (typeof srcOrImage === "string") {
      const found = galleryImages.find((img) => img.src === srcOrImage);
      if (found) {
        setSelectedImage(found);
      } else {
        const idx = typeof index === "number" ? index : 0;
        setSelectedImage({
          id: idx + 1,
          src: srcOrImage,
          alt: `${product.title} ${idx + 1}`,
          title: product.title,
          category: 'products',
          description: product.title,
          tags: ['Product'],
        });
      }
    } else if (srcOrImage && typeof srcOrImage === "object") {
      setSelectedImage(srcOrImage);
    }
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
  };

  const handleNextImage = () => {
    if (!selectedImage) return;
    const currentIndex = galleryImages.findIndex((img) => img.id === selectedImage.id || img.src === selectedImage.src);
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    setSelectedImage(galleryImages[nextIndex]);
  };

  const handlePrevImage = () => {
    if (!selectedImage) return;
    const currentIndex = galleryImages.findIndex((img) => img.id === selectedImage.id || img.src === selectedImage.src);
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[prevIndex]);
  };

  return (
    <>
      <ModernPageShell eyebrow={product.breadcrumb} title={product.title}>
        <ProductDetailLayout product={product} onImageClick={handleImageClick} />
      </ModernPageShell>
      {lightboxOpen && selectedImage && (
        <GalleryLightbox
          image={selectedImage}
          onClose={handleCloseLightbox}
          onNext={handleNextImage}
          onPrev={handlePrevImage}
          images={galleryImages}
        />
      )}
    </>
  );
}
