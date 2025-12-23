"use client";

import { motion } from "framer-motion";
import { Shield, CheckCircle, AlertTriangle } from "lucide-react";

interface SystemHealthProps {
  stats: {
    tenantsCount: number;
    activeCount: number;
    usersCount: number;
    suspendedCount: number;
  };
}

export default function SystemHealth({ stats }: SystemHealthProps) {
  // Calculate health percentage
  const totalTenants = stats.tenantsCount || 1;
  const activePercentage = Math.round((stats.activeCount / totalTenants) * 100);
  const isHealthy = activePercentage >= 80;
  const isWarning = activePercentage >= 50 && activePercentage < 80;

  const healthItems = [
    {
      label: "سالن‌های فعال",
      value: `${activePercentage}%`,
      status: isHealthy ? "healthy" : isWarning ? "warning" : "critical",
    },
    {
      label: "دسترسی پایگاه داده",
      value: "99.9%",
      status: "healthy",
    },
    {
      label: "زمان پاسخ سرور",
      value: "45ms",
      status: "healthy",
    },
  ];

  return (
    <div className="group relative mt-6">
      {/* Glow */}
      <div className={`absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 ${
        isHealthy ? "bg-green-500/20" : isWarning ? "bg-yellow-500/20" : "bg-red-500/20"
      }`} />

      {/* Card */}
      <div className="relative bg-[#111] border border-white/5 rounded-2xl p-5 overflow-hidden hover:border-white/10 transition-all">
        {/* Noise */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulance type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E\")"
        }} />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              isHealthy ? "bg-green-400/10 border-green-400/20" :
              isWarning ? "bg-yellow-400/10 border-yellow-400/20" :
              "bg-red-400/10 border-red-400/20"
            }`}>
              <Shield className={`w-5 h-5 ${
                isHealthy ? "text-green-400" :
                isWarning ? "text-yellow-400" :
                "text-red-400"
              }`} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">سلامت سیستم</h3>
              <p className="text-[10px] text-brand-gray">وضعیت Real-time</p>
            </div>
          </div>

          {/* Overall Status */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`mb-5 p-4 rounded-xl border ${
              isHealthy ? "bg-green-400/5 border-green-400/20" :
              isWarning ? "bg-yellow-400/5 border-yellow-400/20" :
              "bg-red-400/5 border-red-400/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-gray">وضعیت کلی</span>
              <div className="flex items-center gap-2">
                {isHealthy ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" strokeWidth={2.5} />
                    <span className="text-sm font-black text-green-400">سالم</span>
                  </>
                ) : isWarning ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-yellow-400" strokeWidth={2.5} />
                    <span className="text-sm font-black text-yellow-400">هشدار</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-400" strokeWidth={2.5} />
                    <span className="text-sm font-black text-red-400">بحرانی</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Health Items */}
          <div className="space-y-3">
            {healthItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center justify-between"
              >
                <span className="text-xs text-brand-gray">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${
                    item.status === "healthy" ? "text-green-400" :
                    item.status === "warning" ? "text-yellow-400" :
                    "text-red-400"
                  }`}>
                    {item.value}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${
                    item.status === "healthy" ? "bg-green-400" :
                    item.status === "warning" ? "bg-yellow-400" :
                    "bg-red-400"
                  } animate-pulse`} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-5 pt-5 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-brand-gray font-bold">عملکرد کلی</span>
              <span className="text-xs font-black text-white">{activePercentage}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${activePercentage}%` }}
                transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className={`h-full rounded-full ${
                  isHealthy ? "bg-gradient-to-r from-green-500 to-green-400" :
                  isWarning ? "bg-gradient-to-r from-yellow-500 to-yellow-400" :
                  "bg-gradient-to-r from-red-500 to-red-400"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
