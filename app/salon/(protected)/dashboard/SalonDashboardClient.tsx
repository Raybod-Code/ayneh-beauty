"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  AlertCircle,
  Brain,
  Star,
  Crown,
  Award,
} from "lucide-react";

// Helper function to get tenant slug from URL
function getTenantSlug(): string {
  if (typeof window === 'undefined') return '';
  
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('localhost:')) {
    return 'localhost-fallback';
  }
  
  if (parts.length >= 2) {
    return parts[0];
  }
  
  return '';
}

// AI Insights با رنگ‌های جدید
const aiInsights = [
  {
    id: 1,
    type: "warning",
    title: "پیک ساعات",
    message: "امروز ساعت 14-16 شلوغ‌ترین زمان است. پیشنهاد: یک کارمند اضافه اختصاص دهید.",
    icon: AlertCircle,
    gradient: "from-amber-400/20 to-amber-600/10",
    iconBg: "bg-amber-400/10",
    iconColor: "text-amber-400",
    buttonBg: "bg-amber-400/10",
    buttonBorder: "border-amber-400/20",
    buttonText: "text-amber-400",
    buttonHover: "hover:bg-amber-400/20",
  },
  {
    id: 2,
    type: "success",
    title: "رشد درآمد",
    message: "درآمد شما این هفته 23% افزایش داشته. روند عالی است!",
    icon: TrendingUp,
    gradient: "from-emerald-400/20 to-emerald-600/10",
    iconBg: "bg-emerald-400/10",
    iconColor: "text-emerald-400",
    buttonBg: "bg-emerald-400/10",
    buttonBorder: "border-emerald-400/20",
    buttonText: "text-emerald-400",
    buttonHover: "hover:bg-emerald-400/20",
  },
  {
    id: 3,
    type: "info",
    title: "پیشنهاد هوشمند",
    message: "سرویس رنگ مو محبوب‌ترین انتخاب این ماه است. پیشنهاد: پکیج ویژه بسازید.",
    icon: Brain,
    gradient: "from-sky-400/20 to-sky-600/10",
    iconBg: "bg-sky-400/10",
    iconColor: "text-sky-400",
    buttonBg: "bg-sky-400/10",
    buttonBorder: "border-sky-400/20",
    buttonText: "text-sky-400",
    buttonHover: "hover:bg-sky-400/20",
  },
];

// Quick Actions با رنگ‌های جدید
const quickActions = [
  {
    id: "new-booking",
    label: "رزرو جدید",
    icon: Calendar,
    gradient: "from-sky-400/20 to-sky-600/10",
    iconBg: "bg-sky-400/10",
    iconColor: "text-sky-400",
    hover: "hover:border-sky-400/50",
    glow: "bg-sky-400",
  },
  {
    id: "add-customer",
    label: "مشتری جدید",
    icon: Users,
    gradient: "from-slate-400/20 to-slate-600/10",
    iconBg: "bg-slate-400/10",
    iconColor: "text-slate-400",
    hover: "hover:border-slate-400/50",
    glow: "bg-slate-400",
  },
  {
    id: "add-service",
    label: "سرویس جدید",
    icon: Sparkles,
    gradient: "from-amber-400/20 to-amber-600/10",
    iconBg: "bg-amber-400/10",
    iconColor: "text-amber-400",
    hover: "hover:border-amber-400/50",
    glow: "bg-amber-400",
  },
  {
    id: "reports",
    label: "گزارشات",
    icon: BarChart3,
    gradient: "from-emerald-400/20 to-emerald-600/10",
    iconBg: "bg-emerald-400/10",
    iconColor: "text-emerald-400",
    hover: "hover:border-emerald-400/50",
    glow: "bg-emerald-400",
  },
];

