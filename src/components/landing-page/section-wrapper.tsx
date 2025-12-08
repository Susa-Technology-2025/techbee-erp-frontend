"use client";

import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import { Box } from "@mui/material";
import { useInView } from "react-intersection-observer";

type ScrollAnimationWrapperProps = {
  children: ReactNode;
  variants: Variants;
  threshold?: number;
  triggerOnce?: boolean;
};

export default function ScrollAnimationWrapper({
  children,
  variants,
  threshold = 0.3,
  triggerOnce = false,
}: ScrollAnimationWrapperProps) {
  const [ref, inView] = useInView({
    triggerOnce,
    threshold,
  });

  return (
    <Box
      component={motion.div}
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      variants={variants}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      sx={{
        scrollSnapAlign: "center",
      }}
    >
      {children}
    </Box>
  );
}
