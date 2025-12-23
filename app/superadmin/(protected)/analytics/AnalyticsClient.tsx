"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  DollarSign,
  Activity,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Zap,
  Target,
  Award,
  ArrowUpRight,
  Crown,
  Shield,
} from "lucide-react";
import Link from "next/link";
import RevenueChart from "./RevenueChart";
import UserGrowthChart from "./UserGrowthChart";
import PlanDistributionChart from "./PlanDistributionChart";
import ActivityTimeline from "./ActivityTimeline";

interface AnalyticsData {
  stats: {
    totalTenants: number;
    activeTenants: number;
    totalUsers: number;
    tenantGrowth: number;
    userGrowth: number;
  };
  monthlyTenants: any[];
  monthlyUsers: any[];
  planStats: any[];
  recentActivity: any[];
}

export default function AnalyticsClient({ data }: { data: AnalyticsData }) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "12m">("30d");

  const kpis = [
    {
      title: "کل سالن‌ها",
      value: data.stats.totalTenants,
      change: data.stats.tenantGrowth,
      icon: Building2,
      color: "brand-gold",
      description: "در 30 روز گذشته",
    },
    {
      title: "سالن‌های فعال",
      value: data.stats.activeTenants,
      change: Math.round((data.stats.activeTenants / data.stats.totalTenants) * 100) - 100,
      icon: Activity,
      color: "green",
      description: "نرخ فعال‌سازی",
    },
    {
      title: "کل کاربران",
      value: data.stats.totalUsers,
      change: data.stats.userGrowth,
      icon: Users,
      color: "blue",
      description: "رشد ماهانه",
    },
    {
      title: "نرخ تبدیل",
      value: "24%",
      change: 12,
      icon: Target,
      color: "purple",
      description: "از بازدید به ثبت‌نام",
    },
  ];

  const handleExport = () => {
    // Export logic
    const csvData = `داده‌های آنالیتیکس\n${JSON.stringify(data, null, 2)}`;
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-gold/[0.02] rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/[0.015] rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
        
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(198, 168, 124, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(198, 168, 124, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,10,0.7)_100%)]" />
      </div>

      <div className="relative z-10 p-6 lg:p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-brand-gold/40 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold to-brand-gold/80 flex items-center justify-center shadow-2xl shadow-brand-gold/30">
                <BarChart3 className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">آنالیتیکس پیشرفته</h1>
              <p className="text-brand-gray text-sm mt-1">تحلیل و گزارش‌گیری جامع</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/10 rounded-xl backdrop-blur-xl">
              {(["7d", "30d", "12m"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    timeRange === range
                      ? "bg-brand-gold text-black"
                      : "text-brand-gray hover:text-white"
                  }`}
                >
                  {range === "7d" ? "7 روز" : range === "30d" ? "30 روز" : "12 ماه"}
                </button>
              ))}
            </div>

            {/* Export Button */}
            <motion.button
              onClick={handleExport}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              <div className="absolute -inset-1 bg-green-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-2 px-5 py-2 bg-green-500/15 hover:bg-green-500/25 text-green-400 border border-green-500/30 rounded-xl font-bold transition-all">
                <Download className="w-4 h-4" strokeWidth={2.5} />
                <span className="hidden sm:inline">دانلود گزارش</span>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            const isPositive = kpi.change >= 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative"
              >
                <div className={`absolute -inset-0.5 bg-${kpi.color}-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500`} />

                <div className="relative bg-[#111] border border-white/5 rounded-2xl p-6 overflow-hidden hover:scale-[1.02] transition-all duration-500">
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E\")"
                  }} />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-${kpi.color === "brand-gold" ? "brand-gold" : kpi.color + "-400"}/10 border border-${kpi.color === "brand-gold" ? "brand-gold" : kpi.color + "-400"}/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className={`w-6 h-6 text-${kpi.color === "brand-gold" ? "brand-gold" : kpi.color + "-400"}`} strokeWidth={2.5} />
                      </div>
                      
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                        isPositive ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"
                      }`}>
                        {isPositive ? (
                          <TrendingUp className="w-3 h-3" strokeWidth={2.5} />
                        ) : (
                          <TrendingDown className="w-3 h-3" strokeWidth={2.5} />
                        )}
                        <span className="text-xs font-bold">{Math.abs(kpi.change)}%</span>
                      </div>
                    </div>

                    <p className="text-brand-gray text-xs mb-2 font-bold uppercase tracking-wider">
                      {kpi.title}
                    </p>
                    <div className="text-3xl font-black text-white font-mono mb-1">
                      {typeof kpi.value === "number" ? kpi.value.toLocaleString("fa-IR") : kpi.value}
                    </div>
                    <p className="text-xs text-brand-gray">{kpi.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <RevenueChart data={data.monthlyTenants} />
          </motion.div>

          {/* User Growth Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <UserGrowthChart data={data.monthlyUsers} />
          </motion.div>
        </div>

        {/* Plan Distribution & Activity */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Plan Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <PlanDistributionChart data={data.planStats} />
          </motion.div>

          {/* Activity Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-2"
          >
            <ActivityTimeline activities={data.recentActivity} />
          </motion.div>
        </div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-gold/10 via-purple-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity" />

          <div className="relative bg-[#111] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-gold/10 border border-brand-gold/20 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">بینش‌های عملکرد</h3>
                <p className="text-xs text-brand-gray">نکات کلیدی و توصیه‌ها</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-brand-gold" strokeWidth={2.5} />
                  <span className="text-xs font-bold text-brand-gray">بهترین پلن</span>
                </div>
                <p className="text-lg font-black text-white mb-1">
                  {data.planStats[0]?.name || "Basic"}
                </p>
                <p className="text-xs text-brand-gray">
                  {data.planStats[0]?.percentage || 0}% از کل سالن‌ها
                </p>
              </div>

              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-400" strokeWidth={2.5} />
                  <span className="text-xs font-bold text-brand-gray">رشد قوی</span>
                </div>
                <p className="text-lg font-black text-white mb-1">
                  +{data.stats.tenantGrowth}%
                </p>
                <p className="text-xs text-brand-gray">نسبت به ماه گذشته</p>
              </div>

              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-purple-400" strokeWidth={2.5} />
                  <span className="text-xs font-bold text-brand-gray">هدف ماهانه</span>
                </div>
                <p className="text-lg font-black text-white mb-1">75%</p>
                <p className="text-xs text-brand-gray">از هدف محقق شده</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