export default function SalonDashboardClient() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tenant, setTenant] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        let slug = getTenantSlug();
        
        let tenantData: any = null;
        let tenantError: any = null;
        
        if (slug === 'localhost-fallback') {
          const response = await supabase
            .from("tenants")
            .select("*")
            .eq("status", "active")
            .limit(1);
          
          tenantData = response.data;
          tenantError = response.error;
          
          if (tenantData && tenantData.length > 0) {
            slug = tenantData[0].slug;
          }
        } else {
          const response = await supabase
            .from("tenants")
            .select("*")
            .eq("slug", slug)
            .eq("status", "active")
            .limit(1);
          
          tenantData = response.data;
          tenantError = response.error;
        }

        if (tenantError || !tenantData || tenantData.length === 0) {
          setError(
            slug === 'localhost-fallback' 
              ? "هیچ سالن فعالی در دیتابیس وجود ندارد"
              : `هیچ سالنی با آدرس "${slug}" پیدا نشد`
          );
          setLoading(false);
          return;
        }

        const currentTenant = tenantData[0];
        setTenant(currentTenant);

        const today = new Date().toISOString().split("T")[0];

        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select("*")
          .eq("tenant_id", currentTenant.id)
          .eq("booking_date", today)
          .order("booking_time", { ascending: true });

        if (!bookingsError) {
          setBookings(bookingsData || []);
        }

        const { data: customersData } = await supabase
          .from("customers")
          .select("*")
          .eq("tenant_id", currentTenant.id)
          .gte("created_at", today);

        const { data: reviewsData } = await supabase
          .from("reviews")
          .select("rating")
          .eq("tenant_id", currentTenant.id);

        const todayRevenue = bookingsData?.reduce((sum, b) => sum + Number(b.price || 0), 0) || 0;
        const avgRating = reviewsData?.length 
          ? reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length 
          : 4.8;

        setStats({
          revenue: todayRevenue,
          revenueChange: 23.5,
          bookings: bookingsData?.length || 0,
          bookingsChange: 12.5,
          newCustomers: customersData?.length || 0,
          customersChange: -5.2,
          satisfaction: avgRating,
          satisfactionChange: 8.2,
        });

      } catch (error: any) {
        setError(`خطای غیرمنتظره: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-brand-gold border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white font-bold mb-2">در حال بارگذاری داشبورد...</p>
          <p className="text-brand-gray text-sm">صبر کنید، داده‌های واقعی در حال دریافت هستند</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="text-center max-w-md bg-rose-500/10 border border-rose-400/20 rounded-3xl p-8">
          <p className="text-rose-400 text-xl font-bold mb-4">❌ خطا</p>
          <p className="text-white mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-gold/80 transition-all"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl font-bold mb-2">❌ سالنی یافت نشد</p>
          <p className="text-brand-gray">لطفاً با پشتیبانی تماس بگیرید</p>
        </div>
      </div>
    );
  }

  // Stats با رنگ‌های لوکس
  const realtimeStats = [
    {
      id: "revenue",
      label: "درآمد امروز",
      value: stats?.revenue?.toLocaleString() || "0",
      unit: "تومان",
      change: stats?.revenueChange || 0,
      trend: (stats?.revenueChange || 0) >= 0 ? "up" : "down",
      icon: DollarSign,
      gradient: "from-emerald-400/30 to-emerald-600/10",
      iconBg: "from-emerald-400/20 to-emerald-600/5",
      iconColor: "text-emerald-400",
      progressGradient: "from-emerald-400 to-emerald-500",
      glowColor: "emerald-400",
      target: 15000000,
      subtitle: "از هدف 15M",
    },
    {
      id: "bookings",
      label: "رزروهای امروز",
      value: stats?.bookings?.toString() || "0",
      unit: "رزرو",
      change: stats?.bookingsChange || 0,
      trend: (stats?.bookingsChange || 0) >= 0 ? "up" : "down",
      icon: Calendar,
      gradient: "from-sky-400/30 to-sky-600/10",
      iconBg: "from-sky-400/20 to-sky-600/5",
      iconColor: "text-sky-400",
      progressGradient: "from-sky-400 to-sky-500",
      glowColor: "sky-400",
      target: 30,
      subtitle: "از هدف 30",
    },
    {
      id: "customers",
      label: "مشتریان جدید",
      value: stats?.newCustomers?.toString() || "0",
      unit: "نفر",
      change: stats?.customersChange || 0,
      trend: (stats?.customersChange || 0) >= 0 ? "up" : "down",
      icon: Users,
      gradient: "from-slate-400/30 to-slate-600/10",
      iconBg: "from-slate-400/20 to-slate-600/5",
      iconColor: "text-slate-400",
      progressGradient: "from-slate-400 to-slate-500",
      glowColor: "slate-400",
      target: 10,
      subtitle: "از هدف 10",
    },
    {
      id: "satisfaction",
      label: "رضایت مشتری",
      value: stats?.satisfaction?.toFixed(1) || "0",
      unit: "از 5",
      change: stats?.satisfactionChange || 0,
      trend: (stats?.satisfactionChange || 0) >= 0 ? "up" : "down",
      icon: Star,
      gradient: "from-amber-400/30 to-amber-600/10",
      iconBg: "from-amber-400/20 to-amber-600/5",
      iconColor: "text-amber-400",
      progressGradient: "from-amber-400 to-amber-500",
      glowColor: "amber-400",
      target: 5,
      subtitle: "عالی",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-gold/5 via-slate-500/5 to-sky-500/5 border-b border-white/10">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              opacity: [0.03, 0.08, 0.03],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-brand-gold via-slate-500 to-sky-500 rounded-full blur-3xl"
          />
        </div>

        <div className="relative p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-4xl font-black text-white mb-2 flex items-center gap-3"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    👋
                  </motion.div>
                  سلام، خوش آمدید به {tenant.name}!
                </motion.h1>
                <p className="text-brand-gray">
                  {currentTime.toLocaleDateString("fa-IR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {" • "}
                  {currentTime.toLocaleTimeString("fa-IR")}
                </p>
                <p className="text-xs text-emerald-400 mt-1">
                  ✅ متصل به: {tenant.slug}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={action.id}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 ${action.hover} transition-all`}
                    >
                      <div className={`w-8 h-8 rounded-xl ${action.iconBg} flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${action.iconColor}`} strokeWidth={2.5} />
                      </div>
                      <span className="text-sm font-bold text-white hidden md:block">
                        {action.label}
                      </span>

                      <motion.div
                        className={`absolute inset-0 ${action.glow} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 -z-10`}
                        initial={false}
                      />
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {realtimeStats.map((stat, index) => {
                const Icon = stat.icon;
                const progress = stat.target ? (parseFloat(stat.value.replace(/,/g, "")) / stat.target) * 100 : 0;
                const isSelected = selectedStat === stat.id;

                return (
                  <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedStat(isSelected ? null : stat.id)}
                    className="relative group cursor-pointer"
                  >
                    <motion.div
                      className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      animate={
                        isSelected
                          ? {
                              scale: [1, 1.05, 1],
                              opacity: [0.5, 0.8, 0.5],
                            }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    <motion.div
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center relative overflow-hidden`}
                        >
                          <motion.div
                            className={`absolute inset-0 bg-${stat.glowColor}`}
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.1, 0.3, 0.1],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          <Icon className={`w-7 h-7 ${stat.iconColor} relative z-10`} strokeWidth={2.5} />
                        </motion.div>

                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold ${
                            stat.trend === "up"
                              ? "bg-emerald-400/10 text-emerald-400"
                              : "bg-rose-400/10 text-rose-400"
                          }`}
                        >
                          {stat.trend === "up" ? (
                            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={3} />
                          ) : (
                            <ArrowDownRight className="w-3.5 h-3.5" strokeWidth={3} />
                          )}
                          {Math.abs(stat.change)}%
                        </motion.div>
                      </div>

                      <div className="mb-3">
                        <motion.div
                          key={stat.value}
                          initial={{ scale: 1.2, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-4xl font-black text-white mb-1 tracking-tight"
                        >
                          {stat.value}
                          <span className="text-lg text-brand-gray mr-1">{stat.unit}</span>
                        </motion.div>
                        <div className="text-sm text-brand-gray">{stat.label}</div>
                      </div>

                      {stat.target && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-brand-gray">{stat.subtitle}</span>
                            <span className="font-bold text-white">{Math.round(progress)}%</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(progress, 100)}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className={`h-full bg-gradient-to-r ${stat.progressGradient} rounded-full relative overflow-hidden`}
                            >
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  repeatDelay: 1,
                                  ease: "easeInOut",
                                }}
                                style={{ opacity: 0.3 }}
                              />
                            </motion.div>
                          </div>
                        </div>
                      )}

                      <motion.div
                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Sparkles className={`w-5 h-5 ${stat.iconColor}`} strokeWidth={2} />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-400/20 to-sky-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative bg-gradient-to-br from-slate-500/5 to-sky-500/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-400 to-sky-400 flex items-center justify-center shadow-lg shadow-slate-400/30"
                >
                  <Brain className="w-6 h-6 text-white" strokeWidth={2.5} />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    تحلیل‌های هوشمند
                    <Sparkles className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
                  </h2>
                  <p className="text-sm text-brand-gray">پیشنهادات و هشدارهای AI برای بهبود عملکرد</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiInsights.map((insight, index) => {
                  const Icon = insight.icon;
                  return (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="relative group/card"
                    >
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${insight.gradient} rounded-2xl blur opacity-0 group-hover/card:opacity-100 transition-opacity duration-300`} />
                      
                      <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-xl ${insight.iconBg} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-5 h-5 ${insight.iconColor}`} strokeWidth={2.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white mb-1">{insight.title}</h3>
                            <p className="text-sm text-brand-gray leading-relaxed">{insight.message}</p>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full mt-3 px-4 py-2 rounded-xl ${insight.buttonBg} border ${insight.buttonBorder} ${insight.buttonText} font-bold text-sm ${insight.buttonHover} transition-all flex items-center justify-center gap-2`}
                        >
                          مشاهده جزئیات
                          <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Live Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400/20 to-slate-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-400/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-sky-400" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">رزروهای زنده</h2>
                    <p className="text-sm text-brand-gray">برنامه امروز شما ({bookings.length})</p>
                  </div>
                </div>

                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-400/10 border border-emerald-400/20"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-bold text-emerald-400">زنده</span>
                </motion.div>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-12 text-brand-gray">
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" strokeWidth={1.5} />
                  <p className="text-lg font-bold mb-2">هنوز رزروی برای امروز وجود ندارد</p>
                  <p className="text-sm">با فشردن "رزرو جدید" اولین رزرو امروز رو ثبت کن</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map((booking, index) => {
                    const statusConfig = {
                      "in-progress": { color: "sky-400", bg: "bg-sky-400/10", label: "در حال انجام", pulse: true },
                      confirmed: { color: "emerald-400", bg: "bg-emerald-400/10", label: "تایید شده", pulse: false },
                      pending: { color: "amber-400", bg: "bg-amber-400/10", label: "در انتظار", pulse: false },
                    };

                    const config = statusConfig[booking.status as keyof typeof statusConfig] || statusConfig.pending;
                    const customerInitials = booking.customer_name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase() || "??";

                    return (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.01, x: 4 }}
                        className="relative group/booking"
                      >
                        {booking.priority === "vip" && (
                          <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-brand-gold to-amber-500 flex items-center justify-center shadow-lg shadow-brand-gold/30 z-10"
                          >
                            <Crown className="w-4 h-4 text-white" strokeWeight={2.5} />
                          </motion.div>
                        )}

                        <div className="relative bg-white/[0.02] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.04] hover:border-white/20 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center gap-1 flex-shrink-0">
                              <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center relative`}>
                                <Clock className={`w-5 h-5 text-${config.color}`} strokeWidth={2.5} />
                                {config.pulse && (
                                  <motion.div
                                    className={`absolute inset-0 bg-${config.color} rounded-xl`}
                                    animate={{
                                      scale: [1, 1.3, 1],
                                      opacity: [0.3, 0, 0.3],
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                    }}
                                  />
                                )}
                              </div>
                              <span className="text-xs font-bold text-white">{booking.booking_time}</span>
                              <span className="text-[10px] text-brand-gray">{booking.duration}د</span>
                            </div>

                            <div className="relative flex-shrink-0">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-400 to-sky-400 flex items-center justify-center text-white font-black shadow-lg text-sm">
                                {customerInitials}
                              </div>
                              {booking.status === "in-progress" && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0a0a0a] animate-pulse" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-white truncate">{booking.customer_name}</h4>
                                {booking.priority === "vip" && (
                                  <span className="px-2 py-0.5 rounded-md bg-brand-gold/10 text-brand-gold text-[10px] font-black">
                                    VIP
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-brand-gray truncate">{booking.customer_phone}</p>
                            </div>

                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                              <div className={`px-3 py-1 rounded-xl ${config.bg} border border-${config.color}/20 text-${config.color} text-xs font-bold whitespace-nowrap`}>
                                {config.label}
                              </div>
                              <div className="text-brand-gold font-black text-sm">
                                {Number(booking.price).toLocaleString()}
                                <span className="text-[10px] mr-1">تومان</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {bookings.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/10 text-white font-bold hover:bg-white/[0.04] hover:border-white/20 transition-all flex items-center justify-center gap-2"
                >
                  مشاهده همه رزروها
                  <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
