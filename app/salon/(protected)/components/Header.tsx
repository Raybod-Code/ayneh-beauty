"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Settings,
  User,
  LogOut,
  Shield,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import NotificationCenter from "@/components/dashboard/NotificationCenter";
import { useSearch } from "@/lib/providers/SearchProvider";

interface HeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function Header({ title, subtitle, breadcrumbs }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { setIsOpen } = useSearch(); // ✅ اتصال به Command Palette

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10">
      <div className="px-6 md:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left Side - Title & Breadcrumbs */}
          <div className="flex-1 min-w-0">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="text-xs text-brand-gray hover:text-white transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-xs text-white font-bold">
                        {crumb.label}
                      </span>
                    )}
                    {index < breadcrumbs.length - 1 && (
                      <span className="text-brand-gray">/</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-brand-gray mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Search (باز کردن Command Palette) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="hidden lg:flex items-center gap-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 rounded-2xl px-4 py-2.5 text-brand-gray hover:text-white transition-all"
            >
              <Search className="w-4 h-4" strokeWidth={2.5} />
              <span className="text-sm">جستجو...</span>
              <kbd className="text-xs bg-white/5 px-2 py-0.5 rounded">⌘K</kbd>
            </motion.button>

            {/* Notification Center */}
            <NotificationCenter />

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 rounded-2xl px-3 py-2 transition-all"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0a0a0a]" />
                </div>

                <div className="hidden md:block text-right">
                  <div className="text-xs font-bold text-white">مدیر سالن</div>
                  <div className="text-[10px] text-brand-gray">Salon Manager</div>
                </div>
              </motion.button>

              {/* User Dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-64 bg-[#111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                  >
                    {/* User Info */}
                    <div className="px-5 py-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                          <User className="w-6 h-6 text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">مدیر سالن</div>
                          <div className="text-xs text-brand-gray">manager@salon.com</div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/salon/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors"
                      >
                        <Settings className="w-4 h-4 text-brand-gray" strokeWidth={2.5} />
                        <span className="text-sm text-white">تنظیمات</span>
                      </Link>

                      <button className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                        <Shield className="w-4 h-4 text-brand-gray" strokeWidth={2.5} />
                        <span className="text-sm text-white">امنیت و حریم خصوصی</span>
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-white/10 p-2">
                      <button className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl hover:bg-red-500/10 text-red-400 transition-colors">
                        <LogOut className="w-4 h-4" strokeWidth={2.5} />
                        <span className="text-sm font-bold">خروج از حساب</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
