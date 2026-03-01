"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";

type GalleryModalProps = {
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function GalleryModal({ images, index, onClose, onPrev, onNext }: GalleryModalProps) {
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowLeft") {
        onPrev();
      }

      if (event.key === "ArrowRight") {
        onNext();
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [onClose, onNext, onPrev]);

  const activeImage = images[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
        {index + 1} / {images.length}
      </div>

      <button
        type="button"
        className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
        onClick={onClose}
      >
        <X size={20} />
      </button>

      <button
        type="button"
        className="absolute left-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
        onClick={(event) => {
          event.stopPropagation();
          onPrev();
        }}
      >
        <ChevronLeft size={20} />
      </button>

      <div
        className="max-h-[90vh] max-w-6xl"
        onClick={(event) => event.stopPropagation()}
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const endX = event.changedTouches[0]?.clientX;
          if (touchStartX.current === null || typeof endX !== "number") {
            return;
          }

          const deltaX = endX - touchStartX.current;
          if (Math.abs(deltaX) < 40) {
            return;
          }

          if (deltaX > 0) {
            onPrev();
          } else {
            onNext();
          }
        }}
      >
        <ImageWithFallback src={activeImage} alt={`Gallery image ${index + 1}`} className="max-h-[88vh] w-auto object-contain" />
      </div>

      <button
        type="button"
        className="absolute right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
        onClick={(event) => {
          event.stopPropagation();
          onNext();
        }}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
