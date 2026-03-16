"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { scaleInVariants, viewportOnce } from "./motion";

type ScaleInProps = HTMLMotionProps<"div">;

export default function ScaleIn({ children, ...props }: ScaleInProps) {
  return (
    <motion.div
      variants={scaleInVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      {...props}
    >
      {children}
    </motion.div>
  );
}
