"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { fadeInUpVariants, viewportOnce } from "./motion";

type SlideUpProps = HTMLMotionProps<"div">;

export default function SlideUp({ children, ...props }: SlideUpProps) {
  return (
    <motion.div
      variants={fadeInUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      {...props}
    >
      {children}
    </motion.div>
  );
}
