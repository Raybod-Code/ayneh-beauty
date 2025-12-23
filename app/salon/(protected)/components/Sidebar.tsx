"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  User,
  Menu,
  X,
  Calendar,
  Scissors,
  Users,
  UserCircle,
  Store,
  Sparkles,
  Wallet,
  Package,
  Send,
} from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/auth/logout/actions";
import { toast } from "sonner";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    label: "داشبورد",
    href: "/salon/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "رزروها",
    href: "/salon/bookings",
    icon: Calendar,
    badge: 5, // تعداد رزروهای جدید
  },
  {
    label: "سرویس‌ها",
    href: "/salon/services",
    icon: Scissors,
  },
  {
    label: "کارمندان",
    href: "/salon/staff",
    icon: Users,
  },
  {
    label: "مشتریان",
    href: "/salon/customers",
    icon: UserCircle,
  },
  {
    label: "مالی",
    href: "/salon/financial",
    icon: Wallet,
  },
  {
    label: "موجودی",
    href: "/salon/inventory",
    icon: Package,
  },
  {
    label: "بازاریابی",
    href: "/salon/marketing",
    icon: Send,
  },
  {
    label: "آمار و گزارش",
    href: "/salon/analytics",
    icon: BarChart3,
  },
  {
    label: "تنظیمات",
    href: "/salon/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    const result = await logout();

    if (result.success) {
      toast.success("خروج موفقیت‌آمیز");
      router.push("/salon/login");
    } else {
      toast.error("خطا در خروج از حساب");
      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 right-4 z-[60] w-12 h-12 rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center shadow-xl backdrop-blur-xl"
      >
        <motion.div
          animate={{ rotate: mobileOpen ? 90 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {mobileOpen ? (
            <X className="w-6 h-6 text-white" strokeWidth={2.5} />
          ) : (
            <Menu className="w-6 h-6 text-white" strokeWidth={2.5} />
          )}
        </motion.div>
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed right-0 top-0 h-screen bg-[#0a0a0a] border-l border-white/10 z-50 
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-[280px]"}
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.03, 0.05, 0.03],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 right-0 w-64 h-64 bg-brand-gold rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.02, 0.04, 0.02],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 rounded-full blur-3xl"
          />

          {/* Noise Texture */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' /%3E%3C/svg%3E")',
            }}
          />
        </div>

        <div className="relative h-full flex flex-col">
          {/* Logo Section */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 flex-shrink-0">
            <Link
              href="/salon/dashboard"
              className="flex items-center gap-3 group relative"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                whileTap={{ scale: 0.95 }}
                className="relative flex-shrink-0"
              >
                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-brand-gold rounded-[16px] blur-xl opacity-0 group-hover:opacity-60"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Icon Container */}
                <div className="relative w-12 h-12 rounded-[16px] bg-gradient-to-br from-brand-gold via-brand-gold to-yellow-600 flex items-center justify-center shadow-lg shadow-brand-gold/30 group-hover:shadow-brand-gold/60 transition-shadow duration-300">
                  <Store className="w-7 h-7 text-white" strokeWidth={2.5} />

                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 rounded-[16px]"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </motion.div>

              {!collapsed && (
                <div className="overflow-hidden">
                  <motion.div
                    className="text-xl font-black text-white group-hover:text-brand-gold transition-colors whitespace-nowrap"
                    whileHover={{ scale: 1.05 }}
                  >
                    سالن من
                  </motion.div>
                  <div className="text-[10px] text-brand-gray font-bold tracking-wider whitespace-nowrap">
                    SALON PANEL
                  </div>
                </div>
              )}
            </Link>

            {/* Collapse Button */}
            <motion.button
              onClick={() => setCollapsed(!collapsed)}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.9 }}
              className="hidden lg:flex w-8 h-8 rounded-xl bg-white/5 items-center justify-center transition-colors flex-shrink-0 group"
            >
              <motion.div
                animate={{ rotate: collapsed ? 180 : 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <ChevronLeft
                  className="w-4 h-4 text-brand-gray group-hover:text-brand-gold transition-colors"
                  strokeWidth={2.5}
                />
              </motion.div>
            </motion.button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 overflow-y-auto custom-scrollbar">
            <div className="space-y-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                const isHovered = hoveredItem === item.href;

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={item.href}
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`
                        relative flex items-center rounded-2xl transition-all duration-200 group
                        ${collapsed ? "px-3 py-3 justify-center" : "px-4 py-3 gap-3"}
                        ${
                          isActive
                            ? "bg-brand-gold/10 text-white"
                            : "text-brand-gray hover:text-white"
                        }
                      `}
                    >
                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute -right-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-gold rounded-full shadow-lg shadow-brand-gold/50"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}

                      {/* Glow Effect */}
                      <AnimatePresence>
                        {(isActive || isHovered) && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className={`absolute inset-0 rounded-2xl blur-md -z-10 ${
                              isActive ? "bg-brand-gold/20" : "bg-brand-gold/10"
                            }`}
                          />
                        )}
                      </AnimatePresence>

                      {/* Hover Background */}
                      <motion.div
                        className="absolute inset-0 bg-white/[0.02] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={false}
                      />

                      {/* Icon Container */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                        whileTap={{ scale: 0.9 }}
                        className={`
                          relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300
                          ${
                            isActive
                              ? "bg-brand-gold/20 text-brand-gold shadow-lg shadow-brand-gold/30"
                              : "bg-white/5 group-hover:bg-brand-gold/10 group-hover:text-brand-gold"
                          }
                        `}
                      >
                        <Icon className="w-5 h-5" strokeWidth={2.5} />

                        {/* Icon Glow */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 bg-brand-gold rounded-xl blur-md opacity-30"
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        )}

                        {/* Badge Dot when collapsed */}
                        {item.badge && collapsed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 shadow-lg shadow-red-500/50"
                          >
                            <motion.div
                              className="absolute inset-0 rounded-full bg-red-500"
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [1, 0, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Label */}
                      {!collapsed && (
                        <span className="font-bold text-sm flex-1 whitespace-nowrap relative">
                          {item.label}
                        </span>
                      )}

                      {/* Badge */}
                      {item.badge && !collapsed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                          className="relative w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/50"
                        >
                          <span className="text-[10px] font-black text-white relative z-10">
                            {item.badge}
                          </span>

                          {/* Badge Pulse */}
                          <motion.div
                            className="absolute inset-0 rounded-full bg-red-500"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 0, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        </motion.div>
                      )}

                      {/* Hover Tooltip (collapsed mode) */}
                      {collapsed && isHovered && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-[#111] border border-white/10 rounded-xl px-3 py-2 whitespace-nowrap text-sm font-bold shadow-xl pointer-events-none"
                        >
                          {item.label}
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-full">
                            <div className="w-2 h-2 bg-[#111] border-l border-b border-white/10 rotate-45 -translate-x-1/2" />
                          </div>
                        </motion.div>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </nav>

          {/* User Section */}
          <div className="p-3 border-t border-white/10 flex-shrink-0">
            {/* User Profile */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`
                flex items-center rounded-2xl bg-white/[0.02] border border-white/10 mb-2 transition-all group cursor-pointer
                ${collapsed ? "px-3 py-3 justify-center" : "px-3 py-3 gap-3"}
              `}
            >
              <div className="relative flex-shrink-0">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-shadow"
                >
                  <User className="w-5 h-5 text-white" strokeWidth={2.5} />
                </motion.div>

                {/* Online Status */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-[#0a0a0a] shadow-lg shadow-green-500/50"
                />
              </div>

              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate group-hover:text-brand-gold transition-colors">
                    مدیر سالن
                  </div>
                  <div className="flex items-center gap-1 text-xs text-brand-gray">
                    <Sparkles className="w-3 h-3" strokeWidth={2.5} />
                    <span>Salon Manager</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Logout Button */}
            <motion.button
              onClick={handleLogout}
              disabled={loggingOut}
              whileHover={{ scale: loggingOut ? 1 : 1.02 }}
              whileTap={{ scale: loggingOut ? 1 : 0.98 }}
              className={`
                relative w-full flex items-center rounded-2xl 
                bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 
                text-red-400 font-bold text-sm transition-all overflow-hidden group
                disabled:opacity-50 disabled:cursor-not-allowed
                ${collapsed ? "px-3 py-3 justify-center" : "px-4 py-3 gap-3"}
              `}
            >
              {/* Hover Effect */}
              <motion.div
                className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
              />

              {/* Glow on Hover */}
              <motion.div
                className="absolute inset-0 bg-red-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity -z-10"
                initial={false}
              />

              <motion.div
                animate={loggingOut ? { rotate: 360 } : {}}
                transition={{
                  duration: 1,
                  repeat: loggingOut ? Infinity : 0,
                  ease: "linear",
                }}
              >
                <LogOut className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
              </motion.div>

              {!collapsed && (
                <span className="whitespace-nowrap relative">
                  {loggingOut ? "در حال خروج..." : "خروج از حساب"}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </aside>
    </>
  );
}
