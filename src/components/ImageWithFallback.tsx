"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type ImageWithFallbackProps = {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onClick?: () => void;
};

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4K";

export function ImageWithFallback({
  src,
  alt,
  className,
  priority,
  sizes,
  onClick,
}: ImageWithFallbackProps) {
  const normalizedSource = src && src.trim() ? src : ERROR_IMG_SRC;
  const [currentSource, setCurrentSource] = useState(normalizedSource);

  useEffect(() => {
    setCurrentSource(normalizedSource);
  }, [normalizedSource]);

  return (
    <Image
      src={currentSource}
      alt={alt}
      width={1600}
      height={900}
      priority={priority}
      sizes={sizes}
      onClick={onClick}
      className={className}
      onError={() => setCurrentSource(ERROR_IMG_SRC)}
      unoptimized={currentSource.startsWith("data:")}
    />
  );
}
