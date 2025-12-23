"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Users,
  TrendingUp,
  Activity,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  Crown,
  Zap,
  Shield,
  Clock,
  Eye,
  BarChart3,
  Plus,
} from "lucide-react";
import Link from "next/link";
import GrowthChart from "./GrowthChart";
import SystemHealth from "./SystemHealth";

interface DashboardClientProps {
  stats: {
    tenantsCount: number;
    activeCount: number;
    usersCount: number;
    suspendedCount: number;
  };
  recentTenants: any[];
  topPerformers: any[];
  growthData: { month: string; count: number }[];
}

export default function DashboardClient({
  stats,
  recentTenants,
  topPerformers,
  growthData,
}: DashboardClientProps) {
  const overviewCards = [
    {
      title: "کل سالن‌ها",
      value: stats.tenantsCount,
      icon: Building2,
      color: "text-brand-gold",
      bg: "bg-brand-gold/10",
      border: "border-brand-gold/20",
      gradient: "from-brand-gold/20 to-brand-gold/5",
      trend: "+12%",
    },
    {
      title: "سالن‌های فعال",
      value: stats.activeCount,
      icon: Activity,
      color: "text-green-400",
      bg: "bg-green-400/10",
      border: "border-green-400/20",
      gradient: "from-green-500/20 to-green-600/5",
      trend: "+8%",
    },
    {
      title: "کل کاربران",
      value: stats.usersCount,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20",
      gradient: "from-blue-500/20 to-blue-600/5",
      trend: "+24%",
    },
    {
      title: "تعلیق شده",
      value: stats.suspendedCount,
      icon: AlertCircle,
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-400/20",
      gradient: "from-red-500/20 to-red-600/5",
      trend: "-5%",
    },
  ];

  const quickActions = [
    {
      title: "افزودن سالن",
      icon: Plus,
      href: "/superadmin/tenants/new",
      color: "brand-gold",
    },
    {
      title: "مشاهده سالن‌ها",
      icon: Building2,
      href: "/superadmin/tenants",
      color: "blue-400",
    },
    {
      title: "آنالیتیکس",
      icon: BarChart3,
      href: "/superadmin/analytics",
      color: "purple-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand-gold/[0.02] rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/[0.015] rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
        
        {/* Grid */}
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
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-brand-gold/40 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold to-brand-gold/80 flex items-center justify-center shadow-2xl shadow-brand-gold/30">
                  <Sparkles className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  داشبورد مدیریت
                </h1>
                <p className="text-brand-gray text-sm mt-1">
                  مدیریت هوشمند سیستم Multi-Tenant
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-left"
          >
            <div className="px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
              <span className="text-brand-gold font-mono text-xl font-bold block">
                {new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
              </span>
              <span className="text-brand-gray text-xs">
                {new Date().toLocaleDateString("fa-IR", { weekday: "long", day: "numeric", month: "long" })}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewCards.map((card, index) => {
            const Icon = card.icon;
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
                {/* Glow */}
                <div className={`absolute -inset-0.5 bg-gradient-to-br ${card.gradient} rounded-[2rem] opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500`} />

                {/* Card */}
                <div className={`relative bg-[#111] border ${card.border} rounded-[2rem] p-6 overflow-hidden hover:scale-[1.02] transition-all duration-500`}>
                  {/* Noise */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E\")"
                  }} />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-12 h-12 ${card.bg} border ${card.border} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className={`w-6 h-6 ${card.color}`} strokeWidth={2.5} />
                      </div>
                      <span className={`text-xs font-bold ${card.color} bg-white/5 px-3 py-1 rounded-lg`}>
                        {card.trend}
                      </span>
                    </div>

                    <p className="text-brand-gray text-xs mb-2 font-bold uppercase tracking-wider">
                      {card.title}
                    </p>
                    <div className="text-4xl font-black text-white font-mono">
                      {card.value.toLocaleString("fa-IR")}
                    </div>
                  </div>

                  {/* Bottom shine */}
                  <div className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-${card.color.replace('text-', '')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Growth Chart - 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <GrowthChart data={growthData} />
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
              <h3 className="text-lg font-black text-white">دسترسی سریع</h3>
            </div>

            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link key={idx} href={action.href}>
                  <motion.div
                    whileHover={{ scale: 1.03, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative"
                  >
                    <div className={`absolute -inset-0.5 bg-${action.color}/20 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500`} />
                    <div className="relative flex items-center gap-4 p-4 bg-[#111] border border-white/5 rounded-2xl hover:border-white/10 transition-all">
                      <div className={`w-10 h-10 bg-${action.color}/10 border border-${action.color}/20 rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 text-${action.color}`} strokeWidth={2.5} />
                      </div>
                      <span className="font-bold text-white flex-1">{action.title}</span>
                      <ArrowUpRight className="w-4 h-4 text-brand-gray group-hover:text-brand-gold group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] transition-all" strokeWidth={2.5} />
                    </div>
                  </motion.div>
                </Link>
              );
            })}

            <SystemHealth stats={stats} />
          </motion.div>
        </div>

        {/* Recent & Top Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Tenants */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-gold/10 via-transparent to-brand-gold/10 rounded-[2rem] opacity-0 group-hover:opacity-100 blur transition-opacity duration-700" />

            <div className="relative bg-[#111] border border-white/5 rounded-[2rem] p-6 overflow-hidden hover:border-brand-gold/20 transition-all">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E\")"
              }} />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-gold/10 border border-brand-gold/20 rounded-xl flex items-center justify-center">
                      <Activity className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">آخرین سالن‌ها</h3>
                      <p className="text-xs text-brand-gray">جدیدترین ثبت‌نام‌ها</p>
                    </div>
                  </div>

                  <Link
                    href="/superadmin/tenants"
                    className="group/link flex items-center gap-2 px-4 py-2 bg-brand-gold/10 hover:bg-brand-gold text-brand-gold hover:text-white rounded-xl text-xs font-bold transition-all"
                  >
                    همه
                    <ArrowUpRight className="w-3 h-3 group-hover/link:translate-x-[-2px] group-hover/link:translate-y-[-2px] transition-transform" strokeWidth={3} />
                  </Link>
                </div>

                {recentTenants.length > 0 ? (
                  <div className="space-y-3">
                    {recentTenants.map((tenant, idx) => (
                      <Link key={tenant.id} href={`/superadmin/tenants/${tenant.id}`}>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + idx * 0.05 }}
                          whileHover={{ x: 4 }}
                          className="group/item flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-brand-gold/30 rounded-xl transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-gold/10 rounded-lg flex items-center justify-center border border-brand-gold/20 group-hover/item:scale-110 transition-transform">
                              <Building2 className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-white group-hover/item:text-brand-gold transition-colors">
                                {tenant.name}
                              </h4>
                              <p className="text-xs text-brand-gray font-mono">{tenant.slug}.ayneh.com</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                              tenant.status === "active"
                                ? "bg-green-400/10 text-green-400"
                                : "bg-red-400/10 text-red-400"
                            }`}>
                              {tenant.status === "active" ? "فعال" : "تعلیق"}
                            </span>
                            <Eye className="w-4 h-4 text-brand-gray group-hover/item:text-brand-gold transition-colors" strokeWidth={2.5} />
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-700" />
                    <p className="text-brand-gray text-sm">هنوز سالنی ثبت نشده</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Top Performers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 via-transparent to-purple-500/10 rounded-[2rem] opacity-0 group-hover:opacity-100 blur transition-opacity duration-700" />

            <div className="relative bg-[#111] border border-white/5 rounded-[2rem] p-6 overflow-hidden hover:border-purple-500/20 transition-all">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E\")"
              }} />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-400/10 border border-purple-400/20 rounded-xl flex items-center justify-center">
                    <Crown className="w-5 h-5 text-purple-400" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">سالن‌های برتر</h3>
                    <p className="text-xs text-brand-gray">بر اساس تعداد اعضا</p>
                  </div>
                </div>

                {topPerformers.length > 0 ? (
                  <div className="space-y-3">
                    {topPerformers.map((tenant, idx) => (
                      <Link key={tenant.id} href={`/superadmin/tenants/${tenant.id}`}>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + idx * 0.05 }}
                          whileHover={{ x: 4 }}
                          className="group/item flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-purple-400/30 rounded-xl transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${
                                idx === 0 ? "bg-brand-gold text-black" :
                                idx === 1 ? "bg-gray-400 text-black" :
                                idx === 2 ? "bg-orange-600 text-white" :
                                "bg-white/5 text-brand-gray"
                              }`}>
                                {idx + 1}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-white group-hover/item:text-purple-400 transition-colors">
                                {tenant.name}
                              </h4>
                              <p className="text-xs text-brand-gray">
                                {tenant.members?.[0]?.count || 0} عضو
                              </p>
                            </div>
                          </div>

                          <TrendingUp className="w-4 h-4 text-green-400" strokeWidth={2.5} />
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Crown className="w-12 h-12 mx-auto mb-3 text-gray-700" />
                    <p className="text-brand-gray text-sm">داده‌ای موجود نیست</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
