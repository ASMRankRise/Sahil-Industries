import type { ComponentType, HTMLAttributes } from "react";

export type CircularGalleryItem = {
  image: string;
  text?: string;
  description?: string;
  alt?: string;
};

type CircularGalleryProps = HTMLAttributes<HTMLDivElement> & {
  items?: readonly CircularGalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  scrollEase?: number;
  onItemClick?: (item: CircularGalleryItem, index: number) => void;
  onActiveChange?: (index: number) => void;
};

declare const CircularGallery: ComponentType<CircularGalleryProps>;
export default CircularGallery;
