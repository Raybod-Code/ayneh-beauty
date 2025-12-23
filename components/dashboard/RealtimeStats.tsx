"use client";

import { motion } from "framer-motion";
import { 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp,
  AlertTriangle,
  Activity,
  RefreshCw
} from "lucide-react";
import { useRealtime } from "@/lib/providers/RealtimeProvider";

export default function RealtimeStats() {
  const { stats, loading, refreshStats } = useRealtime();

  const statCards = [
    {
      title: "رزروهای امروز",
      value: stats.todayBookings,
      total: stats.totalBookings,
      icon: Calendar,
      color: "luxury-sky-400",
      bgColor: "luxury-sky-400/10",
      borderColor: "luxury-sky-400/30",
    },
    {
      title: "درآمد امروز",
      value: `${(stats.todayRevenue / 1000000).toFixed(1)}M`,
      total: `${(stats.totalRevenue / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: "luxury-emerald-400",
      bgColor: "luxury-emerald-400/10",
      borderColor: "luxury-emerald-400/30",
    },
    {
      title: "رزروهای فعال",
      value: stats.activeBookings,
      icon: Activity,
      color: "brand-gold",
      bgColor: "brand-gold/10",
      borderColor: "brand-gold/30",
    },
    {
      title: "مشتریان جدید",
      value: stats.newCustomers,
      total: stats.totalCustomers,
      icon: Users,
      color: "luxury-violet-400",
      bgColor: "luxury-violet-400/10",
      borderColor: "luxury-violet-400/30",
    },
    {
      title: "موجودی کم",
      value: stats.lowStockItems,
      icon: AlertTriangle,
      color: "luxury-rose-400",
      bgColor: "luxury-rose-400/10",
      borderColor: "luxury-rose-400/30",
      alert: stats.lowStockItems > 0,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">آمار لحظه‌ای</h2>
          <p className="text-sm text-brand-gray mt-0.5">
            به‌روزرسانی خودکار
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={refreshStats}
          disabled={loading}
          className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center hover:border-brand-gold/50 transition-all disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            strokeWidth={2.5}
          />
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                relative rounded-2xl p-5 border transition-all hover:scale-[1.02]
                ${stat.alert ? 'animate-pulse' : ''}
                bg-${stat.bgColor} border-${stat.borderColor}
              `}
            >
              {/* Icon */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-${stat.bgColor} border border-${stat.borderColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}`} strokeWidth={2.5} />
                </div>

                {/* Live Indicator */}
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
                  className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50"
                />
              </div>

              {/* Title */}
              <h3 className="text-sm text-brand-gray mb-2">{stat.title}</h3>

              {/* Value */}
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-white">
                  {loading ? "..." : stat.value}
                </span>
                {stat.total && (
                  <span className="text-sm text-brand-gray mb-1">
                    / {stat.total}
                  </span>
                )}
              </div>

              {/* Glow Effect */}
              {stat.alert && (
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`absolute inset-0 bg-${stat.color} rounded-2xl blur-xl -z-10`}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
