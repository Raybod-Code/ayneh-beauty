"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExit(true);
      setTimeout(onComplete, 1000); 
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={exit ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[60] bg-[#0a0a0a] flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center"
      >
        <h1 className="text-white text-6xl md:text-8xl font-serif tracking-widest">
          AYNEH
        </h1>
        <div className="mt-4 h-[1px] w-0 bg-white mx-auto animate-[width_2s_ease-in-out_forwards_wait]" style={{ animationName: 'expandLine' }}></div>
        <style jsx>{`
          @keyframes expandLine {
            0% { width: 0; opacity: 0; }
            50% { width: 100px; opacity: 1; }
            100% { width: 0; opacity: 0; }
          }
        `}</style>
      </motion.div>
    </motion.div>
  );
}