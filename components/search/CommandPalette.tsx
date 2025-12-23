"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search,
  Calendar,
  UserCircle,
  Scissors,
  Users,
  Wallet,
  Package,
  Send,
  BarChart3,
  Settings,
  LayoutDashboard,
  ArrowRight,
  Loader2,
  X,
} from "lucide-react";
import { useSearch } from "@/lib/providers/SearchProvider";
import { Command } from "cmdk";

const iconMap: any = {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  UserCircle,
  Wallet,
  Package,
  Send,
  BarChart3,
  Settings,
};

const typeConfig = {
  page: { label: "صفحه", color: "luxury-violet-400" },
  booking: { label: "رزرو", color: "luxury-sky-400" },
  customer: { label: "مشتری", color: "luxury-emerald-400" },
  service: { label: "سرویس", color: "brand-gold" },
  staff: { label: "کارمند", color: "luxury-rose-400" },
  inventory: { label: "موجودی", color: "luxury-amber-400" },
  transaction: { label: "تراکنش", color: "luxury-emerald-400" },
};

export default function CommandPalette() {
  const { query, setQuery, results, loading, isOpen, setIsOpen } = useSearch();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(results.length, 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(results.length, 1));
      } else if (e.key === "Enter" && results.length > 0) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleSelect = (item: any) => {
    if (item.url) {
      router.push(item.url);
      setIsOpen(false);
      setQuery("");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-[10%] left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-[101]"
          >
            <div className="relative rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-purple-500/5 pointer-events-none" />

              {/* Search Input */}
              <div className="relative flex items-center gap-4 px-6 py-5 border-b border-white/10">
                <Search className="w-5 h-5 text-brand-gray flex-shrink-0" strokeWidth={2.5} />
                
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو در همه‌جا..."
                  autoFocus
                  className="flex-1 bg-transparent text-white placeholder:text-brand-gray outline-none text-lg"
                />

                {loading && (
                  <Loader2 className="w-5 h-5 text-brand-gold animate-spin" strokeWidth={2.5} />
                )}

                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>

              {/* Results */}
              <Command className="relative max-h-[400px] overflow-y-auto custom-scrollbar">
                {query && results.length === 0 && !loading && (
                  <div className="p-8 text-center">
                    <Search className="w-16 h-16 text-brand-gray opacity-20 mx-auto mb-4" strokeWidth={1.5} />
                    <p className="text-white font-bold mb-1">نتیجه‌ای یافت نشد</p>
                    <p className="text-sm text-brand-gray">کلمه کلیدی دیگری را امتحان کنید</p>
                  </div>
                )}

                {!query && (
                  <div className="p-6">
                    <div className="text-xs text-brand-gray mb-3 px-2">دسترسی سریع</div>
                    <div className="space-y-1">
                      {[
                        { title: "داشبورد", icon: "LayoutDashboard", url: "/salon/dashboard" },
                        { title: "رزروها", icon: "Calendar", url: "/salon/bookings" },
                        { title: "مشتریان", icon: "UserCircle", url: "/salon/customers" },
                        { title: "مالی", icon: "Wallet", url: "/salon/financial" },
                      ].map((item) => {
                        const Icon = iconMap[item.icon];
                        return (
                          <button
                            key={item.url}
                            onClick={() => handleSelect(item)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 transition-all text-right group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-brand-gold/20 transition-all">
                              <Icon className="w-5 h-5 text-brand-gray group-hover:text-brand-gold transition-colors" strokeWidth={2.5} />
                            </div>
                            <span className="text-white font-bold flex-1">{item.title}</span>
                            <ArrowRight className="w-4 h-4 text-brand-gray opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {query && results.length > 0 && (
                  <Command.List className="p-2">
                    {results.map((item, index) => {
                      const config = typeConfig[item.type as keyof typeof typeConfig];
                      const Icon = item.icon ? iconMap[item.icon] : Search;
                      const isSelected = index === selectedIndex;

                      return (
                        <Command.Item
                          key={item.id}
                          value={item.title}
                          onSelect={() => handleSelect(item)}
                          className={`
                            flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all mb-1
                            ${isSelected ? "bg-brand-gold/10 border border-brand-gold/30" : "hover:bg-white/5"}
                          `}
                        >
                          <div className={`w-10 h-10 rounded-xl bg-${config.color}/10 border border-${config.color}/30 flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-5 h-5 text-${config.color}`} strokeWidth={2.5} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="text-white font-bold mb-0.5">{item.title}</div>
                            {item.description && (
                              <div className="text-sm text-brand-gray truncate">{item.description}</div>
                            )}
                          </div>

                          <div className={`text-xs px-2 py-1 rounded-lg bg-${config.color}/10 text-${config.color} font-bold`}>
                            {config.label}
                          </div>
                        </Command.Item>
                      );
                    })}
                  </Command.List>
                )}
              </Command>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-3 border-t border-white/10 text-xs text-brand-gray">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10">↑↓</kbd>
                    <span>حرکت</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10">Enter</kbd>
                    <span>انتخاب</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10">ESC</kbd>
                  <span>بستن</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
