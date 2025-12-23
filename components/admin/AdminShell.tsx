"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ShoppingBag,
  Settings,
  LogOut,
  Menu,
  Scissors,
  Bell,
  Check,
  UserCog,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

type NotifType = "booking" | "alert" | "error";

type Notification = {
  id: number;
  text: string;
  time: string;
  type: NotifType;
  read: boolean;
};

// اضافه شدن owner به تایپ نقش‌ها
type Role = "owner" | "admin" | "secretary";

type MenuItem = {
  title: string;
  icon: any;
  href: string;
  role: "all" | Role;
};

// آپدیت کردن ورودی کامپوننت که با Layout سازگار باشد
interface AdminShellProps {
  children: React.ReactNode;
  user?: any; // اختیاری کردیم که اگر پاس ندادی هم کار کنه
  role?: string; // اختیاری
}

export default function AdminShell({ children, user: initialUser, role: initialRole }: AdminShellProps) {
  const pathname = usePathname();
  const supabase = createClient();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotif, setShowNotif] = useState(false);

  // اگر نقش از بالا اومده (از layout)، همون رو بذار، وگرنه نال بذار تا useEffect پر کنه
  const [role, setRole] = useState<Role | null>((initialRole as Role) || null);
  // اگر نقش اومده، یعنی لودینگ نداریم
  const [roleLoading, setRoleLoading] = useState(!initialRole);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, text: "رزرو جدید: سارا محمدی (رنگ مو)", time: "۵ دقیقه پیش", type: "booking", read: false },
    { id: 2, text: "موجودی «شامپو خاویار» کم است", time: "۱ ساعت پیش", type: "alert", read: false },
    { id: 3, text: "کنسلی نوبت: مینا راد", time: "۲ ساعت پیش", type: "error", read: true },
  ]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast("همه اعلان‌ها خوانده شد.");
  };

  const MENU_ITEMS: MenuItem[] = [
    { title: "داشبورد", icon: LayoutDashboard, href: "/admin", role: "all" },
    { title: "مدیریت نوبت‌ها", icon: CalendarDays, href: "/admin/bookings", role: "secretary" },
    { title: "آرایشگرها و شیفت‌ها", icon: UserCog, href: "/admin/staff", role: "admin" },
    { title: "لیست مشتریان", icon: Users, href: "/admin/customers", role: "secretary" },
    { title: "مدیریت فروشگاه", icon: ShoppingBag, href: "/admin/products", role: "admin" },
    { title: "تنظیمات سایت", icon: Settings, href: "/admin/settings", role: "admin" },
  ];

  // نقش را از profiles بخوان (فقط اگر از props نیامده بود)
  useEffect(() => {
    if (initialRole) return; // اگر نقش پاس داده شده، دیگه فچ نکن

    let isActive = true;

    const loadRole = async () => {
      setRoleLoading(true);

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      if (!isActive) return;

      if (userErr || !userId) {
        setRole(null);
        setRoleLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (!isActive) return;

      if (error || !data?.role) {
        setRole(null);
      } else {
        setRole(data.role as Role);
      }

      setRoleLoading(false);
    };

    loadRole();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      loadRole();
    });

    return () => {
      isActive = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase, initialRole]);

  const visibleMenu = useMemo(() => {
    if (roleLoading) return MENU_ITEMS.filter((i) => i.role === "all");

    return MENU_ITEMS.filter((item) => {
      if (item.role === "all") return true;
      if (!role) return false;
      // اگر ادمین یا اونر هست، همه چیز رو ببینه (یا لاجیک دقیق‌تر)
      if (role === 'owner') return true; 
      if (role === 'admin' && item.role !== 'owner') return true;
      return item.role === role;
    });
  }, [MENU_ITEMS, role, roleLoading]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast("خطا در خروج");
      return;
    }
    toast("خارج شدید");
    window.location.href = "/admin/login";
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
            actionButton: "font-sans bg-brand-gold text-black hover:brightness-110 rounded-xl px-3 py-2 text-xs font-bold",
            cancelButton:
              "font-sans bg-white/5 hover:bg-white/10 border border-white/10 text-gray-100 rounded-xl px-3 py-2 text-xs",
            closeButton:
              "font-sans bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 rounded-xl px-3 py-2 text-xs",
          },
        }}
      />

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

      <aside
        className={`
          fixed md:sticky top-0 right-0 h-screen bg-[#111] border-l border-white/5 transition-all duration-300 z-50 flex flex-col
          w-64
          ${isSidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
          ${isSidebarOpen ? "md:w-64" : "md:w-20"}
        `}
      >
        <div className="h-20 flex items-center justify-center border-b border-white/5">
          {isSidebarOpen ? (
            <h1 lang="en" className="text-2xl font-black font-serif tracking-widest text-brand-gold">
              AYNEH
            </h1>
          ) : (
            <span lang="en" className="text-xl font-bold text-brand-gold hidden md:block">
              A
            </span>
          )}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {visibleMenu.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive ? "bg-brand-gold text-black font-bold" : "text-gray-400 hover:bg-white/5 hover:text-white"}
                  ${!isSidebarOpen && "md:justify-center"}
                `}
              >
                <Icon size={20} className={isActive ? "text-black" : "text-gray-400 group-hover:text-brand-gold"} />
                {isSidebarOpen && <span className="flex-1">{item.title}</span>}
              </Link>
            );
          })}

          {roleLoading && (
            <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300">
              در حال بارگذاری دسترسی‌ها...
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 transition-colors
              ${!isSidebarOpen && "md:justify-center"}
            `}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>خروج</span>}
          </button>
        </div>
      </aside>

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
            <h2 className="text-lg font-bold text-white hidden md:block">پنل مدیریت</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                onClick={() => setShowNotif((p) => !p)}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors relative"
                title="اعلانات"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span
                    className="
                      absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-brand-gold
                      ring-2 ring-[#0a0a0a]
                      shadow-[0_0_16px_rgba(198,168,124,0.55)]
                    "
                  />
                )}
              </button>

              <AnimatePresence>
                {showNotif && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.96 }}
                      className="
                        absolute left-0 mt-4 w-80 z-50 overflow-hidden rounded-2xl
                        border border-brand-gold/15
                        bg-[#0b0b0b]/95
                        backdrop-blur-md
                        shadow-[0_28px_90px_rgba(0,0,0,0.80),0_0_0_1px_rgba(198,168,124,0.10)]
                      "
                    >
                      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/30">
                        <span className="text-sm font-extrabold text-white tracking-wide">اعلانات ({unreadCount})</span>
                        <button onClick={markAllRead} className="text-[10px] text-brand-gold hover:underline">
                          خواندن همه
                        </button>
                      </div>

                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-center text-gray-300/80 py-8 text-sm">پیام جدیدی نیست</p>
                        ) : (
                          notifications.map((notif) => (
                            <button
                              key={notif.id}
                              onClick={() => {
                                markAsRead(notif.id);
                                if (!notif.read) toast("خوانده شد.");
                              }}
                              className={`
                                w-full text-right p-4 border-b border-white/10 transition-colors
                                flex items-start gap-3 hover:bg-white/5
                                ${notif.read ? "opacity-70" : "opacity-100"}
                              `}
                            >
                              <div
                                className={`
                                  w-2.5 h-2.5 mt-2 rounded-full shrink-0 bg-brand-gold
                                  shadow-[0_0_18px_rgba(198,168,124,0.45)]
                                  ${
                                    notif.type === "booking"
                                      ? "opacity-100"
                                      : notif.type === "alert"
                                      ? "opacity-75"
                                      : "opacity-55"
                                  }
                                `}
                              />

                              <div
                                className={`flex-1 rounded-xl px-2 py-1 ${
                                  notif.read ? "bg-transparent" : "bg-brand-gold/5"
                                }`}
                              >
                                <p className="text-xs text-white leading-relaxed">{notif.text}</p>
                                <span className="text-[10px] text-gray-300/80 mt-1 block">{notif.time}</span>
                              </div>

                              {!notif.read && <Check size={12} className="text-brand-gold mt-1" />}
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-4 pl-2 md:pl-0">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-bold text-white">مدیر سیستم</span>
                <span lang="en" className="text-xs text-gray-500">
                  {roleLoading ? "..." : role ?? "No role"}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center text-black font-bold">
                <Scissors size={20} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
