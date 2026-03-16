"use client";

import { PropsWithChildren } from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { fadeInVariants, viewportOnce } from "./motion";

type FadeInProps = PropsWithChildren<HTMLMotionProps<"div">>;

export default function FadeIn({ children, ...props }: FadeInProps) {
  return (
    <motion.div
      variants={fadeInVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      {...props}
    >
      {children}
    </motion.div>
  );
}
