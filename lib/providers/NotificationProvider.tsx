"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Bell, CheckCircle, AlertTriangle, Info, DollarSign, Package, Send, AlertCircle } from "lucide-react";

type NotificationType = "booking" | "customer" | "payment" | "inventory" | "marketing" | "system" | "alert";
type NotificationPriority = "low" | "normal" | "high" | "urgent";

interface Notification {
  id: string;
  tenant_id: string;
  user_id?: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  is_read: boolean;
  link?: string;
  metadata?: any;
  created_at: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteAllRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Helper function to get tenant
  const getTenantSlug = (): string => {
    if (typeof window === 'undefined') return '';
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('localhost:')) {
      return 'localhost-fallback';
    }
    if (parts.length >= 2) return parts[0];
    return '';
  };

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      let slug = getTenantSlug();
      
      let tenantData: any = null;
      
      if (slug === 'localhost-fallback') {
        const response = await supabase.from("tenants").select("*").eq("status", "active").limit(1);
        tenantData = response.data;
        if (tenantData && tenantData.length > 0) slug = tenantData[0].slug;
      } else {
        const response = await supabase.from("tenants").select("*").eq("slug", slug).eq("status", "active").limit(1);
        tenantData = response.data;
      }

      if (!tenantData || tenantData.length === 0) {
        setLoading(false);
        return;
      }

      const tenant = tenantData[0];

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("tenant_id", tenant.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Mark as read
  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);

      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .in("id", unreadIds);

      if (error) throw error;

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      toast.success("همه اعلان‌ها خوانده شد");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("خطا در خواندن اعلان‌ها");
    }
  };

  // Delete notification
  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase.from("notifications").delete().eq("id", id);

      if (error) throw error;

      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success("اعلان حذف شد");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("خطا در حذف اعلان");
    }
  };

  // Delete all read
  const deleteAllRead = async () => {
    try {
      const readIds = notifications.filter((n) => n.is_read).map((n) => n.id);

      if (readIds.length === 0) {
        toast.info("اعلان خوانده‌شده‌ای وجود ندارد");
        return;
      }

      const { error } = await supabase.from("notifications").delete().in("id", readIds);

      if (error) throw error;

      setNotifications((prev) => prev.filter((n) => !n.is_read));
      toast.success("اعلان‌های خوانده شده حذف شدند");
    } catch (error) {
      console.error("Error deleting read notifications:", error);
      toast.error("خطا در حذف اعلان‌ها");
    }
  };

  // Refresh
  const refreshNotifications = async () => {
    setLoading(true);
    await fetchNotifications();
  };

  // Unread count
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Real-time subscription
  useEffect(() => {
    const getTenantAndSubscribe = async () => {
      let slug = getTenantSlug();
      
      let tenantData: any = null;
      
      if (slug === 'localhost-fallback') {
        const response = await supabase.from("tenants").select("*").eq("status", "active").limit(1);
        tenantData = response.data;
        if (tenantData && tenantData.length > 0) slug = tenantData[0].slug;
      } else {
        const response = await supabase.from("tenants").select("*").eq("slug", slug).eq("status", "active").limit(1);
        tenantData = response.data;
      }

      if (!tenantData || tenantData.length === 0) return;

      const tenant = tenantData[0];

      const channel = supabase
        .channel("notifications")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `tenant_id=eq.${tenant.id}`,
          },
          (payload) => {
            const newNotification = payload.new as Notification;
            
            setNotifications((prev) => [newNotification, ...prev]);

            // Show toast notification
            const icons = {
              booking: CheckCircle,
              customer: Info,
              payment: DollarSign,
              inventory: Package,
              marketing: Send,
              system: Bell,
              alert: AlertTriangle,
            };

            const Icon = icons[newNotification.type] || Bell;

            toast(newNotification.title, {
              description: newNotification.message,
              icon: <Icon className="w-5 h-5" />,
              duration: 5000,
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    getTenantAndSubscribe();
  }, [supabase]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}
