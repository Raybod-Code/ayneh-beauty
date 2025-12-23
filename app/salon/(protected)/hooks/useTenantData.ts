import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTenant } from "@/app/context/TenantContext";

export function useTenantStats() {
  const { tenant } = useTenant();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenant?.id) return;

    const fetchStats = async () => {
      try {
        const supabase = createClient();
        const today = new Date().toISOString().split("T")[0];

        // Bookings امروز
        const { data: bookings } = await supabase
          .from("bookings")
          .select("*")
          .eq("tenant_id", tenant.id)
          .eq("booking_date", today);

        // Customers جدید امروز
        const { data: customers } = await supabase
          .from("customers")
          .select("*")
          .eq("tenant_id", tenant.id)
          .gte("created_at", today);

        // Reviews
        const { data: reviews } = await supabase
          .from("reviews")
          .select("rating")
          .eq("tenant_id", tenant.id);

        // محاسبه درآمد امروز
        const todayRevenue = bookings?.reduce((sum, b) => sum + Number(b.price || 0), 0) || 0;

        // میانگین رضایت
        const avgRating = reviews?.length 
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
          : 0;

        setStats({
          revenue: todayRevenue,
          revenueChange: 23.5, // فعلاً ثابت (بعداً محاسبه می‌کنیم)
          bookings: bookings?.length || 0,
          bookingsChange: 12.5,
          newCustomers: customers?.length || 0,
          customersChange: -5.2,
          satisfaction: avgRating,
          satisfactionChange: 8.2,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Real-time subscription
    const supabase = createClient();
    const channel = supabase
      .channel("tenant-stats")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `tenant_id=eq.${tenant.id}`,
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tenant?.id]);

  return { stats, loading };
}

export function useTenantBookings() {
  const { tenant } = useTenant();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenant?.id) return;

    const fetchBookings = async () => {
      try {
        const supabase = createClient();
        const today = new Date().toISOString().split("T")[0];

        const { data } = await supabase
          .from("bookings")
          .select(`
            *,
            customers (*)
          `)
          .eq("tenant_id", tenant.id)
          .eq("booking_date", today)
          .order("booking_time", { ascending: true });

        setBookings(data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    // Real-time subscription
    const supabase = createClient();
    const channel = supabase
      .channel("tenant-bookings")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `tenant_id=eq.${tenant.id}`,
        },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tenant?.id]);

  return { bookings, loading };
}
