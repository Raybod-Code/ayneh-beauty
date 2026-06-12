"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ShoppingBag,
  Settings,
  LogOut,
  Scissors,
  Bell,
  Check,
  UserCog,
  TrendingUp,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Sparkles,
  AlertCircle,
  ShoppingCart,
  Zap,
  Command,
  Moon,
  Sun,
  Globe,
  Star,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { Toaster, toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

// ─── Types ───────────────────────────────────────────────────────────────────
type Role = "owner" | "admin" | "secretary";

type NotifType = "booking" | "alert" | "error" | "success" | "ai";

type Notification = {
  id: number;
  text: string;
  subtext?: string;
  time: string;
  type: NotifType;
  read: boolean;
};

type MenuItem = {
  title: string;
  titleEn: string;
  icon: any;
  href: string;
  role: "all" | Role;
  badge?: number | string;
  isNew?: boolean;
};

type CommandItem = {
  label: string;
  icon: any;
  href?: string;
  action?: () => void;
  group: string;
};

interface AdminShellProps {
  children: React.ReactNode;
  user?: any;
  role?: string;
  salonName?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const NOTIF_ICONS: Record<NotifType, any> = {
  booking: CalendarDays,
  alert: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle2,
  ai: Sparkles,
};

const NOTIF_COLORS: Record<NotifType, string> = {
  booking: "text-[#7b68ee]",
  alert: "text-[#f5a623]",
  error: "text-[#ff4d6d]",
  success: "text-[#4ade80]",
  ai: "text-[#c9a96e]",
};

const NOTIF_BG: Record<NotifType, string> = {
  booking: "bg-[#7b68ee]/10",
  alert: "bg-[#f5a623]/10",
  error: "bg-[#ff4d6d]/10",
  success: "bg-[#4ade80]/10",
  ai: "bg-[#c9a96e]/10",
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function CommandPalette({
  open,
  onClose,
  items,
}: {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
    }
  }, [open]);

  const filtered = useMemo(() => {
    if (!query) return items;
    return items.filter((i) =>
      i.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, items]);

  const groups = useMemo(() => {
    const g: Record<string, CommandItem[]> = {};
    filtered.forEach((item) => {
      if (!g[item.group]) g[item.group] = [];
      g[item.group].push(item);
    });
    return g;
  }, [filtered]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh] px-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl bg-[#111118] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8">
              <Search size={16} className="text-white/40 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجو یا دستور..."
                className="flex-1 bg-transparent text-white placeholder-white/30 text-sm outline-none font-[var(--font-doran)]"
                dir="rtl"
              />
              <kbd className="text-[10px] text-white/20 border border-white/10 px-1.5 py-0.5 rounded font-mono">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-72 overflow-y-auto py-2">
              {Object.entries(groups).map(([group, groupItems]) => (
                <div key={group}>
                  <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-white/25 font-semibold">
                    {group}
                  </div>
                  {groupItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href ?? "#"}
                      onClick={() => {
                        item.action?.();
                        onClose();
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors group"
                      dir="rtl"
                    >
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/50 group-hover:text-[#c9a96e] group-hover:bg-[#c9a96e]/10 transition-all">
                        <item.icon size={14} />
                      </div>
                      <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="px-4 py-8 text-center text-white/25 text-sm">
                  نتیجه‌ای یافت نشد
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-white/5 flex items-center gap-4 text-[11px] text-white/20">
              <span className="flex items-center gap-1">
                <kbd className="border border-white/10 px-1 rounded font-mono">↑↓</kbd> ناوبری
              </span>
              <span className="flex items-center gap-1">
                <kbd className="border border-white/10 px-1 rounded font-mono">↵</kbd> انتخاب
              </span>
              <span className="flex items-center gap-1">
                <kbd className="border border-white/10 px-1 rounded font-mono">ESC</kbd> بستن
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NotifPanel({
  notifications,
  onMarkRead,
  onMarkAll,
  onClose,
}: {
  notifications: Notification[];
  onMarkRead: (id: number) => void;
  onMarkAll: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-0 mt-2 w-80 bg-[#111118] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
        <span className="text-sm font-semibold text-white">اعلان‌ها</span>
        <div className="flex items-center gap-2">
          <button
            onClick={onMarkAll}
            className="text-[11px] text-[#c9a96e] hover:text-white transition-colors"
          >
            همه خوانده شد
          </button>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Items */}
      <div className="max-h-72 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-10 text-center text-white/30 text-sm">هیچ اعلانی وجود ندارد</div>
        ) : (
          notifications.map((n) => {
            const Icon = NOTIF_ICONS[n.type];
            return (
              <motion.div
                key={n.id}
                layout
                className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer ${
                  !n.read ? "bg-white/2" : ""
                }`}
                onClick={() => onMarkRead(n.id)}
              >
                <div className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${NOTIF_BG[n.type]}`}>
                  <Icon size={14} className={NOTIF_COLORS[n.type]} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-relaxed ${
                    n.read ? "text-white/40" : "text-white/80"
                  }`}>
                    {n.text}
                  </p>
                  {n.subtext && (
                    <p className="text-[10px] text-white/25 mt-0.5">{n.subtext}</p>
                  )}
                  <p className="text-[10px] text-white/20 mt-1">{n.time}</p>
                </div>
                {!n.read && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c9a96e] mt-1.5 shrink-0" />
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminShell({
  children,
  user: initialUser,
  role: initialRole,
  salonName = "سالن زیبایی",
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const [role, setRole] = useState<Role | null>((initialRole as Role) || null);
  const [roleLoading, setRoleLoading] = useState(!initialRole);
  const [salonDisplayName, setSalonDisplayName] = useState(salonName);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      text: "رزرو جدید: سارا محمدی — رنگ و هایلایت",
      subtext: "امروز، ساعت ۱۴:۰۰",
      time: "۵ دقیقه پیش",
      type: "booking",
      read: false,
    },
    {
      id: 2,
      text: "هوش مصنوعی: موجودی شامپو خاویار به ۳ عدد رسید",
      subtext: "پیشنهاد: سفارش ۱۵ عدد تا پایان هفته",
      time: "۴۵ دقیقه پیش",
      type: "ai",
      read: false,
    },
    {
      id: 3,
      text: "کنسلی نوبت: مینا راد — پدیکور VIP",
      time: "۲ ساعت پیش",
      type: "error",
      read: false,
    },
    {
      id: 4,
      text: "درآمد امروز از ۵ میلیون تومان گذشت 🎉",
      time: "۳ ساعت پیش",
      type: "success",
      read: true,
    },
  ]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  // ─── Keyboard shortcut Cmd+K ───
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
      if (e.key === "Escape") setCmdOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ─── Load role if not passed ───
  useEffect(() => {
    if (initialRole) return;
    let active = true;
    const load = async () => {
      setRoleLoading(true);
      const { data: u } = await supabase.auth.getUser();
      if (!active || !u.user?.id) { setRoleLoading(false); return; }
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", u.user.id)
        .single();
      if (!active) return;
      setRole((data?.role as Role) ?? null);
      setRoleLoading(false);
    };
    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [supabase, initialRole]);

  const markAsRead = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("همه اعلان‌ها خوانده شد");
  }, []);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/login");
  }, [supabase, router]);

  // ─── Menu definition ───
  const MENU_ITEMS: MenuItem[] = [
    { title: "داشبورد",       titleEn: "Dashboard",  icon: LayoutDashboard, href: "/dashboard",          role: "all" },
    { title: "مدیریت نوبت‌ها", titleEn: "Bookings",   icon: CalendarDays,    href: "/dashboard/bookings", role: "secretary" },
    { title: "مشتریان",        titleEn: "Customers",  icon: Users,           href: "/dashboard/customers",role: "secretary" },
    { title: "کارمندان",       titleEn: "Staff",      icon: UserCog,         href: "/dashboard/staff",    role: "admin" },
    { title: "سرویس‌ها",       titleEn: "Services",   icon: Scissors,        href: "/dashboard/services", role: "admin" },
    { title: "فروشگاه",        titleEn: "Products",   icon: ShoppingBag,     href: "/dashboard/products", role: "admin" },
    { title: "آمار و گزارش",   titleEn: "Analytics",  icon: TrendingUp,      href: "/dashboard/analytics",role: "admin", isNew: true },
    { title: "بازاریابی",      titleEn: "Marketing",  icon: Megaphone,       href: "/dashboard/marketing",role: "admin" },
    { title: "تنظیمات",        titleEn: "Settings",   icon: Settings,        href: "/dashboard/settings", role: "all" },
  ];

  const roleOrder: Record<Role, number> = { owner: 3, admin: 2, secretary: 1 };
  const visibleMenu = useMemo(() => {
    if (roleLoading) return MENU_ITEMS.filter((i) => i.role === "all");
    return MENU_ITEMS.filter((item) => {
      if (item.role === "all") return true;
      if (!role) return false;
      return roleOrder[role] >= roleOrder[item.role as Role];
    });
  }, [role, roleLoading]);

  // ─── Command palette items ───
  const cmdItems: CommandItem[] = useMemo(() => [
    ...visibleMenu.map((m) => ({ label: m.title, icon: m.icon, href: m.href, group: "ناوبری" })),
    { label: "جستجوی مشتری",     icon: Search,     href: "/dashboard/customers", group: "اقدامات سریع" },
    { label: "رزرو جدید",        icon: CalendarDays, href: "/dashboard/bookings/new", group: "اقدامات سریع" },
    { label: "خروج از حساب",     icon: LogOut,     action: handleLogout, group: "حساب کاربری" },
  ], [visibleMenu, handleLogout]);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  // ─── Role badge ───
  const ROLE_LABEL: Record<Role, string> = {
    owner: "مالک",
    admin: "مدیر",
    secretary: "منشی",
  };

  // ─── Sidebar width for layout ───
  const sidebarW = collapsed ? 72 : 240;

  return (
    <>
      <Toaster
        position="top-left"
        toastOptions={{
          style: {
            background: "#1a1a24",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#e8e8f0",
            fontFamily: "var(--font-doran)",
          },
        }}
      />

      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        items={cmdItems}
      />

      <div className="admin-shell flex h-screen bg-[#0a0a0f] overflow-hidden" dir="rtl">

        {/* ── Mobile overlay ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* ════════════════════════════════════════
            SIDEBAR
        ════════════════════════════════════════ */}
        <motion.aside
          animate={{ width: collapsed ? 72 : 240 }}
          transition={{ type: "spring", stiffness: 380, damping: 35 }}
          className={`
            fixed top-0 right-0 h-full z-40 flex flex-col
            bg-[#0d0d14] border-l border-white/5
            lg:relative lg:translate-x-0
            ${
              mobileOpen
                ? "translate-x-0"
                : "translate-x-full lg:translate-x-0"
            }
          `}
        >
          {/* Brand */}
          <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5 min-h-[72px]">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c9a96e] to-[#8a6c3e] flex items-center justify-center shrink-0 shadow-lg shadow-[#c9a96e]/20"
            >
              <Scissors size={16} className="text-black" />
            </motion.div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden"
                >
                  <p className="text-xs font-bold text-white leading-tight truncate max-w-[140px]">
                    {salonDisplayName}
                  </p>
                  <p className="text-[10px] text-white/30 mt-0.5">پنل مدیریت</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search / Command */}
          <div className="px-3 py-3 border-b border-white/5">
            <button
              onClick={() => setCmdOpen(true)}
              className={`
                w-full flex items-center gap-2.5 px-3 py-2
                bg-white/4 hover:bg-white/7 border border-white/6 hover:border-white/10
                rounded-xl text-white/30 hover:text-white/50
                transition-all duration-200 group
                ${ collapsed ? "justify-center" : "" }
              `}
            >
              <Search size={13} className="shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs flex-1 text-right"
                  >
                    جستجو...
                  </motion.span>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {!collapsed && (
                  <motion.kbd
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[9px] border border-white/10 px-1.5 py-0.5 rounded font-mono text-white/20"
                  >
                    ⌘K
                  </motion.kbd>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden px-2 space-y-0.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5">
            {visibleMenu.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`
                    relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                    transition-all duration-200 group overflow-hidden
                    ${ collapsed ? "justify-center" : "" }
                    ${
                      active
                        ? "bg-[#c9a96e]/12 text-[#c9a96e]"
                        : "text-white/40 hover:text-white/80 hover:bg-white/4"
                    }
                  `}
                >
                  {/* Active indicator */}
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#c9a96e] rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}

                  {/* Icon */}
                  <item.icon
                    size={17}
                    className={`shrink-0 transition-transform duration-200 ${
                      hoveredItem === item.href && !active ? "scale-110" : ""
                    }`}
                  />

                  {/* Label */}
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -4 }}
                        transition={{ duration: 0.15 }}
                        className="flex-1 flex items-center justify-between min-w-0"
                      >
                        <span className="text-sm font-medium truncate">{item.title}</span>
                        <div className="flex items-center gap-1.5">
                          {item.isNew && (
                            <span className="text-[9px] bg-[#7b68ee]/20 text-[#7b68ee] px-1.5 py-0.5 rounded-full font-bold uppercase">
                              new
                            </span>
                          )}
                          {item.badge !== undefined && (
                            <span className="text-[10px] bg-[#c9a96e]/15 text-[#c9a96e] px-1.5 py-0.5 rounded-full font-bold">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Collapsed tooltip */}
                  {collapsed && (
                    <div className="
                      absolute right-full mr-3 px-2.5 py-1.5
                      bg-[#1a1a24] border border-white/10 rounded-lg
                      text-xs text-white/80 whitespace-nowrap
                      opacity-0 pointer-events-none group-hover:opacity-100
                      transition-opacity duration-150 shadow-xl
                      z-50
                    ">
                      {item.title}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom: user + collapse toggle */}
          <div className="border-t border-white/5 p-3 space-y-2">
            {/* User info */}
            <div className={`flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/4 transition-colors group ${ collapsed ? "justify-center" : "" }`}>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#c9a96e]/30 to-[#8a6c3e]/20 border border-[#c9a96e]/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-[#c9a96e]">
                  {salonDisplayName.charAt(0)}
                </span>
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-xs font-medium text-white/70 truncate">
                      {salonDisplayName}
                    </p>
                    <p className="text-[10px] text-white/25">
                      {role ? ROLE_LABEL[role] : "در حال بارگذاری..."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {!collapsed && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleLogout}
                    className="text-white/20 hover:text-[#ff4d6d] transition-colors p-1 opacity-0 group-hover:opacity-100"
                    title="خروج"
                  >
                    <LogOut size={13} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Collapse toggle */}
            <button
              onClick={() => setCollapsed((v) => !v)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-white/20 hover:text-white/50 hover:bg-white/4 rounded-xl transition-all text-xs ${ collapsed ? "justify-center" : "" }`}
            >
              <motion.div
                animate={{ rotate: collapsed ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              >
                <ChevronRight size={14} />
              </motion.div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    جمع کردن منو
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.aside>

        {/* ════════════════════════════════════════
            MAIN CONTENT AREA
        ════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* ── Top Header ── */}
          <header className="h-[72px] flex items-center justify-between px-6 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-sm shrink-0">

            {/* Left: mobile menu + page title */}
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                className="lg:hidden text-white/40 hover:text-white transition-colors p-1"
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? <X size={20} /> : (
                  <div className="space-y-1.5">
                    <div className="w-5 h-0.5 bg-current" />
                    <div className="w-3.5 h-0.5 bg-current" />
                    <div className="w-5 h-0.5 bg-current" />
                  </div>
                )}
              </button>

              {/* Breadcrumb / page context */}
              <div>
                <div className="flex items-center gap-1.5 text-[11px] text-white/20">
                  <span>{salonDisplayName}</span>
                  <span>/</span>
                  <span className="text-white/40">
                    {visibleMenu.find((m) => isActive(m.href))?.title ?? "داشبورد"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2">

              {/* Command palette trigger */}
              <button
                onClick={() => setCmdOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/4 hover:bg-white/7 border border-white/6 text-white/30 hover:text-white/60 transition-all text-xs"
              >
                <Command size={12} />
                <span>جستجو</span>
                <kbd className="text-[9px] border border-white/10 px-1 rounded font-mono">⌘K</kbd>
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotif((v) => !v)}
                  className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/4 hover:bg-white/7 border border-white/6 hover:border-white/10 text-white/50 hover:text-white transition-all"
                >
                  <Bell size={15} />
                  <AnimatePresence>
                    {unreadCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-[#ff4d6d] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-[#0a0a0f]"
                      >
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                <AnimatePresence>
                  {showNotif && (
                    <NotifPanel
                      notifications={notifications}
                      onMarkRead={markAsRead}
                      onMarkAll={markAllRead}
                      onClose={() => setShowNotif(false)}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* AI Insights quick pill */}
              <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#c9a96e]/10 hover:bg-[#c9a96e]/18 border border-[#c9a96e]/15 hover:border-[#c9a96e]/30 text-[#c9a96e] transition-all text-xs">
                <Sparkles size={12} />
                <span>۳ پیشنهاد AI</span>
              </button>

            </div>
          </header>

          {/* ── Page content ── */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Global admin styles */}
      <style jsx global>{`
        .admin-shell * {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.06) transparent;
        }
        .admin-shell *::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .admin-shell *::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.06);
          border-radius: 999px;
        }
        .admin-shell *::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </>
  );
}
