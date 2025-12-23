"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "solid" | "outline"; // دو مدل: تو پر (مشکی) یا تو خالی (خط دار)
}

export default function LuxuryButton({ children, onClick, className = "", variant = "solid" }: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  // متغیرهای فیزیک حرکت (آهنربا)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // فنر برای نرم کردن حرکت (مثل ژله)
  const xSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const ySpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const transform = useMotionTemplate`translateX(${xSpring}px) translateY(${ySpring}px)`;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const { height, width, left, top } = ref.current.getBoundingClientRect();
    
    // مرکز دکمه
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // فاصله موس از مرکز (تقسیم بر ۳ برای اینکه خیلی شدید تکون نخوره)
    const distanceX = (e.clientX - centerX) / 3; 
    const distanceY = (e.clientY - centerY) / 3;

    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    // برگشت به سر جای اول
    x.set(0);
    y.set(0);
  };

  // استایل‌های پایه
  const baseStyle = "relative px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300 overflow-hidden group";
  
  // استایل‌های متغیر (سیاه یا سفید)
  const variants = {
    solid: "bg-gray-900 text-white hover:bg-black border border-transparent",
    outline: "bg-transparent text-gray-900 border border-gray-900 hover:bg-gray-900 hover:text-white",
  };

  return (
    <motion.button
      ref={ref}
      style={{ transform }} // اعمال حرکت آهنربایی
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {/* متن دکمه */}
      <span className="relative z-10 flex items-center gap-2" style={{ fontFamily: 'var(--font-doran)' }}>
        {children}
      </span>

      {/* افکت درخشش نامحسوس (Shimmer) موقع حرکت */}
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          transform: "skewX(-20deg) translateX(-150%)",
        }}
        animate={{
          x: ["0%", "200%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
          repeatDelay: 1
        }}
      />
    </motion.button>
  );
}