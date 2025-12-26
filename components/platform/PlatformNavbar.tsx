// components/platform/PlatformNavbar.tsx
"use client";

import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Menu, X, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, memo } from "react";
import NoiseTexture from "@/components/ui/NoiseTexture";

const navItems = [
  { label: "ویژگی‌ها", href: "#features" },
  { label: "قیمت‌گذاری", href: "#pricing" },
  { label: "نظرات", href: "#testimonials" },
  { label: "تماس", href: "#contact" },
];

// Cursor glow (shared across platform pages)
const CustomCursorGlow = memo(() => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 w-8 h-8 rounded-full z-[60] mix-blend-screen"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: "-50%",
        translateY: "-50%",
        background:
          "radial-gradient(circle, hsl(43, 74%, 66%) 0%, transparent 70%)",
        filter: "blur(8px)",
      }}
    />
  );
});
CustomCursorGlow.displayName = "CustomCursorGlow";

export default function PlatformNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Cursor glow on all pages using this navbar */}
      <CustomCursorGlow />

      {/* Glassmorphism background */}
      <div className="relative bg-[#050505]/70 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
        <NoiseTexture />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/platform">
              <motion.div
                className="flex items-center gap-3 group cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold to-luxury-gold-light flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-black" />
                  <div className="absolute inset-0 rounded-xl bg-white/40 opacity-0 group-hover:opacity-40 blur-xl transition-opacity" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-brand-gold to-luxury-gold-light bg-clip-text text-transparent">
                    آینه
                  </h1>
                  <p className="text-[10px] text-gray-500 -mt-1">Beauty Platform</p>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className="text-sm text-gray-300 hover:text-white transition-colors relative group"
                  whileHover={{ y: -2 }}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-brand-gold to-luxury-gold-light group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/salon/login">
                <motion.button
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  ورود
                </motion.button>
              </Link>

              <Link href="/platform/signup">
                <motion.button
                  className="px-6 py-2.5 bg-gradient-to-r from-brand-gold to-luxury-gold-light text-black rounded-xl font-bold text-sm shadow-lg shadow-brand-gold/20 hover:shadow-brand-gold/40 transition-all flex items-center gap-2 relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                  />
                  <span className="relative z-10">شروع رایگان</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform relative z-10" />
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white"
              onClick={() => setIsOpen((o) => !o)}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden relative bg-[#050505]/92 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <NoiseTexture />
            <div className="relative z-10 px-6 py-6 space-y-4">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className="block text-gray-300 hover:text-white transition-colors py-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </motion.a>
              ))}

              <div className="pt-4 space-y-3">
                <Link href="/salon/login" className="block">
                  <button className="w-full px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold">
                    ورود
                  </button>
                </Link>
                <Link href="/platform/signup" className="block">
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-brand-gold to-luxury-gold-light text-black rounded-xl font-bold">
                    شروع رایگان
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
