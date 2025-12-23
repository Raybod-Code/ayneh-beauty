"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // آپدیت موقعیت ماوس
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // تشخیص هاور روی دکمه‌ها و لینک‌ها
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON" || target.tagName === "A" || target.closest("button") || target.closest("a")) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* دایره اصلی (نقطه کوچک) */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-black rounded-full pointer-events-none z-[100] hidden lg:block mix-blend-difference"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: isHovering ? 0 : 1, // وقتی هاور میشه، نقطه وسط غیب میشه
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />

      {/* دایره بزرگ (هاله دورش) */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border border-black rounded-full pointer-events-none z-[100] hidden lg:block mix-blend-difference"
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          scale: isHovering ? 2.5 : 1, // موقع هاور بزرگ میشه
          backgroundColor: isHovering ? "white" : "transparent", // رنگش عوض میشه
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      />
    </>
  );
}