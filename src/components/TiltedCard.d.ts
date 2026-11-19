import type { ComponentType, CSSProperties, ReactNode } from "react";

type TiltedCardProps = {
  imageSrc?: string;
  altText?: string;
  captionText?: string;
  containerHeight?: string | number;
  containerWidth?: string | number;
  imageHeight?: string | number;
  imageWidth?: string | number;
  rotateAmplitude?: number;
  scaleOnHover?: number;
  glare?: number;
  shadow?: number;
  radius?: number;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

declare const TiltedCard: ComponentType<TiltedCardProps>;
export default TiltedCard;
