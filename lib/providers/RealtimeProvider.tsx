"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface RealtimeStats {
  totalBookings: number;
  todayBookings: number;
  activeBookings: number;
  totalRevenue: number;
  todayRevenue: number;
  totalCustomers: number;
  newCustomers: number;
  lowStockItems: number;
}

interface RealtimeContextType {
  stats: RealtimeStats;
  loading: boolean;
  refreshStats: () => Promise<void>;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

const initialStats: RealtimeStats = {
  totalBookings: 0,
  todayBookings: 0,
  activeBookings: 0,
  totalRevenue: 0,
  todayRevenue: 0,
  totalCustomers: 0,
  newCustomers: 0,
  lowStockItems: 0,
};

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<RealtimeStats>(initialStats);
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

  // Fetch stats
  const fetchStats = async () => {
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
      const today = new Date().toISOString().split('T')[0];

      // Fetch all data in parallel
      const [
        bookingsResponse,
        todayBookingsResponse,
        activeBookingsResponse,
        transactionsResponse,
        todayTransactionsResponse,
        customersResponse,
        inventoryResponse,
      ] = await Promise.all([
        // Total bookings
        supabase
          .from("bookings")
          .select("id", { count: "exact", head: true })
          .eq("tenant_id", tenant.id),
        
        // Today bookings
        supabase
          .from("bookings")
          .select("id", { count: "exact", head: true })
          .eq("tenant_id", tenant.id)
          .eq("booking_date", today),
        
        // Active bookings (confirmed or in-progress)
        supabase
          .from("bookings")
          .select("id", { count: "exact", head: true })
          .eq("tenant_id", tenant.id)
          .in("status", ["confirmed", "in-progress"]),
        
        // Total revenue (income transactions)
        supabase
          .from("transactions")
          .select("amount")
          .eq("tenant_id", tenant.id)
          .eq("type", "income"),
        
        // Today revenue
        supabase
          .from("transactions")
          .select("amount")
          .eq("tenant_id", tenant.id)
          .eq("type", "income")
          .eq("date", today),
        
        // Total customers
        supabase
          .from("customers")
          .select("id, created_at", { count: "exact" })
          .eq("tenant_id", tenant.id),
        
        // Low stock items
        supabase
          .from("inventory")
          .select("id", { count: "exact", head: true })
          .eq("tenant_id", tenant.id)
          .filter("quantity", "lte", "min_quantity"),
      ]);

      // Calculate totals
      const totalRevenue = transactionsResponse.data?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
      const todayRevenue = todayTransactionsResponse.data?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

      // Calculate new customers (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const newCustomers = customersResponse.data?.filter(
        c => new Date(c.created_at) >= thirtyDaysAgo
      ).length || 0;

      setStats({
        totalBookings: bookingsResponse.count || 0,
        todayBookings: todayBookingsResponse.count || 0,
        activeBookings: activeBookingsResponse.count || 0,
        totalRevenue,
        todayRevenue,
        totalCustomers: customersResponse.count || 0,
        newCustomers,
        lowStockItems: inventoryResponse.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    setLoading(true);
    await fetchStats();
  };

  // Initial fetch
  useEffect(() => {
    fetchStats();
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    const setupSubscriptions = async () => {
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

      // Subscribe to bookings changes
      const bookingsChannel = supabase
        .channel("realtime-bookings")
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

      // Subscribe to transactions changes
      const transactionsChannel = supabase
        .channel("realtime-transactions")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "transactions",
            filter: `tenant_id=eq.${tenant.id}`,
          },
          () => {
            fetchStats();
          }
        )
        .subscribe();

      // Subscribe to customers changes
      const customersChannel = supabase
        .channel("realtime-customers")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "customers",
            filter: `tenant_id=eq.${tenant.id}`,
          },
          () => {
            fetchStats();
          }
        )
        .subscribe();

      // Subscribe to inventory changes
      const inventoryChannel = supabase
        .channel("realtime-inventory")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "inventory",
            filter: `tenant_id=eq.${tenant.id}`,
          },
          () => {
            fetchStats();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(bookingsChannel);
        supabase.removeChannel(transactionsChannel);
        supabase.removeChannel(customersChannel);
        supabase.removeChannel(inventoryChannel);
      };
    };

    setupSubscriptions();
  }, []);

  return (
    <RealtimeContext.Provider value={{ stats, loading, refreshStats }}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error("useRealtime must be used within RealtimeProvider");
  }
  return context;
}
