"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Award,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Star,
  ShoppingBag,
  Sparkles,
  Crown,
  Zap,
  Target,
  TrendingDown,
} from "lucide-react";

// Helper function
function getTenantSlug(): string {
  if (typeof window === 'undefined') return '';
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('localhost:')) {
    return 'localhost-fallback';
  }
  if (parts.length >= 2) return parts[0];
  return '';
}

type TimeRange = "today" | "week" | "month" | "year";

export default function AnalyticsClient() {
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  
  // Data
  const [bookings, setBookings] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);

  // Time ranges
  const timeRanges = [
    { id: "today" as TimeRange, label: "امروز", icon: Clock },
    { id: "week" as TimeRange, label: "هفته", icon: Calendar },
    { id: "month" as TimeRange, label: "ماه", icon: Calendar },
    { id: "year" as TimeRange, label: "سال", icon: Calendar },
  ];

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
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

        const currentTenant = tenantData[0];
        setTenant(currentTenant);

        // Fetch all data
        const [bookingsRes, customersRes, servicesRes, staffRes] = await Promise.all([
          supabase.from("bookings").select("*").eq("tenant_id", currentTenant.id),
          supabase.from("customers").select("*").eq("tenant_id", currentTenant.id),
          supabase.from("services").select("*").eq("tenant_id", currentTenant.id),
          supabase.from("staff").select("*").eq("tenant_id", currentTenant.id),
        ]);

        if (bookingsRes.data) setBookings(bookingsRes.data);
        if (customersRes.data) setCustomers(customersRes.data);
        if (servicesRes.data) setServices(servicesRes.data);
        if (staffRes.data) setStaff(staffRes.data);

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data by time range
  const filteredData = useMemo(() => {
    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return {
      bookings: bookings.filter(b => new Date(b.created_at) >= startDate),
      customers: customers.filter(c => new Date(c.created_at) >= startDate),
    };
  }, [bookings, customers, timeRange]);

  // Calculate stats
  const stats = useMemo(() => {
    const { bookings: filtered, customers: filteredCustomers } = filteredData;
    
    const totalRevenue = filtered.reduce((sum, b) => sum + (Number(b.price) || 0), 0);
    const completedBookings = filtered.filter(b => b.status === "completed");
    const completedRevenue = completedBookings.reduce((sum, b) => sum + (Number(b.price) || 0), 0);
    
    const previousPeriodBookings = bookings.filter(b => {
      const date = new Date(b.created_at);
      const now = new Date();
      let prevStart = new Date();
      let prevEnd = new Date();

      switch (timeRange) {
        case "today":
          prevStart.setDate(now.getDate() - 1);
          prevStart.setHours(0, 0, 0, 0);
          prevEnd.setDate(now.getDate() - 1);
          prevEnd.setHours(23, 59, 59, 999);
          break;
        case "week":
          prevStart.setDate(now.getDate() - 14);
          prevEnd.setDate(now.getDate() - 7);
          break;
        case "month":
          prevStart.setMonth(now.getMonth() - 2);
          prevEnd.setMonth(now.getMonth() - 1);
          break;
        case "year":
          prevStart.setFullYear(now.getFullYear() - 2);
          prevEnd.setFullYear(now.getFullYear() - 1);
          break;
      }

      return date >= prevStart && date <= prevEnd;
    });

    const previousRevenue = previousPeriodBookings.reduce((sum, b) => sum + (Number(b.price) || 0), 0);
    const revenueChange = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    const bookingChange = previousPeriodBookings.length > 0
      ? ((filtered.length - previousPeriodBookings.length) / previousPeriodBookings.length) * 100
      : 0;

    // Average booking value
    const avgBookingValue = filtered.length > 0 ? totalRevenue / filtered.length : 0;

    // Popular services
    const serviceCount: { [key: string]: { count: number; revenue: number; name: string } } = {};
    filtered.forEach(b => {
      if (b.service_id) {
        if (!serviceCount[b.service_id]) {
          serviceCount[b.service_id] = { count: 0, revenue: 0, name: b.service_name || 'نامشخص' };
        }
        serviceCount[b.service_id].count++;
        serviceCount[b.service_id].revenue += Number(b.price) || 0;
      }
    });

    const popularServices = Object.entries(serviceCount)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top customers
    const customerSpending: { [key: string]: { spent: number; visits: number; name: string } } = {};
    filtered.forEach(b => {
      if (b.customer_id) {
        if (!customerSpending[b.customer_id]) {
          customerSpending[b.customer_id] = { spent: 0, visits: 0, name: b.customer_name || 'نامشخص' };
        }
        customerSpending[b.customer_id].spent += Number(b.price) || 0;
        customerSpending[b.customer_id].visits++;
      }
    });

    const topCustomers = Object.entries(customerSpending)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 5);

    // Staff performance
    const staffPerformance: { [key: string]: { count: number; revenue: number; name: string } } = {};
    filtered.forEach(b => {
      if (b.staff_id) {
        if (!staffPerformance[b.staff_id]) {
          staffPerformance[b.staff_id] = { count: 0, revenue: 0, name: b.staff_name || 'نامشخص' };
        }
        staffPerformance[b.staff_id].count++;
        staffPerformance[b.staff_id].revenue += Number(b.price) || 0;
      }
    });

    const topStaff = Object.entries(staffPerformance)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Status breakdown
    const statusCount = {
      pending: filtered.filter(b => b.status === 'pending').length,
      confirmed: filtered.filter(b => b.status === 'confirmed').length,
      completed: filtered.filter(b => b.status === 'completed').length,
      cancelled: filtered.filter(b => b.status === 'cancelled').length,
    };

    return {
      totalRevenue,
      completedRevenue,
      revenueChange,
      totalBookings: filtered.length,
      bookingChange,
      completedBookings: completedBookings.length,
      newCustomers: filteredCustomers.length,
      avgBookingValue,
      popularServices,
      topCustomers,
      topStaff,
      statusCount,
    };
  }, [filteredData, bookings, timeRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-brand-gold border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!tenant) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-brand-gold" strokeWidth={2.5} />
                گزارش‌ها و آمار
              </h1>
              <p className="text-xs text-brand-gray mt-0.5">تحلیل عملکرد {tenant.name}</p>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center gap-2 p-1 bg-white/[0.02] border border-white/10 rounded-xl">
              {timeRanges.map((range) => (
                <motion.button
                  key={range.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTimeRange(range.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    timeRange === range.id
                      ? "bg-brand-gold text-black"
                      : "text-brand-gray hover:text-white"
                  }`}
                >
                  {range.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-brand-gold" strokeWidth={2.5} />
              </div>
              {stats.revenueChange !== 0 && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                  stats.revenueChange > 0 
                    ? "bg-luxury-emerald-400/10 text-luxury-emerald-400" 
                    : "bg-luxury-rose-400/10 text-luxury-rose-400"
                }`}>
                  {stats.revenueChange > 0 ? (
                    <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" strokeWidth={2.5} />
                  )}
                  <span className="text-xs font-bold">{Math.abs(stats.revenueChange).toFixed(1)}%</span>
                </div>
              )}
            </div>
            <h3 className="text-3xl font-black text-white mb-1">
              {(stats.totalRevenue / 1000000).toFixed(1)}M
            </h3>
            <p className="text-sm text-brand-gray">درآمد کل</p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-brand-gray">درآمد تکمیل شده</p>
              <p className="text-lg font-black text-brand-gold">{(stats.completedRevenue / 1000000).toFixed(1)}M تومان</p>
            </div>
          </motion.div>

          {/* Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-luxury-sky-400/10 border border-luxury-sky-400/30 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-luxury-sky-400" strokeWidth={2.5} />
              </div>
              {stats.bookingChange !== 0 && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                  stats.bookingChange > 0 
                    ? "bg-luxury-emerald-400/10 text-luxury-emerald-400" 
                    : "bg-luxury-rose-400/10 text-luxury-rose-400"
                }`}>
                  {stats.bookingChange > 0 ? (
                    <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" strokeWidth={2.5} />
                  )}
                  <span className="text-xs font-bold">{Math.abs(stats.bookingChange).toFixed(1)}%</span>
                </div>
              )}
            </div>
            <h3 className="text-3xl font-black text-white mb-1">{stats.totalBookings}</h3>
            <p className="text-sm text-brand-gray">تعداد رزروها</p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-brand-gray">تکمیل شده</p>
              <p className="text-lg font-black text-luxury-emerald-400">{stats.completedBookings} رزرو</p>
            </div>
          </motion.div>

          {/* Customers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-luxury-violet-400/10 border border-luxury-violet-400/30 flex items-center justify-center">
                <Users className="w-6 h-6 text-luxury-violet-400" strokeWidth={2.5} />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-luxury-emerald-400/10 text-luxury-emerald-400">
                <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                <span className="text-xs font-bold">جدید</span>
              </div>
            </div>
            <h3 className="text-3xl font-black text-white mb-1">{stats.newCustomers}</h3>
            <p className="text-sm text-brand-gray">مشتری جدید</p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-brand-gray">کل مشتریان</p>
              <p className="text-lg font-black text-white">{customers.length} نفر</p>
            </div>
          </motion.div>

          {/* Average */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-luxury-amber-400/10 border border-luxury-amber-400/30 flex items-center justify-center">
                <Target className="w-6 h-6 text-luxury-amber-400" strokeWidth={2.5} />
              </div>
            </div>
            <h3 className="text-3xl font-black text-white mb-1">
              {(stats.avgBookingValue / 1000).toFixed(0)}K
            </h3>
            <p className="text-sm text-brand-gray">میانگین هر رزرو</p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-brand-gray">بیشترین خرید</p>
              <p className="text-lg font-black text-luxury-amber-400">
                {stats.topCustomers.length > 0 
                  ? `${(stats.topCustomers[0].spent / 1000).toFixed(0)}K تومان`
                  : "0 تومان"
                }
              </p>
            </div>
          </motion.div>
        </div>

        {/* Status Breakdown & Top Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
              وضعیت رزروها
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-luxury-amber-400/10 border border-luxury-amber-400/30">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-luxury-amber-400" strokeWidth={2.5} />
                  <span className="text-sm font-bold text-white">در انتظار</span>
                </div>
                <span className="text-lg font-black text-luxury-amber-400">{stats.statusCount.pending}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-luxury-sky-400/10 border border-luxury-sky-400/30">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-luxury-sky-400" strokeWidth={2.5} />
                  <span className="text-sm font-bold text-white">تایید شده</span>
                </div>
                <span className="text-lg font-black text-luxury-sky-400">{stats.statusCount.confirmed}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-luxury-emerald-400/10 border border-luxury-emerald-400/30">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-luxury-emerald-400" strokeWidth={2.5} />
                  <span className="text-sm font-bold text-white">تکمیل شده</span>
                </div>
                <span className="text-lg font-black text-luxury-emerald-400">{stats.statusCount.completed}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-luxury-rose-400/10 border border-luxury-rose-400/30">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-luxury-rose-400" strokeWidth={2.5} />
                  <span className="text-sm font-bold text-white">لغو شده</span>
                </div>
                <span className="text-lg font-black text-luxury-rose-400">{stats.statusCount.cancelled}</span>
              </div>
            </div>
          </motion.div>

          {/* Popular Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
              پرطرفدارترین خدمات
            </h3>
            <div className="space-y-3">
              {stats.popularServices.map((service, index) => (
                <div key={service.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-black text-brand-gold">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{service.name}</p>
                    <p className="text-xs text-brand-gray">{service.count} رزرو</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-brand-gold">{(service.revenue / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              ))}
              {stats.popularServices.length === 0 && (
                <p className="text-center text-brand-gray py-8">داده‌ای موجود نیست</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Top Customers & Staff Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Customers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
              برترین مشتریان
            </h3>
            <div className="space-y-3">
              {stats.topCustomers.map((customer, index) => (
                <div key={customer.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-luxury-violet-400 to-luxury-sky-400 flex items-center justify-center text-white font-black flex-shrink-0">
                    {customer.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{customer.name}</p>
                    <p className="text-xs text-brand-gray">{customer.visits} ویزیت</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-brand-gold">{(customer.spent / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              ))}
              {stats.topCustomers.length === 0 && (
                <p className="text-center text-brand-gray py-8">داده‌ای موجود نیست</p>
              )}
            </div>
          </motion.div>

          {/* Staff Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
              عملکرد کارمندان
            </h3>
            <div className="space-y-3">
              {stats.topStaff.map((member, index) => (
                <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold to-luxury-amber-500 flex items-center justify-center text-black font-black flex-shrink-0">
                    {member.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{member.name}</p>
                    <p className="text-xs text-brand-gray">{member.count} رزرو</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-brand-gold">{(member.revenue / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              ))}
              {stats.topStaff.length === 0 && (
                <p className="text-center text-brand-gray py-8">داده‌ای موجود نیست</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
