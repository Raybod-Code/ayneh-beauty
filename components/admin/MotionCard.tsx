"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function MotionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -2, scale: 1.01 }}
      whileTap={reduce ? undefined : { scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 22, mass: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
