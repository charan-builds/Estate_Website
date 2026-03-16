"use client";

import { PropsWithChildren } from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { staggerContainerVariants, viewportOnce } from "./motion";

type StaggerContainerProps = PropsWithChildren<HTMLMotionProps<"div">>;

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
