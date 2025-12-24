"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, User, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/app/context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const { cartItems, setIsOpen: setIsCartOpen } = useCart();
  const cartCount = cartItems.reduce(
    (acc: number, item: any) => acc + (item.quantity || 1),
    0
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // بعد از همه‌ی هوک‌ها
  // قبلی (فقط /admin):
  if (pathname?.startsWith("/salon")) {
    return null;
  }

  // جدید (هم /admin هم /superadmin):
  if (pathname?.startsWith("/salon")  || pathname?.startsWith("/superadmin") || pathname?.startsWith("/platform")) {
    return null;
  }

  const navLinks = [
    { name: "خانه", href: "/" },
    { name: "خدمات", href: "/#services" },
    { name: "استودیو ناخن", href: "/nail-studio" },
    { name: "فروشگاه", href: "/shop" },
    { name: "رزرو نوبت", href: "/booking" },
    { name: "گالری", href: "/#gallery" },
    { name: "تماس", href: "/#contact" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#050505]/80 backdrop-blur-md py-4 shadow-lg border-b border-white/5"
            : "py-4 md:py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
          {/* لوگو */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center group-hover:bg-[#C6A87C] transition-colors">
              <span className="font-serif font-black text-black text-lg md:text-xl">
                A
              </span>
            </div>
            <span className="font-serif font-bold text-lg md:text-xl tracking-widest hidden md:block text-white">
              AYNEH
            </span>
          </Link>

          {/* منوی دسکتاپ */}
          <div className="hidden md:flex items-center gap-8 bg-white/5 px-8 py-3 rounded-full border border-white/10 backdrop-blur-sm">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#C6A87C] ${
                  pathname === link.href ? "text-[#C6A87C]" : "text-gray-300"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* آیکون‌ها */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* آیکون ورود موبایل */}
            <Link
              href="/login"
              className="md:hidden p-2 text-white hover:text-[#C6A87C] transition-colors"
            >
              <User size={22} />
            </Link>

            {/* سبد خرید */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-white/10 rounded-full transition-colors group text-white"
            >
              <ShoppingBag
                size={22}
                className="group-hover:text-[#C6A87C] transition-colors"
              />

              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-[#C6A87C] text-black text-[9px] md:text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* دکمه ورود دسکتاپ */}
            <Link
              href="/login"
              className="hidden md:flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#C6A87C] transition-colors"
            >
              <User size={18} /> ورود
            </Link>

            {/* منوی موبایل */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 text-white hover:text-[#C6A87C] transition-colors"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* منوی موبایل */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-[60] bg-[#050505] flex flex-col items-center justify-center gap-8"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white hover:bg-red-500 transition-colors"
            >
              <X size={28} />
            </button>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-3xl font-serif font-bold text-white hover:text-[#C6A87C] transition-colors"
              >
                {link.name}
              </Link>
            ))}

            <div className="w-full max-w-xs h-[1px] bg-white/10 my-4" />

            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-xl font-bold text-[#C6A87C] hover:text-white transition-colors"
            >
              <LogIn size={24} />
              ورود به حساب کاربری
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
