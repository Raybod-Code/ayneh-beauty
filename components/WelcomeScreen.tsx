"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

interface Props {
  onComplete: () => void;
}

export default function WelcomeScreen({ onComplete }: Props) {
  useEffect(() => {
    // این تایمر بعد از ۳.۵ ثانیه صفحه خوش‌آمد رو می‌بنده
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-7xl font-thin tracking-[0.2em] mb-4">
          AYNEH
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-lg md:text-xl text-gray-400 font-light mt-4"
        >
          زیبایی، بازتاب توست
        </motion.p>
      </motion.div>
    </motion.div>
  );
}