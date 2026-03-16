"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

type TestimonialCarouselProps = {
  testimonials: Testimonial[];
};

export default function TestimonialCarousel({
  testimonials,
}: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || testimonials.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [paused, testimonials.length]);

  const active = testimonials[activeIndex];

  return (
    <div
      className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur md:p-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mb-8 flex items-center justify-between">
        <div className="flex text-yellow-400">★★★★★</div>
        <div className="flex gap-2">
          {testimonials.map((item, index) => (
            <button
              key={`${item.name}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === activeIndex ? "w-8 bg-[#1a3a52]" : "w-2.5 bg-slate-300"
              }`}
              aria-label={`Show testimonial from ${item.name}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <p className="mb-8 text-lg italic text-gray-600 md:text-xl">
            &quot;{active.quote}&quot;
          </p>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1a3a52]/10 text-lg font-semibold text-[#1a3a52]">
              {active.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <p className="font-semibold text-[#1a3a52]">{active.name}</p>
              <p className="text-sm text-gray-500">{active.role}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
