"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Shield,
  Search,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

type MenuItem = {
  title: string;
  icon: any;
  href: string;
};

export default function SuperAdminShell({
  children,
  displayName,
}: {
  children: React.ReactNode;
  displayName?: string;
}) {
  const pathname = usePathname();
  const supabase = createClient();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [q, setQ] = useState("");

  const MENU_ITEMS: MenuItem[] = useMemo(
    () => [
      { title: "داشبورد", icon: LayoutDashboard, href: "/superadmin/dashboard" },
      { title: "سالن‌ها", icon: Building2, href: "/superadmin/tenants" },
      { title: "آنالیتیکس", icon: BarChart3, href: "/superadmin/analytics" },
      { title: "تنظیمات", icon: Settings, href: "/superadmin/settings" },
    ],
    []
  );

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return toast("خروج ناموفق بود.");
    toast("با موفقیت خارج شدید.");
    window.location.href = "/admin/login?next=/superadmin/dashboard";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex font-sans" dir="rtl">
      <Toaster
        position="top-center"
        toastOptions={{
          unstyled: true,
          classNames: {
            toast:
              "font-sans group w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl border border-brand-gold/20 " +
              "bg-gradient-to-b from-[#141414]/95 to-[#0b0b0b]/95 " +
              "backdrop-blur-md px-4 py-3 " +
              "shadow-[0_22px_70px_rgba(0,0,0,0.75),0_0_0_1px_rgba(198,168,124,0.14),0_0_40px_rgba(198,168,124,0.10)]",
            title: "font-sans text-sm font-extrabold text-white tracking-wide",
            description: "font-sans text-xs text-gray-300/95 mt-1 leading-relaxed",
            actionButton:
              "font-sans bg-brand-gold text-black hover:brightness-110 rounded-xl px-3 py-2 text-xs font-bold",
            cancelButton:
              "font-sans bg-white/5 hover:bg-white/10 border border-white/10 text-gray-100 rounded-xl px-3 py-2 text-xs",
            closeButton:
              "font-sans bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 rounded-xl px-3 py-2 text-xs",
          },
        }}
      />

      {/* Overlay موبایل */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            key="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={[
          "fixed md:sticky top-0 right-0 h-screen z-50 flex flex-col",
          "bg-[#111] border-l border-white/5",
          "transition-all duration-300",
          "w-72",
          isSidebarOpen ? "translate-x-0 md:w-72" : "translate-x-full md:translate-x-0 md:w-20",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="h-20 flex items-center justify-center border-b border-white/5 relative overflow-hidden">
          {/* subtle animated glow */}
          <motion.div
            aria-hidden
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand-gold/10 blur-3xl"
            animate={{ x: [0, -18, 0], y: [0, 12, 0], opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          {isSidebarOpen ? (
            <div className="flex items-center gap-3 relative">
              <div className="w-10 h-10 rounded-2xl bg-brand-gold/15 border border-brand-gold/25 flex items-center justify-center">
                <Shield className="text-brand-gold" size={18} />
              </div>
              <div className="leading-tight">
                <h1 lang="en" className="text-xl font-black font-serif tracking-widest text-brand-gold">
                  AYNEH
                </h1>
                <p className="text-[10px] text-gray-400 tracking-wide">Super Admin</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-brand-gold/15 border border-brand-gold/25 flex items-center justify-center">
              <Shield className="text-brand-gold" size={18} />
            </div>
          )}
        </div>

        {/* Search (فقط وقتی sidebar بازه) */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-3 border-b border-white/5"
            >
              <div className="relative">
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="جستجو…"
                  className="w-full rounded-2xl bg-black/35 border border-white/10 px-10 py-2.5 text-xs outline-none focus:border-brand-gold/50 transition"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu */}
        <nav className="flex-1 py-5 px-3 space-y-2 overflow-y-auto no-scrollbar">
          {MENU_ITEMS.filter((item) => item.title.includes(q.trim()) || !q.trim()).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={[
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-brand-gold text-black font-bold shadow-[0_18px_60px_rgba(198,168,124,0.18)]"
                    : "text-gray-400 hover:bg-white/5 hover:text-white",
                  !isSidebarOpen ? "md:justify-center" : "",
                ].join(" ")}
              >
                <Icon size={20} className={isActive ? "text-black" : "text-gray-400 group-hover:text-brand-gold"} />
                {isSidebarOpen && <span className="flex-1">{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <div className={["mb-3", !isSidebarOpen ? "hidden md:hidden" : ""].join(" ")}>
            <div className="rounded-2xl border border-brand-gold/15 bg-gradient-to-b from-[#141414]/85 to-[#0b0b0b]/85 p-3">
              <div className="text-[11px] text-gray-300">حساب</div>
              <div className="text-sm font-bold text-white mt-0.5">{displayName || "Super Admin"}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className={[
              "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors",
              "text-red-300 hover:bg-red-500/10",
              !isSidebarOpen ? "md:justify-center" : "",
            ].join(" ")}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>خروج</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen((p) => !p)}
              className="p-2 hover:bg-white/10 rounded-lg text-gray-400"
              title="منو"
            >
              <Menu size={24} />
            </button>

            <div className="hidden md:block">
              <div className="text-sm font-bold text-white">پنل مدیریت کل سیستم</div>
              <div className="text-xs text-gray-500 mt-0.5">نظارت، اشتراک‌ها، دسترسی‌ها و تحلیل‌ها</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-gold/15 border border-brand-gold/25 flex items-center justify-center">
              <Shield className="text-brand-gold" size={18} />
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
