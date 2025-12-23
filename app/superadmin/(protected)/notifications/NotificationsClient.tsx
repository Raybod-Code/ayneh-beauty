"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  Search,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "./actions";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  action_url?: string;
  action_label?: string;
  icon?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export default function NotificationsClient() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    const result = await getNotifications();
    if (result.success && result.data) {
      setNotifications(result.data);
    }
    setLoading(false);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    const result = await markAsRead(notificationId);
    if (result.success) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
        )
      );
      toast.success("علامت خوانده شده زده شد");
    }
  };

  const handleMarkAllAsRead = async () => {
    const result = await markAllAsRead();
    if (result.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() })));
      toast.success("همه اعلانات خوانده شدند");
    }
  };

  const handleDelete = async (notificationId: string) => {
    const result = await deleteNotification(notificationId);
    if (result.success) {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      toast.success("اعلان حذف شد");
    }
  };

  // Filter notifications
  const filteredNotifications = notifications
    .filter((n) => {
      if (filter === "unread") return !n.is_read;
      if (filter === "read") return n.is_read;
      return true;
    })
    .filter((n) => {
      if (!searchQuery) return true;
      return (
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" strokeWidth={2.5} />;
      case "warning":
        return <AlertTriangle className="w-5 h-5" strokeWidth={2.5} />;
      case "error":
        return <AlertCircle className="w-5 h-5" strokeWidth={2.5} />;
      default:
        return <Info className="w-5 h-5" strokeWidth={2.5} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400";
      case "warning":
        return "from-orange-500/20 to-yellow-500/20 border-orange-500/30 text-orange-400";
      case "error":
        return "from-red-500/20 to-rose-500/20 border-red-500/30 text-red-400";
      default:
        return "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400";
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "همین الان";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} دقیقه پیش`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ساعت پیش`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} روز پیش`;
    return date.toLocaleDateString("fa-IR");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-gold/20 to-yellow-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-[#111]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-brand-gray text-sm mb-1">همه اعلانات</div>
                  <div className="text-3xl font-black text-white">{notifications.length}</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-brand-gold" strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-[#111]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-brand-gray text-sm mb-1">خوانده نشده</div>
                  <div className="text-3xl font-black text-white">{unreadCount}</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-blue-400" strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-[#111]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-brand-gray text-sm mb-1">خوانده شده</div>
                  <div className="text-3xl font-black text-white">
                    {notifications.length - unreadCount}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
                  <CheckCheck className="w-6 h-6 text-green-400" strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#111]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray" strokeWidth={2.5} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در اعلانات..."
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pr-12 pl-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Filter Tabs */}
              <div className="flex gap-2 bg-white/[0.02] border border-white/10 rounded-2xl p-1">
                {(["all", "unread", "read"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-bold transition-all
                      ${
                        filter === f
                          ? "bg-brand-gold text-black"
                          : "text-brand-gray hover:text-white"
                      }
                    `}
                  >
                    {f === "all" ? "همه" : f === "unread" ? "خوانده نشده" : "خوانده شده"}
                  </button>
                ))}
              </div>

              {/* Mark All as Read */}
              {unreadCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 rounded-2xl px-4 py-2.5 font-bold text-sm transition-colors whitespace-nowrap"
                >
                  <CheckCheck className="w-4 h-4" strokeWidth={2.5} />
                  خواندن همه
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#111]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-10 h-10 text-brand-gold" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-black text-white mb-2">اعلانی وجود ندارد</h3>
                <p className="text-brand-gray text-sm">
                  {searchQuery ? "نتیجه‌ای برای جستجوی شما یافت نشد" : "هنوز اعلانی دریافت نکرده‌اید"}
                </p>
              </motion.div>
            ) : (
              filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group"
                >
                  {/* Glow Effect */}
                  {!notification.is_read && (
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-gold/20 to-yellow-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
                  )}

                  <div
                    className={`
                      relative bg-[#111]/50 backdrop-blur-xl border rounded-3xl p-6 transition-all
                      ${
                        notification.is_read
                          ? "border-white/10 opacity-60 hover:opacity-100"
                          : "border-brand-gold/20 bg-brand-gold/[0.02]"
                      }
                    `}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                        className={`
                          w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0
                          bg-gradient-to-br ${getTypeColor(notification.type)}
                        `}
                      >
                        {getTypeIcon(notification.type)}
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-base font-black text-white">
                            {notification.title}
                          </h3>
                          <span className="text-xs text-brand-gray whitespace-nowrap">
                            {getRelativeTime(notification.created_at)}
                          </span>
                        </div>

                        <p className="text-sm text-brand-gray mb-3 leading-relaxed">
                          {notification.message}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {notification.action_url && (
                            <a
                              href={notification.action_url}
                              className="flex items-center gap-2 bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/20 text-brand-gold rounded-xl px-3 py-1.5 text-xs font-bold transition-colors"
                            >
                              {notification.action_label || "مشاهده"}
                              <ExternalLink className="w-3 h-3" strokeWidth={2.5} />
                            </a>
                          )}

                          {!notification.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="flex items-center gap-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 text-white rounded-xl px-3 py-1.5 text-xs font-bold transition-colors"
                            >
                              <CheckCheck className="w-3 h-3" strokeWidth={2.5} />
                              خوانده شد
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors"
                          >
                            <Trash2 className="w-3 h-3" strokeWidth={2.5} />
                            حذف
                          </button>
                        </div>
                      </div>

                      {/* Unread Indicator */}
                      {!notification.is_read && (
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [1, 0.5, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="w-3 h-3 rounded-full bg-brand-gold shadow-lg shadow-brand-gold/50 flex-shrink-0"
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
