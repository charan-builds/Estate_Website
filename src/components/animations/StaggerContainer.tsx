"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { staggerContainerVariants, viewportOnce } from "./motion";

type StaggerContainerProps = HTMLMotionProps<"div">;

export default function StaggerContainer({
  children,
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      {...props}
    >
      {children}
    </motion.div>
  );
}
