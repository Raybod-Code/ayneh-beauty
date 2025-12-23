"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  Calendar,
  DollarSign,
  Package,
  Send,
  AlertTriangle,
  Info,
  RefreshCw,
  Filter,
} from "lucide-react";
import { useNotifications } from "@/lib/providers/NotificationProvider";
import { formatDistanceToNow } from "date-fns";
import { faIR } from "date-fns/locale";
import Link from "next/link";

type NotificationType = "all" | "booking" | "customer" | "payment" | "inventory" | "marketing" | "system" | "alert";

const typeConfig = {
  booking: { icon: Calendar, color: "luxury-sky-400", label: "رزرو" },
  customer: { icon: Info, color: "luxury-violet-400", label: "مشتری" },
  payment: { icon: DollarSign, color: "luxury-emerald-400", label: "پرداخت" },
  inventory: { icon: Package, color: "luxury-amber-400", label: "موجودی" },
  marketing: { icon: Send, color: "brand-gold", label: "بازاریابی" },
  system: { icon: Bell, color: "luxury-slate-400", label: "سیستم" },
  alert: { icon: AlertTriangle, color: "luxury-rose-400", label: "هشدار" },
};

export default function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    refreshNotifications,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState<NotificationType>("all");

  // Filter notifications
  const filteredNotifications =
    filterType === "all"
      ? notifications
      : notifications.filter((n) => n.type === filterType);

  return (
    <>
      {/* Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center hover:bg-white/[0.05] hover:border-white/20 transition-all"
      >
        <Bell className="w-5 h-5 text-white" strokeWidth={2.5} />

        {/* Badge */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/50"
          >
            <span className="text-[10px] font-black text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>

            {/* Pulse */}
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
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-screen w-full max-w-md bg-[#0a0a0a] border-r border-white/10 z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-black text-white">اعلان‌ها</h2>
                    <p className="text-sm text-brand-gray mt-0.5">
                      {unreadCount} خوانده نشده
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center hover:border-luxury-rose-400/50 transition-all"
                  >
                    <X className="w-5 h-5" strokeWidth={2.5} />
                  </motion.button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-luxury-emerald-400/10 border border-luxury-emerald-400/30 text-luxury-emerald-400 text-xs font-bold hover:bg-luxury-emerald-400/20 transition-all disabled:opacity-50"
                  >
                    <CheckCheck className="w-4 h-4" strokeWidth={2.5} />
                    خواندن همه
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={deleteAllRead}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-luxury-rose-400/10 border border-luxury-rose-400/30 text-luxury-rose-400 text-xs font-bold hover:bg-luxury-rose-400/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                    حذف خوانده‌ها
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={refreshNotifications}
                    disabled={loading}
                    className="w-9 h-9 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center hover:border-brand-gold/50 transition-all"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                      strokeWidth={2.5}
                    />
                  </motion.button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
                  <button
                    onClick={() => setFilterType("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                      filterType === "all"
                        ? "bg-brand-gold text-black"
                        : "bg-white/[0.02] border border-white/10 text-brand-gray hover:text-white"
                    }`}
                  >
                    همه ({notifications.length})
                  </button>
                  {Object.entries(typeConfig).map(([key, config]) => {
                    const count = notifications.filter((n) => n.type === key).length;
                    if (count === 0) return null;

                    return (
                      <button
                        key={key}
                        onClick={() => setFilterType(key as NotificationType)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                          filterType === key
                            ? `bg-${config.color}/20 text-${config.color} border border-${config.color}/30`
                            : "bg-white/[0.02] border border-white/10 text-brand-gray hover:text-white"
                        }`}
                      >
                        {config.label} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full"
                    />
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <Bell className="w-20 h-20 text-brand-gray opacity-20 mb-4" strokeWidth={1.5} />
                    <p className="text-xl font-bold text-white mb-2">اعلانی وجود ندارد</p>
                    <p className="text-brand-gray">
                      {filterType === "all"
                        ? "هیچ اعلانی برای نمایش نیست"
                        : `اعلان ${typeConfig[filterType as keyof typeof typeConfig]?.label} وجود ندارد`}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 space-y-2">
                    {filteredNotifications.map((notification, index) => {
                      const config = typeConfig[notification.type as keyof typeof typeConfig];
                      const Icon = config.icon;

                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className={`relative rounded-xl p-4 border transition-all ${
                            notification.is_read
                              ? "bg-white/[0.02] border-white/10"
                              : "bg-white/[0.05] border-white/20"
                          }`}
                        >
                          {/* Unread Indicator */}
                          {!notification.is_read && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-4 left-4 w-2 h-2 rounded-full bg-brand-gold shadow-lg shadow-brand-gold/50"
                            >
                              <motion.div
                                className="absolute inset-0 rounded-full bg-brand-gold"
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

                          <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div
                              className={`w-10 h-10 rounded-xl bg-${config.color}/10 border border-${config.color}/30 flex items-center justify-center flex-shrink-0`}
                            >
                              <Icon className={`w-5 h-5 text-${config.color}`} strokeWidth={2.5} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-white mb-1">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-brand-gray mb-2 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-brand-gray">
                                {formatDistanceToNow(new Date(notification.created_at), {
                                  addSuffix: true,
                                  locale: faIR,
                                })}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-3">
                            {!notification.is_read && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => markAsRead(notification.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-luxury-emerald-400/10 border border-luxury-emerald-400/30 text-luxury-emerald-400 text-xs font-bold hover:bg-luxury-emerald-400/20 transition-all"
                              >
                                <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                                خواندن
                              </motion.button>
                            )}

                            {notification.link && (
                              <Link
                                href={notification.link}
                                onClick={() => {
                                  markAsRead(notification.id);
                                  setIsOpen(false);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-bold hover:bg-brand-gold/20 transition-all"
                              >
                                مشاهده
                              </Link>
                            )}

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => deleteNotification(notification.id)}
                              className="mr-auto w-8 h-8 rounded-lg bg-luxury-rose-400/10 border border-luxury-rose-400/30 flex items-center justify-center hover:bg-luxury-rose-400/20 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-luxury-rose-400" strokeWidth={2.5} />
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
