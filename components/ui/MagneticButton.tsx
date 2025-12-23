"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";

export default function MagneticButton({
  children,
  className,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  className: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLButtonElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const reset = () => setPos({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    if (reduce || disabled) return;
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);

    // مقدار کم برای حس لوکس (نه کارتونی)
    setPos({ x: x * 0.16, y: y * 0.16 });
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onMouseMove={onMove}
      onMouseLeave={reset}
      onMouseDown={reset}
      onClick={onClick}
      disabled={disabled}
      animate={reduce ? undefined : { x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.45 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}
