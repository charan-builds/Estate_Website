"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.2,
  });

  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-1 origin-left bg-[#1a3a52]"
      style={{ scaleX }}
    />
  );
}
