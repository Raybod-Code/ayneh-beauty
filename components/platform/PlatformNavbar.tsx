// components/platform/PlatformNavbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X, ArrowLeft, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "امکانات", href: "#features" },
  { label: "تعرفه‌ها", href: "#pricing" },
  { label: "مشاهده دمو", href: "/platform/demo" },
  { label: "نمونه کار", href: "/" },
];

export default function PlatformNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl shadow-lg border-b border-brand-gold/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link href="/platform" className="flex items-center gap-3 group relative z-50">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-gold/20 blur-xl rounded-full animate-pulse-slow" />
                <Sparkles className="relative w-9 h-9 text-brand-gold transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold bg-gradient-to-l from-brand-gold to-brand-dark bg-clip-text text-transparent">
                  پلتفرم آینه
                </span>
                <span className="text-xs text-brand-gray -mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  سالن خود را دیجیتال کنید
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {link.href.startsWith('#') ? (
                    <a
                      href={link.href}
                      className="relative text-brand-gray hover:text-brand-gold transition-colors duration-300 text-sm font-medium group"
                    >
                      <span>{link.label}</span>
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-gold group-hover:w-full transition-all duration-300" />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="relative text-brand-gray hover:text-brand-gold transition-colors duration-300 text-sm font-medium group"
                    >
                      <span>{link.label}</span>
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-gold group-hover:w-full transition-all duration-300" />
                    </Link>
                  )}
                </motion.div>
              ))}
              
              {/* CTA Buttons */}
              <div className="flex items-center gap-4">
                <Link
                  href="/salon/login"
                  className="text-brand-dark hover:text-brand-gold transition-colors duration-300 text-sm font-medium"
                >
                  ورود سالن‌ها
                </Link>
                
                <Link href="/platform/signup">
                  <motion.button
                    className="relative group overflow-hidden px-6 py-2.5 bg-gradient-to-l from-brand-gold to-brand-gold/80 text-white rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-brand-gold/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <span>شروع رایگان</span>
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-brand-gold to-brand-dark"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative z-50 p-2 rounded-xl hover:bg-brand-light transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6 text-brand-dark" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6 text-brand-dark" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-white z-40 md:hidden overflow-y-auto"
            >
              {/* Menu Header */}
              <div className="h-20 flex items-center justify-between px-6 border-b border-brand-gold/10">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-brand-gold" />
                  <span className="font-serif text-xl font-bold text-brand-dark">
                    پلتفرم آینه
                  </span>
                </div>
              </div>

              {/* Menu Content */}
              <div className="p-6">
                {/* Navigation Links */}
                <div className="space-y-2 mb-8">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {link.href.startsWith('#') ? (
                        <a
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-4 rounded-2xl text-brand-gray hover:text-brand-gold hover:bg-brand-light transition-all duration-300 group"
                        >
                          <span className="font-medium">{link.label}</span>
                          <ArrowLeft className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-4 rounded-2xl text-brand-gray hover:text-brand-gold hover:bg-brand-light transition-all duration-300 group"
                        >
                          <span className="font-medium">{link.label}</span>
                          <ArrowLeft className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-brand-gold/10 mb-8" />

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <Link
                    href="/salon/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center px-6 py-4 border-2 border-brand-gold/30 rounded-2xl text-brand-dark font-semibold hover:bg-brand-light hover:border-brand-gold transition-all"
                  >
                    ورود سالن‌ها
                  </Link>
                  
                  <Link
                    href="/platform/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center px-6 py-4 bg-gradient-to-l from-brand-gold to-brand-gold/80 text-white rounded-2xl font-semibold shadow-lg shadow-brand-gold/30 hover:shadow-xl transition-all"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>شروع رایگان ۳۰ روزه</span>
                      <Sparkles className="w-4 h-4" />
                    </span>
                  </Link>
                </motion.div>

                {/* Info Box */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-brand-gold/10 to-transparent border border-brand-gold/20"
                >
                  <p className="text-sm text-brand-gray leading-relaxed">
                    <span className="text-brand-dark font-semibold">۲,۵۰۰+</span> سالن به ما اعتماد کرده‌اند
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex -space-x-2">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-gold to-luxury-gold-light border-2 border-white" />
                      ))}
                    </div>
                    <span className="text-xs text-brand-gray">و هزاران نفر دیگر</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
